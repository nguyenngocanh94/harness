---
description: Onboard this repo onto the harness — discuss the basics with the human, then co-build a thin default layer for every pillar. Slow by design.
---

You are onboarding this repository onto the harness installed by harness-kit.
The skeleton files already exist. Onboarding is **not** a form-fill and it is **not** fast — it is a working session with the human that (A) establishes what this repo is, then (B) walks each of the seven pillars and **co-builds a thin default layer** for it. You build *with* the human, one decision at a time; you do not hand off a pile of prompts and stop.

The pillar model and the thin-default target for each pillar are defined in [`HARNESS.md`](../../HARNESS.md) ("The seven pillars"). Read it first.

Rules that govern the whole run:

- **Never invent product facts.** What the project *is* — its purpose and behavior — lives in the human or in the code, never in a guess. If the repo does not tell you, you ask (Stage A). You never fill a slot with a plausible-sounding description.
- **Co-build the harness, don't defer it.** Every pillar gets a thin layer built *now*, with the human confirming each decision. "Needs human buy-in" is not a reason to defer — it is the reason to build it together in this session. Only thickening beyond thin (full CI, architecture rules, observability infra) is deferred, and it goes to `/harness-pillar`, not a paste-prompt.
- **Facts only in what you write.** Every command you record must have been executed by you, now, successfully. Every doc you point at must exist. Every stack claim must be verifiable.
- **Thin means thin.** Build the thinnest version that works or is honestly stubbed. Do not scaffold CI, heavy lint rules, or logging infrastructure unprompted — those are `/harness-pillar` territory.
- Ask one focused question at a time, building on each answer — never dump a form. Stage A and the gates/legibility steps are conversations.
- Work on a branch (`harness-onboard`); one commit at the end, carrying evidence.
- Friction you hit belongs in `docs/harness/friction.md` — this onboarding is the repo's first probe.

---

## Stage A — Establish the basics (with the human)

Goal: agree on the three things the whole harness hangs off, before building anything. Do not proceed to Stage B until purpose, stack, and (for an existing project) architecture are written and the human has agreed to them.

### A1 — Inventory (read-only)

Detect the stack(s) from manifests (`package.json`, `composer.json`, `go.mod`, `build.gradle`, `Cargo.toml`, `pyproject.toml`, …).
Find the real commands: test, lint, typecheck/build — from manifest scripts, CI configs, Makefiles, READMEs.
Map which docs exist and what they cover, and sketch the architecture if the source has a discoverable shape.
Assess the key question: **does the repo tell you what it is?** Existing source, a README, or manifest metadata may make the purpose legible; an empty or bare-scaffold repo will not. This decides A2.

### A2 — Agree on purpose, stack, architecture

- **Existing repo (purpose legible):** present what you found — a 2–4 sentence purpose, the stack, and an architecture sketch — and ask the human to **confirm or correct** it. Your discovery is a proposal, not a verdict; what the human confirms is what gets written.
- **Greenfield / bare repo (purpose not legible):** the purpose is in the human's head, not the repo. Run a short Socratic interview, one question at a time, only as far as the human can answer:
  1. What is this project going to be — the problem it solves and for whom? (Not deep features; they don't exist yet.)
  2. Who or what consumes it (users, another service, a CLI, a library API)?
  3. What are its boundaries — what it deliberately will *not* do?
  4. Any stack decisions already made, or still open?

  Record the result as **stated intent**, not verified fact — the code that proves it doesn't exist yet. Intended-stack answers go to the pillars notes as decisions to confirm; the CLAUDE.md stack slot stays open until real manifests back it.

Stop Stage A when you can write an honest purpose, the stack (or "intended, unconfirmed"), and an architecture pointer (or "none yet"). Name anything still unknown; do not guess it.

---

## Stage B — Walk each pillar and co-build its thin default layer

Go through the pillars in order. For each: **explain what it is → discuss what this repo needs → build the thinnest working version → verify → record.** The human confirms every decision; nothing is wired silently. Fill the matching `TODO(harness)` slots as you go.

If `CLAUDE.md.harness-kit` or `HARNESS.md.harness-kit` exist, the repo had its own versions: merge the reference copy's harness sections into the existing file — preserve the repo's own content, don't duplicate overlapping guidance — then delete the `.harness-kit` file. Do this as you touch each file below.

### B1 — Knowledge in repo (spend the most time here)

The richest pillar; everything else routes through it.

- **Operating manual** — fill CLAUDE.md's what-it-is (from Stage A), stack, and commands (each executed successfully, now). Conventions must point at code that exists, not aspirations.
- **Reading map + stop rule** — fill "What to read for a task" with one line per task kind, routing only to docs that **actually exist**. A thin-doc repo gets a short, honest map. Never fabricate a doc to point at; a missing doc is a pillars note, and (for an existing project) an architecture note goes here or is recorded as an open item.
- **Feature docs** — confirm the human understands when `/feature` spawns `docs/features/<name>.md`: when a feature has an invariant to preserve, touches more than one area, or needs its own verify command.

Update HARNESS.md's installed-mechanisms table to reflect reality. Leave a slot open rather than guessing.

### B2 — Human role / hard gates (spend the most time here)

A gate is a promise about what an agent must not touch alone. The four generic gates ship pre-filled (data-losing migration, auth/session/credential change, weakening validation/tests/DoD, deleting user data).

Discuss domain gates as a **conversation, not a single question**. Walk the human through the categories, one at a time: what here is irreversible, externally binding, money-moving, destructive, or compliance-bound? Turn each answer into a concrete gate line phrased as a stop-and-confirm trigger the agent can recognize. Replace the TODO with those lines.
Confirm the escalation rule: crossing a gate needs a decision record in `docs/plans/`; bypassing one that should have stopped you is friction to log.

### B3 — Mechanical enforcement (thin: the verify runner)

The one genuinely new build. Wire the definition-of-done commands into **one runnable `verify` entry point** (a package script, Makefile target, or shell script — whatever fits the stack) that runs typecheck → lint → test in order. Run it; it must pass. "Done" is now a command, not a paragraph — record it in CLAUDE.md's Verification section.
If a step isn't wired in this repo, say so explicitly and leave it out of `verify` rather than faking it; note the gap for `/harness-pillar`.
Do **not** create CI pipelines or dependency/architecture rules here — those are thickening. When you note the gap, record the stack-appropriate suggestion for later: TS/JS → Biome + dependency-cruiser; PHP → PHPStan + Deptrac; Go → golangci-lint + depguard; Kotlin → detekt + Konsist; Rust → clippy + cargo-deny; Python → ruff + import-linter.

### B4 — Runtime legibility (thin: a note, not infra)

Co-write a short legibility note with the human: where logs go, how to reproduce a bug end-to-end, what runtime state matters. Docs, not tooling — the thinnest honest version. Greenfield: a stub listing the open questions. Observability infrastructure is `/harness-pillar` work.

### B5 — Entropy control (mostly agree, little to build)

Confirm the team accepts the seeded rules: the append-only friction protocol and "docs must earn their existence, deleted when premature." Adjust wording only if their reality differs.

### B6 — Merge philosophy (confirm it matches reality)

The merge section ships in CLAUDE.md prose. Confirm it matches how the team actually merges (branch-per-task, evidence carried, DoD stands in for CI until CI exists). Adapt wording to their reality; do not impose a process they will not follow.

### B7 — Feedback loop (confirm understanding)

Confirm the human understands: friction entries close with observed outcomes, harness changes carry a prediction, and friction about the kit's own templates ports back upstream. The four generic bets in HARNESS.md are seeded.

---

## Closing

1. Run `verify` (the definition of done as now wired). Include its real output.
2. Write `docs/plans/<today>-harness-pillars.md`: a seven-pillar table with **what thin layer was built** for each and **how to thicken it** (the `/harness-pillar` prompt or the deferred CI/observability suggestion). This replaces the old paste-prompt handoff — prompts survive only for genuinely-not-yet-buildable thickening.
3. Commit the `harness-onboard` branch with all onboarding changes.
4. End your report with:
   - files created/adapted, and every `TODO(harness)` slot still open;
   - the seven-pillar table (thin layer built + path to thicken);
   - the three self-check answers: did I make any doc stale (fixed?); did I hit friction (logged?); what did I not attempt (say so).
