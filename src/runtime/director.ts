import { platform } from 'node:os';
import { evaluateIdentity } from '../core/identity';
import { assertMayRunReadOnly, type ExecutionModeState } from '../core/kill-switch';
import { evaluatePolicy, mayExecuteWithoutApproval } from '../core/policy-kernel';
import { DIRECTOR_BUDGET, directorRequestSchema, RuntimeFault, type RuntimeActor } from './contracts';
import { SqliteTaskStore } from './task-store';

// No prompts, providers, subprocesses, dynamic tools or arbitrary file paths are accepted.
export function runDirector(input: unknown, actor: RuntimeActor, store: SqliteTaskStore, mode: ExecutionModeState,
  signal?: AbortSignal) {
  const identity = evaluateIdentity({ actorId: actor.id, role: actor.role, sessionId: 'server-verified',
    authenticated: actor.authenticated, mfaSatisfied: false, trustedDevice: false }, false);
  if (!identity.allowed || actor.role !== 'admin' || !actor.id) throw new RuntimeFault('administrator_required');
  if (mode.mode === 'halted') throw new RuntimeFault('execution_halted');
  assertMayRunReadOnly(mode);
  const parsed = directorRequestSchema.safeParse(input);
  if (!parsed.success) throw new RuntimeFault('invalid_director_request');
  const policy = evaluatePolicy({ intent: { intent: 'administrative', dataClass: 'PUBLIC', needsWeb: false,
    needsTools: false, needsAgents: false, preferLocal: true, approvalRequired: false, confidence: 1 }, requestedCapabilities: [] });
  if (!mayExecuteWithoutApproval(policy)) throw new RuntimeFault('policy_denied');
  if (signal?.aborted) throw new RuntimeFault('request_cancelled');
  store.verifyIntegrity();
  store.recoverInterrupted();
  const accepted = store.accept(actor.id, parsed.data);
  if (accepted.replayed) return { ...accepted, receipt: store.verifyIntegrity(), execution: 'deterministic-no-inference' as const };
  let task = store.transition(actor.id, accepted.task.taskId, 'queued', 'running');
  const startedAt = Date.now();
  try {
    const result = parsed.data.operation === 'status' ? {
      kind: 'runtime-status', execution: 'deterministic-no-inference', platform: platform(), executionMode: mode.mode,
      storage: 'local-sqlite', workloadTools: [], providerCalls: 0, estimatedUsd: 0, turns: 1,
      openClicky: 'not-connected', modelMemory: 'not-implemented', budget: DIRECTOR_BUDGET
    } : {
      kind: 'planned-next-actions', source: 'reviewed-roadmap-not-live-discovery',
      actions: ['Attach an authorized Mac execution/desktop session and verify OpenClicky.',
        'Implement an explicitly configured NIM/local inference adapter with classification and cost checks.',
        'Add durable shared storage before enabling runtime on Vercel.',
        'Implement candidate quarantine/evaluations before automated upgrades.'],
      workloadTools: [], providerCalls: 0, estimatedUsd: 0, turns: 1
    };
    if (signal?.aborted) task = store.cancel(actor.id, task.taskId);
    else if (Date.now() - startedAt >= DIRECTOR_BUDGET.maxWallClockMs) {
      task = store.transition(actor.id, task.taskId, 'running', 'failed', { reason: 'execution_deadline_exceeded' });
    } else task = store.transition(actor.id, task.taskId, 'running', 'succeeded', { result });
  } catch {
    task = store.transition(actor.id, task.taskId, 'running', 'failed', { reason: 'director_execution_failed' });
  }
  return { task, replayed: false, receipt: store.verifyIntegrity(), execution: 'deterministic-no-inference' as const };
}
