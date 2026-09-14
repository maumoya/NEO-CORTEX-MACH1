# Agentic OS requirement reconciliation

Review date: 2026-09-14. Baseline: public commit `ce124b5` (0.5.0).

## Coverage and evidence rules

This is a partial historical recovery, not a claim that every ChatGPT thread was read. Four targeted personal-context searches returned excerpts and artifact summaries. The owner then supplied three original attachments; all were read and are retained in `docs/source/`. They provide the full master framework, historical Upgrade Watch reports and Paper V8 Polisher. Original thread URLs and the executable Mac bootstrap were not returned. Earlier handoff summaries remain leads, not proof of deployment.

Only technical requirements are retained here. Raw chat transcripts, personal profile information, account secrets, and unrelated discussions are excluded. Previously suggested packages are not automatically approved dependencies.

Evidence labels:

- **CURRENT**: explicit instructions in this conversation.
- **RECOVERED**: prior user request or artifact summarized by personal-context retrieval; original source not fully inspected.
- **REPO**: verified source/configuration in the canonical repository.
- **GAP**: earlier source or implementation evidence was not recovered.

## Requirements register

| ID | Source and strength | Requirement | Verified baseline / disposition |
|---|---|---|---|
| R01 | CURRENT; REPO migration manifest; recovered Sep 6 request | Standalone `maumoya/NEO-CORTEX-MACH1`; preserve unrelated projects | Correct root verified. Do not touch `realestateos-staging` or BLE sources. Old-copy deletion is not authorized in this change. |
| R02 | CURRENT; recovered Sep 12 OpenClicky handoff | Supervisor directs OpenClicky, independently verifies outputs; stop pursuing experimental MCP bridge | Mac bridge absent. No simulated delegation or new MCP installation. MyClicky is superseded by the explicit OpenClicky choice. Exact upstream source, commit and MIT license are recorded; execution remains quarantined pending host identity, permission and artifact verification. Local packets now accept only real paths inside configured project roots. |
| R03 | RECOVERED Sep 7 safe-runtime patch and Sep 12 handoff | Read-only Director, task/correlation IDs, at most 8 turns, zero tool calls, safe-mode tests, `/api/agent`, `/console` | Missing at baseline. Implement a deterministic, zero-inference runtime first. The older OpenAI SDK proposal is not permission to enable paid API use. |
| R04 | CURRENT; REPO agent/security contracts | Deterministic policy above model/tool output; no self-approval, secret disclosure, or uncontrolled mutation | Contracts existed, but the Checkout header was not trustworthy approval evidence. Correct claims and fail closed where approval evidence is missing. |
| R05 | RECOVERED framework summaries; REPO learning register | Durable tasks, memory independent of model context, restart recovery | In-memory checkpoints only. First increment: local SQLite task metadata and integrity-checked receipts, not full RAG or persistent personal memory. |
| R06 | RECOVERED Sep 6 request; REPO routing config | Cost/token-aware task routing, provider independence, fallback evaluation | Catalog filtering and heuristic ranking exist. Fix invalid numeric metadata and order-dependent ties; NIM/local adapters and evaluation-backed routing remain pending. |
| R07 | RECOVERED Sep 6 request; REPO AGENTS.md | Council/specialists and isolated MiroFish simulation | Role names are designs, not running agents. Do not start a 60-agent council without capacity/cost/evaluation evidence. |
| R08 | RECOVERED Sep 6 request; supplied Upgrade Watch reports; CURRENT | Recurring upgrade discovery; ECC, skills/plugins and MCP scanning; quarantine before adoption | Historical candidates retained in `UPGRADE-CANDIDATES.md`; existing scheduled watches updated and enabled. Reviewed ECC instruction profile included. No new upstream executable installed. |
| R09 | RECOVERED framework summaries; REPO contracts | Budgets, cancellation, bounded retries, correlation IDs, observability and rollback | Add durable lifecycle records and conservative restart recovery for the zero-tool Director; no claims of general durable workflow execution. |
| R10 | RECOVERED Sep 6 product request; REPO SaaS pages | Website, subscriptions, user/admin dashboards, CRM/revenue, support and release notes | Demo product surface exists. Real billing, entitlements, CRM ingestion and revenue remain incomplete; no live billing activation. |
| R11 | REPO learning register; recovered broad framework | A2A/MCP, skill registry, hybrid RAG/CAG, relational/vector/graph data, voice/native interface | Architectural backlog; no evidence justifying installing every suggested service. |
| R12 | GAP original Vault/bootstrap discussion | Mac bootstrap, human verification gates, large model downloads | Original details not recovered. No model downloads, signing, system-extension or network-permission changes. |
| R13 | CURRENT | Maintain shared state, decisions and prioritized next actions | Three state files are now on public `main`; update them with measured results and remaining gaps. |
| R14 | RECOVERED deployment handoff | Separate `neo-cortex-control-plane`, Node 24, safe mode and verified deployment evidence | Deployment target is recovered context, not verified deployment state. Use Node 24 for the candidate; no deployment in this phase. |
| R15 | CURRENT; supplied Master Framework | One shared brain across all devices, with specialized memory areas | Architecture selects NEO-owned operational storage, Obsidian workspace and Graphify projection. Live memory/device enrollment remains pending. |
| R16 | CURRENT | Evaluate Obsidian, Graphify and Orbit | Verified Obsidian/Graphify roles; Orbit exact project unresolved and optional. Do not fabricate a product identity. |
| R17 | CURRENT; supplied reports | ECC environment and complete verification/repair loops | Three pinned, reviewed ECC instruction adaptations plus `neo-loops`; no GateGuard or upstream hooks imported. |
| R18 | CURRENT | Panniantong social access and OpenClicky computer use | Identified Panniantong/Agent-Reach; committed skills/activation contracts. Account and Mac access are not active. |
| R19 | CURRENT; supplied V8 Polisher | Research-paper skill and complete master-framework retention | Source inputs retained; project paper skill included. No publication, evidence fabrication or legal-outcome claim. |
| R20 | CURRENT | Continuous safety/cost/quality research and scheduled new-feature discovery | Existing Upgrade Watch changed to hourly; Weekly Evolution resumed for Monday morning; future execution success still needs observation. |

## Decisions for this implementation

1. Build the R03/R05/R09 safe-runtime foundation with no paid inference, external tools, worker launches, or computer-control claims.
2. Local SQLite durability is opt-in and requires a persistent operator-owned directory. Serverless/Vercel deployment must fail closed until a shared durable store is implemented; `/tmp` is not durable storage.
3. The Director may update its own bounded task journal. “Read-only” refers to workload capabilities: no arbitrary filesystem, process, network, credential, payment, or publishing tools.
4. Agent endpoints require server-verified administrator identity. Unconfigured authentication is not demo access to the runtime.
5. Keep every unimplemented requirement above visible; do not equate a policy document, proposed SDK lane, or successful build with a working agent.
6. Treat OpenClicky as a quarantined worker candidate: its broad macOS, filesystem, shell, network and computer-use capabilities never override NEO workspace confinement, approvals or Policy Kernel decisions.

## Next historical recovery

Recover the original Vault/bootstrap executable and any remaining handoff originals through authorized access. Upgrade-watch attachment recovery is complete for the supplied report. Reconcile proposals with current upstream evidence before installing packages. Supplied source documents are preserved at the owner's request; unrelated personal context and private chat transcripts remain excluded.
