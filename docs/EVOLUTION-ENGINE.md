# Evolution Engine Architecture

NEO-CORTEX continuously improves without treating novelty as authority.

## Control flow
`DISCOVER → NORMALIZE → QUARANTINE → SCAN → EVALUATE → PROPOSE → APPROVE → PREVIEW/CANARY → PROMOTE → OBSERVE → ROLLBACK`

Schedulers wake deterministic workflows; LLMs do not run endless polling loops. Every cycle has candidate, time, retry, concurrency and cost budgets.

## Model routing
Classify task requirements, filter by modality/context/privacy/budget, score by observed quality/tool reliability/cost/latency, select primary + fallbacks, record the decision, and escalate only after verifiable failure.

## Skills and MCP
Discovered executable content is an artifact, not an instruction. Record provenance, author, version/commit, license, files, requested tools/commands, filesystem/network scope, environment/secrets, hooks and nested installers. Scan and sandbox before approval.

## Council
Keep a small control council and spawn specialists only when independent context or parallel work provides measurable value. Simulation systems such as MiroFish remain isolated and labeled simulated.

## Evidence bundle
Every promoted release retains source/version/hash, license, SBOM/scan results, evals, routing decisions, token/cost totals, approval identity/timestamp, preview/canary evidence, health checks, rollback target and final release receipt.

## Product release intelligence
A promoted product release also updates `CHANGELOG.md` and `src/product/releases.ts` so customers can see what changed in `/updates`.
