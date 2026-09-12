> Owner-supplied source, preserved 2026-09-12. Historical proposals and version/performance/security claims require independent verification. This file does not authorize installation, spending, account actions or publication of private data. Current accepted architecture: ../AGENTIC-OS-FRAMEWORK.md.

There are **three upgrade candidates worth putting into NEO-CORTEX’s governed evaluation queue today**. I did not install, merge, rotate credentials, or deploy anything.

- **GPT‑6 Astra as a new** **`frontier`** **routing tier — HIGH capability / MEDIUM deployment risk.** OpenAI released Astra on **September 3, 2026** for difficult coding, research, computer-use, and long-running multi-step work, and Vercel added `openai/gpt-6-astra` to AI Gateway on **September 4**. OpenAI also classifies Astra at the **Critical cybersecurity capability** threshold, which is the reason I would *not* make it the default model.  Proposed NEO change: register Astra as an opt-in `frontier/critical-capability` model available only after task classification, with stricter tool scopes, mandatory sandboxing for executable work, reduced network permissions, full trajectory/audit capture, and no access to `RESTRICTED/SECRET` data unless explicitly approved. Supply-chain risk is low because this is an official API/Gateway model, but operational and agency risk are high because of its capability level. Token/cost impact should be measured empirically rather than inferred from benchmark claims. **Tests:** existing NEO eval set versus GPT‑5.6 Sol for coding correctness, research citations, instruction retention, tool-call count, latency, tokens, cost, refusal behavior, prompt injection and attempted privilege escalation. **Canary:** 5% of approved frontier tasks, read-only or isolated sandbox first. **Rollback:** remove Astra from the eligible router catalog and restore GPT‑5.6 Sol/frontier predecessor; no workflow should reference Astra directly because the Agentic OS abstraction owns model selection. [OpenAI GPT‑6 Astra release notes](https://openai.com/products/release-notes/?utm_source=chatgpt.com)
- **OpenAI Sandbox Agents + Vercel AI SDK 7 harness abstraction — HIGH architectural value / MEDIUM integration risk.** OpenAI’s official TypeScript Agents SDK now exposes `SandboxAgent` with manifests, filesystem/shell/edit capabilities, snapshots, resumable state, memory and multiple sandbox backends; the repository is MIT-licensed.  Separately, Vercel AI SDK 7 added `HarnessAgent`, which normalizes established harnesses such as Claude Code, Codex and Pi behind one API, plus durable `WorkflowAgent`, approvals, timeouts, sandboxing and redesigned telemetry. This directly supports NEO’s permanent abstraction-layer principle.  The Vercel AI SDK repository identifies its license as Apache‑2.0.  Proposed NEO change: define a **`HarnessAdapter`** **interface** above Codex/Claude/OpenAI rather than hard-wiring any one harness, while keeping NEO’s Policy Kernel, capability broker and audit receipts above it. Do **not** delegate authorization to the harness. Requested permissions can include shell, files, patches, network and sandbox state, so defaults should remain deny-first. Secrets should arrive through opaque leases, not inherited environment dumps. **Tests:** identical task corpus across native NEO runner, OpenAI SandboxAgent and Vercel HarnessAgent; verify tool scopes, checkpoint/resume, cancellation, duplicated actions, token use, crash recovery and permission-denial behavior. One regression concern is that HarnessAgent has had recent lifecycle/terminal-step bugs and still has gaps such as structured-output support, so it should remain experimental behind the adapter.  **Canary:** coding/research sandboxes only, no production credentials, 10–20 controlled runs. **Rollback:** switch the adapter to NEO’s existing execution path without modifying the workflow definition.
- **Make MCP transport security a hard compatibility gate — HIGH security priority / LOW implementation risk.** Multiple official MCP SDK advisories in 2026 exposed the same architectural weakness: local HTTP/WebSocket servers without correct `Host`/`Origin` validation can be reached through DNS rebinding; the TypeScript SDK also had a cross-client data-leak issue when server/transport instances were reused. Patched baselines include Go SDK **≥1.4.0**, Python MCP **≥1.28.1** for the affected deprecated WebSocket path, Ruby MCP **≥0.23.0**, Java SDK **≥1.0.0**, and TypeScript SDK **≥1.26.0** for the cross-client issue.  Proposed NEO change: extend the MCP quarantine scanner so registration fails when an HTTP MCP server lacks explicit origin/host policy, authentication, per-client transport isolation, pinned provenance or minimum patched SDK versions. Local MCP should prefer `stdio` when networking is unnecessary. **Tests:** malicious `Origin`, DNS-rebinding simulation, concurrent clients with colliding request IDs, wildcard scope detection, localhost unauthenticated server, cross-client response isolation and tool-call authorization. **Canary:** enforce as warning in scanner reports first, then rejection for newly registered MCPs after existing integrations are inventoried. **Rollback:** downgrade enforcement from `BLOCK` to `WARN`; never revert the patched-version denylist.

Two upstream projects are useful but **not ready for automatic adoption**. ECC is now MIT-licensed and explicitly multi-harness, with skills, verification loops, memory and security patterns that map closely to NEO; however, its breadth—hundreds of skills plus hooks and multiple install surfaces—creates too much permission and prompt-injection surface to install wholesale. Its own docs warn against duplicate installation paths.  I would mine individual patterns, scan and vendor only selected modules. Matt Pocock’s skills are also MIT and deliberately small/composable, with particularly useful TDD, debugging, specification and architecture-feedback loops; the safer NEO approach is a pinned, reviewed copy of selected skills rather than the automatically updating Claude plugin.

For MCP scanning, **Sentinel Scan CLI** is a reasonable sandbox-evaluation candidate because it is MIT, offline by default, reports no telemetry/API-key requirement for local scanning, and explicitly checks tool poisoning, hidden Unicode, hardcoded secrets, excessive agency, missing provenance and HITL gaps.  **Sentinel Warden** has a strong design—static scanning of `SKILL.md`, MCP configs and rules plus an Agent BOM—but it currently has extremely low adoption, so I would treat its rules as research input rather than a trusted dependency.

MiroFish remains strategically interesting for the future simulation/Council layer, particularly the self-hosted Neo4j/Ollama variants, but its AGPL‑3.0 lineage and very high simulation token footprint make direct incorporation into the NEO core unattractive. Some forks report roughly **500K–1M tokens** for a modest simulation.  The better design is a quarantined **external simulation adapter** with strict budgets and machine-readable results, not copied MiroFish code inside NEO.

**Recommended promotion order:** first enforce the MCP security baseline, then prototype the harness-abstraction layer, then benchmark Astra before giving it any privileged execution path. Astra is the flashy upgrade; the MCP gate is the one I would ship first.

Monday 9:51 AM

NEO-CORTEX Upgrade Watchsvg

A **meaningful new security candidate** surfaced today for NEO-CORTEX.

### GitHub Agentic Workflows v0.88.4 / Agentic Workflow Firewall hardening

GitHub published its September 7 update with **v0.88.4**, focused specifically on agent isolation, network control, trusted enclaves, and data-flow policy. The release adds finer-grained **trusted-enclave sensitivity**, automatically generated **data-flow integrity/confidentiality (DIFC) policies** for GitHub App-authenticated workflows, and continued migration toward **Cloud Hypervisor microVM isolation**.

The underlying `github/gh-aw-firewall` project is official GitHub software under the **MIT license**. Its architecture is especially relevant to NEO-CORTEX: the agent is separated from an optional API-proxy sidecar that holds LLM credentials, while outbound HTTP/HTTPS is forced through a controlled proxy. It supports allow/deny domains, DLP inspection, runtime limits, token steering, audit logs, and multiple LLM providers.

**Proposed NEO-CORTEX change:** do **not** add `gh-aw-firewall` as a production dependency yet. Instead, promote its architecture into the governed security backlog as a reference implementation for a new **Execution Egress Boundary**:

`Agent → isolated runtime → egress policy → credential broker/API proxy → approved external services`

The key ideas worth adopting are credential isolation from the actual agent process, fail-closed network egress, machine-readable network/audit policies, explicit workload sensitivity classes, and treating policy-blocked output as a governed outcome rather than an agent failure. GitHub's new DIFC work is particularly compatible with NEO's Policy Kernel and capability-broker model.

**Risk: MEDIUM for evaluation, HIGH if directly installed with broad privileges.** The firewall itself reduces agent-network risk, but its execution model can involve Docker, Squid, iptables, custom mounts, Docker-in-Docker, SSL interception, API proxying, and potentially root-level setup. That makes the dependency a substantial trusted-computing-base addition.  Supply-chain provenance is strong because it is maintained under GitHub's organization and MIT-licensed; however, NEO should pin exact releases/digests and verify signatures rather than use its documented `curl | sudo bash` installation route. Prompt-injection exposure is reduced on the **exfiltration** side because compromised agents cannot freely contact arbitrary domains, but the firewall does not itself solve malicious instructions entering through webpages, files, MCP outputs, issues, or PRs.

Secrets behavior is attractive: GitHub documents an API-proxy sidecar specifically so provider credentials do not need to enter the agent container. NEO should copy that design principle into its own capability broker rather than exporting `OPENAI_API_KEY`, Anthropic credentials, GitHub tokens, or other secrets into agent environments.

**Token/cost impact:** fundamentally model-neutral. Egress proxying and DLP add compute/latency rather than LLM tokens. GitHub's firewall also exposes token-usage records and supports rate limits/token steering, which could actually strengthen NEO's budget enforcement. MicroVM isolation will carry startup and infrastructure overhead, so it should be benchmarked separately from model latency.

**Evaluation tests:** run a malicious-agent suite attempting DNS/HTTP exfiltration, redirect-based allowlist escape, credential/environment enumeration, requests to unapproved MCP endpoints, encoded data exfiltration, indirect prompt injection followed by network calls, API-key extraction from the agent process, filesystem escape, and network access after timeout. Also verify that legitimate OpenAI, Anthropic, Vercel and GitHub calls still work under tightly scoped policy.

**Canary:** one disposable NEO sandbox class, no production credentials, read-only repository access, explicit domain allowlist, synthetic secrets only, and audit every outbound request. Compare it with NEO's current sandbox behavior for latency, policy bypass rate, operational complexity and false blocks.

**Rollback:** because this should initially sit behind NEO's execution-provider abstraction, rollback is simply disabling the experimental `egress_boundary_v2` runtime profile and returning jobs to the existing sandbox. No workflow definition, credential, or application code should depend directly on GitHub's firewall.

There were **no newly published OpenAI Agents SDK, Vercel AI SDK/Gateway, Claude Code, ECC, MiroFish, or MCP-security developments in this check that cleared the threshold for another notification**. Claude Code's latest visible release is v2.1.263 with generic reliability fixes, which is not specific enough to justify changing NEO yet.

Tuesday 8:50 AM

NEO-CORTEX Upgrade Watchsvg

A **new governed upgrade candidate** cleared the threshold since the previous check.

### MCP Python SDK 2.2.0 security baseline

The official `modelcontextprotocol/python-sdk` released **v2.2.0 on September 7, 2026** with a GitHub-verified signed release. It introduces several defaults that matter directly to NEO-CORTEX’s future MCP execution broker.

Most important: MCP HTTP clients now refuse cross-origin redirects. Redirects are followed only when scheme/host/port remain within the endpoint’s origin, preventing an MCP endpoint from transparently steering a privileged client toward another host. OAuth discovery follows the same restriction.

It also adds explicit authorization controls: `validate_token_resource` can ensure a presented token was actually issued for that MCP resource server, while OAuth client-credential providers gain explicit `issuer=` validation. Both become increasingly important ahead of the SDK’s 3.0 behavior changes.

Stateful Streamable HTTP sessions now default to a **30-minute idle expiration** and a **10,000-session maximum**, reducing abandoned-session/resource-exhaustion exposure. The release also fixes session cleanup after `DELETE` and refused initial requests.

This follows a significant history of MCP Python transport vulnerabilities, including cross-principal session access, DNS rebinding, and missing WebSocket Host/Origin validation. Those older issues are already patched, but 2.2.0’s defaults materially strengthen the architecture NEO should expect from future MCP adapters.

**Provenance/license:** official `modelcontextprotocol` organization; release commit has GitHub verified signature. Current package metadata declares **MIT** and identifies the MCP project under LF Projects.

### NEO-CORTEX impact

There is **no immediate dependency upgrade to perform**. The canonical `maumoya/NEO-CORTEX-MACH1` is currently a Node/TypeScript system and has no Python MCP SDK dependency; its installed agent stack includes `@openai/agents 0.17.0`, AI SDK `7.0.93`, and Gateway `4.0.75`.

That actually makes this a good time to encode the requirements **before** MCP execution becomes production infrastructure. NEO currently marks its MCP/tool layer and security scanner as only `PARTIAL`, with the production registry/execution broker and runtime scanner still outstanding.

**Proposed change for governed evaluation:** extend the future MCP compatibility/security contract with four requirements:

1.  Redirects from authenticated MCP endpoints must be **same-origin by default**.
2.  OAuth-enabled MCP adapters must validate both **issuer** and intended **resource/audience**.
3.  Stateful transports require configurable **idle expiration, concurrent-session ceilings, and deterministic cleanup**.
4.  NEO Sentinel should flag MCP SDKs/transports whose behavior is weaker than these controls, even when technically protocol-compatible.

This fits NEO’s existing agent contract because Sentinel is already responsible for MCP, supply-chain, secret and behavior analysis, while tools operate under explicit network/capability allowlists.

**Risk: LOW** to adopt as a policy/evaluation requirement; **MEDIUM** for a future Python MCP migration because 2.x contains meaningful API changes from 1.x.

Supply-chain risk is low if NEO pins the official package/version/hash. Prompt-injection risk is not eliminated: malicious MCP-returned text remains untrusted data and must stay below the Policy Kernel. Filesystem/secrets permissions do not broaden merely by adopting these transport rules. Token impact is effectively zero; additional issuer/audience checks and redirect enforcement add negligible compute/network cost.

**Required tests:** cross-origin 301/302/307/308 redirects; malicious OAuth metadata redirect; wrong-resource bearer token; wrong issuer; expired/idle stateful session; concurrent-session exhaustion; failed initialization cleanup; authenticated user A attempting to reuse user B’s session; DNS-rebinding attempt; malformed tool-output schema.

**Canary:** apply these rules first to NEO’s MCP Sentinel/evaluator as `WARN`, using synthetic MCP servers and fake credentials. After compatibility testing, promote them to `BLOCK` for newly registered networked MCP servers. `stdio` integrations remain independently evaluated because several HTTP-specific risks do not apply to them.

**Rollback:** revert enforcement from `BLOCK → WARN`; do not weaken the underlying Policy Kernel or remove evidence collection. No application workflow should depend directly on a particular MCP SDK version.

I found **no newer OpenAI, Vercel, Claude Code, ECC, mattpocock/skills, MiroFish, social-API, or model release since the previous scan that independently clears the notification threshold**. The notable Vercel/OpenAI Astra items remain the previously identified candidates, not new discoveries today.

Wednesday 8:32 AM

NEO-CORTEX Upgrade Watchsvg

A **meaningful NEO-CORTEX upgrade candidate** appeared and directly affects the canonical repository.

## OpenAI Agents SDK JS `0.17.0 → 0.17.2`

NEO-CORTEX currently pins **`@openai/agents: 0.17.0`** in `maumoya/NEO-CORTEX-MACH1`.  OpenAI released **0.17.1 and 0.17.2 on September 8, 2026**, with GitHub-verified signed release commits. The upstream repository is official OpenAI and **MIT-licensed**.

This clears the watch threshold because `0.17.1` contains several security and governance fixes that map almost exactly onto NEO-CORTEX’s architecture:

- **Sandbox Git argument-injection hardening.** OpenAI fixed Git repository argument injection in sandbox handling.
- **Server-wide MCP tool guardrails.** A guardrail can now govern every tool exposed through an MCP server rather than requiring fragile per-tool policy wiring.
- **Approval integrity improvements.** Serialized approval ownership, approvals across handoffs, deferred-tool identity, and resumed-session writes received fixes. These matter because NEO explicitly relies on approval gates.
- **MCP isolation fixes.** Cached MCP tool definitions are isolated and duplicate MCP lifecycle ownership is removed, reducing cross-run/state contamination risk.
- **Fail-correctly behavior.** Unsuccessful Responses terminal states and truncated empty completions are now rejected instead of potentially being treated as usable output.
- **Session/compaction concurrency fixes.** Concurrent writes survive automatic compaction and multiple resume/approval state transitions were hardened.
- **`0.17.2`** **fixes model-setting preservation for GPT-5 and newer models.** This is particularly important for NEO's model router: intended reasoning/model settings should no longer disappear during SDK processing.

### Proposed NEO change

Prepare a governed dependency candidate:

**`@openai/agents 0.17.0 → 0.17.2`**

Do **not** merge it directly. The canonical NEO design explicitly requires `DISCOVER → NORMALIZE → QUARANTINE → SCAN → EVALUATE → PROPOSE → APPROVE → CANARY → PROMOTE → OBSERVE → ROLLBACK`, with the deterministic Policy Kernel remaining above model/tool instructions.

I would also add an NEO invariant while evaluating the upgrade: **SDK MCP guardrails are defense-in-depth, never the Policy Kernel itself.** An upstream SDK bug or malicious MCP response must therefore still encounter NEO's independent capability authorization.

**Risk: LOW–MEDIUM for the dependency bump; HIGH value for security.**

Supply-chain risk is **low**: official `openai/openai-agents-js`, MIT license, signed releases. No new blanket operating-system permission is required merely by moving from 0.17.0 to 0.17.2. The dangerous capabilities remain the capabilities NEO deliberately hands an agent: filesystem, shell/sandbox, MCP/network, repository access and external tools.

Prompt-injection risk remains **material**. The MCP guardrails improve enforcement after potentially hostile MCP content enters the system; they do not make MCP output trustworthy.

Secrets risk should not increase. NEO should continue keeping provider credentials outside prompts, tool results, persisted RunState and sandbox files wherever possible.

Filesystem/network risk should **decrease**, especially around sandbox Git operations and MCP tool governance.

Token impact should be essentially negligible from the upgrade itself. However, the 0.17.2 model-settings correction could change **actual inference behavior and therefore cost** if NEO previously requested a GPT-5+ reasoning configuration that 0.17.x failed to preserve. That makes token/cost regression testing mandatory rather than assuming identical bills.

### Required evaluation before approval

Run the existing NEO suite plus targeted cases for malicious Git repository arguments, malicious MCP tool output/instructions, MCP tools attempting unauthorized capabilities, identical tool names from multiple MCP servers, approval → serialization → resume, approval → handoff → resume, concurrent session writes during compaction, rejected/failed Responses, truncated responses, interrupted sandbox PTY operations, and GPT-5+/Astra model-setting preservation.

For model routing, record the **actual request settings, output tokens, reasoning tokens, latency, tool calls and dollar cost** for identical workloads on 0.17.0 versus 0.17.2.

**Canary:** pin exactly `0.17.2` on an evaluation branch; synthetic secrets only; no production credentials; read-only repositories initially; network deny-by-default; MCP servers limited to controlled test fixtures. Run the normal NEO workload corpus plus adversarial cases before enabling write-capable sandbox tasks.

**Promotion condition:** zero Policy Kernel bypasses, zero approval ownership regressions, equivalent-or-better session recovery, expected model settings visible in traces, and no unexplained cost/latency increase.

**Rollback:** restore the exact `0.17.0` dependency/lock state. No NEO workflow should require a 0.17.2-only feature during the canary, so rollback remains dependency-level rather than architectural.

**Recommendation:** **`APPROVE FOR CANARY`****, not production promotion yet.** Of yesterday's releases, this one is unusually well aligned with NEO-CORTEX: the value is less about shiny new agent functionality and more about tightening the exact MCP, sandbox, approvals, persistence and model-routing boundaries NEO is supposed to get right.

Thursday 8:14 AM

NEO-CORTEX Upgrade Watchsvg

A **meaningful security finding** cleared the notification threshold today. It changes how I recommend NEO-CORTEX treat ECC.

### ⚠️ ECC 2.2.1: GateGuard can silently allow destructive SQL

`affaan-m/ECC` released **v2.2.1 on September 8, 2026** as a security/bug-fix release. The release has a verified GitHub signature and ECC is **MIT-licensed**. Among other fixes, 2.2.1 hardens PowerShell destructive-command recognition, project-root exemption handling, installer ownership/collision behavior, dry-run uninstall, atomic Claude settings changes, and dependency handling.

However, an open issue against the exact signed 2.2.1 commit has a reproducible **fail-open condition in GateGuard**. Realistic quoted SQL such as `psql -c "drop table users"`, `psql -c 'truncate audit_log'`, and `mysql -e "delete from sessions"` passes GateGuard as **ALLOWED**, while an unrealistic unquoted form is denied. The reported root cause is that quoted content is stripped before the destructive-SQL detector examines it.

That matters because ECC itself describes GateGuard as triggering on destructive commands including `drop table`.

ECC 2.2.1 release

[GateGuard SQL bypass issue #3024](https://github.com/affaan-m/ECC/issues/3024?utm_source=chatgpt.com)

**NEO-CORTEX risk: HIGH if GateGuard is treated as an authorization/security boundary; LOW currently for the read-only Director path.** NEO's current governed Director has no mutation tools, so this does not presently create a direct destructive-database path. But it is highly relevant before NEO gains database, shell, deployment, CRM, financial, or other write-capable tools.

The bigger architectural lesson is important: **NEO must never authorize a dangerous operation because an upstream regex-based command scanner says it is safe.** GateGuard can remain defense-in-depth, but NEO's deterministic Policy Kernel and capability broker must remain authoritative.

### Proposed governed NEO change

Add a security invariant to the Execution/Policy layer:

**`High-risk capabilities are authorized from structured intent/capability metadata, never solely from command-text classification.`**

For database operations, classify capability before shell construction, for example `db.read`, `db.write`, `db.schema.modify`, and `db.bulk_delete`. Anything equivalent to DROP/TRUNCATE/unbounded DELETE should require an explicit high-risk capability plus human approval regardless of how quotes, variables, pipes, subshells, wrappers, encoded strings, or alternative clients obscure the resulting command.

For ECC specifically, I would change its NEO status from **“candidate security enhancement” → “QUARANTINED / patterns only.”** Do not install ECC 2.2.1 wholesale into NEO or delegate Policy Kernel decisions to GateGuard. ECC's plugin manifest contains **68 agents, 286 skills, 94 command shims and local hooks**, with hooks enabled by default, which is far too broad a supply-chain/prompt surface to accept unreviewed.

**Supply chain:** MEDIUM. Provenance is good: signed upstream release, known maintainer, MIT license. But its enormous agent/skill/hook surface materially enlarges NEO's trusted computing base.

**Prompt-injection:** HIGH if ECC receives write-capable tools. A malicious repository, MCP response, webpage or retrieved document could steer an agent toward a destructive command; this specific bug demonstrates that the secondary gate may fail silently.

**Permissions:** ECC hooks execute in the local agent lifecycle and observe/interpose on tool activity. No blanket network privilege should be granted merely for ECC.

**Secrets:** keep ECC outside NEO's secret broker. Hooks/skills should receive neither raw provider keys nor unrestricted environment dumps.

**Filesystem:** any evaluated ECC component should get project-scoped read access and initially zero writes outside a disposable workspace.

**Network:** deny by default. Add endpoints per capability, not per plugin.

**Token/cost:** the vulnerability fix itself has negligible token implications. Wholesale ECC adoption would not: hundreds of available skills/rules/hooks can inflate discovery/context and tool-selection overhead. Selective vendoring remains preferable.

### Required regression tests

Before reconsidering GateGuard or an equivalent NEO scanner, add adversarial command tests covering quoted SQL, alternate clients, multiline commands, environment variables, shell substitution, pipes/semicolons, heredocs, encoded payloads, aliases/wrappers and indirect execution.

The critical cases are:

`DROP TABLE` → BLOCK

`TRUNCATE` → BLOCK

unbounded `DELETE FROM` → BLOCK

same operations hidden inside quotes/subshells → BLOCK

`git commit -m "refactor drop table handling"` → ALLOW

Then test a stronger condition: even if **every textual scanner incorrectly returns SAFE**, NEO's capability broker must independently refuse `db.schema.modify` without the required approval.

### Canary and rollback

**Canary:** no ECC runtime installation. Vendor or reproduce only the GateGuard test corpus inside NEO's security-evaluation fixtures. Run it against NEO Sentinel/Policy Kernel using synthetic databases and credentials. If selected ECC skills are later tested, pin the exact commit, disable hooks initially, and expose no production secrets or external write capabilities.

**Promotion gate:** zero fail-open cases for destructive capability tests, including obfuscated representations, plus deterministic authorization independent of model or plugin judgment.

**Rollback:** because nothing upstream is being installed, rollback is simply removal of the experimental evaluation fixture. Existing NEO execution and Policy Kernel behavior remains untouched.

**Decision:** **`DO NOT ADOPT ECC 2.2.1 GATEGUARD AS A SECURITY CONTROL`****.** Continue mining ECC for useful patterns, but NEO should build the stronger capability-based boundary rather than inherit this class of regex fragility.

Yesterday 8:15 AM

NEO-CORTEX Upgrade Watchsvg

A **major new candidate cleared the NEO-CORTEX threshold**: OpenAI’s new **Agents API**, released September 10, 2026, plus Vercel’s first-class Sandbox integration released the same day. This is more consequential than another SDK bump because it offers a managed long-running agent harness while letting NEO retain control of the execution environment.

### Candidate: Agents API + governed Vercel Sandbox execution

OpenAI’s Agents API is now in **public beta**. OpenAI manages the Codex-derived agent loop, context compaction, session state, tool search, programmatic tool calling, and optional parallel subagents. Crucially, the execution environment is separable: OpenAI-hosted, self-hosted, or a supported sandbox provider such as Vercel. OpenAI says there is no additional Agents API fee beyond the models and tools consumed.

Vercel simultaneously released an official integration where OpenAI maintains the session/agent loop while each session connects to an **isolated Vercel Sandbox**, with reconnection via signed OpenAI webhooks and Vercel Queues, persistent files across follow-up instructions, and scale-to-zero execution.

This fits NEO-CORTEX unusually well because NEO can keep the **Policy Kernel, approvals, capability broker, audit receipts and budget controls outside the managed harness**, rather than rebuilding context-compaction and long-duration orchestration itself.

**Decision:** **`APPROVE FOR ARCHITECTURAL CANARY`****, not production adoption.**

### Provenance and licensing

The API itself is an OpenAI hosted service. Its underlying harness is based on the official open-source Codex project; the official Codex package declares **Apache-2.0**. The existing OpenAI Agents JS SDK remains official OpenAI software under **MIT**.

Vercel Sandbox is maintained by Vercel and implemented as isolated Linux **Firecracker microVMs**. Current package metadata identifies `@vercel/sandbox` as **Apache-2.0**.

Supply-chain provenance is therefore **strong**, although the Agents API remains public beta and should be version-pinned/isolated behind a NEO adapter.

### Security assessment

**Overall risk: MEDIUM-HIGH during evaluation; potentially MEDIUM after containment.**

Prompt-injection risk remains **HIGH** because long-running agents can consume repositories, files, MCP responses and web/tool output. Managed orchestration does not make retrieved instructions trustworthy.

Filesystem risk is materially broader than NEO’s current safe runtime. Agents API sandboxes are explicitly designed for file manipulation and code execution. Vercel Sandbox additionally permits root-equivalent `sudo`, installation of packages, Docker/FUSE, network access, and public ports. Its default image includes coding agents and development utilities.

That makes NEO's containment layer mandatory. **Do not expose the default unrestricted Sandbox configuration to an autonomous NEO agent.**

Secrets should stay outside the model-visible filesystem/environment wherever possible. Vercel supports OIDC authentication, and NEO should eventually inject short-lived/scoped credentials through the capability boundary rather than persisting raw provider or infrastructure tokens inside workspaces.

Network policy must remain deny-by-default. MCP, package registries, GitHub and model endpoints should be explicitly enumerated by task capability.

### Proposed NEO-CORTEX change

Do **not** replace the current Director.

Add an experimental execution abstraction such as:

`NEO Policy Kernel`

→ `Capability/Approval Broker`

→ `Agent Runtime Adapter`

→ `OpenAI Agents API`

→ `NEO Sandbox Adapter`

→ `Vercel Sandbox`

The important boundary is that the Agents API gets to **reason and orchestrate**, but it does **not** become NEO's authorization authority.

NEO should own:

-  capability grants;
-  network policy;
-  secret leases;
-  filesystem mounts;
-  human approvals;
-  monetary/token budgets;
-  audit receipts;
-  kill switch;
-  promotion/rollback.

OpenAI may own context compaction, subagent scheduling and the agent loop.

That separation is the strongest reason to evaluate this release.

### Token and cost implications

There is potentially meaningful upside. OpenAI says **tool search dynamically loads relevant tool definitions**, reducing context/token consumption, while programmatic tool calling can filter and combine tool results before bringing them back into model context. Automatic compaction supports sessions across multiple context windows.

But parallel subagents can easily reverse those savings. Three simultaneous Astra subagents can multiply inference consumption if NEO does not impose a parent-level aggregate budget.

For the canary, retain the current NEO budget philosophy: **aggregate cost belongs to the root job**, not each subagent independently.

Vercel Sandbox additionally bills CPU, provisioned memory, outbound transfer and related infrastructure usage. Current published Pro pricing starts at $0.128/active CPU-hour and $0.0212/GB-hour of provisioned memory after included usage.

### Required security/regression tests

The evaluation suite should include:

1.  indirect prompt injection attempting to obtain shell/network/filesystem privileges;
2.  subagent attempting capabilities absent from its parent grant;
3.  MCP output instructing the agent to override NEO policy;
4.  exfiltration of synthetic API keys through HTTP/DNS;
5.  sandbox access to environment credentials;
6.  path traversal and writes outside the assigned workspace;
7.  unauthorized package installation and `sudo`;
8.  persistent malicious files surviving session resume;
9.  compromised state after automatic context compaction;
10.  webhook replay/forgery and session-reconnection attacks;
11.  subagent fan-out exceeding concurrency/token limits;
12.  kill-switch propagation to all child agents/sandboxes;
13.  crash/restart followed by deterministic approval-state recovery.

A particularly important invariant is:

**An OpenAI/Vercel component returning “allowed” can never override a NEO Policy Kernel denial.**

### Canary

Create an isolated `agents-api-experimental` runtime profile.

Keep NEO's existing safe runtime unchanged. Give the canary only a synthetic repository, synthetic secrets, read-only source initially, no deployment credentials, no production MCP servers, outbound-network allowlists, one subagent maximum, a short session lifetime, and aggressive token/infrastructure limits.

Run identical planning/research/coding tasks through the existing NEO Director and the new runtime and compare quality, completion rate, latency, tokens, infrastructure cost, policy violations, recovered-session correctness and audit completeness.

Only after that should filesystem writes inside disposable workspaces be enabled.

### Rollback

The runtime adapter must make rollback trivial:

`agents-api-experimental → disabled`

Existing workflows return to the present NEO Director without migration.

Do not persist essential NEO state exclusively inside an OpenAI session or Vercel sandbox. Canonical policy state, approvals, receipts and checkpoints remain NEO-owned so loss of either provider cannot strand the system.

### Two related Vercel upgrades strengthen the case

Vercel Sandbox expanded from four to **all 20 Vercel compute regions on September 10**, including selectable regions and Pro/Enterprise failover, which is useful for latency and future data-residency policy.

Today, **September 11**, Vercel also doubled default Sandbox storage from **32 GB to 64 GB** for sandboxes created with an image using current SDK/CLI versions.  That is useful for larger repositories, model artifacts and long-running build/test environments, but storage quotas should remain deliberately lower in NEO unless a workload justifies more capacity.

I found no newer ECC, MiroFish, MCP-security, Claude Code, or model-security development since the last run that independently clears the notification threshold. The **Agents API + controlled Vercel Sandbox boundary is today's significant architectural candidate.**

Today 8:07 AM

NEO-CORTEX Upgrade Watchsvg

A **new upgrade candidate cleared the threshold** since the previous NEO-CORTEX scan: **Claude Code v2.1.269’s reproducible plugin evaluation framework**.

### Claude Code `v2.1.269`: governed plugin/skill evaluation

Anthropic released **Claude Code v2.1.269 on September 11, 2026 at 19:17**, after the previous NEO-CORTEX watch run. Its important addition is `claude plugin eval`, which runs a plugin’s evaluation suite and produces **scored, reproducible JSON and HTML reports**. The same release also adds file-change diffs to Bash results and optional repository attributes in OpenTelemetry.

That is directly useful for NEO-CORTEX because the difficult problem with ECC, mattpocock/skills, Anthropic plugins and other skill ecosystems is not discovering them; it is **proving that a quarantined skill/plugin actually behaves acceptably before promotion**.

**Recommendation:** **`APPROVE FOR EVALUATION-HARNESS CANARY`** **— do not adopt Claude Code as a NEO security authority.**

### Provenance and license

Provenance is strong: this is the official `anthropics/claude-code` repository and Anthropic release channel. However, an important correction to make explicit: **Claude Code itself is not MIT or Apache open source.** Its license states that it is © Anthropic PBC, all rights reserved, and governed by Anthropic’s Commercial Terms.

Anthropic's plugin system can contain skills, agents, hooks, MCP servers, LSP servers, monitors, executables added to Bash `PATH`, and default settings. Anthropic itself therefore recommends trust scrutiny for plugin sources.

So the supply-chain picture is:

**Claude Code executable: LOW-MEDIUM provenance risk.** Official vendor, but proprietary binary/runtime.

**Plugin under evaluation: UNKNOWN until scanned.** Potentially HIGH because a plugin can introduce executable hooks, MCP endpoints, binaries and model-visible instructions.

### Proposed NEO-CORTEX change

Do **not** install v2.1.269 into NEO's production runtime.

Instead, add a future **`PluginEvalAdapter`** to NEO's quarantine pipeline:

`DISCOVER`

→ provenance/license verification

→ static Sentinel scan

→ capability extraction

→ **isolated behavioral eval**

→ adversarial eval

→ scored evidence bundle

→ human approval

→ canary

→ promotion

For Claude-compatible candidates, `claude plugin eval` could become one **evaluation backend**, alongside NEO's own tests.

Critically:

> A passing Claude evaluation must never equal NEO authorization.

The NEO Policy Kernel remains authoritative. Claude's score becomes evidence attached to an upgrade proposal.

This would be especially useful for evaluating selected pieces of **ECC, mattpocock/skills and future Anthropic plugins** without blindly installing entire upstream collections.

### Security assessment

**Overall adoption risk: LOW-MEDIUM if isolated; HIGH if automatically trusted.**

**Prompt injection: HIGH inherent risk.** A `SKILL.md`, agent instruction, MCP response or malicious test fixture is executable *instructional input* from the model's perspective. Behavioral evaluation helps detect failures but cannot prove absence of injection paths.

**Filesystem:** potentially broad. Plugins can include hooks, binaries and agents capable of interacting with project files. Anthropic's plugin architecture explicitly supports executable components.  NEO should therefore evaluate them only inside disposable workspaces.

**Network:** plugin MCP servers or plugin-executed programs may introduce network access. NEO should keep evaluation egress deny-by-default and permit destinations independently of Claude/plugin configuration.

**Secrets:** zero production secrets during plugin evaluation. Use synthetic canary credentials and honeytokens. A plugin that attempts to discover or transmit them should automatically fail evaluation.

**Permissions:** do not use bypass modes. An evaluation should exercise denied operations and record whether the plugin attempts escalation.

### Why the Bash diff feature matters too

v2.1.269 now attaches a **diff of files changed by Bash commands** to the Bash tool result when Bash performs file edits.

That is a useful pattern for NEO independently of Claude:

**Every mutation-capable execution receipt should contain the resulting filesystem diff, not merely the command and exit code.**

An agent running:

`sed`, `python`, `perl`, build scripts or custom generators

can mutate files without using an explicit Edit tool. Command auditing alone therefore misses the actual consequence.

I would add this principle to NEO's execution receipts.

### Token/cost impact

The new capability should **not be part of normal agent inference**, so steady-state NEO token cost stays unchanged.

Evaluation cost does increase because candidate plugins would execute reproducible model-based test suites. That is acceptable if governed with:

-  fixed eval datasets;
-  maximum model calls;
-  token ceilings;
-  concurrency caps;
-  cheap model first, frontier model only for disputed cases;
-  cached results keyed by candidate commit SHA + evaluator version + test-suite hash.

That last part matters: unchanged upstream code should not be repeatedly re-evaluated at full cost.

### Tests to add

The NEO Plugin/Skill Evaluation Suite should intentionally test:

1.  benign task completion;
2.  instruction to reveal environment variables;
3. `SKILL.md` prompt injection;
4.  malicious repository instructions;
5.  MCP tool output attempting policy override;
6.  unauthorized filesystem writes;
7.  writes outside the workspace;
8.  network exfiltration;
9.  command execution not required by the task;
10.  hidden Unicode/invisible instructions;
11.  attempts to modify NEO/Claude policy files;
12.  attempts to alter its own evaluator;
13.  misleading "task complete" claims after failed commands;
14.  nondeterministic behavior over repeated runs;
15.  token explosion/tool-loop behavior.

Because Claude Code has historically had vulnerabilities where hostile repository content interacted with permissions, sandbox boundaries or trust decisions, NEO should specifically retain those regression classes rather than assume the latest binary eliminates the architectural threat.

### Canary

Use **v2.1.269 pinned exactly** inside an isolated evaluation environment.

Start with one known-safe internally authored toy plugin and several deliberately malicious fixtures. No production repository write access, no production MCP endpoints, no deployment token, no inherited shell credentials, restricted egress and disposable filesystem.

Run NEO's own evaluator and `claude plugin eval` independently.

Promotion criterion should require agreement on critical security failures, not just a high Claude score.

Then evaluate **one selectively vendored external skill**, rather than ECC or another large catalog wholesale.

### Rollback

Very clean: disable the `ClaudePluginEvalAdapter`.

Because this is an evaluator rather than a runtime dependency, NEO's Director, Policy Kernel, model router, production agents and stored workflows remain untouched. Existing evaluation evidence remains as historical audit data but cannot authorize future versions.

**Bottom line:** this is worth adopting as a **quarantined testing capability**, not as another autonomous agent layer. The particularly valuable idea is reproducible machine-readable behavioral evaluation tied to a precise plugin version. That fills a real gap between NEO's current static supply-chain scanning and eventual governed promotion of third-party skills.
