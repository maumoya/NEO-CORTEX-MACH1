# Changelog

## 0.3.1 — 2026-09-12 — Verification Baseline
- Added persistent repository state, decision, and prioritized-next-action records.
- Added a reproducible one-command verification gate covering secret patterns, TypeScript, core policy tests, production build, and dependency audit.
- Added ten regression tests for high-risk approval, classified-data routing, autonomous-action denial, identity, budgets, sandboxing, checkpoints, safe mode, evolution quarantine, and deterministic model selection.
- Replaced model-catalog first-match routing with deterministic tier preferences and a testable catalog-routing function.
- Added a build gate that rejects product pages consuming seeded demo data without an explicit demo banner.
- Bound Stripe Checkout creation to an authenticated user, explicit request-scoped approval, normal execution mode, and Policy Kernel decision; added Clerk route protection when configured.
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
