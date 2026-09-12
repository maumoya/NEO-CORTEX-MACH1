---
name: neo-loops
description: Complete NEO-CORTEX implementation and repair tasks through bounded execution, independent verification and persistent state updates.
---

# Complete the loop

Define observable acceptance criteria. Inspect → plan → execute or delegate → verify independently → repair → verify again → record evidence → finish. Follow existing authorization through the whole cycle; do not ask the owner to relay messages, copy output or perform routine work available through your tools.

For delegated work, record task/correlation IDs, workspace, capability subset, deadline, aggregate spend ceiling and expected artifacts. Verify files, diff, tests and application state independently. A worker's completion statement is not proof.

Use a maximum of two revised repair attempts per failure, with a materially different diagnosis/approach. Retain one task identity and reuse idempotency keys when retrying external operations. Stop at verified completion, a concrete approval boundary, revoked/absent access, or an exhausted failure budget with an incident receipt. Never bypass a permission denial, retry an unknown payment outcome, or approve your own escalation.

Persist the outcome in NEO-CORTEX_STATE/DECISIONS/NEXT. Present the completed cycle and evidence, not an intermediate suggestion dressed as a finished result. Scheduled loops require a real scheduler; a skill file alone does not run continuously.
