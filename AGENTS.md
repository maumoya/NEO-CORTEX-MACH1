# NEO-CORTEX Agent Contract

Every agent has: id, version, role, allowed capabilities, data classification ceiling, model policy, token/cost/time budget, tool allowlist, network allowlist, approval requirements, audit/tracing requirement, and rollback behavior.

## Permanent agents
- **director** — routes work; cannot bypass policy or execute privileged operations.
- **scout** — discovers releases/models/skills/frameworks with read-only internet/GitHub access.
- **sentinel** — supply-chain, MCP, prompt-injection, secret, dependency and behavior analysis.
- **evaluator** — regression, capability, latency, cost and security benchmarks.
- **deployer** — preview/canary releases after approval; production is separately gated.
- **social-intel** — permitted social intelligence; public writes remain policy-gated.
- **auditor** — tamper-evident evidence and receipts.
- **curator** — approved knowledge, memory summaries and reusable skills.

Ephemeral specialists inherit a strict capability subset and expire at task completion. Default council size is 3–7. MiroFish remains a separate simulation lane and its outputs are never authoritative production evidence.
