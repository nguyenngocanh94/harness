## What harness-kit is

A template + CLI that onboards other repositories onto the harness patterns from the signalv2 experiment.
Two parts: `init.ts` (deterministic skeleton copier) and `template/.claude/commands/harness-onboard.md` (the agent adaptation step that runs inside targets).
Design record: [`docs/plans/2026-07-05-harness-kit-design.md`](./docs/plans/2026-07-05-harness-kit-design.md).

## Conventions

- `init.ts`'s contract is an invariant: create-if-missing, never overwrite, never merge. The only exceptions are the `docs/harness/kit-version` stamp (always rewritten) and `<name>.harness-kit` reference copies (created once beside existing merge-worthy files that differ from the template). Changing this contract requires a decision record in `docs/plans/`.
- `onboard.ts` is bootstrap-only: ensure the cache clone is fresh, then delegate to the cached `init.ts`. It never touches the target itself, and it fails loudly while `DEFAULT_REPO` is the unpublished placeholder.
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
