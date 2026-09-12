import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateBudget } from '../src/core/budget-guard';
import { InMemoryCheckpointStore } from '../src/core/checkpoint-store';
import { mayPersistRawPayload, requiresPrivateOrExplicitlyApprovedInference } from '../src/core/data-classification';
import { evaluateIdentity } from '../src/core/identity';
import { validateIntentDecision, type IntentDecision } from '../src/core/intent-gateway';
import { assertMayMutateExternalState } from '../src/core/kill-switch';
import { evaluatePolicy, mayExecuteWithoutApproval } from '../src/core/policy-kernel';
import { validateSandboxRequest } from '../src/core/sandbox';
import { initialDecision, mayAutoExecute } from '../src/evolution/policy';
import { routeFromCatalog } from '../src/model-router';

const publicCodingIntent: IntentDecision = {
  intent: 'coding', dataClass: 'PUBLIC', needsWeb: false, needsTools: true,
  needsAgents: false, preferLocal: false, approvalRequired: false, confidence: 0.9
};

test('high-risk intents force human approval', () => {
  const decision = validateIntentDecision({ ...publicCodingIntent, intent: 'finance' });
  assert.equal(decision.approvalRequired, true);
  assert.throws(() => validateIntentDecision({ ...publicCodingIntent, confidence: 1.1 }));
});

test('classified payload persistence and provider rules fail closed', () => {
  assert.equal(mayPersistRawPayload('SECRET'), false);
  assert.equal(mayPersistRawPayload('PHI'), false);
  assert.equal(requiresPrivateOrExplicitlyApprovedInference('RESTRICTED'), true);
  const denied = evaluatePolicy({
    intent: { ...publicCodingIntent, dataClass: 'RESTRICTED' },
    requestedCapabilities: ['network.outbound'],
    targetProvider: 'external-provider',
    approvedProviders: []
  });
  assert.equal(denied.allowed, false);
  assert.deepEqual(denied.deniedCapabilities, ['network.outbound']);
});

test('money movement and credential changes cannot be autonomous', () => {
  for (const capability of ['money.move', 'credential.change'] as const) {
    const decision = evaluatePolicy({ intent: publicCodingIntent, requestedCapabilities: [capability] });
    assert.equal(decision.allowed, false);
    assert.equal(decision.requiresHumanApproval, true);
  }
});

test('identity checks require authentication, MFA, and a trusted device for high risk', () => {
  const decision = evaluateIdentity({
    actorId: 'a', role: 'operator', sessionId: 's', authenticated: false,
    mfaSatisfied: false, trustedDevice: false
  }, true);
  assert.deepEqual(decision.reasonCodes, ['authentication_required', 'mfa_required', 'trusted_device_required']);
});

test('budget guard blocks every configured ceiling', () => {
  const budget = { maxTurns: 2, maxToolCalls: 3, maxRetries: 1, maxWallClockMs: 1000, maxEstimatedUsd: 1 };
  const base = { turns: 0, toolCalls: 0, retries: 0, startedAtMs: Date.now(), estimatedUsd: 0 };
  assert.equal(evaluateBudget(budget, base).allowed, true);
  assert.deepEqual(evaluateBudget(budget, { ...base, turns: 2 }), { allowed: false, reason: 'max_turns_exceeded' });
  assert.deepEqual(evaluateBudget(budget, { ...base, toolCalls: 3 }), { allowed: false, reason: 'max_tool_calls_exceeded' });
  assert.deepEqual(evaluateBudget(budget, { ...base, retries: 2 }), { allowed: false, reason: 'max_retries_exceeded' });
  assert.deepEqual(evaluateBudget(budget, { ...base, estimatedUsd: 1 }), { allowed: false, reason: 'max_estimated_cost_exceeded' });
});

test('sandbox rejects network and secret-environment policy violations', () => {
  assert.throws(() => validateSandboxRequest({
    candidateId: 'c', command: 'echo', args: [], timeoutMs: 100,
    network: { outbound: 'deny', allowedHosts: ['example.com'] },
    environmentKeys: [], disposableFilesystem: true
  }));
  assert.throws(() => validateSandboxRequest({
    candidateId: 'c', command: 'echo', args: [], timeoutMs: 100,
    network: { outbound: 'deny', allowedHosts: [] },
    environmentKeys: ['API_TOKEN'], disposableFilesystem: true
  }));
});

test('checkpoints are monotonic per task', async () => {
  const store = new InMemoryCheckpointStore();
  const checkpoint = { checkpointId: 'c1', taskId: 't1', correlationId: 'r1', sequence: 1, createdAt: new Date(0).toISOString(), state: { ok: true } };
  await store.save(checkpoint);
  assert.deepEqual(await store.latest('t1'), checkpoint);
  await assert.rejects(() => store.save({ ...checkpoint, checkpointId: 'c2' }));
});

test('safe mode blocks external mutation', () => {
  assert.throws(() => assertMayMutateExternalState({ mode: 'safe', reason: 'test' }));
  assert.doesNotThrow(() => assertMayMutateExternalState({ mode: 'normal' }));
});

test('executable evolution candidates are quarantined and never auto-run', () => {
  const candidate = { id: 'c', kind: 'dependency' as const, source: 'test', version: '1', discoveredAt: new Date(0).toISOString(), executable: true };
  assert.equal(initialDecision(candidate), 'quarantine');
  assert.equal(mayAutoExecute(candidate), false);
});

test('model routing is deterministic, classification-aware, and does not prefer unknown pricing', () => {
  const catalog = [
    { id: 'beta/unknown-price', type: 'language', context_window: 200_000, tags: ['tool-use'] },
    { id: 'alpha/expensive', type: 'language', context_window: 100_000, tags: ['tool-use'], pricing: { input: '0.02' } },
    { id: 'alpha/cheap', type: 'language', context_window: 50_000, tags: ['tool-use'], pricing: { input: '0.001' } }
  ];
  const fast = routeFromCatalog(catalog, { taskClass: 'fast', dataClass: 'PUBLIC', needsTools: true });
  assert.equal(fast.recommendation?.id, 'alpha/cheap');
  const restricted = routeFromCatalog(catalog, { taskClass: 'fast', dataClass: 'RESTRICTED', needsTools: true, approvedProviders: ['beta'] });
  assert.deepEqual(restricted.eligible.map(model => model.id), ['beta/unknown-price']);
});

test('restricted network egress with a missing provider fails closed', () => {
  const intent = { ...publicCodingIntent, dataClass: 'SECRET' as const };
  assert.equal(evaluatePolicy({ intent, requestedCapabilities: ['network.outbound'] }).allowed, false);
  assert.equal(evaluatePolicy({ intent, requestedCapabilities: [] }).allowed, true);
});

test('allowed policy decisions do not discharge outstanding human approval', () => {
  const intent = validateIntentDecision({ ...publicCodingIntent, intent: 'finance', dataClass: 'FINANCIAL' });
  const checkout = evaluatePolicy({ intent, requestedCapabilities: ['network.outbound'], targetProvider: 'stripe', approvedProviders: ['stripe'] });
  assert.equal(checkout.allowed, true);
  assert.equal(checkout.requiresHumanApproval, true);
  assert.equal(mayExecuteWithoutApproval(checkout), false);
  assert.equal(mayExecuteWithoutApproval(evaluatePolicy({ intent: publicCodingIntent, requestedCapabilities: [] })), true);
});

test('invalid budget numbers, fractional counters and future start times fail closed', () => {
  const budget = { maxTurns: 2, maxToolCalls: 3, maxRetries: 1, maxWallClockMs: 1000, maxEstimatedUsd: 1 };
  const usage = { turns: 0, toolCalls: 0, retries: 0, startedAtMs: Date.now(), estimatedUsd: 0 };
  for (const value of [NaN, Infinity, -1]) {
    assert.equal(evaluateBudget({ ...budget, maxEstimatedUsd: value }, usage).allowed, false);
    assert.equal(evaluateBudget(budget, { ...usage, estimatedUsd: value }).allowed, false);
  }
  assert.equal(evaluateBudget(budget, { ...usage, turns: 0.5 }).allowed, false);
  assert.equal(evaluateBudget(budget, { ...usage, startedAtMs: Date.now() + 60_000 }).allowed, false);
});

test('unknown-price ties are stable regardless of catalog order', () => {
  const models = [{ id: 'z/model' }, { id: 'a/model' }, { id: 'm/model' }];
  for (const catalog of [models, [...models].reverse(), [models[1], models[0], models[2]]]) {
    assert.deepEqual(routeFromCatalog(catalog, { taskClass: 'fast', dataClass: 'PUBLIC' }).eligible.map(model => model.id),
      ['a/model', 'm/model', 'z/model']);
  }
});

test('invalid pricing, metadata and request ceilings cannot imply free eligible inference', () => {
  const catalog = [
    { id: 'a/negative', pricing: { input: '-1' } }, { id: 'b/blank', pricing: { input: '  ' } },
    { id: 'c/unknown', pricing: { input: 'NaN' } }, { id: 'd/free', pricing: { input: '0' } },
    { id: 'e/bad-context', context_window: Infinity, pricing: { input: '0' } }
  ];
  const request = { taskClass: 'fast' as const, dataClass: 'PUBLIC' as const, maxInputCostPerToken: 0 };
  assert.deepEqual(routeFromCatalog(catalog, request).eligible.map(model => model.id), ['d/free']);
  for (const value of [NaN, Infinity, -1]) {
    assert.throws(() => routeFromCatalog(catalog, { ...request, maxInputCostPerToken: value }), /Invalid model route/);
  }
});
