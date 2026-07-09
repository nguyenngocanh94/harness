# harness-kit

Onboard any repository onto an agent-development harness: the repo patterns proven (and still being proven) in the signalv2 experiment — thin operating manual, hard gates, reading map, feature docs, friction log with prediction→outcome discipline, definition of done, merge philosophy.

The kit splits onboarding along the judgment line:

- **`init.ts` (deterministic)** copies the skeleton — never overwrites, stamps a version, and tells you the one next step.
- **`/harness-onboard` (agent, judgment)** is a working session, not a form-fill: it discusses the repo's basics with you (purpose, stack, architecture), then walks all seven pillars and **co-builds a thin default layer** for each — verified commands, domain gates, a reading map pointing only at docs that exist, and a runnable definition of done. Thickening a pillar later is `/harness-pillar`'s job. Onboarding is slow on purpose.

## Install & onboard — one command

Requirements on any machine: `bun` and `git`. Then, from anywhere:

```bash
curl -fsSL https://raw.githubusercontent.com/nguyenngocanh94/harness/main/onboard.ts | bun - /path/to/target-repo
```

The first run clones the kit into `~/.cache/harness-kit`; later runs fast-forward it, so every machine installs the latest kit automatically (offline falls back to the cached copy). When it finishes, open the target repo in Claude Code and run `/harness-onboard` — the skeleton is installed, the adaptation happens there.

Convenience alias for your dotfiles:

```bash
alias onboard='curl -fsSL https://raw.githubusercontent.com/nguyenngocanh94/harness/main/onboard.ts | bun -'
# then, inside any repo:
onboard .
```

Equivalent from a local clone:

```bash
git clone https://github.com/nguyenngocanh94/harness.git
bun harness/onboard.ts /path/to/target-repo
```

Overrides: `--repo=<git-url>` or `HARNESS_KIT_REPO` (fork/mirror), `--ref=<branch>`, `HARNESS_KIT_CACHE` (cache location), `--force` (onboard a non-git directory).

`init.ts` remains the underlying installer — `onboard.ts` is bootstrap-only and never touches the target itself.

## What lands in a target

| File | Role |
| --- | --- |
| `CLAUDE.md` | operating manual scaffold — generic core verbatim, `TODO(harness)` slots for judgment |
| `HARNESS.md` | the experiment map: principles, mechanism inventory, seeded bets, probe protocol |
| `docs/harness/friction.md` | the learning loop — protocol header, zero entries |
| `docs/features/_template.md` | per-feature doc template (invariants, verify-as-command) |
| `.claude/commands/harness-onboard.md` | the onboarding session — discuss the basics, co-build a thin layer per pillar |
| `.claude/commands/feature.md` | optional feature-start workflow (intake → gate check → doc → done) |
| `.claude/commands/harness-pillar.md` | thicken one pillar past its thin layer, co-built with the human |
| `docs/harness/kit-version` | stamp for update tracking (the only file init ever rewrites) |

If `CLAUDE.md` or `HARNESS.md` already exist, init leaves them untouched and drops a `<name>.harness-kit` reference copy next to them; `/harness-onboard` merges and deletes it.

## Updating an onboarded repo

Re-run `init.ts` — it copies files added by newer kit versions, refreshes the stamp, and touches nothing else. Template changes always bump `VERSION`.

## The feedback loop

Every onboarded repo keeps its own friction log. Entries about the kit's templates (not the repo's domain) get ported back to this repo's `docs/harness/friction.md` with the usual prediction→outcome discipline. Learnings flow: repos → kit → all future onboardings.

## Maturity — honest note

The patterns come from a live experiment (signalv2) whose bets are **still open** — hub-and-spoke routing, thin-manual sufficiency, prompt-level gates, and prediction honesty are being measured, not proven. Each onboarding is itself a probe; expect to feed friction back.
