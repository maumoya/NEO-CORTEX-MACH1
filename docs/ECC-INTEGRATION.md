# ECC integration profile

NEO uses a curated ECC environment, not an unreviewed global install.

Upstream: [affaan-m/ECC](https://github.com/affaan-m/ECC), formerly `everything-claude-code`; creator copyright: Affaan Mustafa. Reviewed snapshot: `8321021c54d670126ce3b2969d5deb880b4b0c2a`. License: MIT, retained in `third-party/ECC-LICENSE`.

Selected sources: `skills/verification-loop/SKILL.md`, `skills/iterative-retrieval/SKILL.md`, `skills/strategic-compact/SKILL.md`. Project adaptations live under `.claude/skills/ecc-*`; provenance and digests are recorded in `config/ecc-profile.json`. These are manually reviewed instruction files. This is not an audit of every ECC executable.

Adaptations replace upstream secret-printing grep examples with NEO's redacted scanner, preserve command exit codes, use this repository's actual test command, omit unsupported coverage claims and avoid installing compaction hooks. Retrieval retains targeted refinement and phase-based compaction. We import no GateGuard script, installer, plugin manifest, MCP configuration or automatic hook. Existing global host hooks have not been inspected, so this profile cannot claim to disable them.

`CLAUDE.md` routes relevant work to the selected skills. Other supervisor environments can explicitly read the same files. No paid Claude account, binary installation or provider switch is implied. ECC is workflow guidance; NEO retains identity, permissions, budgets and execution authority.

For expansion: pin a candidate commit, inspect its license/files/dependencies, run static and behavioral checks in isolation, compare against NEO's verification suite, and promote only the selected module. The GateGuard issue in the supplied watch notes is tracked as evidence at [issue 3024](https://github.com/affaan-m/ECC/issues/3024), not treated as proof that our current pinned snapshot has been dynamically tested.
