# NEO-CORTEX MACH1

**One persistent brain. Many models. Many agents. Governed.**

NEO-CORTEX MACH1 is an Agentic OS under construction: a product shell, deterministic policy contracts, an opt-in local Director with durable task receipts, and a governed integration roadmap. Dashboards still use seeded examples; models, personal memory, Mac control and cross-device workers are not activated by the presence of this code.

Start with [the concise framework and implementation sequence](docs/AGENTIC-OS-FRAMEWORK.md), [runtime setup](docs/SAFE-DIRECTOR.md), and the shared [state](NEO-CORTEX_STATE.md), [decisions](NEO-CORTEX_DECISIONS.md), and [next actions](NEO-CORTEX_NEXT.md).

Memory decision: NEO owns identity and operational state; Obsidian is the readable knowledge workspace; Graphify is a rebuildable index. Orbit remains optional until its exact project is identified. All devices connect to the same core. [ECC integration](docs/ECC-INTEGRATION.md) supplies reviewed, pinned skills, including verification loops; Agent-Reach and OpenClicky activation contracts are included.

## Product surfaces
- `/` — product landing page and architecture visualization
- `/pricing` — subscription plans and Stripe Checkout boundary
- `/updates` — customer-readable release timeline
- `/support` — support tiers
- `/sign-in` — Clerk-backed identity boundary when configured
- `/dashboard` — customer Mission Control
- `/backoffice` — founder revenue/CRM/product dashboard; admin-only when auth is configured
- `/console` — fixed read-only Director operations; disabled until authenticated local runtime is configured
- `POST /api/agent` — bounded `status` / `next` operations with actor-scoped idempotency and SQLite receipts

## Agentic OS control plane
`Intent → Context → Model Router → Agent Orchestrator → Skills/Tools → Policy Kernel → Execution → Verification → Memory → Learning`

The deterministic Policy Kernel remains above all model/tool-generated instructions. Unknown executable artifacts are quarantined. High-risk actions remain approval-gated.

## Safe-by-default deployment
This repository commits **no secrets**. With no production credentials, the product runs in clearly labeled demo mode and billing endpoints fail closed.

`.env.example` lists configuration names only. Credentials alone do not implement missing adapters or remove demo labels. Checkout remains blocked until a trusted server-side approval workflow exists; the previous caller-supplied approval header was insufficient. Local SQLite runtime is disabled on Vercel until shared durable storage is implemented.

## Development

Use Node `>=24.14 <25`, then `npm ci --ignore-scripts` and `npm run verify`. Verification checks the ECC profile, secret patterns, demo source boundary, TypeScript, regression tests, production build and dependency audit. It does not prove live Mac/account/device access.

The hourly Upgrade Watch and Monday morning Weekly Evolution scheduled tasks were updated on 2026-09-12. [Schedule receipt](config/research-schedule.json), [upgrade candidates](docs/UPGRADE-CANDIDATES.md), and [historical requirements](docs/REQUIREMENTS-RECONCILIATION.md) distinguish research from installed capabilities.

## Release discipline
Every shipped change must update both `CHANGELOG.md` and `src/product/releases.ts`, so the public `/updates` page stays synchronized with the product.

## Evolution pipeline
`DISCOVER → NORMALIZE → QUARANTINE → SCAN → EVALUATE → PROPOSE → APPROVE → CANARY → PROMOTE → OBSERVE → ROLLBACK`

See `docs/EVOLUTION-ENGINE.md` and `docs/LEARNING-COVERAGE.md`.
