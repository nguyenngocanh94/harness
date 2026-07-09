## What this project is

TODO(harness): 2–4 sentences — what this project does, who consumes it, where its boundaries are.

## Runtime and stack

TODO(harness): the real stack — runtime, language(s), datastores, frameworks, test/lint/build tools. Facts only; every claim verified against the repo.

## Architecture

TODO(harness): pointer to the architecture map or main design doc, if one exists. If the repo has no architecture docs, delete this section — do not invent one; the pillars plan schedules it.

## What to read for a task

TODO(harness): route task types to the docs that actually exist, one line each ("<kind of work> → <doc>"). Never point at docs you wish existed.

Stop reading when you can name the files you will change and the command that proves the change works.

## Workflows

Repeatable procedures live as workflow docs any agent can follow (in Claude Code they are also slash commands):

- Onboard this repo onto the harness → `docs/harness/workflows/onboard.md` (`/harness-onboard`)
- Start a feature → `docs/harness/workflows/feature.md` (`/feature`)
- Thicken one harness pillar → `docs/harness/workflows/pillar.md` (`/harness-pillar`)

## Conventions

- Match existing patterns in the codebase before introducing new ones.
- Anything crossing a boundary — a message, an env var, a request body, stored config — is validated at the edge. Trust nothing unparsed.
- When implementation of a feature starts, create `docs/features/<name>.md` from [`docs/features/_template.md`](./docs/features/_template.md), and update it in the same change that changes the feature.
- Docs record intent and design. Anything a command can answer — test results, proof status, whether it builds — is never written into a doc; run the command instead. High-churn, machine-written state stays out of prose entirely.
- TODO(harness): domain conventions (layering rules, purity rules, naming) — only ones you can point at existing code for.

## Hard gates

Stop and confirm with the human before:

- a schema or data migration that can lose data;
- changing auth, session, or credential behavior;
- weakening validation, lint rules, tests, or the definition of done;
- deleting user data;
- TODO(harness): domain gates — what else is irreversible or externally binding here (filled from the onboarding interview).

Crossing a gate requires a decision record in `docs/plans/`.
Bypassing a gate that should have stopped you is harness friction — log it.

## Commands

TODO(harness): the real commands — install, dev, test, lint, typecheck/build. Every command listed here must have been executed successfully during onboarding.

## Verification (definition of done)

Before claiming any change complete, run and pass, in order:

TODO(harness): the ordered command list — this stack's equivalent of typecheck → lint → test.

If a step is not wired up yet, say so explicitly in your report instead of skipping it silently.

Then answer three questions in your report:

- Did this change make any doc stale? Fix it in the same change.
- Did I hit harness friction? Log it in [`docs/harness/friction.md`](./docs/harness/friction.md).
- What did I not attempt? Say so explicitly.

## How work merges

- One task, one branch, small batches — a change that can be verified end-to-end beats a large one that cannot.
- Every merge carries its evidence: the verification output and the three self-check answers above.
- Until CI exists, the definition of done stands in for it; once CI exists, green is a hard merge requirement.
- Human review concentrates where machines cannot judge: hard-gate territory, design decisions, and the report — not every generated line.
- Throughput comes from small batches, never from skipping checks.

## Working notes

- When the harness itself fails you — a missing rule, a stale doc, wasted reading, a guardrail that should have caught your mistake — append an entry to [`docs/harness/friction.md`](./docs/harness/friction.md) (format inside). Harness changes get a prediction there; close entries with observed outcomes.
- TODO(harness): repo-specific working notes (how to reproduce bugs end-to-end, flakiness policy).
