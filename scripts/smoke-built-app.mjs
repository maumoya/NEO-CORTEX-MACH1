import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

// Run server and probes in one process/session; never inherit live app credentials.
const port = 3219;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
  env: { PATH: process.env.PATH, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
    NEXT_PUBLIC_APP_URL: base, NEO_CORTEX_EXECUTION_MODE: 'safe', NEO_CORTEX_RUNTIME_ENABLED: 'false',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: '', CLERK_SECRET_KEY: '', ADMIN_USER_IDS: '', STRIPE_SECRET_KEY: '',
    STRIPE_WEBHOOK_SECRET: '', CRON_SECRET: '', DATABASE_URL: '', OPENAI_API_KEY: '', AI_GATEWAY_API_KEY: '' },
  stdio: ['ignore', 'ignore', 'ignore']
});
let exited = false;
server.on('exit', () => { exited = true; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 40 && !exited; attempt++) {
    try { if ((await fetch(base + '/console', { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } }
    catch { /* Startup only; no mutation retry. */ }
    await delay(250);
  }
  assert.ok(ready && !exited, 'Built app failed to start on the isolated probe port');
  for (const [path, text] of [['/console', 'DISABLED'], ['/dashboard', 'DEMO MODE'], ['/backoffice', 'FOUNDER DEMO']]) {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(3000) });
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).includes(text), path + ' missing status label');
  }
  const agent = await fetch(base + '/api/agent', { method: 'POST', headers: { origin: base, 'content-type': 'application/json' },
    body: JSON.stringify({ operation: 'status', idempotencyKey: 'smoke_request_000001' }), signal: AbortSignal.timeout(3000) });
  assert.equal(agent.status, 503);
  assert.deepEqual(await agent.json(), { error: 'runtime_disabled' });
  assert.equal((await fetch(base + '/api/checkout', { method: 'POST', signal: AbortSignal.timeout(3000) })).status, 503);
  assert.equal((await fetch(base + '/api/cron/evolve', { signal: AbortSignal.timeout(3000) })).status, 401);
  console.log('Built-app smoke passed: disabled console/runtime, labeled dashboards, closed billing and protected cron.');
} finally {
  if (!exited) {
    const stopped = once(server, 'exit');
    server.kill('SIGTERM');
    const force = setTimeout(() => server.kill('SIGKILL'), 3000);
    await stopped;
    clearTimeout(force);
  }
}
