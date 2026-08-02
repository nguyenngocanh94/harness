# Pillar-thickening workflow

You are thickening **one** pillar of the harness. Onboarding built a thin default layer for every pillar; this workflow grows a single one when the thin layer is no longer enough — usually because the friction log or the pillars doc says so.

The seven pillars and their thin-default targets are defined in `HARNESS.md` ("The seven pillars"). The onboarding pillars doc in `docs/plans/*-harness-pillars.md` records what was built thin and how each was meant to thicken.

Principles for this workflow:

- **One pillar per run.** Scope is a single pillar; do not drift into others.
- **Co-build, don't auto-generate.** Thickening changes real infrastructure (CI, dependency rules, logging) — every decision is confirmed with the human, one question at a time.
- **Thicken only what evidence justifies.** Repeated friction is one source. The confirmed risk profile, an incident, an external obligation, or a known high-impact failure mode are equally valid evidence and may make a control prerequisite before friction occurs. If none applies, say so and confirm the human still wants to thicken.
- Work on a branch; one commit at the end, carrying evidence.

## Step 1 — Pick the pillar and read its current state

If a pillar was named, use it; otherwise ask which one. Read that pillar's row in HARNESS.md, its credible-when criterion, the risk profile, and its entry in the onboarding pillars doc: what thin layer exists today and what "thicker" was meant to mean. Confirm your understanding with the human before proposing anything.

## Step 2 — Gate check

Thickening frequently crosses hard gates: CI and dependency rules change how work merges; touching auth/observability may expose credentials or user data. Read `AGENTS.md`'s Hard gates. If this thickening crosses one, **stop and confirm**, and write a decision record in `docs/plans/` before building.

## Step 3 — Decide what to build, with the human

Discuss the concrete target, one question at a time. Shape the conversation to the pillar:

- **Mechanical enforcement:** CI that runs the definition of done on every change; stack-appropriate architecture/lint rules — TS/JS → Biome + dependency-cruiser; PHP → PHPStan + Deptrac; Go → golangci-lint + depguard; Kotlin → detekt + Konsist; Rust → clippy + cargo-deny; Python → ruff + import-linter — and permission deny-rules for destructive commands. Confirm each before wiring it.
- **Runtime legibility:** which runtime state must be observable — structured logs, state dumps, deterministic reproduction. Write the legibility contract into the docs first, then plan implementation.
- **Knowledge in repo:** the missing architecture doc or a reading-map that has outgrown one line per task; write the doc that reality now justifies.
- **Any other pillar:** name the specific gap the thin layer no longer covers, and the smallest thing that closes it.

## Step 4 — Build

Implement the confirmed target following the repo's Conventions. Keep to one branch, small batches. Add the enforcement/observability as real, running configuration — not a description of one.

## Step 5 — Verify and record

- Run the definition of done (`verify`) plus whatever the new layer adds (the CI config runs locally, the new rule fires on a violation, the logs appear). Include real output.
- Update HARNESS.md's installed-mechanisms table: the pillar moves from "thin" to its new state.
- Update the onboarding pillars doc: mark the pillar thickened, with a link to what was built.
- Log a friction entry with a **prediction** for what this thickening should change (e.g. "gate bypasses now caught by CI, not memory"); it closes later with observed outcome.
- End your report with the three self-check answers: any doc made stale (fixed?); friction logged?; what you did not attempt.
