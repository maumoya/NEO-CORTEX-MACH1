# NEO-CORTEX MACH1

**One persistent brain. Many models. Many agents. Governed.**

NEO-CORTEX MACH1 is a model-agnostic Agentic Operating System plus the product surface around it: a public SaaS site, customer Mission Control, founder backoffice, governed evolution engine, subscription boundary, release intelligence, and secure identity boundary.

## Product surfaces
- `/` — product landing page and architecture visualization
- `/pricing` — subscription plans and Stripe Checkout boundary
- `/updates` — customer-readable release timeline
- `/support` — support tiers
- `/sign-in` — Clerk-backed identity boundary when configured
- `/dashboard` — customer Mission Control
- `/backoffice` — founder revenue/CRM/product dashboard; admin-only when auth is configured

## Agentic OS control plane
`Intent → Context → Model Router → Agent Orchestrator → Skills/Tools → Policy Kernel → Execution → Verification → Memory → Learning`

The deterministic Policy Kernel remains above all model/tool-generated instructions. Unknown executable artifacts are quarantined. High-risk actions remain approval-gated.

## Safe-by-default deployment
This repository commits **no secrets**. With no production credentials, the product runs in clearly labeled demo mode and billing endpoints fail closed.

Production integrations are activated through `.env.example`: Clerk, Stripe, Postgres-compatible storage, OpenAI, and Vercel AI Gateway.

## Release discipline
Every shipped change must update both `CHANGELOG.md` and `src/product/releases.ts`, so the public `/updates` page stays synchronized with the product.

## Evolution pipeline
`DISCOVER → NORMALIZE → QUARANTINE → SCAN → EVALUATE → PROPOSE → APPROVE → CANARY → PROMOTE → OBSERVE → ROLLBACK`

See `docs/EVOLUTION-ENGINE.md` and `docs/LEARNING-COVERAGE.md`.
