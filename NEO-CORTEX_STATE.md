# NEO-CORTEX State

Last updated: 2026-09-12 UTC  
Canonical repository: `maumoya/NEO-CORTEX-MACH1`  
Verified commit: `7ec17caa20b277345237a07a9444de769daff3d3`
Prepared candidate: `0.3.1` (local, not published)

## Evidence boundary

This snapshot distinguishes verified repository evidence from unverified machine state.

- **Verified here:** GitHub default branch and history, repository files, dependency resolution, TypeScript checks, production build, dependency audit, and repository secret-pattern scan.
- **Not reachable from this session:** the Mac mini filesystem, uncommitted Mac changes, `/Applications/OpenClicky.app`, OpenClicky runtime/memory/logs, macOS permissions, Keychain, launch agents, local models, and local services.
- Local-machine claims remain `UNKNOWN` until a Mac execution/desktop bridge is attached. They must not be inferred from documentation or UI demo data.

## Verification baseline

| Check | Result | Evidence |
|---|---|---|
| Repository access | PASS | GitHub connection confirms admin/push access to the public repository |
| Git history | PASS | Two commits; current `main` tip is `7ec17ca` |
| Dependency install | PASS | Exact declared versions resolved with lifecycle scripts disabled |
| TypeScript | PASS | `npm run typecheck` |
| Production build | PASS | `npm run build`; 11 routes generated |
| Dependency audit | PASS | `npm audit --omit=dev --audit-level=moderate`; zero reported vulnerabilities |
| Secret-pattern scan | PASS | No likely committed credentials found |
| Automated tests | PASS | Ten core policy, safety, and routing regression tests pass |
| CI | READY, NOT PUBLISHED | Least-privilege workflow prepared with commit-pinned actions |
| Commit verification | WARN | Both commits are unsigned |
| HTTP smoke test | PASS | `/dashboard` 200 with demo banner; unconfigured Checkout 503; unauthorized evolution cron 401 |

## Current architecture

### Product surface

- Next.js 16 / React 19 application with landing, pricing, updates, support, customer dashboard, founder backoffice, and sign-in routes.
- Clerk is an optional identity boundary. Without keys, protected pages intentionally render demo mode.
- Stripe Checkout and webhook endpoints fail closed when credentials are absent.
- A Postgres-compatible schema exists, but the application does not connect to it.
- Dashboard, CRM, revenue, customer, and agent-health numbers are seeded demo data.

### Agentic control-plane seed

- Typed contracts exist for intent, data classification, identity, policy, budgets, kill switch, sandbox requests, secret leases, checkpoints, and execution receipts.
- The model router fetches the public Vercel AI Gateway catalog and filters on hard requirements.
- The evolution endpoint fetches the model catalog and returns a summary; it does not discover, persist, scan, evaluate, install, promote, or roll back candidates.
- The OpenAI council integration is an empty placeholder.
- Agent roles are documented, but there is no durable agent registry or orchestrator runtime.

## Subsystem status

| Subsystem | Status | Current reality |
|---|---|---|
| Architecture | PARTIAL | Modular contracts and product shell exist; runtime wiring is largely absent |
| Bootstrap/install | REPO PASS / MAC UNKNOWN | Cloud verification succeeds; no Mac bootstrap script or Mac install evidence in the repository |
| Models | PARTIAL | Vercel catalog filter only; no NVIDIA NIM, GPT-OSS, or local inference adapter |
| Agents | PLANNED | Roles documented; no executable director/council/worker lifecycle |
| Memory | PLANNED | In-memory checkpoint class only; no durable typed/vector/graph memory |
| Tools | PLANNED | Capability vocabulary exists; no tool registry, broker, or OpenClicky adapter |
| Security | PARTIAL | Strong policy contracts/config; no end-to-end enforcement or security test harness |
| Permissions | MAC UNKNOWN | No verified macOS Accessibility, Screen Recording, Automation, or Full Disk Access state |
| Networking | PARTIAL | Direct model-catalog fetch; no enforced egress broker/allowlist runtime |
| Automation | PARTIAL | Vercel cron calls evolution daily; durable queues, idempotency, and retry state are absent |
| Self-healing | PLANNED | Kill switch/checkpoint contracts exist; no watchdog, recovery controller, or restore testing |
| Observability | PLANNED | Receipt types and demo metrics exist; no persistent logs, traces, SLOs, alerts, or tamper evidence |
| Documentation | PARTIAL | Vision and policies are documented; operating/runbook/API documentation is incomplete |
| Git/GitHub | PARTIAL | Canonical repo is clean remotely; CI, branch policy verification, signed commits, and release automation are absent |
| SaaS product | MVP DEMO | UI builds; auth, billing persistence, entitlements, CRM ingestion, and real metrics are incomplete |

## Known inconsistencies and risks

1. The repository markets a functioning Agentic OS, but most control-plane elements are interfaces or policy documents rather than integrated runtime behavior.
2. Demo dashboards can be reached without authentication when Clerk is unconfigured. They are clearly labeled, but must never be confused with live operational telemetry.
3. The Stripe webhook verifies signatures but does not persist events, update entitlements, or implement idempotency.
4. Checkout is now prepared to bind sessions to authenticated users and enforce execution/policy gates, but this has not been exercised with live Clerk or Stripe credentials.
5. The evolution cron is scheduled daily, while the migration manifest describes weekly evolution and upgrade-watch automation.
6. Core tests and a CI gate now exist locally; SBOM, provenance, integration tests, and a broader security regression harness remain missing.
7. Runtime policy functions are not placed in front of every API/tool/external mutation path.
8. Mac/OpenClicky state cannot be verified from this session, so local autonomy is blocked even though repository work is available.

## Immediate target state

Establish a trustworthy development spine before expanding features: reproducible installs, automated tests, CI verification, integrated policy enforcement, durable execution records, then a narrow OpenClicky worker adapter with explicit capabilities and receipts.
