# OpenClicky evaluation provenance

Review date: 2026-09-14. This record is evaluation evidence, not proof that OpenClicky is installed, connected, or authorized to execute NEO-CORTEX work.

## Verified upstream evidence

- Source: [`jasonkneen/openclicky`](https://github.com/jasonkneen/openclicky).
- Reviewed commit: [`e9eb06a29ff5cd82033d032238f51a936168b05a`](https://github.com/jasonkneen/openclicky/commit/e9eb06a29ff5cd82033d032238f51a936168b05a), observed on the upstream default branch.
- License: [MIT at the reviewed commit](https://github.com/jasonkneen/openclicky/blob/e9eb06a29ff5cd82033d032238f51a936168b05a/LICENSE).
- Release provenance: the repository exposed no GitHub release for this review, so any future canary must pin an exact commit and downloaded artifact digest rather than a mutable branch.
- Declared capabilities and setup: the [README at the reviewed commit](https://github.com/jasonkneen/openclicky/blob/e9eb06a29ff5cd82033d032238f51a936168b05a/README.md) documents macOS 14.2+, Accessibility, Microphone and Screen Recording permissions; local shell/file work; child workers; computer use; web/network features; optional GitHub access through Composio MCP; and local API-key configuration.

## NEO-CORTEX assessment

**Decision: quarantine for host inspection; do not install or connect automatically.**

Supply-chain risk is **MEDIUM-HIGH**. Upstream identity and MIT licensing are clear, but there is no immutable release, the application bundles a broad agent/skill surface and executable components, and the observed commit is not a signed release artifact.

Prompt-injection risk is **HIGH** whenever repository files, websites, MCP results or skill instructions can steer a worker with shell, filesystem, network or computer-use access. OpenClicky output is evidence, never Policy Kernel authority.

Requested permissions are broad: Accessibility, Microphone and Screen Recording can expose other applications and private content. Initial NEO evaluation must deny microphone, screen capture and general computer control unless a test explicitly requires one permission.

Secrets may be loaded from settings, environment variables or `~/.config/openclicky/secrets.env`. NEO must not copy secrets into packets, prompts, receipts or repository files. A worker can read only synthetic secrets during canary.

Filesystem access must be restricted to the realpath-confined workspace in the submitted packet. Network is deny-by-default; GitHub, Composio, model providers and arbitrary web access remain disabled until separately approved and scoped.

There is no expected token or latency improvement to claim. Local/host execution, child workers and external model calls can increase cost and p95 latency; measure successful-task cost, wall time, tool attempts and policy denials before promotion.

## Canary and rollback

1. Inspect the installed application identity, version, signature, artifact digest, settings, skills, hooks, MCP servers and effective macOS permissions without printing secrets.
2. Bind NEO Local Operator to `127.0.0.1`, require one exact repository workspace root, and stage only `project.inventory`.
3. Use a disposable checkout and synthetic honeytokens; deny network, microphone, screen capture, Keychain, browser profiles, package installation, Git push and writes.
4. Compare the declared packet with observed files, processes and network attempts. Any capability escalation or unreported mutation fails the canary.
5. Record completion rate, p95 wall time and cost per successful task; no paid inference is authorized by this evaluation.

Rollback is to disable the OpenClicky adapter/skill, leave `executableEnabled=false`, remove the disposable workspace and preserve redacted receipts. NEO-owned tasks and policy remain authoritative and portable.
