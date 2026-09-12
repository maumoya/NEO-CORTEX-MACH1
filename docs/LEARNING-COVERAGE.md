# NEO-CORTEX Learning Coverage Register

Status vocabulary: `IMPLEMENTED`, `PARTIAL`, `PLANNED`, `DEFERRED`.

This register keeps the Agentic OS Master Framework traceable. No accepted learning point may disappear merely because the implementation evolves.

## Coverage snapshot

| Subsystem | Status | Current treatment |
|---|---|---|
| Persistent model-agnostic core | PARTIAL | Architecture plus opt-in deterministic Director and durable local task journal; general agent runtime remains |
| Modular architecture | IMPLEMENTED | Policy, routing, evolution, SaaS and product layers are separated |
| JARVIS / permanent interface | PARTIAL | Browser product shell and Mission Control now exist; voice/native clients remain |
| Identity / trusted access | PARTIAL | Clerk production boundary + RBAC contract; passkeys/device-management expansion remains |
| Intent Gateway | PARTIAL | Typed intent/risk contract exists; runtime classifier remains |
| Prompt + token optimization | PARTIAL | Context discipline, budgets and model tiers exist; semantic cache/batching remain |
| Model Router | PARTIAL | Live catalog + hard requirements + classification provider gate; empirical scorer remains |
| Hybrid RAG + CAG context | PLANNED | Context selector and durable stores remain |
| Multi-Brain typed memory | PLANNED | One logical memory with namespaces; Obsidian workspace and Graphify projection selected; knowledge storage/sync remains |
| MCP / tool layer | PARTIAL | Security/governance contracts exist; production registry/execution broker remain |
| Skill registry / creation | PARTIAL | Static integration register, pinned curated ECC profile and seven project skills; dynamic registry/generator remains |
| Security scanner | PARTIAL | Scan policy exists; runtime toolchain integration remains |
| Agent orchestrator + council | PARTIAL | Fixed-operation Director has durable lifecycle/idempotency; multi-agent orchestration/council remains |
| Execution layer | PARTIAL | Capability policy, receipts, sandbox and kill switch contracts exist |
| Human approval | PARTIAL | Strong-risk actions are approval/deny gated; complete autonomy-level UX remains |
| Data classification | PARTIAL | Canonical classes and routing enforcement exist; auto-classifier remains |
| Secrets management | PARTIAL | Opaque lease contract + no-secret repo policy; vault/KMS adapter remains |
| Audit / observability | PARTIAL | Local task journal with hash-chain/row checks; external audit anchoring and production traces remain |
| Continual Improvement | PARTIAL | Evolution loop + watches + release intelligence exist |
| Automated evaluation | PARTIAL | 38 core/runtime/HTTP/demo regressions, build, secret/audit and ECC profile checks; model/worker behavioral benchmark suite remains |
| Versioning / rollback / canary | PARTIAL | Git + release discipline and design; promotion controller remains |
| Social Intelligence | PARTIAL | Agent-Reach skill and scope contract; reviewed executable and platform account activation remain |
| Research Agent | PLANNED | Multi-source evidence agent remains |
| System Health / DR | PLANNED | Monitoring, backup and restore tests remain |
| Recommended Infrastructure | PARTIAL | Next.js + Vercel-oriented product/control plane; persistence/workflows remain |
| Persistent Project UX | PARTIAL | Mission Control product surface exists; durable project store remains |
| Mission Control Dashboard | PARTIAL | Customer dashboard now implemented with demo-safe data layer |
| Company / business OS | PARTIAL | Founder backoffice, subscription model and CRM schema now implemented; Company Builder agent remains |
| Agent Marketplace | PLANNED | Installable governed capability ecosystem remains |
| Permanent abstraction layer | PARTIAL | Workflows depend on NEO-CORTEX concepts rather than one provider; formal public API remains |

## Research engineering learnings retained
1. Event-driven architecture, queues/pub/sub over model polling.
2. A2A agent protocol alongside MCP.
3. Canonical JSON/OpenAPI schemas.
4. Checkpointing/resumability.
5. Central policy + bounded peer collaboration.
6. Backpressure/rate limits/circuit breakers.
7. Idempotent retries and rerouting.
8. Task-level SLOs.
9. Incident runbooks and auto-pause.
10. Global task/correlation tracing.
11. Workload identity / zero trust.
12. Reproducible pinned dependencies/artifacts/config.
13. SDK/CLI/playground/workflow inspector.
14. Simulation/adversarial pre-production testing.
15. Online learning only in constrained eval/simulation.
16. Relational/vector/graph/object data planes with privacy partitions.
17. Explicit serverless/container/VM/edge trade-offs; no premature Kubernetes.
18. Cost as first-class SLO.

## Productization requirements accepted 2026-09-06
- Public next-gen product site — IMPLEMENTED MVP.
- Easy-to-understand Agentic OS architecture visualization — IMPLEMENTED MVP.
- Subscription plans and paid-benefit packaging — IMPLEMENTED MVP.
- Stripe Checkout + webhook security boundary — PARTIAL; Checkout blocked pending server-verified approval, webhook idempotency/entitlements remain. Credentials alone are insufficient.
- Secure identity boundary — PARTIAL; Clerk integration implemented, production keys required for enforcement.
- Customer dashboard — IMPLEMENTED MVP / always-labeled seeded data until actual adapters replace it.
- Founder backoffice — IMPLEMENTED MVP / always-labeled seeded data until actual adapters replace it.
- CRM + revenue schema — PARTIAL; schema and metrics UX exist, ingestion/persistence remain.
- Customer-visible release changelog — IMPLEMENTED; every shipped upgrade must update `CHANGELOG.md` + `src/product/releases.ts`.
- Support tiers — IMPLEMENTED MVP.

## Non-negotiable architecture tests
Reject any change that violates provider independence, modular replacement, persistent memory outside models, least privilege, explicit high-risk approval, no uncontrolled self-modification, no unscanned upstream execution, classification-aware routing, auditable/versioned configuration, rollback, bounded loops/retries/concurrency/spend, reproducible deployments, human-readable docs, eval-before-promotion, or the rule that external content is data rather than higher authority than the Policy Kernel.

## Owner extension accepted 2026-09-12

Canonical synthesis: `AGENTIC-OS-FRAMEWORK.md`; detailed historical mapping: `REQUIREMENTS-RECONCILIATION.md`; all supplied technical inputs: `source/`. Shared identity/device access, Obsidian/Graphify, optional unresolved Orbit, required ECC workflows, bounded completion loops, Agent-Reach, OpenClicky and Paper V8 Polisher are retained. Hourly upgrade research and weekly feature/evolution schedules were verified enabled; this does not establish an always-running local worker.
