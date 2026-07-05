# harness-kit

Onboard any repository onto an agent-development harness: the repo patterns proven (and still being proven) in the signalv2 experiment — thin operating manual, hard gates, reading map, feature docs, friction log with prediction→outcome discipline, definition of done, merge philosophy.

The kit splits onboarding along the judgment line:

- **`init.ts` (deterministic)** copies the skeleton — never overwrites, stamps a version, and tells you the one next step.
- **`/harness-onboard` (agent, judgment)** adapts the skeleton to the repo: verified commands, domain gates via a human interview, a reading map that points only at docs that exist, and a pillar handoff for what onboarding must not invent.

## Usage

```bash
# once
git clone <this repo> ~/Workspace/harness-kit

# per target repo
bun ~/Workspace/harness-kit/init.ts /path/to/target-repo
```

Then open the target repo in Claude Code and run `/harness-onboard`.

## What lands in a target

| File | Role |
| --- | --- |
| `CLAUDE.md` | operating manual scaffold — generic core verbatim, `TODO(harness)` slots for judgment |
| `HARNESS.md` | the experiment map: principles, mechanism inventory, seeded bets, probe protocol |
| `docs/harness/friction.md` | the learning loop — protocol header, zero entries |
| `docs/features/_template.md` | per-feature doc template (invariants, verify-as-command) |
| `.claude/commands/harness-onboard.md` | the adaptation step |
| `docs/harness/kit-version` | stamp for update tracking (the only file init ever rewrites) |

If `CLAUDE.md` or `HARNESS.md` already exist, init leaves them untouched and drops a `<name>.harness-kit` reference copy next to them; `/harness-onboard` merges and deletes it.

## Updating an onboarded repo

Re-run `init.ts` — it copies files added by newer kit versions, refreshes the stamp, and touches nothing else. Template changes always bump `VERSION`.

## The feedback loop

Every onboarded repo keeps its own friction log. Entries about the kit's templates (not the repo's domain) get ported back to this repo's `docs/harness/friction.md` with the usual prediction→outcome discipline. Learnings flow: repos → kit → all future onboardings.

## Maturity — honest note

The patterns come from a live experiment (signalv2) whose bets are **still open** — hub-and-spoke routing, thin-manual sufficiency, prompt-level gates, and prediction honesty are being measured, not proven. Each onboarding is itself a probe; expect to feed friction back.
