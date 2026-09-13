import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { operatorAvailability } from '../src/operator/config';
import { OperatorPacketStore } from '../src/operator/packet';

const request = {
  idempotencyKey: 'operator_request_00000001', kind: 'verification' as const,
  title: 'Verify local NEO-CORTEX', objective: 'Run the repository verification command and report the exact result without changing files.',
  workspace: '~/Developer/NEO-CORTEX-MACH1', timeLimitMinutes: 10
};

function setup(t: { after(fn: () => void): void }) {
  const directory = mkdtempSync(join(tmpdir(), 'neo-operator-test-'));
  chmodSync(directory, 0o700);
  const store = new OperatorPacketStore(directory);
  t.after(() => { store.close(); rmSync(directory, { recursive: true, force: true }); });
  return { directory, store };
}

test('operator mode is explicit, local-only, and requires private persistent storage', () => {
  assert.deepEqual(operatorAvailability({}), { enabled: false, reason: 'operator_disabled' });
  assert.deepEqual(operatorAvailability({ NEO_CORTEX_OPERATOR_ENABLED: 'true' }), { enabled: false, reason: 'persistent_data_directory_required' });
  assert.deepEqual(operatorAvailability({ NEO_CORTEX_OPERATOR_ENABLED: 'true', NEO_CORTEX_DATA_DIR: '/operator/data', NEXT_PUBLIC_APP_URL: 'https://remote.example' }),
    { enabled: false, reason: 'local_canonical_app_url_required' });
  assert.deepEqual(operatorAvailability({ NEO_CORTEX_OPERATOR_ENABLED: 'true', NEO_CORTEX_DATA_DIR: '/operator/data', NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:3000' }),
    { enabled: true, reason: 'local_operator_configured' });
});

test('operator stages a private bounded packet with idempotency and tamper evidence', t => {
  const { directory, store } = setup(t);
  const first = store.stage('local-owner-bootstrap', request);
  const file = join(directory, first.receipt.relativePath);
  assert.equal(first.replayed, false);
  assert.equal(first.packet.state, 'staged');
  assert.equal(first.packet.authority.execution, 'human-submitted-worker-handoff');
  assert.ok(first.packet.prohibited.some(item => item.includes('credentials')));
  assert.ok(existsSync(file));
  assert.match(readFileSync(file, 'utf8'), /Verify local NEO-CORTEX/);
  assert.equal(readFileSync(join(directory, 'operator.sqlite'), 'utf8').includes(request.objective), false);
  const replay = store.stage('local-owner-bootstrap', request);
  assert.equal(replay.replayed, true);
  assert.equal(replay.packet.packetId, first.packet.packetId);
  assert.throws(() => store.stage('local-owner-bootstrap', { ...request, objective: 'A different request with the same key.' }), /idempotency_conflict/);
  assert.equal(store.verifyIntegrity().packetCount, 1);
  writeFileSync(file, '{}', { encoding: 'utf8', mode: 0o600 });
  assert.throws(() => store.verifyIntegrity(), /packet_integrity_failed|audit_integrity_failed/);
});
