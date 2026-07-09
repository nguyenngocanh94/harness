---
description: Adapt the harness-kit skeleton to this repo — verified facts, domain gates, reading map, then a pillar handoff.
---

You are onboarding this repository onto the harness installed by harness-kit.
The skeleton files already exist; your job is **adaptation**: record what IS true about this repo, and never create what ISN'T.

Rules that govern the whole run:

- **Facts only.** Every command you write into CLAUDE.md must have been executed by you, now, successfully. Every doc you point at must exist. Every stack claim must be verifiable in the repo.
- **Never invent the project's purpose.** What the project *is* is a fact that lives in the human, not something you infer from a filename, a stray dependency, or an empty scaffold. If you cannot establish it from what's actually in the repo, you elicit it (phase 1b) — you do not guess and you do not fill the slot with a plausible-sounding description.
- **Do not create** architecture docs, enforcement configs (CI, linters, dependency rules), or logging/observability — those need human decisions and get handed off in phase 6.
- Work on a branch (`harness-onboard`); one commit at the end, carrying evidence.
- Ask the human one focused question at a time. Two phases talk to the human: phase 1b (purpose, only when it isn't discoverable from the repo) and phase 3 (gates).
- Friction you hit during this onboarding goes into `docs/harness/friction.md` — the onboarding is this repo's first probe.

## Phase 1 — Inventory (read-only)

Detect the stack(s) from manifests (`package.json`, `composer.json`, `go.mod`, `build.gradle`, `Cargo.toml`, `pyproject.toml`, …).
Find the real commands: test, lint, typecheck/build — from manifest scripts, CI configs, Makefiles, and READMEs.
Map which docs exist and what they cover.
Assess whether the repo tells you what it is: does existing source, a README, or manifest metadata make the project's purpose legible? Note the answer — it decides phase 1b.
Stop when you can fill every `TODO(harness)` slot or explicitly know it must stay open.

## Phase 1b — Establish purpose (interview, only if inventory didn't)

If phase 1 could not establish what the project is — an empty or near-empty repo, a bare scaffold, no README, nothing that states intent — then the purpose is not in the repo to be read; it is in the human's head. Do **not** proceed to fill CLAUDE.md from a guess.

Instead, run a short brainstorming interview to draw it out. Socratic, one question at a time, building on each answer — never a form dumped all at once. Cover, in order and only as far as the human can answer:

1. What is this project going to be — the problem it solves and for whom?
2. Who or what consumes it (users, other services, a CLI, a library API)?
3. What are its boundaries — what it deliberately will *not* do?
4. Any stack decisions already made, or still open?

Stop as soon as you can write an honest 2–4 sentence description. Record it as **stated intent**, not verified fact — the code that proves it doesn't exist yet. Stack answers here are *intended* stack: capture them in the pillars plan as decisions to confirm, and leave the CLAUDE.md stack slot open until real manifests back it.

If phase 1 already made the purpose legible from the repo, skip this phase entirely — do not interview a human for something the code already says.

## Phase 2 — Merge and fill CLAUDE.md and HARNESS.md

If `CLAUDE.md.harness-kit` or `HARNESS.md.harness-kit` exist, the repo had its own versions: merge the reference copy's harness sections into the existing file — preserve the repo's own content, do not duplicate overlapping guidance — then delete the `.harness-kit` file.
Fill the `TODO(harness)` slots you have grounding for: what-the-project-is (from the repo, or from phase 1b's stated intent — never a guess), stack, commands. If purpose came from the interview, write it plainly; the reading map and verification below will still be thin because no code backs it yet.
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
