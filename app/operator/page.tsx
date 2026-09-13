import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Nav } from '@/components/Brand';
import { LocalOperator } from '@/components/LocalOperator';
import { clerkConfigured, isAdminUserId } from '@/src/auth/config';
import { executionModeFromEnvironment } from '@/src/core/kill-switch';
import { operatorAvailability } from '@/src/operator/config';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Local Operator' };

export default async function OperatorPage() {
  const availability = operatorAvailability();
  const authReady = clerkConfigured();
  if (authReady) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    if (!isAdminUserId(userId)) redirect('/dashboard');
  }
  const mode = executionModeFromEnvironment();
  const enabled = availability.enabled && mode.mode !== 'halted';
  const reason = !availability.enabled ? availability.reason : mode.mode === 'halted' ? 'execution_halted' : 'ready';
  return <><Nav /><main className="page"><div className="pageTitle">
    <div className="eyebrow">DAY-ONE AGENTIC OS</div><h1>Local Operator</h1>
    <p>Use NEO-CORTEX now to stage, audit, and hand off bounded local work. The first release is deliberately useful without pretending it has unrestricted computer control.</p>
  </div><div className="statusBanner">{enabled ? 'READY' : 'DISABLED'} · {reason.replaceAll('_', ' ')} · Execution mode: {mode.mode}</div>
    <LocalOperator enabled={enabled} />
  </main></>;
}
