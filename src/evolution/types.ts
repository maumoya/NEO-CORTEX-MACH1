export type CandidateKind='documentation'|'model'|'skill'|'mcp'|'agent_framework'|'security_advisory'|'social_api'|'dependency';
export interface Candidate{id:string;kind:CandidateKind;source:string;version:string;discoveredAt:string;executable:boolean;license?:string;hash?:string;notes?:string[];}
export type CandidateDecision='observe'|'quarantine'|'reject'|'evaluate'|'await_approval'|'preview'|'canary'|'promote'|'rollback';
