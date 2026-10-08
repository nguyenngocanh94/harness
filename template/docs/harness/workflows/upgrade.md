# Harness upgrade workflow

You are bringing this repo up to the kit version that `init` just installed. `init` never overwrites: files it could not create were left alone, and beside every one that differs from the kit's current template it dropped a `<name>.harness-kit` reference copy. This workflow walks those references, merges what the kit changed, and deletes each reference. Run it whenever `init` reported any `ref` line, before onboarding or feature work continues.

Start by reading what changed: `docs/harness/kit-version` holds the version now installed; `init`'s report named the previous one. The kit's `CHANGELOG.md` (in the kit repo) lists every template change between the two — read that span first so you merge intent, not just text.

Principles: never discard repo-specific content; a reference is the kit's *current* file, not a diff, so compare against the changelog to find what actually moved; confirm with the human whenever a change alters how existing entries, gates, or commands are read.

## Walk every `*.harness-kit`

```sh
find . -name '*.harness-kit' -not -path './node_modules/*'
```

For each, by kind:

- **`AGENTS.md`, `HARNESS.md`** — merge the kit's changed harness sections into the existing file; keep the repo's own content; do not duplicate overlapping guidance.
- **`docs/harness/workflows/*.md`** — the published tool-neutral workflow changed. Merge it into the existing body, preserving deliberate repo-specific guidance. Never leave it unreviewed: every per-tool wrapper dispatches to this body, so an old body silently keeps old behavior.
- **`.claude/commands/*.md`, `.agents/skills/*/SKILL.md`** — kit-owned dispatch shims (Claude Code commands, Codex skills). Replace the file's content with the reference. If the repo added anything to the wrapper, move it to the workflow body or `AGENTS.md` (confirm with the human), not the shim. An old-kit wrapper carrying an inlined workflow must not survive.
- **`docs/harness/friction.md`, `docs/harness/risk-profile.md`, `docs/features/_template.md`, `docs/harness/legibility.md`, `docs/harness/merge-evidence.md`** — protocol or template changes. Merge the *structure* (new sections, new fields, new budgets); never touch *content* (every friction entry, every risk row, every answer stays).
- **Migration from a CLAUDE.md-only repo** (`AGENTS.md.harness-kit` exists and `AGENTS.md` does not): move the repo's `CLAUDE.md` manual into `AGENTS.md` using the reference's structure, replace `CLAUDE.md` with the one-line bridge `@AGENTS.md`, delete the reference.

Delete each reference once merged. `find` must come back empty before you finish.

## Close

- Run `verify`. Include its output.
- If a workflow or protocol changed how the team works (new review steps, new budgets, new gates), say so in one line each in your report, so the human can tell the team.
- Three self-check answers: doc made stale (fixed?); friction logged? (kit-template friction ports upstream to the kit's log); what you did not merge and why.
