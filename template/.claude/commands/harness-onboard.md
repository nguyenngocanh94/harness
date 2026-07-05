---
description: Adapt the harness-kit skeleton to this repo — verified facts, domain gates, reading map, then a pillar handoff.
---

You are onboarding this repository onto the harness installed by harness-kit.
The skeleton files already exist; your job is **adaptation**: record what IS true about this repo, and never create what ISN'T.

Rules that govern the whole run:

- **Facts only.** Every command you write into CLAUDE.md must have been executed by you, now, successfully. Every doc you point at must exist. Every stack claim must be verifiable in the repo.
- **Do not create** architecture docs, enforcement configs (CI, linters, dependency rules), or logging/observability — those need human decisions and get handed off in phase 6.
- Work on a branch (`harness-onboard`); one commit at the end, carrying evidence.
- Ask the human one focused question at a time; only phase 3 requires one.
- Friction you hit during this onboarding goes into `docs/harness/friction.md` — the onboarding is this repo's first probe.

## Phase 1 — Inventory (read-only)

Detect the stack(s) from manifests (`package.json`, `composer.json`, `go.mod`, `build.gradle`, `Cargo.toml`, `pyproject.toml`, …).
Find the real commands: test, lint, typecheck/build — from manifest scripts, CI configs, Makefiles, and READMEs.
Map which docs exist and what they cover.
Stop when you can fill every `TODO(harness)` slot or explicitly know it must stay open.

## Phase 2 — Merge and fill CLAUDE.md and HARNESS.md

If `CLAUDE.md.harness-kit` or `HARNESS.md.harness-kit` exist, the repo had its own versions: merge the reference copy's harness sections into the existing file — preserve the repo's own content, do not duplicate overlapping guidance — then delete the `.harness-kit` file.
Fill the `TODO(harness)` slots you have verified facts for: what-the-project-is, stack, commands.
Update HARNESS.md's installed-mechanisms table to reflect reality (installed / adapted / deferred).
Leave a slot open rather than guessing; open slots are listed in the pillars plan.

## Phase 3 — The gates interview

The four generic hard gates are pre-filled.
Ask the human one question: *"What else is irreversible, externally binding, or dangerous in this domain — things an agent must stop and confirm before touching?"*
Write their answer as concrete gate lines; replace the TODO.

## Phase 4 — Reading map from reality

Fill "What to read for a task" with routes to docs that actually exist, one line per task kind.
A repo with thin docs gets a short, honest map.
Never fabricate a doc to give the map something to point at — missing docs are a pillars-plan item.

## Phase 5 — Definition of done, verified

Run each candidate command (typecheck/build, lint, test).
Write into the Verification section only the ones that pass; broken or missing steps are recorded in the pillars plan, and the Verification section says explicitly which steps are not wired yet.

## Phase 6 — Pillar handoff (do not skip)

Write `docs/plans/<today>-harness-pillars-plan.md`:

1. A seven-pillar assessment table — knowledge in repo, mechanical enforcement, runtime legibility, entropy control, merge philosophy, human role, feedback loop — with what the kit + this onboarding wired vs what remains.
2. For each open pillar, a **ready-to-paste prompt for a fresh session**, context included. Use these shapes:
   - Mechanical enforcement: "Read CLAUDE.md, HARNESS.md, and docs/plans/<today>-harness-pillars-plan.md. Brainstorm mechanical enforcement for this repo: CI running the definition of done, <stack-appropriate architecture/lint rules>, and permission deny-rules for destructive commands. Confirm each with me before wiring anything."
   - Runtime legibility: "Read CLAUDE.md and docs/plans/<today>-harness-pillars-plan.md. Brainstorm what runtime state must be observable in this system — structured logs, state dumps, deterministic reproduction — write the legibility contract into the docs, then plan implementation."
   - Missing architecture docs, entropy control, or other gaps: same shape, scoped to the gap.
3. Stack-appropriate enforcement suggestions for the prompt above: TS/JS → Biome + dependency-cruiser; PHP → PHPStan + Deptrac; Go → golangci-lint + depguard; Kotlin → detekt + Konsist; Rust → clippy + cargo-deny; Python → ruff + import-linter. Suggestions only — nothing is wired during onboarding.

## Phase 7 — Close

Run the definition of done as now written.
Commit the branch with the onboarding changes.
End your report with:

- files created/adapted, and every `TODO(harness)` slot still open;
- the pillar assessment table;
- the teaching block: which pillars are open, one line on **why each was deliberately not attempted here** (enforcement changes CI/deps and needs buy-in; legibility needs product knowledge), and the ready-to-paste fresh-session prompts;
- the three self-check answers: did I make any doc stale; did I hit friction (logged?); what did I not attempt.
