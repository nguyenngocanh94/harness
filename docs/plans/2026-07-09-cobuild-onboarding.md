# Co-build onboarding — discuss the basics, then build a thin default layer per pillar

Date: 2026-07-09.
Status: accepted; implemented in v0.2.0. Decisions below resolve the open questions from the brainstorming session.
Origin: real onboarding sessions stop at diagnosis-and-handoff. `/harness-onboard` phase 6 writes paste-prompts for future fresh sessions and phase 7 ends, so every pillar beyond "knowledge in repo" arrives empty. The intended model is different: onboarding should (a) establish the repo's basics *with* the human by discussion, then (b) walk each pillar and **co-build a thin default layer**, not defer it.

## The problem with the current flow

`harness-onboard.md` today: inventory (phase 1) → optional greenfield purpose interview (1b) → fill CLAUDE.md/HARNESS.md (2) → gates interview (3) → reading map (4) → verify commands (5) → **pillar handoff** (6, writes an assessment plus ready-to-paste prompts for fresh sessions) → close (7).

Two failures observed in practice:

1. **The result is thin to the point of empty.** The repo gets a skeleton with real commands and gates, but mechanical enforcement, runtime legibility, entropy control, and the rest are deferred to prompts the human must remember to run somewhere else, later. Nothing is built. The harness does not actually stand up.
2. **The core rule is read too strictly.** [`2026-07-05-harness-kit-design.md`](./2026-07-05-harness-kit-design.md) says *"onboarding records what is; it never creates what isn't,"* justified by "enforcement and legibility need stack decisions, dependency changes, product knowledge, and human buy-in." But those conditions are exactly what a co-build session provides — the human is in the loop the whole time. The reason for deferral dissolves the moment onboarding becomes a conversation instead of a batch job.

## The decision

Restructure onboarding into two collaborative stages, and amend the boundary: the kit co-builds a **thin default layer** for every pillar *with* the human, instead of handing off prompts. Deferral shrinks to "how to thicken later," it is no longer the default outcome for a whole pillar.

The amended boundary (supersedes the strict reading of the 2026-07-05 record):

- **Product facts are never invented** — purpose, what the system does, its features. These are established by discussion (greenfield) or inventory-then-confirmation (existing repo). Unchanged.
- **The harness's own thin layer IS built during onboarding**, one decision at a time, each confirmed by the human. Human-in-the-loop is the licence the old rule was missing.
- **Thickening stays optional and deferred** — full CI pipelines, heavy architecture/lint rules, observability infrastructure. Onboarding builds the thinnest version that runs; the handoff becomes "here is how to make each layer thicker when you need it," not "here is everything, go build it yourself."

This keeps faith with the existing bets — thin manual (#2), rules start prompt-level and cheap (principle), context routed not maximized — while fixing the gap that onboarding never actually erects the harness.

## Stage A — Establish the basics by discussion (every repo)

Goal: agree on the three things the whole harness hangs off, before building anything. This replaces the current "inventory silently, then fill slots" with "inventory, propose, confirm."

The three basics:

1. **What the repo is about** — the problem and who it is for. Not deep feature detail (a greenfield repo has no features yet); just the core idea, honest about how much is real.
2. **Tech stack** — runtime, languages, datastores, frameworks, test/lint/build tools.
3. **Architecture** — only for an existing project with a discoverable shape; a greenfield repo skips this until code exists.

Source differs by repo maturity, but the *step* is collaborative in both cases:

- **Existing repo:** the agent inventories first (manifests, CI configs, Makefiles, READMEs, source layout), then **presents what it found and asks the human to confirm or correct it** — purpose, stack, and an architecture sketch. Discovery is a proposal, not a verdict. The human's correction is what gets written.
- **Greenfield repo:** no inventory to confirm, so it is a pure Socratic interview (the current phase 1b, promoted to the default path): problem/audience → consumers → boundaries → stack decisions already made or still open. Recorded as *stated intent*, tagged unproven, never as verified fact.

Stage A ends when purpose, stack, and (if applicable) architecture are written and the human has agreed to them. Anything still unknown is named explicitly, not guessed.

## Stage B — Walk each pillar and co-build its thin default layer

Go through the pillars in order, one at a time. For each: **explain what the pillar is → discuss what this repo needs → build the thinnest version that works → verify it → record it.** The human confirms every decision; nothing is wired silently.

"Thin default layer" per pillar — the target output of onboarding:

### 1. Knowledge in repo (detail this step most)

The richest step, because everything else routes through it. Thin default:

- **Operating manual** — CLAUDE.md filled from Stage A: what-it-is, stack, commands (each executed successfully, now), conventions grounded in code the agent can point at.
- **Reading map + stop rule** — "What to read for a task" routes each kind of work to a doc that *actually exists*, one line each, plus the explicit stop rule. A repo with thin docs gets a short, honest map — never a pointer to a doc we wish existed.
- **Architecture note** — for an existing project, a one-paragraph pointer to the real design (or the main entry points if no design doc exists). Greenfield: omitted until there is code; recorded as an open item.
- **Feature-doc convention** — `docs/features/_template.md` is present; confirm the team knows when to spawn one.

Discussion here decides: which task types deserve a reading-map line, which conventions are real vs aspirational, and where the architecture truth lives.

### 2. Human role / hard gates (detail this step most)

The pillar that most needs a human, because a gate is a promise about what an agent must not touch alone. Thin default:

- The four generic gates ship pre-filled (data-losing migration, auth/session/credential change, weakening validation/tests/DoD, deleting user data).
- **Discuss domain gates as a conversation, not a single question.** Walk the human through the categories — what here is irreversible, externally binding, money-moving, destructive, or compliance-bound? Draw out concrete gate lines, one at a time, each phrased as a stop-and-confirm trigger the agent can recognize.
- Confirm the escalation rule: crossing a gate needs a decision record in `docs/plans/`; bypassing one that should have stopped you is friction to log.

Output: a hard-gates list where every domain line came from the human and is specific enough to fire.

### 3. Mechanical enforcement

The biggest change from today (was: fully deferred). Thin default = the cheapest enforcement that *actually runs now*:

- Wire the definition-of-done commands into one runnable entry point (e.g. a `verify` script that runs typecheck → lint → test in order), so "done" is a command, not a paragraph.
- No CI, no dependency-cruiser/architecture rules at onboarding — those stay in the thicken-later handoff, with the stack-appropriate suggestions the current phase 6 already lists (Biome+dependency-cruiser for TS, PHPStan+Deptrac for PHP, etc.).
- If a DoD step is not wired in the repo, say so; the thin layer records the gap instead of faking the step.

### 4. Runtime legibility

Thin default = a short **legibility note** co-written with the human: where logs go, how to reproduce a bug end-to-end, what state matters. It is docs, not infrastructure — the thinnest honest version. Observability tooling is thicken-later. Greenfield: a stub with the open questions.

### 5. Entropy control

Thin default = already mostly seeded (friction log + "docs must earn their existence, deleted when premature"). Confirm the team accepts the delete-when-premature rule and the append-only friction protocol. Little to build; mostly to agree.

### 6. Merge philosophy

Thin default = the merge section ships in CLAUDE.md prose. Confirm it matches how the team actually merges (branch-per-task, evidence-carries, DoD-stands-in-for-CI-until-CI-exists). Adapt wording if their reality differs; do not invent a process they will not follow.

### 7. Feedback loop

Thin default = friction log with the prediction→outcome protocol (seeded) plus the four generic bets in HARNESS.md. Confirm the human understands entries close with observed outcomes, and that kit-template friction ports back upstream.

## Closing (replaces the handoff)

Onboarding ends by reporting, for each pillar: **what thin layer was built, and how to thicken it when needed.** The seven-pillar assessment table stays, but its cells now read "thin layer built: <what>" instead of "deferred → paste this prompt." The ready-to-paste prompts survive only for genuinely-not-yet-buildable thickening (CI, observability infra), not for whole pillars.

Then the usual self-check: any doc made stale (fix now), any friction hit (log it), what was not attempted (say so).

## What this does not change

- `init.ts`'s create-if-missing, never-overwrite contract. This record only reshapes the agent step; the deterministic installer is untouched.
- The facts-only spine for *product* knowledge — purpose and behavior are still established with the human, never invented.
- Thin-first philosophy: we build the thinnest working layer, not a heavy one. This is not a licence to scaffold CI and architecture rules unprompted.

## Resolved decisions

- **D1 — Two commands.** `/harness-onboard` is restructured to co-build the *thin* layer of every pillar during onboarding. A new `/harness-pillar <name>` command owns *thickening* one pillar later (CI, architecture rules, observability), so onboarding stays bounded and continued co-building has a home that isn't a paste-prompt.
- **D2 — The pillar model lives in `HARNESS.md`.** A durable "The seven pillars" section defines each pillar and its thin-default target, so an onboarded repo can look the model up long after onboarding. No new top-level doc — that would fight entropy control.
- **Fa — Invariants are human-owned.** In `/feature`, the agent proposes invariants and anything gate-adjacent, but the human confirms them explicitly before they are written. Invariants encode domain truth the agent must not invent. Reflected in `feature.md` and `docs/features/_template.md`.
- **Fb — Creating a feature keeps the reading map current.** `/feature` requires updating CLAUDE.md's "What to read for a task" to point at the new feature doc, so knowledge that lands in the repo stays findable — closing the "in the repo but not indexed" gap.
- **Fc — A hard threshold decides when a feature needs a doc.** Write `docs/features/<name>.md` when the feature has an invariant to preserve, touches more than one area, or needs its own verify command; skip it otherwise. Replaces "big enough to deserve a doc" judgment with a checkable rule.
- **Template + VERSION impact (hard gate, cleared).** Implementing this rewrites `harness-onboard.md`, adds `harness-pillar.md`, edits `feature.md`/`_template.md`, and adds the pillar section to `HARNESS.md` — a template change that bumps VERSION (→ 0.2.0) and reshapes a mechanism onboarded repos depend on. This record is the required decision record; the human cleared the gate in the session that accepted it.

## The thin enforcement layer, concretely

The one genuinely new build during onboarding (was fully deferred): a single runnable `verify` entry point that chains the definition-of-done commands in order (typecheck → lint → test, stack-appropriate). "Done" becomes a command, not a paragraph. The template ships no script — the stack isn't known until onboarding — so `/harness-onboard` wires it during Stage B pillar 3, and records honestly which steps aren't wired yet. Heavier enforcement (CI, dependency/architecture rules) stays for `/harness-pillar`.

## Prediction (to close in the friction log once implemented)

Onboarding a real repo after this change produces a harness where every pillar has a named thin layer that runs or is honestly stubbed — measured by: zero pillars left as bare paste-prompts, and the definition-of-done runnable as a single command at the end of onboarding.
