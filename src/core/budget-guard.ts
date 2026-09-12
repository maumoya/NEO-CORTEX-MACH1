import type { TaskBudget } from './task-context';
export interface BudgetUsage { turns: number; toolCalls: number; retries: number; startedAtMs: number; estimatedUsd: number; }
export type BudgetDecision = { allowed: true } | { allowed: false; reason: string };
export function evaluateBudget(budget: TaskBudget, usage: BudgetUsage): BudgetDecision {
  const values = [budget.maxTurns, budget.maxToolCalls, budget.maxRetries, budget.maxWallClockMs, budget.maxEstimatedUsd,
    usage.turns, usage.toolCalls, usage.retries, usage.startedAtMs, usage.estimatedUsd];
  const counts = [budget.maxTurns, budget.maxToolCalls, budget.maxRetries, usage.turns, usage.toolCalls, usage.retries];
  if (values.some(value => !Number.isFinite(value) || value < 0) || counts.some(value => !Number.isSafeInteger(value))) {
    return { allowed: false, reason: 'invalid_budget_or_usage' };
  }
  const now = Date.now();
  if (usage.startedAtMs > now) return { allowed: false, reason: 'invalid_start_time' };
  if (usage.turns >= budget.maxTurns) return { allowed: false, reason: 'max_turns_exceeded' };
  if (usage.toolCalls >= budget.maxToolCalls) return { allowed: false, reason: 'max_tool_calls_exceeded' };
  if (usage.retries > budget.maxRetries) return { allowed: false, reason: 'max_retries_exceeded' };
  if (now - usage.startedAtMs >= budget.maxWallClockMs) return { allowed: false, reason: 'max_wall_clock_exceeded' };
  if (usage.estimatedUsd >= budget.maxEstimatedUsd) return { allowed: false, reason: 'max_estimated_cost_exceeded' };
  return { allowed: true };
}
export function assertWithinBudget(budget: TaskBudget, usage: BudgetUsage): void { const d = evaluateBudget(budget, usage); if (!d.allowed) throw new Error(`NEO-CORTEX circuit breaker: ${d.reason}`); }
