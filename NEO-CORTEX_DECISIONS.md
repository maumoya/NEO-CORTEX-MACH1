# NEO-CORTEX Decisions

Last updated: 2026-09-13 UTC

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

## D-011 — Recover history without upgrading proposals into facts

- **Decision:** Retain retrieved requirements and all three supplied source documents with evidence labels; use `docs/AGENTIC-OS-FRAMEWORK.md` as their accepted synthesis.
- **Reason:** Earlier watch reports recommended canaries but did not install them. Retrieval did not provide an exhaustive GPT archive.
- **Consequence:** Unverified versions/performance and unavailable Mac state remain explicit; no private chat dump is imported into public memory.

## D-012 — Approval requires server evidence

- **Decision:** Remove the caller-controlled Checkout approval header and block Checkout while server-side approval is absent.
- **Reason:** 0.3.1 checked `allowed` but did not discharge `requiresHumanApproval`; a client header is forgeable.
- **Consequence:** Authentication, credentials and normal execution mode alone cannot activate billing. A future approval must bind user/action/plan, expiry and single-use consumption.

## D-013 — Narrow durable Director first

- **Decision:** Implement only deterministic `status` and `next` with local SQLite task receipts, not arbitrary prompts/tools. Zero inference spend.
- **Reason:** This establishes tested identity, idempotency, lifecycle, restart and audit behavior before adding side-effecting workers.
- **Consequence:** Opt-in self-hosted runtime only; Vercel is disabled until shared durable storage exists. Hash-chain checks are not tamper-proof against a host owner.

## D-014 — One logical brain, multiple specialized memory areas

- **Decision:** NEO owns identity, operational records and policy. Obsidian owns readable knowledge content; Graphify provides a rebuildable source-linked projection. Orbit is optional pending exact identification.
- **Reason:** These tools serve different functions. Independent authoritative copies would create conflicts and duplicate work.
- **Consequence:** Use owner/workspace IDs, namespaces, revisions, provenance, retention and explicit synchronization conflicts. All devices use the same API and memory; no model session is canonical storage.

## D-015 — Required curated ECC profile

- **Decision:** Include three reviewed ECC instruction adaptations pinned to `8321021c54d670126ce3b2969d5deb880b4b0c2a`, with license and source/local hashes.
- **Reason:** The owner requires ECC; selected retrieval, compaction and verification patterns are useful without importing an unreviewed hook/install surface.
- **Consequence:** No upstream executable, GateGuard, installer or lifecycle hook is activated. NEO authorization remains independent. Additional modules require review.

## D-016 — Skills do not manufacture access

- **Decision:** Provide complete-loop, Agent-Reach, OpenClicky and paper-polishing skills with explicit activation/evidence boundaries.
- **Reason:** A skill file does not connect a Mac desktop, enroll a phone or authenticate social accounts.
- **Consequence:** Device/account activation proceeds only from observed host state. No fabricated delegation, credential export, public social action or paid fallback.

## D-017 — Reuse real schedules

- **Decision:** Update the existing Upgrade Watch to hourly and resume the existing Weekly Evolution for Monday around 09:00 America/New_York, including new-feature research.
- **Reason:** The owner requested continuous improvement and a scheduled feature search; duplicate schedules would waste work.
- **Consequence:** Future research deduplicates sources, measures safety/quality/cost/latency and prepares governed proposals. No automatic upstream installation, merge, deployment or spending.

## D-018 — Current publication authorization

- **Decision:** The owner's latest instruction to keep this framework documented on GitHub authorizes publishing this reviewed repository update.
- **Reason:** The concrete scope is NEO-CORTEX code, configuration, skills and documentation developed in this cycle.
- **Consequence:** Verify before publishing. This does not authorize a production deployment, private vault publication, account changes, spending or unrelated repository work.

## D-019 — Verify the published artifact

- **Decision:** Record the implementation commit separately from its documentation receipt.
- **Evidence:** Published 0.4.0 commit `13c221cfbb0495eba9edc118e9ff65ab5a632147` has the exact locally reviewed tree `322d6ff50a3c3ea3ee5d5b5423999289b950f240`; GitHub Verify run `34721933277` completed successfully.
- **Consequence:** This closes the repository build/test/publish/verify loop. It does not imply that Mac, Obsidian, Graphify, social accounts or mobile clients have been connected.

## D-020 — Local Operator before full worker automation

- **Decision:** Ship a separately gated, localhost-only Local Operator as the first daily-use NEO-CORTEX surface. It stages bounded OpenClicky work packets and private receipts but does not execute a worker.
- **Reason:** The owner needs a practical Agentic OS immediately, while the actual OpenClicky application protocol and the supervisor's Mac access remain unverified. Guessing a desktop bridge would create false claims and uncontrolled privilege.
- **Consequence:** The bootstrap can run without Clerk only on localhost with a private persistent directory. When Clerk is configured, administrator authentication is required. Task categories are read-only and fixed; direct OpenClicky launch, arbitrary prompts/tools, installs, secrets, network changes, social actions, financial actions, deployment, Git push, and edits remain outside this release.
