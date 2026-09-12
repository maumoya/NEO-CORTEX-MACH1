# NEO-CORTEX Decisions

Last updated: 2026-09-12 UTC

This is an append-only decision record. Superseded decisions stay visible and must point to their replacement.

## D-001 — Canonical repository

- **Decision:** `maumoya/NEO-CORTEX-MACH1` on branch `main` is the canonical repository.
- **Reason:** The migration manifest, GitHub repository metadata, and current root layout agree.
- **Consequence:** Do not mix BLE diagnostic code into this repository. Do not delete any former source until destination verification is complete and deletion is separately approved.

## D-002 — Evidence before claims

- **Decision:** State documents label every material claim as verified repository evidence, verified runtime evidence, or unknown local-machine state.
- **Reason:** This session is connected to a Linux execution workspace and a cloud browser, not the Mac mini desktop/filesystem.
- **Consequence:** OpenClicky permissions, models, memory, logs, and Mac installation status remain unknown until directly inspected.

## D-003 — Deterministic authority

- **Decision:** The Policy Kernel remains higher authority than model, tool, web, repository, skill, or OpenClicky output.
- **Reason:** A subordinate computer-use agent can be wrong, compromised, or over-permissioned.
- **Consequence:** OpenClicky work must be capability-bounded, independently verified, and recorded with receipts. OpenClicky never self-approves privilege escalation or production promotion.

## D-004 — No MCP-bridge detour

- **Decision:** Do not invest further in the experimental OpenClicky MCP bridge unless direct desktop control proves insufficient for a specific required operation.
- **Reason:** The bridge is not necessary for the intended supervisor/worker relationship and has already consumed disproportionate effort.
- **Consequence:** Prefer structured filesystem/Terminal access; use desktop control only for OpenClicky's GUI or other GUI-only state.

## D-005 — Build the trust spine first

- **Decision:** Prioritize reproducible verification, tests, CI, policy integration, and durable receipts before broad autonomous features or production billing.
- **Reason:** Current runtime claims exceed implemented and tested behavior.
- **Consequence:** New agents, memory systems, tool adapters, and self-healing features must land behind tests and explicit capability boundaries.

## D-006 — Local-first sensitive inference

- **Decision:** Restricted, PHI, and secret workloads default to local/private inference. External providers require an explicit approved-provider policy.
- **Reason:** This matches the existing classification contract and minimizes unnecessary data transmission.
- **Consequence:** NVIDIA NIM/OpenClicky may become a preferred worker lane after direct runtime verification, but documentation alone does not authorize or prove it.

## D-007 — No secret material in Git or conversational output

- **Decision:** Commit only environment-variable names and safe examples. Never print or persist live credentials in state files, logs, receipts, or chat.
- **Reason:** The repository is public and the system is intended to handle privileged automation.
- **Consequence:** Secret access must use opaque handles/leases with redacted diagnostics.

## D-008 — External side effects remain gated

- **Decision:** Publishing, production deployment, money movement, credential changes, destructive personal-data actions, and messages sent as the owner require the configured human approval.
- **Reason:** These actions are consequential or difficult to reverse.
- **Consequence:** Preview builds and local reversible changes may be automated; production promotion remains separate.

## D-009 — Honest demo/product boundary

- **Decision:** Demo telemetry and seeded CRM/revenue data must remain visibly labeled and structurally separated from live data.
- **Reason:** The current product surface contains plausible financial and operational numbers that are not real telemetry.
- **Consequence:** Live integrations must replace demo repositories through explicit adapters; they must not silently fall back to demo values in production.

## D-010 — OpenClicky adapter scope

- **Decision:** The first OpenClicky integration will be a narrow worker adapter, not a second supervisor.
- **Reason:** The project needs one source of task authority and one deterministic policy boundary.
- **Consequence:** Initial capabilities should be local read, bounded command execution, file patching, build/test, and GUI tasks. Each job needs a task ID, timeout, allowlist, result artifact references, and independent verification.
