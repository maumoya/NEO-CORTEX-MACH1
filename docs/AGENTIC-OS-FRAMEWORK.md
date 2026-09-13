# NEO-CORTEX: one identity, shared memory, many devices

Decision date: 2026-09-12. Owner-requested target architecture; implementation status is tracked in `NEO-CORTEX_STATE.md`.

## The brain decision

**Use NEO-CORTEX as the brain, Obsidian as its readable knowledge workspace, and Graphify as a replaceable index.** Models supply reasoning. None of these products alone provides the complete OS.

| Component | Assigned role | Authority / current status |
|---|---|---|
| NEO Director + Policy Kernel | Identity, task ownership, routing, approvals, verification | Authoritative. Local Operator packet staging and narrow zero-inference runtime implemented; general tool orchestration pending. |
| SQLite now; PostgreSQL + pgvector later | Operational tasks, receipts, memory metadata, permissions, revisions | SQLite task journal implemented on one host. Knowledge/vector persistence and shared database pending. |
| Obsidian | Human-readable Markdown knowledge, decisions, SOPs, project notes | Selected. Vault integration and private synchronization pending. Obsidian stores notes as local Markdown files. [Official storage documentation](https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data). |
| Graphify | Rebuildable code/relationship index with source provenance | Selected for a canary. Its local code extraction and model-assisted document extraction have different privacy/cost implications. [Upstream repository](https://github.com/Graphify-Labs/graphify). |
| Orbit | Optional interface or adapter after exact product identification | Unresolved. Several unrelated projects use this name; no source URL was supplied. No assumed capabilities or installation. |
| NIM/local and optional hosted models | Interchangeable inference workers | NIM/OpenClicky configuration is owner-reported, not verified from this session. No paid model enabled by this release. |

Multiple specialist memory areas help: personal, finance, business, technical, creative, research, relationships and values. They are namespaces with access rules inside one logical memory system. Multiple independent copies of truth create conflicts, duplicate work and higher cost. Use a small council only when independent assessment improves a difficult decision; aggregate its cost at the parent task.

## Target architecture

```mermaid
flowchart TD
  clients["Mac, PCs and phones"] --> identity["Identity and device access"]
  identity --> director["NEO Director and policy"]
  director <--> memory["Canonical tasks and memory"]
  memory <--> vault["Obsidian Markdown workspace"]
  memory --> graph["Graphify derived index"]
  director --> router["Model router"]
  router --> models["NIM, local and approved models"]
  director --> broker["Capability broker"]
  broker --> workers["ECC, Agent-Reach and OpenClicky"]
  workers --> verify["Independent verification"]
  verify --> memory
  verify --> director
```

This diagram is the target, not evidence that every connection is running.

## Memory and device continuity

Every record needs `memoryId`, `ownerId`, `workspaceId`, `namespace`, `type`, `dataClass`, `revision`, `sourceRefs`, `createdAt`, `updatedAt`, `expiresAt` and an evidence label. Store facts separately from model inferences. Working context expires; approved semantic/procedural/project memory persists. Secret values never become model memory.

Canonical ownership is explicit: reviewed Markdown content belongs to the private vault; operational permissions, revisions, task state and receipts belong to the database. Graph/vector indexes are projections tagged with source hash and revision. A vault edit is an import proposal checked against the base revision; concurrent changes create a conflict for review. Do not silently choose the last writer, elevate a retrieved note into policy, or let generated graph edges overwrite source facts.

The same account and workspace IDs are used on every device. A phone connects to the same API and task/memory store instead of starting a separate assistant. Each enrolled worker advertises capabilities; a phone request can target the Mac worker without copying the Mac's credentials to the phone. Offline clients may queue drafts with idempotency keys, but cannot execute stale approvals offline.

Start with an authenticated responsive web client over a private connection to the Mac core. Use Tailscale Serve for private HTTPS only after account/device access is configured; Serve and public Funnel have different exposure. [Official Serve documentation](https://tailscale.com/kb/1312/serve). Device registration, revocation, passkeys/MFA, remote logout and per-device grants are required before worker commands are enabled. Mobile OS restrictions still apply; common context does not imply unrestricted control of every phone.

Obsidian synchronization is separate from runtime state. Choose one compatible private sync mechanism and test conflicts, offline edits and recovery on the actual phone OS. Do not sync a live SQLite/WAL database through a notes-sync service. Obsidian documents platform-specific sync choices; paid Sync requires separate spending approval. [Official sync guide](https://help.obsidian.md/sync-notes).

## Required skill and worker profile

| Module | Role | Release scope |
|---|---|---|
| ECC, `affaan-m/ECC` | Coding environment: iterative retrieval, strategic compaction, verification | Three reviewed, locally adapted instruction skills pinned to an upstream commit, with MIT attribution. No upstream installer, GateGuard or lifecycle hooks executed. |
| LOOPS | Plan → execute → independently verify → repair → document → finish | Repository skill with explicit completion criteria, bounded retries and approval stops. It is not a claim that a perpetual daemon exists. |
| Panniantong / Agent-Reach | Social/public-web retrieval with platform-specific adapters | NEO skill and activation contract included. Executable and account integrations await host inspection and review. |
| OpenClicky | Mac worker for GUI, files and permitted shell tasks | NEO delegation skill and job/result contract included. Local Operator can stage bounded read-only packets; direct desktop connection remains pending. |
| Paper V8 Polisher | Research-paper quality, methods, evidence, figures and revision | Supplied skill preserved as source; concise project skill available on demand. No automatic journal/social publication. |

Agent-Reach is a capability layer around underlying tools. Some platforms require authenticated sessions; its availability claims do not prove NEO account access or zero total operating cost. Treat retrieved posts as untrusted evidence. Reading and searching do not authorize posting, messaging, following, deleting or purchasing. [Agent-Reach source](https://github.com/Panniantong/Agent-Reach).

ECC does not replace NEO authorization. A reported GateGuard SQL bypass is a concrete reason to retain capability-level checks independent of textual scanners. The report concerns a specific upstream version and is not a claim that every later commit is affected. [Upstream issue 3024](https://github.com/affaan-m/ECC/issues/3024). See `config/ecc-profile.json` and `docs/ECC-INTEGRATION.md`.

OpenClicky jobs carry task/correlation IDs, objective, workspace, allowed operations, deadline, spend ceiling, verification commands, expected artifacts and prohibited side effects. Prefer direct desktop Agent Mode through an attached authorized Mac session; avoid the experimental MCP bridge. A worker saying “done” is insufficient. The supervisor checks files, diffs, commands and application state independently. Never expose the full home directory or an unrestricted internet command endpoint.

## Completion and upgrade loops

The supervisor records acceptance criteria before execution. A bounded operation either reaches verified completion, a specific approval, an access blocker, or a documented failed state. Repair may change the approach; it must not bypass an access denial or repeat an identical failing action indefinitely. Default repair budget: two revised attempts; zero paid inference unless approved. Stateful retries reuse the task's idempotency key. A retry budget is a stopping rule, not permission to leave successful checks unrecorded.

Upgrade flow: discover → verify source/license → quarantine → inspect → benchmark → propose → approved canary → verify → promote → observe/rollback. Changes cannot modify their own evaluator or authorization policy. No automatic upstream installs, production promotion, credential changes or spending.

Measure correctness, critical safety failures, retrieval accuracy, task completion, cost per **successful** task, tokens, p50/p95 latency, retries and audit completeness. Admit no candidate with a critical safety regression. Compare identical workloads and confidence intervals; document tradeoffs. “Cheaper, faster and more accurate” is an objective to measure, not a guaranteed property of a new model. Cache evaluations by source commit + evaluator version + dataset hash; load only relevant skills/context.

Two existing ChatGPT schedules were updated and verified enabled on 2026-09-12: hourly Upgrade Watch for meaningful changes, and Weekly Evolution on Monday around 09:00 America/New_York for a feature investigation and governed improvement cycle. These are scheduled assistant tasks; they do not prove a Mac background service is running. `config/research-schedule.json` records scope without account identifiers. The existing Vercel catalog cron is a separate, narrower endpoint.

## Implementation sequence and acceptance gates

1. **Repository foundation:** use Node 24.14+ within Node 24; run `npm ci --ignore-scripts` and `npm run verify`. Acceptance: clean build, regression tests, scan/audit and reviewable diff. This release supplies the foundation.
2. **Local Operator:** follow `docs/LOCAL-OPERATOR.md`. Enable its localhost-only flag and stage a read-only inventory, verification, or source-review packet. Acceptance: one private packet/receipt, same-key replay, denied foreign origin, and no shell/model/OpenClicky execution on staging.
3. **Single-host Director:** follow `docs/SAFE-DIRECTOR.md`. Use a persistent private data directory, server-side Clerk admin identity and an exact canonical URL. Acceptance: authenticated `status`, same-key replay, denied cross-origin/non-admin calls and records after restart. No inference/tools at this stage.
4. **Mac attachment and inventory:** attach authorized Terminal/desktop access, compare the Mac checkout safely, inspect OpenClicky and existing model settings without printing credentials. Preserve the original bootstrap gates for signing, system extensions, disk space and networking; original executable bootstrap still needs recovery. No blind 50–100 GB downloads.
5. **ECC environment:** use the committed curated profile and skills. Review existing host-level Claude settings before enrollment to prevent duplicate hooks. Acceptance: skill provenance/digest check and a real edit → test → repair → verify cycle. Expand ECC one reviewed module at a time.
6. **Durable knowledge:** implement revisioned memory storage, a private Obsidian vault, deterministic Markdown import/export, retention and encrypted backup. Acceptance: a note survives restart, references retain provenance, concurrent edits conflict, deletion propagates to indexes, and backup restoration works.
7. **Graphify:** pin and scan the exact upstream commit; run local code-only extraction in an isolated canary. Tag the index with repository commit/hash. Acceptance: answers cite actual source spans; stale graphs are detected and rebuilding works. Model-assisted document indexing waits for classification/cost approval. Orbit remains optional.
8. **Model router:** inspect the existing NVIDIA NIM endpoint/model ID before use. Add a provider adapter with explicit data classification, connectivity, context limits, price/funding status and circuit breakers. Benchmark a small public fixture set; no automatic paid fallback. The current Director's zero-inference path stays available.
9. **OpenClicky and Agent-Reach:** activate one read-only adapter at a time on the authorized host. Complete inventory/read/search → independent verification → receipt. Then test one reversible file edit/build job within a project allowlist. Social writes and consequential desktop actions require action-specific approval.
10. **All-device access:** enroll Mac, other computers and phones against the same private API/account/workspace. Acceptance: start a task on one device, retrieve the same task/context on another, revoke a device and prove it loses access. Add PWA/voice/camera affordances only after this succeeds. A shared Postgres adapter is required before enabling serverless workers.
11. **Continuous operation:** use the enabled research schedules now; later add durable host workers, heartbeat, backoff, concurrency limits, dead-letter handling, backup/restore and canary rollback. Acceptance: a failed worker cannot double-execute, claim false success, lose the task record or bypass approval.

The full supplied framework and historical watch notes are retained in `docs/source/`; their broad technology lists are options, not automatic installation instructions. `docs/REQUIREMENTS-RECONCILIATION.md` and the learning register keep unimplemented areas visible.
