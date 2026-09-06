export type ExecutionMode = 'normal'|'safe'|'halted';
export interface ExecutionModeState { mode: ExecutionMode; reason?: string; }
export function executionModeFromEnvironment(): ExecutionModeState { const raw=(process.env.NEO_CORTEX_EXECUTION_MODE??'safe').toLowerCase(); if(raw==='normal')return{mode:'normal'}; if(raw==='halted')return{mode:'halted',reason:'environment_kill_switch'}; return{mode:'safe',reason:'default_safe_mode'}; }
export function assertMayMutateExternalState(state: ExecutionModeState): void { if(state.mode!=='normal')throw new Error(`External mutation disabled: ${state.mode}:${state.reason??'unspecified'}`); }
export function assertMayRunReadOnly(state: ExecutionModeState): void { if(state.mode==='halted')throw new Error(`Execution halted: ${state.reason??'unspecified'}`); }
