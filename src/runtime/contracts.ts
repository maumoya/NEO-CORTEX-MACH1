import { z } from 'zod';

export const directorRequestSchema = z.object({
  operation: z.enum(['status', 'next']),
  idempotencyKey: z.string().min(16).max(128).regex(/^[a-zA-Z0-9_-]+$/)
}).strict();
export type DirectorRequest = z.infer<typeof directorRequestSchema>;
export type TaskState = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
export interface RuntimeActor { id: string; authenticated: boolean; role: 'admin' | 'operator' | 'viewer' | 'agent'; }
export interface TaskRecord {
  taskId: string;
  correlationId: string;
  actorKey: string;
  idempotencyHash: string;
  requestHash: string;
  operation: DirectorRequest['operation'];
  state: TaskState;
  createdAt: string;
  updatedAt: string;
  result: Record<string, unknown> | null;
  reason: string | null;
}
export class RuntimeFault extends Error {
  constructor(public readonly code: string) { super(code); this.name = 'RuntimeFault'; }
}
export const DIRECTOR_BUDGET = Object.freeze({
  maxTurns: 8, maxToolCalls: 0, maxRetries: 0, maxWallClockMs: 60_000, maxEstimatedUsd: 0
});
