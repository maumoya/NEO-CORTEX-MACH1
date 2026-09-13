'use client';

import { useRef, useState } from 'react';

type TaskKind = 'inventory' | 'verification' | 'source_review';
type StagedPacket = {
  packet: { packetId: string; packetHash: string; task: { kind: TaskKind; title: string; objective: string; workspace: string; timeLimitMinutes: number } };
  receipt: { relativePath: string; createdAt: string };
  replayed: boolean;
  workerPrompt: string;
};

const descriptions: Record<TaskKind, string> = {
  inventory: 'Read-only Mac or workspace inventory. No edits, installs, sign-ins, or network changes.',
  verification: 'Run the existing repository verification command and inspect its output. No source changes.',
  source_review: 'Read source, tests, and documentation; produce a report only. No edits or execution beyond inspection.'
};

export function LocalOperator({ enabled }: { enabled: boolean }) {
  const [kind, setKind] = useState<TaskKind>('verification');
  const [title, setTitle] = useState('Verify NEO-CORTEX local installation');
  const [objective, setObjective] = useState('Run the existing verification command, inspect its output, and report exact passing or failing checks without changing files.');
  const [workspace, setWorkspace] = useState('~/Developer/NEO-CORTEX-MACH1');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('No worker packet staged.');
  const [result, setResult] = useState<StagedPacket | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  async function stage() {
    if (!enabled || busy) return;
    setBusy(true);
    setMessage('Staging a local, non-executing work packet…');
    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch('/api/operator/tasks', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idempotencyKey: idempotencyKey.current, kind, title, objective, workspace, timeLimitMinutes }),
        signal: AbortSignal.timeout(10_000)
      });
      const data = await response.json() as StagedPacket | { error: string };
      if (!response.ok || 'error' in data) {
        setMessage(`Packet was not staged: ${'error' in data ? data.error : 'operator_unavailable'}.`);
        return;
      }
      setResult(data);
      idempotencyKey.current = null;
      setMessage(data.replayed ? 'Existing packet safely replayed; no duplicate was created.' : 'Packet staged locally. It has not run and no worker has been contacted.');
    } catch {
      setMessage('The request failed. Retrying will reuse the same key and cannot duplicate a staged packet.');
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.workerPrompt);
      setMessage('Worker packet copied. Submit it to OpenClicky only when you want this bounded task run.');
    } catch {
      setMessage('Clipboard access was unavailable. Select and copy the packet text below.');
    }
  }

  return <section className="operatorGrid">
    <div className="dataPanel">
      <div className="operatorTitle"><div><div className="eyebrow">LOCAL OPERATOR</div><h2>Stage a real task</h2></div><span className="pill">LOCAL ONLY</span></div>
      <p className="operatorIntro">This is the usable first NEO-CORTEX: it makes a durable, policy-bounded OpenClicky work packet. Staging never runs shell commands, calls a model, or contacts OpenClicky.</p>
      <label htmlFor="operator-kind">Task type</label>
      <select id="operator-kind" value={kind} disabled={!enabled || busy} onChange={event => { setKind(event.target.value as TaskKind); idempotencyKey.current = null; }}>
        <option value="verification">Repository verification</option><option value="inventory">System / workspace inventory</option><option value="source_review">Source review</option>
      </select>
      <p className="fieldHelp">{descriptions[kind]}</p>
      <label htmlFor="operator-title">Task title</label>
      <input id="operator-title" value={title} maxLength={120} disabled={!enabled || busy} onChange={event => { setTitle(event.target.value); idempotencyKey.current = null; }} />
      <label htmlFor="operator-objective">Objective</label>
      <textarea id="operator-objective" value={objective} maxLength={1200} rows={5} disabled={!enabled || busy} onChange={event => { setObjective(event.target.value); idempotencyKey.current = null; }} />
      <label htmlFor="operator-workspace">Declared workspace</label>
      <input id="operator-workspace" value={workspace} maxLength={500} disabled={!enabled || busy} onChange={event => { setWorkspace(event.target.value); idempotencyKey.current = null; }} />
      <label htmlFor="operator-time">Maximum minutes</label>
      <input id="operator-time" type="number" min="1" max="30" value={timeLimitMinutes} disabled={!enabled || busy} onChange={event => { setTimeLimitMinutes(Number(event.target.value)); idempotencyKey.current = null; }} />
      <div className="operatorActions"><button className="solidButton" onClick={stage} disabled={!enabled || busy}>{busy ? 'Staging…' : 'Stage safe worker packet'}</button></div>
      <p className="fieldHelp" aria-live="polite">{message}</p>
    </div>
    <div className="dataPanel">
      <div className="operatorTitle"><div><div className="eyebrow">WORKER HANDOFF</div><h2>Review before running</h2></div>{result && <span className="pill">STAGED</span>}</div>
      <p className="operatorIntro">OpenClicky is not directly connected yet. Copying this packet is the deliberate, visible handoff boundary until its real local integration has been inspected and approved.</p>
      {result ? <>
        <dl className="receiptList"><div><dt>Packet</dt><dd>{result.packet.packetId}</dd></div><div><dt>Receipt</dt><dd>{result.receipt.relativePath}</dd></div><div><dt>Created</dt><dd>{new Date(result.receipt.createdAt).toLocaleString()}</dd></div></dl>
        <button className="ghostButton" onClick={copy}>Copy bounded worker packet</button>
        <pre className="operatorPrompt" aria-live="polite">{result.workerPrompt}</pre>
      </> : <div className="emptyState">Stage a task to generate a worker packet and local receipt.</div>}
    </div>
  </section>;
}
