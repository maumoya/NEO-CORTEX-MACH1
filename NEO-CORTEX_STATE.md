# NEO-CORTEX State

Last updated: 2026-09-13 UTC
Canonical repository: `maumoya/NEO-CORTEX-MACH1`  
Release snapshot: `0.5.0`
Verified public baseline: `dc164dcaeb6f10c35c2bfff3706c3b9f382d0ef1` (0.3.1)
Published implementation: `13c221cfbb0495eba9edc118e9ff65ab5a632147` (0.4.0).
Verified tree: `322d6ff50a3c3ea3ee5d5b5423999289b950f240`, identical to the locally reviewed tree.
Publication receipt: GitHub `main` now contains the Local Operator implementation as [`c7a63d3`](https://github.com/maumoya/NEO-CORTEX-MACH1/commit/c7a63d31cf2dec25c9f841362ed3ff75db07c6e9), with verified tree `3da52e9169df65e344d9107c641c422ad25a113e`. [Verify run 34743109975](https://github.com/maumoya/NEO-CORTEX-MACH1/actions/runs/34743109975) completed successfully on that exact commit. The earlier 0.4.0 receipt remains recorded above.

## Evidence boundary

The repository is available in a Linux development workspace, not through a live Mac mini connection. Owner-provided terminal screenshots show that a fresh 0.4.0 clone on the Mac mini completed `npm ci --ignore-scripts` and `npm run verify` after a local cache workaround. Mac filesystem beyond that checkout, OpenClicky process/configuration/permissions, NIM model selection, phones and other devices remain unverified. Skill files do not confer computer-use access. No Mac delegation or paid inference occurred.

Four targeted GPT-context searches recovered partial historical excerpts. All three later supplied source documents were read and retained in `docs/source/`. This is not an exhaustive ChatGPT archive. The accepted synthesis is `docs/AGENTIC-OS-FRAMEWORK.md`; original executable bootstrap and exact Orbit project remain unavailable.

## Verification receipt

| Check | Result | Scope |
|---|---|---|
| Dependency lock | PASS | Pinned install with lifecycle scripts disabled; Node 24.19 used, supported range >=24.14 <25 |
| TypeScript / build | PASS | Production build includes /api/agent and /console |
| Regression tests | PASS | 41 core, persistent-runtime, Local Operator HTTP/store, and demo-boundary tests |
| Durable lifecycle | PASS | Separate-process reopen, competing-process duplicate reservation, terminal immutability and interrupted-work recovery |
| Security boundaries | PASS within tested scope | Test identities, schema/origin/role gates, ownership, journal/index changes, finite budgets/prices and unresolved approval denial |
| ECC profile | PASS | Upstream commit, MIT attribution and local skill digests; no upstream executables/hooks imported |
| Skill validation | PASS | Seven project skill entrypoints validated |
| Built-app HTTP smoke | PASS | Disabled Director/runtime, usable local Operator packet staging, labeled dashboards, unconfigured Checkout 503 and unauthenticated cron 401 |
| Secret-pattern scan / dependency audit | PASS | No matched secret patterns; zero reported production dependency vulnerabilities |
| Public 0.3.1 CI | PASS | Verify run 34715661764, commit dc164dc |
| 0.4 release CI | PASS | Verify run 34721933277 succeeded on exact implementation commit 13c221c |
| 0.5 release CI | PASS | Verify run 34743109975 succeeded on exact implementation commit c7a63d3 |
| Research schedules | VERIFIED ENABLED | Existing hourly Upgrade Watch and Monday around 09:00 America/New_York Weekly Evolution updated |
| Live accounts / Mac / devices | NOT VERIFIED | No live Clerk, Stripe, OpenClicky, NIM or device enrollment test |

Tests and source scans are evidence for their stated cases, not proof of comprehensive security, live account activation or complete Agentic OS functionality.

## Architecture and subsystem state

| Subsystem | State | Current implementation / gap |
|---|---|---|
| Architecture | PARTIAL | Modular Next.js product/control-plane seed; one identity and logical memory architecture documented |
| Bootstrap/install | REPO VERIFIED / MAC UNKNOWN | Node dependencies build here; no verified Mac bootstrap or local-model install |
| Models | PARTIAL | Catalog filtering, finite cost checks, deterministic ranking and timed fixed-origin fetch; NIM/local inference adapter pending |
| Agents | PARTIAL | Deterministic admin Director accepts only status/next; council and general worker orchestration pending |
| Memory | PARTIAL FOUNDATION | Durable local task journal; no operational personal/semantic/vector memory. Obsidian selected; Graphify planned derived index |
| Tools | PARTIAL | Local Operator stages three bounded, read-only OpenClicky packets in a private local outbox; no runtime worker dispatch or authenticated platform adapter |
| ECC environment | CURATED PROFILE READY | Three pinned instruction adaptations plus MIT license; host CLI/global settings and full plugin install not verified |
| Security | PARTIAL | Auth/policy/input boundaries for Director; Checkout blocked without trusted approval. General broker/egress/sandbox enforcement pending |
| Permissions | MAC UNKNOWN | No observed Accessibility, Screen Recording, Automation or Full Disk Access state |
| Networking/devices | PLANNED | Private HTTPS, shared identity/workspace, device registration/revocation and thin clients documented; no devices enrolled |
| Automation | PARTIAL | Real ChatGPT research schedules enabled; Local Operator supports task staging but has no auto-dispatch or host daemon |
| Self-healing | PARTIAL | Interrupted local tasks marked failed on next execution; no daemon, watchdog, replay scheduler or host recovery controller |
| Observability | PARTIAL | Local hash-chained task events and row/index consistency; no external anchoring, full traces, alerts or live telemetry |
| Documentation | UPDATED | Framework, runbook, all supplied source inputs, candidate queue, provenance and persistent state |
| Git/GitHub | PUBLISHED / CI PASS | Owner-authorized 0.4.0 implementation and identical tree verified; pinned-action CI passed. Main is unprotected in observed metadata; commits unsigned |
| SaaS product | DEMO | Always-labeled metrics/CRM/revenue; real billing state, entitlements and data adapters absent |

## Material limitations

- The Safe Director remains opt-in and disabled on Vercel until a shared durable store exists. The separate Local Operator is local-only and can stage its own private outbox/receipt data; neither system runs a model, shell command, or worker automatically.
- A hash chain can detect tested changes but cannot stop a database/host owner rewriting the entire chain or a consistent suffix. Backups, external anchors and migrations remain.
- Admin HTTP tests inject synthetic identities; they do not prove a live Clerk account. Cancel/deadline behavior does not yet control a general subprocess worker.
- Corrected the 0.3.1 Checkout approval-header claim. Credentials, normal mode and an allowed capability do not prove human approval.
- Seeded dashboard numbers remain examples even when environment keys are configured. The AST guard checks a specific source pattern; it is not visual or comprehensive telemetry provenance proof.
- Orbit identity is unresolved. No guessed repository or redundant authoritative memory store was installed.
- Historical upgrade reports are retained as proposals. No provider/API/package upgrade or platform login was silently activated.
- Continuous research is scheduled; an always-running local execution loop has not been deployed.

## Next execution boundary

The 0.5 Local Operator implementation is published and CI-verified. On the Mac mini, pull that release, enable only the local Operator flag, and use `/operator` for the first bounded task handoff. Actual Mac attachment is still required for direct OpenClicky delegation, independent host verification, and device activation. Private memory must remain outside this public repository. Orbit still needs an exact project URL before evaluation.
