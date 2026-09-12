# Safe Director runbook

The implemented runtime accepts only `status` and `next`. It uses no LLM, workload tool, shell, arbitrary path or remote worker. It writes its own task journal; “read-only” describes workload capability, not the absence of journal writes. `next` returns a reviewed roadmap, not live discovery. This is a foundation for the framework, not the completed Agentic OS.

## Requirements and configuration

- Node `>=24.14 <25`, persistent self-hosted disk and an operator-owned private directory (0700).
- Enable with `NEO_CORTEX_RUNTIME_ENABLED=true`; set `NEO_CORTEX_DATA_DIR` to an absolute private persistent path outside the public repository.
- Retain `NEO_CORTEX_EXECUTION_MODE=safe`. `halted` rejects execution.
- Configure Clerk through the existing server environment, an admin user in `ADMIN_USER_IDS`, and `NEXT_PUBLIC_APP_URL` with the exact application origin. Use HTTPS except localhost development.
- Do not print or commit credential values. `NEO_CORTEX_RUNTIME_ENABLED=false` is the committed default.
- Vercel execution deliberately returns 503 until a shared durable-store adapter exists. `/tmp`, ephemeral containers and network-synced SQLite files do not satisfy durability.

Start with `npm ci --ignore-scripts`, `npm run verify`, then `npm start -- -H 127.0.0.1`. Open `/console` from that host, authenticate as an admin, and submit a fixed operation. Attach private HTTPS for other devices only after identity/access configuration is verified. No credential changes or live host activation occurred in the cloud development session.

## HTTP contract

`POST /api/agent`, same-origin JSON:

```json
{"operation":"status","idempotencyKey":"a_unique_request_key_001"}
```

The server obtains actor identity from Clerk. Body-supplied actor, role, prompt, path, tools, budget and approval fields are rejected. The idempotency key is 16–128 characters from letters, digits, `_` and `-`. Reuse it for a retry of the same operation; changing operation under that key returns 409.

Responses include task ID, correlation ID, state, fixed result, replay flag and journal head hash. Responses are `no-store`. Disabled/unconfigured storage returns 503; missing identity 401; non-admin or wrong origin 403; halted 423; oversized body 413; rate limit 429; idempotency conflict 409. Clerk middleware may reject an unauthenticated request before the handler. HTTP input is limited to 1 KiB and a five-second body read; the console has a ten-second request timeout.

## Persistence and recovery

SQLite uses transactions, WAL, full synchronous mode, unique actor/idempotency binding and a compare-state lifecycle. Twenty new tasks per actor/minute and 10,000 total tasks bound this initial store. Terminal tasks cannot restart. Work interrupted for over 60 seconds is marked failed on the next accepted execution; it is not automatically replayed. There is no background recovery daemon or maintenance/retention API yet.

Task events are hash chained and the final task rows/index bindings are checked. This detects tested inconsistency/tampering; it does **not** prevent a host/database owner from rewriting the complete chain or deleting a consistent suffix. An external signed anchor, append-only retention and encrypted backups remain necessary for stronger audit guarantees. Hashed user identifiers are pseudonyms, not anonymization. The journal stores no raw prompt or provider secret.

The fixed operation uses one turn, zero tool calls, zero retries and zero estimated inference spend. Its post-operation deadline check is not a general process-killing sandbox. Future tools need independently enforced cancellation/timeouts and aggregate budgets before registration. Production-grade multi-tenant memory, LLM chat, worker dispatch and approval consumption remain pending.

## Verification and rollback

`npm run verify` includes persistence in a separate process, competing-process idempotency, lifecycle/recovery, ownership, journal changes, HTTP identity/origin/input gates, routing costs and demo-label regressions. HTTP tests use injected test identities; they do not verify a live Clerk account. Production-server smoke tests cover disabled console/runtime and unconfigured payment/cron boundaries.

To stop new work, set execution mode to `halted` or disable runtime and restart the local service. Preserve the data directory. Before an eventual upgrade, stop the writer and make an encrypted backup; never copy only the main SQLite file while WAL writes are active. Restore tests and migration tooling are required before an operational rollout beyond this first adapter.
