# Local Operator

`/operator` is the first NEO-CORTEX surface intended for daily use. It is a local-first task handoff system, not a claim of unrestricted desktop automation.

## What it does

1. Accepts one structured task selected from `inventory`, `verification`, or `source_review`.
2. Requires an explicit short objective, declared workspace, and 1–30 minute ceiling.
3. Writes one private JSON work packet in `NEO_CORTEX_DATA_DIR/openclicky-outbox/` and records a hash-chained SQLite receipt in `operator.sqlite`; subsequent integrity checks detect tested packet or receipt changes.
4. Generates a bounded worker instruction that can be reviewed and handed to OpenClicky.
5. Rejects duplicate submissions through an actor-scoped idempotency key.

The initial categories are deliberately read-only. They prohibit credential access, account sign-ins, installations, model/provider changes, network changes, publishing, messages, money movement, deployment, Git push, and source edits.

## What it does not do

- It does not call a model, spend money, run a shell command, launch OpenClicky, or make OpenClicky execute the packet.
- It does not make OpenClicky a second supervisor.
- It does not grant access to Keychain, browser cookies, social accounts, personal memory, or arbitrary paths.
- It does not make a local app accessible from another device. Multi-device access remains a later private-network and identity step.

The visible OpenClicky handoff is intentional. The installed OpenClicky application's actual protocol, local API, URI scheme, skills, and model setup have not been verified. A direct adapter must not be guessed or fabricated.

## Enable it locally

Use a private data directory and bind the app to localhost. In `.env.local`:

```dotenv
NEO_CORTEX_EXECUTION_MODE=safe
NEO_CORTEX_RUNTIME_ENABLED=false
NEO_CORTEX_OPERATOR_ENABLED=true
NEO_CORTEX_DATA_DIR="/Users/YOUR-MAC-USER/Library/Application Support/NEO-CORTEX/data"
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

Keep all provider keys, social credentials, Stripe configuration, and GitHub tokens unset for this first release.

Then run:

```bash
npm run build
npm start -- -H 127.0.0.1
```

Open `http://127.0.0.1:3000/operator`. A `READY · ready` banner means task staging is available. `DISABLED` means the feature flag, local URL, private data directory, or execution mode needs attention.

## First useful loop

1. Leave the default **Repository verification** task selected.
2. Review its workspace and objective, then select **Stage safe worker packet**.
3. Inspect the generated policy and receipt. Staging alone has no execution effect.
4. If you decide to run it, copy the bounded packet into an OpenClicky Agent request.
5. OpenClicky returns its evidence; NEO-CORTEX later gains direct verification only after actual host access is connected.

This implements the first half of the required loop now: **inspect → plan → create bounded work packet → visible handoff → later independent verification**. It does not skip the verification or approval boundary.

## Local security boundary

The API is enabled only when all conditions are true:

- `NEO_CORTEX_OPERATOR_ENABLED=true`;
- a private, owner-owned, absolute persistent data directory exists;
- `NEXT_PUBLIC_APP_URL` is `localhost`, `127.0.0.1`, or `[::1]`;
- request origin exactly matches that local URL; and
- the execution kill switch is not `halted`.

When Clerk is configured, administrator authentication is additionally required. This bootstrap mode must not be exposed with Tailscale Serve, Funnel, LAN binding, port forwarding, or a production hostname before its authentication model is upgraded.
