import type { Candidate, CandidateDecision } from './types';
export function initialDecision(candidate:Candidate):CandidateDecision{if(candidate.executable)return'quarantine';if(candidate.kind==='security_advisory'||candidate.kind==='model')return'evaluate';return'observe';}
export function mayAutoExecute(_candidate:Candidate):boolean{return false;}
