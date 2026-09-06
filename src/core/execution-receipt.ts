import type { Capability } from './policy-kernel';
export interface ExecutionReceipt { receiptId: string; taskId: string; correlationId: string; actorId: string; action: string; capabilities: Capability[]; startedAt: string; completedAt: string; outcome: 'success'|'failed'|'denied'|'rolled_back'; policyReasonCodes: string[]; artifactRefs: string[]; rollbackRef?: string; }
export function createReceiptId(): string { return `receipt_${crypto.randomUUID()}`; }
