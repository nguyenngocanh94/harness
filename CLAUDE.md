## What harness-kit is

A template + CLI that onboards other repositories onto the harness patterns from the signalv2 experiment.
Two parts: `init.ts` (deterministic skeleton copier) and the onboarding workflow `template/docs/harness/workflows/onboard.md` (the agent adaptation step that runs inside targets; `template/.claude/commands/*.md` are thin Claude Code wrappers over the workflow bodies).
The canonical operating manual is `AGENTS.md` (read by every AGENTS.md-aware tool); a `CLAUDE.md` bridge points Claude Code at it.
Design records: [`docs/plans/2026-07-05-harness-kit-design.md`](./docs/plans/2026-07-05-harness-kit-design.md) (the split), [`docs/plans/2026-07-09-cobuild-onboarding.md`](./docs/plans/2026-07-09-cobuild-onboarding.md) (co-build model), [`docs/plans/2026-07-09-agents-md-portability.md`](./docs/plans/2026-07-09-agents-md-portability.md) (cross-tool).

## Conventions

- `init.ts`'s contract is an invariant: create-if-missing, never overwrite, never merge. The only writes beyond create-if-missing are: the `docs/harness/kit-version` stamp (always rewritten); `<name>.harness-kit` reference copies (created once beside existing merge-worthy files — `AGENTS.md`, `HARNESS.md` — that differ from the template); and the `CLAUDE.md` bridge to `AGENTS.md` (symlink, or `@AGENTS.md` shim), created only when the target has no `CLAUDE.md`. Changing this contract requires a decision record in `docs/plans/`.
- `onboard.ts` is bootstrap-only: ensure the cache clone is fresh, then delegate to the cached `init.ts`. It never touches the target itself. `DEFAULT_REPO` points at the published repo (github.com/nguyenngocanh94/harness); overrides via `HARNESS_KIT_REPO` or `--repo`.
- Any change to `template/` bumps `VERSION` in the same commit.
- Template text must stay generic: project-specific facts belong in `TODO(harness)` slots, never hardcoded.
- Docs record intent; anything a command can answer is never written into a doc — run the command.

## Hard gates

Stop and confirm with the human before:

- weakening `init.ts`'s never-overwrite contract;
- weakening validation, tests, or the definition of done;
- removing a template mechanism that onboarded repos already depend on.

## Commands

- `bun test` — CLI behavior suite (temp-dir scenarios).
- `bun run typecheck` — `tsc --noEmit`.
- `bun run lint` — Biome.

## Verification (definition of done)

Run and pass, in order: `bun run typecheck`, `bun run lint`, `bun test`.
Then answer in your report: did this change make any doc or template stale (fix in the same change); did I hit harness friction (log in [`docs/harness/friction.md`](./docs/harness/friction.md)); what did I not attempt (say so).

## Working notes

- The kit dogfoods its own patterns; friction with the kit's own harness goes in its friction log.
- Learnings from onboarded repos arrive as ported friction entries — see README "The feedback loop".
