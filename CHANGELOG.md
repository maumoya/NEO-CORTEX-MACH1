# Changelog

## 0.5.0 — 2026-09-13 — Local Operator
- Publication verified: implementation commit `c7a63d3`, identical local/GitHub tree, and passing GitHub Verify run `34743109975`.
- Added `/operator` and `POST /api/operator/tasks`: a practical, localhost-only task cockpit that stages private, bounded OpenClicky work packets without running a model, shell command, OpenClicky, or any external action.
- Added three initial read-only task categories: inventory, repository verification, and source review. Every generated packet prohibits credential/cookie/Keychain access, installation, account/network/model changes, publishing, social activity, money movement, deployment, Git push, and edits.
- Added a private `openclicky-outbox` with 0600 JSON packets, an integrity-checked local SQLite receipt journal, actor-scoped idempotency, strict input/time limits, same-origin request checks, and an explicit local-only configuration gate.
- Added 0.5 regression and built-app smoke coverage. The UI makes clear that OpenClicky is not yet directly connected; a real adapter requires observed host/application evidence rather than a guessed protocol.

## 0.4.0 — 2026-09-12 — Shared Brain and Safe Director
- Publication verified: implementation commit `13c221c`, identical local/GitHub tree, and passing GitHub Verify run `34721933277`; receipt recorded 2026-09-13.
- Reconciled recovered GPT context and all three owner-supplied documents into one architecture and implementation sequence: NEO-owned state, Obsidian knowledge workspace, Graphify derived index, shared device identity and optional Orbit pending exact identification.
- Added opt-in `/api/agent` and `/console` for deterministic `status`/`next` operations with no inference or workload tools. SQLite records task/correlation IDs, actor-scoped idempotency, transactional lifecycle events, rate limits, integrity checks and conservative interrupted-work recovery.
- Added HTTP authentication/admin/origin/input boundaries and disabled serverless runtime until shared durable storage is available.
- Added 28 regression tests beyond the ten-test baseline, covering persistence across processes, concurrent duplicate requests, ownership, recovery, journal modifications, HTTP boundaries, invalid routing/budget numbers and unconditional demo labeling.
- Corrected 0.3.1's approval claim: a caller-supplied Checkout header is not human approval evidence. Removed it and blocked Checkout while the required server-side approval workflow is absent.
- Fixed unknown-price routing ties, invalid price/metadata handling and missing-provider restricted egress. Catalog requests now have a timeout and reject redirects.
- Added a pinned, reviewed ECC instruction profile with MIT attribution, NEO verification/repair loops, Agent-Reach and OpenClicky worker skills, and the supplied paper-polishing workflow. No upstream executable/hook or new model provider was activated.
- Recorded enabled hourly Upgrade Watch and Monday morning Weekly Evolution schedules; preserved historical upgrade proposals without claiming they were installed.
- Aligned the runtime/CI on Node 24; updated state, decisions, next actions and learning coverage. Mac inspection, mobile enrollment and live account verification remain pending actual access.

## 0.3.1 — 2026-09-12 — Verification Baseline
- Added persistent repository state, decision, and prioritized-next-action records.
- Added a reproducible one-command verification gate covering secret patterns, TypeScript, core policy tests, production build, and dependency audit.
- Added ten regression tests for high-risk approval, classified-data routing, autonomous-action denial, identity, budgets, sandboxing, checkpoints, safe mode, evolution quarantine, and deterministic model selection.
- Replaced model-catalog first-match routing with deterministic tier preferences and a testable catalog-routing function.
- Added a build gate that rejects product pages consuming seeded demo data without an explicit demo banner.
- Bound Stripe Checkout creation to an authenticated user, a caller-supplied approval header, normal execution mode, and Policy Kernel decision; added Clerk route protection when configured. **Corrected in 0.4.0:** the header was not trustworthy approval evidence and outstanding human approval was not enforced.
- Added a least-privilege GitHub Actions workflow with commit-pinned actions.
- Added the npm lockfile and accepted Next.js 16 generated TypeScript configuration for reproducible builds.

## 0.3.0 — 2026-09-06 — MACH1 Product Surface
- Migrated the Agentic OS into its dedicated canonical repository.
- Added next-generation product landing page and architecture presentation.
- Added pricing/subscription product surface with server-side Stripe Checkout boundary.
- Added Clerk-ready authenticated customer Mission Control.
- Added founder backoffice with MRR, ARR, cash, margin, CRM funnel, plan mix, customer health and product metrics.
- Added customer-readable release intelligence at `/updates`.
- Added support product surface and subscription tier benefits.
- Added Postgres-compatible SaaS/CRM schema.
- Kept all integrations safe-by-default and credential-free in Git.

## 0.2.0 — 2026-09-06 — Control & Trust Foundation
- Added data classification, Intent Gateway, deterministic Policy Kernel and compliance-aware model routing.
- Added task/correlation IDs, execution receipts, secret leases, sandbox contracts and checkpointing.
- Added bounded budget guard and execution kill switch.
- Pinned dependencies for reproducible installs.

## 0.1.0 — 2026-09-05 — Evolution Engine Seed
- Added governed upgrade pipeline, agent contract, model router starter, source watchlist and social policy.
