import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { clerkConfigured } from '@/src/auth/config';
import { executionModeFromEnvironment, assertMayMutateExternalState } from '@/src/core/kill-switch';
import { validateIntentDecision } from '@/src/core/intent-gateway';
import { evaluatePolicy, mayExecuteWithoutApproval } from '@/src/core/policy-kernel';

const inputSchema = z.object({ plan: z.enum(['core', 'pro', 'operator']) });
const priceEnv = { core: 'STRIPE_PRICE_CORE', pro: 'STRIPE_PRICE_PRO', operator: 'STRIPE_PRICE_OPERATOR' } as const;

function trustedOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  const origin = configured ? new URL(configured).origin : new URL(request.url).origin;
  if (process.env.NODE_ENV === 'production' && !origin.startsWith('https://')) throw new Error('Production checkout requires an HTTPS application URL.');
  return origin;
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: 'Billing is not configured on this deployment.' }, { status: 503 });
  if (!clerkConfigured()) return Response.json({ error: 'Authenticated billing is not configured on this deployment.' }, { status: 503 });

  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Authentication required.' }, { status: 401 });

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Invalid plan.' }, { status: 400 });
  const priceId = process.env[priceEnv[parsed.data.plan]];
  if (!priceId) return Response.json({ error: 'This plan is not connected to a Stripe price yet.' }, { status: 503 });

  try {
    assertMayMutateExternalState(executionModeFromEnvironment());
  } catch {
    return Response.json({ error: 'External mutations are disabled by the execution policy.' }, { status: 503 });
  }

  const intent = validateIntentDecision({
    intent: 'finance', dataClass: 'FINANCIAL', needsWeb: false, needsTools: true,
    needsAgents: false, preferLocal: false, approvalRequired: true, confidence: 1
  });
  const policy = evaluatePolicy({
    intent, requestedCapabilities: ['network.outbound'], targetProvider: 'stripe', approvedProviders: ['stripe']
  });
  if (!policy.allowed) return Response.json({ error: 'Checkout denied by policy.', reasonCodes: policy.reasonCodes }, { status: 403 });
  // A caller-controlled header cannot prove approval. Keep billing disabled until a
  // server-verified, user/plan-bound, expiring, single-use approval flow is implemented.
  if (!mayExecuteWithoutApproval(policy)) {
    return Response.json({ error: 'Checkout is disabled until the server-side approval workflow is implemented.' }, { status: 403 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = trustedOrigin(request);
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    client_reference_id: userId,
    metadata: { appUserId: userId, plan: parsed.data.plan },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    allow_promotion_codes: true
  });
  if (!session.url) return Response.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 });
  return Response.json({ url: session.url });
}
