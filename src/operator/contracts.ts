import { z } from 'zod';

export const operatorTaskKinds = ['inventory', 'verification', 'source_review'] as const;
export type OperatorTaskKind = typeof operatorTaskKinds[number];

const text = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum)
  .refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value), 'control_characters_not_allowed');

// This schema deliberately represents a staging request, not an arbitrary agent prompt.
// The server does not interpret the workspace or objective as an executable instruction.
export const operatorPacketRequestSchema = z.object({
  idempotencyKey: z.string().min(16).max(128).regex(/^[a-zA-Z0-9_-]+$/),
  kind: z.enum(operatorTaskKinds),
  title: text(4, 120),
  objective: text(12, 1200),
  workspace: text(1, 500),
  timeLimitMinutes: z.number().int().min(1).max(30)
}).strict();

export type OperatorPacketRequest = z.infer<typeof operatorPacketRequestSchema>;

export interface OperatorPacket {
  version: 1;
  packetId: string;
  createdAt: string;
  packetHash: string;
  state: 'staged';
  task: Omit<OperatorPacketRequest, 'idempotencyKey'>;
  authority: {
    mode: 'local-only-safe';
    execution: 'human-submitted-worker-handoff';
    objectiveTrust: 'untrusted-task-content';
  };
  allowed: readonly string[];
  prohibited: readonly string[];
  verification: readonly string[];
}

export interface OperatorPacketReceipt {
  packetId: string;
  packetHash: string;
  kind: OperatorTaskKind;
  state: 'staged';
  createdAt: string;
  relativePath: string;
}

export interface OperatorPacketRecord extends OperatorPacketReceipt {
  actorKey: string;
  idempotencyHash: string;
  requestHash: string;
}

export class OperatorFault extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'OperatorFault';
  }
}
