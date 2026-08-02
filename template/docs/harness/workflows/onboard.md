# Onboarding workflow

You are onboarding this repository onto the harness installed by harness-kit.
The skeleton files already exist. Onboarding is **not** a form-fill and it is **not** fast — it is a working session with the human that (A) establishes what this repo is, then (B) walks each of the seven pillars and **co-builds a thin default layer** for it. You build *with* the human, one decision at a time; you do not hand off a pile of prompts and stop.

The pillar model and the thin-default target for each pillar are defined in `HARNESS.md` ("The seven pillars"). Read it first.

Rules that govern the whole run:

- **Never invent product facts.** What the project *is* — its purpose and behavior — lives in the human or in the code, never in a guess. If the repo does not tell you, you ask (Stage A). You never fill a slot with a plausible-sounding description.
- **Co-build the harness, don't defer it.** Every pillar gets a thin layer built *now*, with the human confirming each decision. "Needs human buy-in" is not a reason to defer — it is the reason to build it together in this session. Only thickening beyond thin (full CI, architecture rules, observability infra) is deferred, and it goes to the pillar-thickening workflow, not a paste-prompt.
- **Facts only in what you write.** Every command you record must have been executed by you, now, successfully. Every doc you point at must exist. Every stack claim must be verifiable.
- **Thin is risk-adjusted.** Build the thinnest version that works for this repo's exposure. Do not scaffold CI, heavy lint rules, or logging infrastructure unprompted, but do not defer a control that the confirmed risk profile makes a prerequisite. Route prerequisite implementation through `docs/harness/workflows/pillar.md` before feature breadth.
- **Onboarding has a scope ceiling.** By default this workflow installs and adapts the harness plus the minimum runnable repository foundation; it does not begin product-feature implementation. Before creating feature-specific domain code, schemas, endpoints, UI flows, or MCP tools, the human must explicitly confirm that the current run includes the first feature. Otherwise stop after the closing evidence and route later feature work through `docs/harness/workflows/feature.md`.
- Ask one focused question at a time, building on each answer — never dump a form. Stage A and the gates/legibility steps are conversations.
- Work on a branch (`harness-onboard`); one commit at the end, carrying evidence.
- Friction you hit belongs in `docs/harness/friction.md` — this onboarding is the repo's first probe.

---

## Stage A — Establish the basics (with the human)

Goal: agree on the things the whole harness hangs off before building anything: purpose, stack, architecture, and risk posture. Do not proceed to Stage B until they are written and the human has agreed to them.

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

  Record the result as **stated intent**, not verified fact — the code that proves it doesn't exist yet. Intended-stack answers go to the pillars notes as decisions to confirm; the AGENTS.md stack slot stays open until real manifests back it.

Stop Stage A when you can write an honest purpose, the stack (or "intended, unconfirmed"), and an architecture pointer (or "none yet"). Name anything still unknown; do not guess it.

Record the scope ceiling for this run: `harness only`, `harness + runnable foundation`, or `harness + explicitly named first feature`. The third option requires the human to name and confirm that feature; a broad request to “build the project” does not silently authorize feature breadth during onboarding.

### A3 — Agree on risk posture and non-negotiable baselines

Read `docs/harness/risk-profile.md`. Classify the repo through a conversation, one exposure at a time; do not infer risk from the repo name alone:

1. Does it hold personal, financial, health, identity, credential, regulated, confidential, or otherwise sensitive data?
2. Is it multi-user or multi-tenant, and can one identity reach another identity's state?
3. Can it move money, send external messages, publish, delete, execute code, change permissions, or create another irreversible/external effect?
4. Which uptime, audit, retention, deletion, geographic, contractual, or compliance obligations already exist?
5. What is the credible blast radius of a mistake today — local/reversible, shared/internal, or external/high-impact?

Record evidence, unknowns, and the agreed posture:

- **baseline** — local/reversible impact; prompt-level gates may be an honest thin start;
- **elevated** — sensitive data, tenant boundaries, credentials, external effects, or material operational impact; relevant controls become prerequisites;
- **critical** — safety-critical, regulated high-consequence, money movement, privileged execution, or similarly severe impact; specialist review and explicit assurance requirements are prerequisites.

The labels guide the conversation; they are not compliance certification. For every applicable exposure, name a non-negotiable baseline, its evidence, and whether it exists now. If an elevated/critical prerequisite is missing, add it to the pillars plan and block feature breadth until it is built or the human explicitly changes the risk decision in a design record.

---

## Stage B — Walk each pillar and co-build its thin default layer

Go through the pillars in order. For each: **explain what it is → discuss what this repo needs → build the thinnest working version → verify → record.** The human confirms every decision; nothing is wired silently. Fill the matching `TODO(harness)` slots as you go.

**Merge existing manuals.** If `AGENTS.md.harness-kit` or `HARNESS.md.harness-kit` exist, the repo had its own versions: merge the reference copy's harness sections into the existing file — preserve the repo's own content, don't duplicate overlapping guidance — then delete the `.harness-kit` file.

**Merge updated workflow bodies.** If `docs/harness/workflows/<name>.md.harness-kit` exists, the published tool-neutral workflow changed since this repo adapted its copy. Review and merge the reference into the existing workflow, preserving deliberate repo-specific guidance, then delete the reference. Never leave the reference unreviewed: command wrappers dispatch to the existing workflow body, so an old body silently keeps old behavior.

**Migrate an old CLAUDE.md-only repo.** If this repo was onboarded by an older kit it has a filled `CLAUDE.md` and no `AGENTS.md` (init left `AGENTS.md.harness-kit` beside it). Move the repo's `CLAUDE.md` content into `AGENTS.md` (merging the template structure from `AGENTS.md.harness-kit`), then replace `CLAUDE.md` with a one-line bridge whose sole content is `@AGENTS.md`, and delete `AGENTS.md.harness-kit`. AGENTS.md is now the single source of truth; the bridge keeps Claude Code working.

**Replace stale command wrappers.** If any `.claude/commands/<name>.md.harness-kit` exists, the repo's command file differs from the current kit's wrapper. Command wrappers are kit-owned dispatch shims: their only job is to point at the matching `docs/harness/workflows/` body. An old-kit command file carries an entire obsolete workflow inline and must not survive — it silently shadows the current workflow doc. Replace the command file's content with the reference copy's, confirm with the human before discarding anything they deliberately added to the wrapper (repo-specific additions belong in the workflow doc or AGENTS.md, not the shim), then delete the `.harness-kit` file.

### B1 — Knowledge in repo (spend the most time here)

The richest pillar; everything else routes through it.

- **Operating manual** — fill AGENTS.md's what-it-is (from Stage A), stack, and commands (each executed successfully, now). Conventions must point at code that exists, not aspirations.
- **Reading map + stop rule** — fill "What to read for a task" with one line per task kind, routing only to docs that **actually exist**. A thin-doc repo gets a short, honest map. Never fabricate a doc to point at; a missing doc is a pillars note, and (for an existing project) an architecture note goes here or is recorded as an open item.
- **Feature docs** — confirm the human understands when the feature workflow spawns `docs/features/<name>.md`: when a feature has an invariant to preserve, touches more than one area, or needs its own verify command.

Update HARNESS.md's installed-mechanisms table to reflect reality. Leave a slot open rather than guessing.

### B2 — Human role / hard gates (spend the most time here)

A gate is a promise about what an agent must not touch alone. The four generic gates ship pre-filled (data-losing migration, auth/session/credential change, weakening validation/tests/DoD, deleting user data).

Discuss domain gates as a **conversation, not a single question**. Walk the human through the categories, one at a time: what here is irreversible, externally binding, money-moving, destructive, or compliance-bound? Turn each answer into a concrete gate line phrased as a stop-and-confirm trigger the agent can recognize. Replace the TODO with those lines.
Confirm the escalation rule: crossing a gate needs a decision record in `docs/plans/`; bypassing one that should have stopped you is friction to log.

Cross-check every gate against `docs/harness/risk-profile.md`: every non-negotiable baseline must be owned either by a mechanical check, a human gate with a named decision owner, or an explicit prerequisite plan. “We will remember” is not ownership.

### B3 — Mechanical enforcement (thin: the verify runner)

The one genuinely new build. Wire the definition-of-done commands into **one runnable `verify` entry point** (a package script, Makefile target, or shell script — whatever fits the stack) that runs typecheck → lint → test in order. Run it; it must pass. "Done" is now a command, not a paragraph — record it in AGENTS.md's Verification section.
If a step isn't wired in this repo, say so explicitly and leave it out of `verify` rather than faking it; note the gap for the pillar-thickening workflow.
Do **not** create CI pipelines or dependency/architecture rules here unless the confirmed risk profile makes them prerequisites — otherwise those are thickening. When you note the gap, record the stack-appropriate suggestion for later: TS/JS → Biome + dependency-cruiser; PHP → PHPStan + Deptrac; Go → golangci-lint + depguard; Kotlin → detekt + Konsist; Rust → clippy + cargo-deny; Python → ruff + import-linter.

### B4 — Runtime legibility (thin: a note, not infra)

Co-write a short legibility note with the human: where logs go, how to reproduce a bug end-to-end, what runtime state matters. Docs, not tooling — the thinnest honest version. Greenfield: a stub listing the open questions. Observability infrastructure is pillar-thickening work.

### B5 — Entropy control (mostly agree, little to build)

Confirm the team accepts the seeded rules: the append-only friction protocol and "docs must earn their existence, deleted when premature." Adjust wording only if their reality differs.
Set the review cadence: the `/harness-review` ritual (friction sweep + docs prune) runs at each release, or when open friction entries exceed ~5 — whichever comes first. Agree on which trigger fits this team.

### B6 — Merge philosophy (confirm it matches reality)

The merge section ships in AGENTS.md prose. Confirm it matches how the team actually merges (branch-per-task, evidence carried, DoD stands in for CI until CI exists). Adapt wording to their reality; do not impose a process they will not follow.

### B7 — Feedback loop (confirm understanding)

Confirm the human understands: friction entries close with observed outcomes, harness changes carry a prediction, and friction about the kit's own templates ports back upstream. The four generic bets in HARNESS.md are seeded. Open entries do not rot — the `/harness-review` ritual (cadence set in B5) closes or escalates them.

---

## Closing

1. Run `verify` (the definition of done as now wired). Include its real output.
2. Write `docs/plans/<today>-harness-pillars.md`: a seven-pillar table with **what thin layer was built**, **why it satisfies the credible-when criterion**, and **how to thicken it**. List risk-profile prerequisites separately from optional thickening; unresolved prerequisites block feature breadth.
3. Commit the `harness-onboard` branch with all onboarding changes.
4. End your report with:
   - files created/adapted, and every `TODO(harness)` slot still open;
   - the seven-pillar table (thin layer built + path to thicken);
   - the three self-check answers: did I make any doc stale (fixed?); did I hit friction (logged?); what did I not attempt (say so).

If the recorded scope ceiling is `harness only` or `harness + runnable foundation`, stop here. Do not continue into product-feature code in the same run.
