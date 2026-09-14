import assert from 'node:assert/strict';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { handleOperatorHttp, type OperatorHttpDependencies } from '../src/operator/http';
import { OperatorPacketStore } from '../src/operator/packet';

const origin = 'http://127.0.0.1:3000';
const input = {
  idempotencyKey: 'operator_http_request_001', kind: 'inventory', title: 'Inspect local workspace',
  objective: 'Read the local workspace and report its observed state without making changes.', workspace: '/replace-in-test', timeLimitMinutes: 10
};

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(origin + '/api/operator/tasks', {
    method: 'POST',
    headers: { host: '127.0.0.1:3000', origin, 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
}

function dependencies(directory: string, workspaceRoots: readonly string[], overrides: Partial<OperatorHttpDependencies> = {}): OperatorHttpDependencies {
  return {
    availability: { enabled: true, reason: 'test' }, authConfigured: false,
    getActor: async () => ({ id: 'admin', authenticated: true, role: 'admin' }),
    openStore: () => new OperatorPacketStore(directory), mode: { mode: 'safe' }, workspaceRoots, appUrl: origin, ...overrides
  };
}

function setup(t: { after(fn: () => void): void }) {
  const directory = mkdtempSync(join(tmpdir(), 'neo-operator-http-'));
  chmodSync(directory, 0o700);
  const workspace = join(directory, 'workspace');
  mkdirSync(workspace, { mode: 0o700 });
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return { directory, workspace, validInput: { ...input, workspace } };
}

test('operator HTTP is same-origin, bounded, and makes a durable packet', async t => {
  const { directory, workspace, validInput } = setup(t);
  assert.equal((await handleOperatorHttp(request(validInput), dependencies(directory, [workspace], { availability: { enabled: false, reason: 'operator_disabled' } }))).status, 503);
  assert.equal((await handleOperatorHttp(request(validInput, { origin: 'https://untrusted.example' }), dependencies(directory, [workspace]))).status, 403);
  assert.equal((await handleOperatorHttp(request({ ...validInput, prompt: 'run a shell command' }), dependencies(directory, [workspace]))).status, 400);
  const first = await handleOperatorHttp(request(validInput), dependencies(directory, [workspace]));
  assert.equal(first.status, 201);
  const body = await first.json() as { packet: { packetId: string; task: { workspace: string } }; workerPrompt: string };
  assert.match(body.packet.packetId, /^packet_/);
  assert.equal(body.packet.task.workspace, workspace);
  assert.match(body.workerPrompt, /Do not access credentials/);
  const replay = await handleOperatorHttp(request(validInput), dependencies(directory, [workspace]));
  assert.equal(replay.status, 200);
  assert.equal((await replay.json() as { replayed: boolean }).replayed, true);
  assert.equal((await handleOperatorHttp(request(validInput), dependencies(directory, [workspace], {
    authConfigured: true, getActor: async () => ({ id: 'viewer', authenticated: true, role: 'viewer' })
  }))).status, 403);
});

test('operator HTTP rejects inconsistent host and forwarded headers', async t => {
  const { directory, workspace, validInput } = setup(t);
  assert.equal((await handleOperatorHttp(request(validInput, { host: 'untrusted.example' }), dependencies(directory, [workspace]))).status, 403);
  assert.equal((await handleOperatorHttp(request(validInput, { 'x-forwarded-host': 'untrusted.example' }), dependencies(directory, [workspace]))).status, 403);
  assert.equal((await handleOperatorHttp(request(validInput, { 'x-forwarded-proto': 'https' }), dependencies(directory, [workspace]))).status, 403);
});

test('operator HTTP confines real paths to configured workspace roots', async t => {
  const { directory, workspace, validInput } = setup(t);
  const outside = mkdtempSync(join(tmpdir(), 'neo-operator-outside-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  assert.equal((await handleOperatorHttp(request({ ...validInput, workspace: outside }), dependencies(directory, [workspace]))).status, 403);
  const escape = join(workspace, 'escape');
  symlinkSync(outside, escape, 'dir');
  assert.equal((await handleOperatorHttp(request({ ...validInput, workspace: escape }), dependencies(directory, [workspace]))).status, 403);
});
