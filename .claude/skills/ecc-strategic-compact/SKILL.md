---
name: ecc-strategic-compact
description: Preserve NEO-CORTEX state at phase boundaries before long agent sessions compact or change context.
metadata:
  origin: affaan-m/ECC
  upstream-commit: 8321021c54d670126ce3b2969d5deb880b4b0c2a
---

# ECC strategic compaction for NEO-CORTEX

Adapted from ECC strategic-compact under MIT; see the repository's `third-party/ECC-LICENSE`.

Before compaction, persist the objective, current branch/commit, changed files, acceptance criteria, actual test outcomes, unresolved failures, authorization boundaries and next action in the shared state records. Compact at a phase boundary when possible; do not intentionally discard exact state during an unfinished edit.

Reload the state records and relevant source before resuming. Do not assume ephemeral task lists or model sessions are durable memory. Load only task-relevant skills. This profile installs no context-reading or lifecycle hook and makes no quantified token-savings claim.
