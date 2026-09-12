# Governed upgrade queue

Review date: 2026-09-12. Input: owner-supplied `docs/source/UPGRADE-WATCH-INPUT.md`. Those historical reports are preserved, but their version, price, license and performance claims are not automatically re-certified here. None of the candidates below was installed or promoted by this review.

| Candidate | Disposition | Required next evidence |
|---|---|---|
| MCP Host/Origin, redirect, issuer/audience and per-client session boundaries | Accepted architecture requirement; no MCP server installed | Synthetic cross-origin/redirect, wrong-issuer/audience, cross-user session, TTL, quota and cleanup tests against a pinned adapter. |
| OpenAI Agents JS `0.17.0 → 0.17.2` | Historical canary proposal; repository still pins 0.17.0 | Re-verify current advisory/release; test Git argument injection, approvals across resume/handoff, session concurrency, MCP isolation and model-setting preservation. No paid eval without approval. |
| GPT-6 Astra frontier lane | Historical opt-in proposal; no provider activation | Re-verify official catalog, capability profile, funding and pricing; compare quality, safety, latency and total cost on identical tasks. |
| SandboxAgent / HarnessAgent / WorkflowAgent abstraction | Design candidate behind NEO adapter | Pinned API review, capability subset, cancellation, duplicated actions, checkpoint recovery and aggregate budget tests. |
| GitHub Agentic Workflow Firewall / credential proxy | Architecture reference | Inspect privileged setup and benchmark isolated egress, redirects, DNS/HTTP exfiltration, credential separation and policy denial. Do not run a privileged bootstrap. |
| ECC GateGuard quoted-SQL issue | [Upstream issue 3024](https://github.com/affaan-m/ECC/issues/3024) inspected; no GateGuard installed | Report concerns 2.2.1. Reproduce safely against a pinned candidate before concluding newer versions are fixed/affected. Scanner output cannot authorize destructive capability. |
| OpenAI Agents API + Vercel Sandbox | Historical architecture-canary proposal | Verify current API/state/billing; test worker isolation, webhook replay, root budget, persistence, kill switch and rollback before any activation. |
| Claude Code plugin evaluation backend | Historical evaluator-canary proposal | Verify proprietary runtime terms and actual version/API; compare synthetic benign and malicious plugins against NEO's independent evaluator. |
| Selected ECC skills | Curated instruction profile included at pinned commit | `npm run check:ecc-profile`; separate review for every additional module/hook. No blanket plugin install. |
| mattpocock/skills, Sentinel Scan/Warden, MiroFish | Research/watch | Pin sources and verify license/behavior. Simulation outputs remain non-authoritative; no automatic execution or token-heavy simulation. |
| Agent-Reach, Graphify, Obsidian, device clients | User-selected integration roadmap | Activation and acceptance gates in `AGENTIC-OS-FRAMEWORK.md`. Orbit identity unresolved. |

Candidate promotion requires source URL/commit, license, capabilities, data classes, secret/egress behavior, test dataset hash, evaluator version, observed results, approved budget, rollback and explicit promotion decision. A historical sentence saying “approve for canary” is a recommendation, not current authorization to spend or deploy.
