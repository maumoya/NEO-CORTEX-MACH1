---
name: ecc-verification-loop
description: Verify NEO-CORTEX code changes through tests, build, policy checks and independent diff inspection before claiming completion.
metadata:
  origin: affaan-m/ECC
  upstream-commit: 8321021c54d670126ce3b2969d5deb880b4b0c2a
---

# ECC verification for NEO-CORTEX

Adapted from ECC verification-loop under MIT; see `third-party/ECC-LICENSE` and `docs/ECC-INTEGRATION.md` at the repository root.

Establish the requested acceptance criteria and inspect existing changes first. Run focused checks during implementation, repair concrete failures, then run `npm run verify` before publication. Preserve full exit status; do not hide failed commands behind pipes. Use `npm run scan:secrets`, which reports paths/rules without printing secret values. Do not use upstream examples that print matching credential lines.

Inspect `git diff` and the relevant application/API behavior independently of a worker's summary. Separate source checks, synthetic identity tests, live integration checks and unavailable machine evidence. Never invent coverage percentages or call an unconfigured adapter active.

Update the state/decision/next files and release notes. Finalize only with test evidence and remaining blockers. Approval is the last step for actions requiring it; complete the concrete patch and verification first. A failing or inaccessible check must be reported, not converted into success.
