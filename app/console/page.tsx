import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Nav } from '@/components/Brand';
import { DirectorConsole } from '@/components/DirectorConsole';
import { clerkConfigured, isAdminUserId } from '@/src/auth/config';
import { executionModeFromEnvironment } from '@/src/core/kill-switch';
import { runtimeAvailability } from '@/src/runtime/config';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Safe Director' };

export default async function ConsolePage() {
  const availability = runtimeAvailability();
  const authReady = clerkConfigured();
  if (authReady) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    if (!isAdminUserId(userId)) redirect('/dashboard');
  }
  const mode = executionModeFromEnvironment();
  const enabled = availability.enabled && authReady && mode.mode !== 'halted';
  const reason = !availability.enabled ? availability.reason : !authReady ? 'authentication_not_configured'
    : mode.mode === 'halted' ? 'execution_halted' : 'ready';
  return <><Nav /><main className="page"><div className="pageTitle">
    <div className="eyebrow">OPERATOR CONSOLE</div><h1>Safe Director</h1>
    <p>Fixed, read-only workload operations with durable local receipts. No AI inference, shell tools, or computer control.</p>
  </div><div className="statusBanner">{enabled ? 'CONFIGURED' : 'DISABLED'} · {reason.replaceAll('_', ' ')} · Execution mode: {mode.mode}</div>
    <DirectorConsole enabled={enabled} />
    <p>Local SQLite requires a persistent, private directory. Vercel execution remains disabled until a shared durable store is implemented.</p>
  </main></>;
}
