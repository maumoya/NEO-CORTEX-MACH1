# Dedicated Repository Migration Manifest

Canonical destination: `maumoya/NEO-CORTEX-MACH1`
Default branch: `main`
Temporary source: `maumoya/l900-ble-diagnostic/NEO-CORTEX-MACH1/`

## Invariant
The Agentic OS lives at the **root** of the dedicated repository. BLE diagnostic code and NEO-CORTEX code must never be mixed again.

## Completion criteria
1. Full Agentic OS source/config/docs exist at the dedicated repo root.
2. Product SaaS surface, dashboard, backoffice, billing/auth boundaries and release intelligence exist there too.
3. Required core P0 control files are verified.
4. Weekly evolution and upgrade-watch automation target the dedicated repository.
5. A separate Vercel project is used for NEO-CORTEX.
6. Old BLE subtree is deleted only after destination verification.
7. Repository secrets are never committed.

## Security note
GitHub repository visibility is an account/repository control and must match the intended publication strategy. The codebase itself contains no production credentials.
