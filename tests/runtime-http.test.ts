import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runtimeAvailability } from '../src/runtime/config';
import { handleDirectorHttp, type DirectorHttpDependencies } from '../src/runtime/http';
import { SqliteTaskStore } from '../src/runtime/task-store';

const origin = 'http://127.0.0.1:3000';
const input = { operation: 'status', idempotencyKey: 'http_request_00000001' };
function request(body: unknown = input, headers: Record<string, string> = {}) {
  return new Request(origin + '/api/agent', { method: 'POST',
    headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
function dependencies(overrides: Partial<DirectorHttpDependencies> = {}): DirectorHttpDependencies {
  return { availability: { enabled: true, reason: 'test' }, authConfigured: true,
    getActor: async () => ({ id: 'test-admin', authenticated: true, role: 'admin' }),
    openStore: () => { throw new Error('Store must not open for a rejected request'); },
    mode: { mode: 'safe' }, appUrl: origin, ...overrides };
}

test('runtime defaults off and refuses serverless or missing durable storage', () => {
  assert.equal(runtimeAvailability({}).enabled, false);
  assert.equal(runtimeAvailability({ NEO_CORTEX_RUNTIME_ENABLED: 'true' }).enabled, false);
  assert.equal(runtimeAvailability({ NEO_CORTEX_RUNTIME_ENABLED: 'true', NEO_CORTEX_DATA_DIR: '/operator/data', VERCEL: '1' }).enabled, false);
  assert.equal(runtimeAvailability({ NEO_CORTEX_RUNTIME_ENABLED: 'true', NEO_CORTEX_DATA_DIR: '/operator/data' }).enabled, true);
});

test('HTTP authentication, administrator, halt and configuration gates precede persistence', async () => {
  const cases: [Partial<DirectorHttpDependencies>, number, string][] = [
    [{ availability: { enabled: false, reason: 'runtime_disabled' } }, 503, 'runtime_disabled'],
    [{ authConfigured: false }, 503, 'authentication_not_configured'],
    [{ getActor: async () => null }, 401, 'authentication_required'],
    [{ getActor: async () => ({ id: 'agent', authenticated: true, role: 'agent' }) }, 403, 'administrator_required'],
    [{ mode: { mode: 'halted' } }, 423, 'execution_halted'],
    [{ appUrl: undefined }, 503, 'canonical_app_url_required'],
    [{ appUrl: 'http://public.example' }, 503, 'https_required']
  ];
  for (const [overrides, status, error] of cases) {
    const response = await handleDirectorHttp(request(input, { 'x-neo-cortex-user-approved': 'checkout', 'x-role': 'admin' }), dependencies(overrides));
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { error });
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});

test('HTTP rejects foreign or absent origins, non-JSON and unsupported methods', async () => {
  assert.equal((await handleDirectorHttp(request(input, { origin: 'https://untrusted.example' }), dependencies())).status, 403);
  assert.equal((await handleDirectorHttp(request(input, { origin: '' }), dependencies())).status, 403);
  assert.equal((await handleDirectorHttp(request(input, { 'content-type': 'text/plain' }), dependencies())).status, 415);
  assert.equal((await handleDirectorHttp(new Request(origin), dependencies())).status, 405);
});

test('HTTP rejects arbitrary prompts, actor overrides, invalid JSON and oversized streamed bodies', async () => {
  for (const body of [{ ...input, prompt: 'run shell' }, { ...input, actor: { role: 'admin' } }, { ...input, operation: 'exec' }]) {
    assert.equal((await handleDirectorHttp(request(body), dependencies())).status, 400);
  }
  const malformed = new Request(origin, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{' });
  assert.equal((await handleDirectorHttp(malformed, dependencies())).status, 400);
  assert.equal((await handleDirectorHttp(request(input, { 'content-length': '2048' }), dependencies())).status, 413);
  const streamed = request({ ...input, prompt: 'x'.repeat(2048) });
  assert.equal(streamed.headers.has('content-length'), false);
  assert.equal((await handleDirectorHttp(streamed, dependencies())).status, 413);
});

test('HTTP response suppresses internal errors and paths', async () => {
  const response = await handleDirectorHttp(request(), dependencies({ openStore: () => { throw new Error('/private/operator/data sensitive detail'); } }));
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'runtime_unavailable' });
});

test('HTTP success, retry and conflict use the same durable actor-scoped journal', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'neo-http-test-'));
  try {
    const deps = dependencies({ openStore: () => new SqliteTaskStore(directory) });
    const first = await handleDirectorHttp(request(), deps);
    assert.equal(first.status, 200);
    const receipt = await first.json();
    const retry = await handleDirectorHttp(request(), deps);
    const replay = await retry.json();
    assert.equal(replay.task.taskId, receipt.task.taskId);
    assert.equal(replay.replayed, true);
    assert.equal(replay.receipt.eventCount, 3);
    assert.equal(replay.task.result.providerCalls, 0);
    const conflict = await handleDirectorHttp(request({ ...input, operation: 'next' }), deps);
    assert.equal(conflict.status, 409);
    assert.deepEqual(await conflict.json(), { error: 'idempotency_conflict' });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
