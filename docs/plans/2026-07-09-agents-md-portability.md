# Cross-tool portability — AGENTS.md canonical, CLAUDE.md as a shim

Date: 2026-07-09.
Status: proposed. Knowledge-layer change (Phase 1) is straightforward; the `init.ts` contract change and existing-repo migration cross a hard gate and need explicit clearance before implementing.
Origin: the kit ships `CLAUDE.md` + `.claude/commands/*.md`, which only Claude Code reads. Using the harness with other agent CLIs (Codex, Cursor, Copilot, Gemini CLI, Aider, Zed, …) does not work today. The goal is to make the harness tool-agnostic.

## Finding

`AGENTS.md` is the open cross-tool standard, read natively by Codex, Cursor, Copilot, Gemini CLI, Aider, Windsurf, Zed, Jules, and others. **Claude Code is the exception: it reads `CLAUDE.md` only and ignores `AGENTS.md`.** The established workaround is a thin `CLAUDE.md` whose sole content is an `@AGENTS.md` import — Claude Code expands it and loads AGENTS.md as if inline, so AGENTS.md stays the single source of truth. (Sources tracked in the chat thread that produced this record; landscape as of mid-2026.)

## The two layers, and why each breaks

1. **Knowledge layer — the operating manual.** Today it is `CLAUDE.md`. Non-Claude tools want `AGENTS.md`; Claude wants `CLAUDE.md`. A rename plus a shim fixes this cleanly.
2. **Command layer — the workflows.** `/harness-onboard`, `/feature`, `/harness-pillar` are Claude Code slash commands in `.claude/commands/`. No other tool reads that directory, so the entire co-build onboarding flow is invisible outside Claude Code. This is the larger break and the file rename does nothing for it.

## Decision — Phase 1: knowledge layer

- **`AGENTS.md` becomes the canonical operating manual.** The full manual (what was `template/CLAUDE.md`) moves to `template/AGENTS.md` verbatim, keeping its `TODO(harness)` slots. This alone covers every AGENTS.md-native tool (Codex, Cursor, Copilot, Gemini CLI, Aider, Zed, Windsurf, Jules, …) — that is what "support all by default" means in practice.
- **`CLAUDE.md` is a bridge to `AGENTS.md`, created by `init`, not shipped as a template file.** Claude Code is the only major tool that ignores AGENTS.md, so it gets the bridge:
  - **Primary: a symlink** `CLAUDE.md → AGENTS.md`. One real file, zero drift.
  - **Fallback: a one-line `@AGENTS.md` import shim** written as a plain file when a symlink can't be created (Windows without privileges, `git core.symlinks=false`, filesystems without symlink support). Claude Code expands the import identically.
  - `init` does not ship `template/CLAUDE.md` (the generic file walker would follow a template symlink and `copyFileSync` a duplicated real file). Instead, after ensuring `AGENTS.md` exists, `init` creates the bridge in a dedicated step: try `symlinkSync`, catch and write the shim.
- Adding another tool's bridge later (e.g. `GEMINI.md`) is the same one-step pattern; not built now because those tools already read AGENTS.md.
- Every template cross-reference that says "read CLAUDE.md's reading map / hard gates / definition of done" is repointed to `AGENTS.md` (HARNESS.md, harness-onboard.md, harness-pillar.md, feature.md, _template.md, README, the kit's own CLAUDE.md).
- `init.ts`: `MERGE_REFERENCE_FILES` becomes `{AGENTS.md, HARNESS.md}`. The `CLAUDE.md` bridge is deterministic (create-if-missing; never a reference copy).

## Why a bridge, not pure symlink

A distributed kit runs on any machine, including Windows and via `git clone`. A committed symlink can be checked out as a plain text file (`core.symlinks=false`), and `init`'s `copyFileSync` follows symlinks and copies target content — either failure silently duplicates the manual. The symlink-with-shim-fallback keeps the elegant single-file result where the OS supports it and stays correct everywhere else.

## Decision — Phase 2: command layer (portable workflows)

Follow the community "shared body + thin per-tool adapter" pattern so there is one source of truth per workflow:

- Move each workflow body to a neutral location: `docs/harness/workflows/onboard.md`, `feature.md`, `pillar.md`.
- `AGENTS.md` gains a short **"Workflows"** section listing them ("to onboard, follow docs/harness/workflows/onboard.md", etc.) so any AGENTS.md-reading tool can run them when the user asks.
- `.claude/commands/*.md` shrink to one-line wrappers that execute the corresponding body, preserving the `/harness-onboard`, `/feature`, `/harness-pillar` ergonomics in Claude Code.
- No per-tool adapters beyond Claude for now (Cursor rules, Copilot instructions) — the AGENTS.md "Workflows" pointer covers every AGENTS.md-native tool. Add a specific adapter only when a target tool proves it needs one (friction-driven).

## Migration of already-onboarded repos (the gated part)

An existing repo onboarded with an older kit has a filled `CLAUDE.md` and no `AGENTS.md`. Re-running init must not create a second, empty manual beside the real one. Proposed handling:

- If `CLAUDE.md` exists and `AGENTS.md` does not, init treats it as a **migration case**: it does *not* drop the template manual as `AGENTS.md`, and instead drops `AGENTS.md.harness-kit` as a reference. `/harness-onboard` (gaining a migration branch) moves the repo's `CLAUDE.md` content into `AGENTS.md`, replaces `CLAUDE.md` with the shim, and deletes the reference.
- If neither exists (fresh repo): init creates `AGENTS.md` (canonical) and `CLAUDE.md` (shim) directly.
- If both already exist (repo migrated, or a repo that already uses AGENTS.md): normal create-if-missing / merge-reference behavior on `AGENTS.md`.

This adds a migration-aware branch to `init.ts`, which is why it crosses the never-overwrite contract's hard gate and needs a decision record (this one) plus explicit human clearance.

## What does not change

- `init.ts`'s create-if-missing, never-overwrite spine. The migration branch adds a case; it does not overwrite anything.
- Tool-agnostic artifacts already portable: `HARNESS.md`, the friction log, feature docs, design records — plain markdown, read by any tool.
- The co-build onboarding model (v0.2.0). This only changes where its manual and workflows live, not what they do.

## Rollout

- Phase 1 (knowledge layer) and Phase 2 (workflows) can ship together as one VERSION bump (→ 0.3.0, since the canonical file name is a breaking change for tooling that hardcodes `CLAUDE.md`).
- Existing repos keep working until re-onboarded: their `CLAUDE.md` is still read by Claude Code; portability to other tools arrives when they migrate.

## Prediction (close in the friction log once implemented)

After this change, onboarding a repo and opening it in a non-Claude tool (Codex or Cursor) surfaces the harness manual and lets the agent run the onboarding/feature workflows — measured by: the manual loads without a Claude-specific file, and at least one workflow runs end-to-end in a second tool.
