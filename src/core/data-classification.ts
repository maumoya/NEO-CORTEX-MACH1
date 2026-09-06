export const DATA_CLASSES = ['PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED','PII','PHI','FINANCIAL','LEGAL','SECRET'] as const;
export type DataClass = (typeof DATA_CLASSES)[number];
const SENSITIVE = new Set<DataClass>(['CONFIDENTIAL','RESTRICTED','PII','PHI','FINANCIAL','LEGAL','SECRET']);
const HIGHLY_RESTRICTED = new Set<DataClass>(['RESTRICTED','PHI','SECRET']);
export function isSensitive(dataClass: DataClass): boolean { return SENSITIVE.has(dataClass); }
export function requiresPrivateOrExplicitlyApprovedInference(dataClass: DataClass): boolean { return HIGHLY_RESTRICTED.has(dataClass); }
export function mayPersistRawPayload(dataClass: DataClass): boolean { return dataClass !== 'SECRET' && dataClass !== 'PHI'; }
