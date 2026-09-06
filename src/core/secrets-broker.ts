export interface SecretLeaseRequest { secretId: string; actorId: string; taskId: string; purpose: string; ttlSeconds: number; }
export interface SecretLease { leaseId: string; secretId: string; expiresAt: string; handle: string; }
export interface SecretsBroker { lease(request: SecretLeaseRequest): Promise<SecretLease>; revoke(leaseId: string): Promise<void>; }
export function redactSecretLikeValue(value: string): string { if (!value) return value; if (value.length <= 8) return '[REDACTED]'; return `${value.slice(0,3)}…[REDACTED]…${value.slice(-2)}`; }
