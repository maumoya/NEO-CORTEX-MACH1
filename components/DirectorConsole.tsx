'use client';

import { useRef, useState } from 'react';

export function DirectorConsole({ enabled }: { enabled: boolean }) {
  const [operation, setOperation] = useState<'status' | 'next'>('status');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('No task submitted.');
  const requestKey = useRef<string | null>(null);
  const inFlight = useRef(false);

  async function run() {
    if (inFlight.current || !enabled) return;
    inFlight.current = true;
    setBusy(true);
    try {
      requestKey.current ??= crypto.randomUUID();
      const response = await fetch('/api/agent', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operation, idempotencyKey: requestKey.current }), signal: AbortSignal.timeout(10_000) });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      if (response.ok) requestKey.current = null;
    } catch { setResult('Request failed. Retrying will reuse the same request key to avoid duplicate work.'); }
    finally { inFlight.current = false; setBusy(false); }
  }

  return <section className="dataPanel" style={{ marginTop: 24 }}>
    <label htmlFor="director-operation">Operation</label>{' '}
    <select id="director-operation" value={operation} disabled={busy || !enabled}
      onChange={event => { setOperation(event.target.value as 'status' | 'next'); requestKey.current = null; }}>
      <option value="status">Runtime status</option><option value="next">Planned next actions</option>
    </select>{' '}
    <button className="solidButton" onClick={run} disabled={busy || !enabled}>{busy ? 'Running…' : 'Run read-only task'}</button>
    <pre aria-live="polite" role="status" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: 20 }}>{result}</pre>
  </section>;
}
