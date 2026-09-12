# NEO-CORTEX Next

Last updated: 2026-09-12 UTC

Priority is ordered. Only one item is `IN PROGRESS` at a time.

## P0 — Establish a trustworthy repository baseline

- [x] Confirm canonical GitHub repository and current commit.
- [x] Read architecture, agent contract, security policy, evolution design, and migration manifest.
- [x] Resolve pinned dependencies with lifecycle scripts disabled.
- [x] Pass TypeScript and production build.
- [x] Run dependency audit and repository secret-pattern scan.
- [x] Create `NEO-CORTEX_STATE.md`, `NEO-CORTEX_DECISIONS.md`, and `NEO-CORTEX_NEXT.md`.
- [x] Make verification reproducible with a single repository command and CI workflow.
- [x] Add focused unit tests for policy, classification, budgets, identity, sandbox validation, checkpoints, and evolution quarantine.
- [x] Add routing-selection tests and remove nondeterministic first-match model selection.
- [x] Add a build-time rule preventing unlabeled demo data from shipping as production telemetry.

## P0 — Close security/runtime gaps

- [x] Put the Intent Gateway and Policy Kernel in front of every currently implemented mutating API path. Future tool and persistence paths must use the same boundary.
- [ ] Add authenticated user binding and server-side entitlement checks to Checkout.
- [ ] Add Stripe webhook idempotency, event persistence, subscription state transitions, and replay tests.
- [ ] Add persistent append-only execution receipts with redaction and integrity checks.
- [ ] Add an enforced outbound network broker and provider allowlist for classified data.
- [ ] Generate SBOM/provenance artifacts and security regression evidence in CI.

## P1 — Build the minimum working Agentic OS

- [ ] Implement the director task state machine with bounded retries, budgets, checkpoints, and cancellation.
- [ ] Implement a durable agent registry from `AGENTS.md`-compatible schemas.
- [ ] Implement a tool registry/execution broker with explicit capabilities and timeouts.
- [ ] Implement durable memory tiers with retention/classification enforcement.
- [ ] Replace first-match model routing with deterministic scoring plus fallback evidence.
- [ ] Implement the evolution candidate store and the discover-to-propose portion of the pipeline without auto-execution.
- [ ] Add operational logs, traces, SLOs, health checks, and incident receipts.

## P1 — Mac mini and OpenClicky integration

- [ ] Attach a genuine Mac execution/desktop bridge to the supervisor session.
- [ ] Locate all NEO-CORTEX checkouts on the Mac and compare commit/status safely.
- [ ] Inspect OpenClicky bundle version, running processes, configuration, logs, model selection, memory, and skills without exposing secrets.
- [ ] Verify Accessibility, Screen Recording, Automation, and Full Disk Access from actual macOS state.
- [ ] Define and implement the narrow OpenClicky worker job/result contract.
- [ ] Delegate one read-only inventory task, then independently verify it through Terminal/filesystem evidence.
- [ ] Expand to bounded edit/build/test jobs only after the read-only proof succeeds.

## P1 — Automation and recovery

- [ ] Resolve the daily-versus-weekly evolution schedule mismatch.
- [ ] Add durable queues, idempotency keys, backoff, concurrency limits, and dead-letter handling.
- [ ] Add watchdog and safe-mode transitions for failed local services.
- [ ] Add backup/restore procedures and execute a restore test.
- [ ] Add preview/canary/rollback controller and verification receipts.

## P2 — Product persistence

- [ ] Connect Postgres with migrations and least-privilege roles.
- [ ] Replace dashboard/backoffice demo repositories with live data adapters.
- [ ] Add customer/project/usage/CRM/support data isolation and retention policies.
- [ ] Add subscription entitlements and plan-limit enforcement.
- [ ] Add founder reporting for cash, MRR, churn, acquisition, AI cost, and customer health from real sources.

## Approval gates

Stop for owner approval immediately before:

- production deployment or public release;
- live payment activation or any charge;
- public publishing or outbound messages as the owner;
- credential creation, rotation, revocation, or permission expansion;
- deletion of the old BLE subtree, important local files, customer data, or account resources;
- security-setting changes on the Mac.

## Current stop condition

The verified `0.3.1` candidate is ready for a local commit. Publishing it to the public GitHub repository requires owner approval. Mac/OpenClicky inspection remains blocked until a Mac execution/desktop bridge is attached.

## Definition of done for the current phase

1. A fresh clone installs reproducibly and passes one verification command.
2. CI independently runs type checks, unit tests, production build, audit, and secret scan.
3. Core policy behavior has regression tests.
4. State/decision/next files reflect verified evidence and current blockers.
5. No production action, credential, payment, or public publication occurs.
