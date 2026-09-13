import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { handleOperatorHttp, type OperatorHttpDependencies } from '../src/operator/http';
import { OperatorPacketStore } from '../src/operator/packet';

const origin = 'http://127.0.0.1:3000';
const input = {
  idempotencyKey: 'operator_http_request_001', kind: 'inventory', title: 'Inspect local workspace',
  objective: 'Read the local workspace and report its observed state without making changes.', workspace: '~/Developer/NEO-CORTEX-MACH1', timeLimitMinutes: 10
};

function request(body: unknown = input, headers: Record<string, string> = {}) {
  return new Request(origin + '/api/operator/tasks', { method: 'POST', headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}

function dependencies(directory: string, overrides: Partial<OperatorHttpDependencies> = {}): OperatorHttpDependencies {
  return {
    availability: { enabled: true, reason: 'test' }, authConfigured: false,
    getActor: async () => ({ id: 'admin', authenticated: true, role: 'admin' }),
    openStore: () => new OperatorPacketStore(directory), mode: { mode: 'safe' }, appUrl: origin, ...overrides
  };
}

test('operator HTTP is same-origin, local-only, bounded, and makes a durable packet', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'neo-operator-http-'));
  chmodSync(directory, 0o700);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.equal((await handleOperatorHttp(request(), dependencies(directory, { availability: { enabled: false, reason: 'operator_disabled' } }))).status, 503);
  assert.equal((await handleOperatorHttp(request(input, { origin: 'https://untrusted.example' }), dependencies(directory))).status, 403);
  assert.equal((await handleOperatorHttp(request({ ...input, prompt: 'run a shell command' }), dependencies(directory))).status, 400);
  const first = await handleOperatorHttp(request(), dependencies(directory));
  assert.equal(first.status, 201);
  const body = await first.json() as { packet: { packetId: string }; workerPrompt: string };
  assert.match(body.packet.packetId, /^packet_/);
  assert.match(body.workerPrompt, /Do not access credentials/);
  const replay = await handleOperatorHttp(request(), dependencies(directory));
  assert.equal(replay.status, 200);
  assert.equal((await replay.json() as { replayed: boolean }).replayed, true);
  assert.equal((await handleOperatorHttp(request(), dependencies(directory, { authConfigured: true, getActor: async () => ({ id: 'viewer', authenticated: true, role: 'viewer' }) }))).status, 403);
});
