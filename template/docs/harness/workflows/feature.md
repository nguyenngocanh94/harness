# Feature-start workflow

You are helping start a feature on a repo that runs the harness-kit harness.
This workflow is **optional** and **generic**: it prescribes no development methodology of its own — it reads *this repo's* adapted `AGENTS.md` and threads its existing rules (reading map, hard gates, definition of done, merge philosophy) into one path. Whether a feature earns a doc is a hard rule, not a vibe — see Step 4.

If the user gave a short feature description, treat it as the opening request.

## Step 1 — Understand what the human wants (the intake)

If a feature description was given, restate it in one sentence and confirm you have it right. Otherwise ask what they want to build.

Then draw out scope with focused questions, **one at a time**, building on each answer — never a form dumped all at once. Ask only as many as you need to fill a feature doc honestly:

1. What does the user see when it works — the observable behavior?
2. What is explicitly **out of scope** for this feature?
3. What existing parts of the system does it touch, or is it net-new?
4. What observably proves it is done (a check, a command, a manual step)?

Stop asking the moment you can name the files you will change and the command that will prove the change works — that is the `AGENTS.md` stop rule. Do not invent answers to fill gaps; unknowns become "Open items" in the feature doc.

## Step 2 — Orient in the repo

Read `AGENTS.md`'s "What to read for a task" and load **only** the doc it routes you to. Confirm the entry-point files you'll change and the proof command. Don't read the whole tree.

## Step 3 — Gate check (stop here if it applies)

Read `AGENTS.md`'s "Hard gates". If the feature crosses one — auth/session/credential behavior, a schema or data migration, deleting user data, weakening validation/tests/the definition of done, or a domain gate — **stop and confirm with the human**, and a decision record in `docs/plans/` is required *before* any code.

## Step 4 — Record intent in the right place

**Does this feature need a doc?** Write one when **any** of these holds — otherwise skip straight to Step 5:

- it has an invariant that must survive future changes, or
- it touches more than one area of the system, or
- it needs its own verify command beyond the global definition of done.

If it needs a doc, pick where intent lives:

- **Cross-cutting, gated, or design-heavy** (a real "why this shape" decision with rejected alternatives) → write a design record in `docs/plans/<date>-<name>.md` first, then link it from the feature doc.
- **Otherwise** → create `docs/features/<kebab-name>.md` from `docs/features/_template.md`, filled from Step 1: Scope, What it does, Invariants, How to verify. Leave genuine TBDs under "Open items" so nothing gets invented later.

**Invariants and gate-adjacent statements are human-owned.** Propose them, then have the human confirm each before it is written — an invariant encodes domain truth you must not invent. Unknowns stay in "Open items"; they are not guessed.

**Keep the feature findable.** If you created a feature doc, add or extend one line in `AGENTS.md`'s "What to read for a task" so it routes to the new doc. Knowledge in the repo that the reading map doesn't index is knowledge no future agent will find.

This doc is the deliverable of intake — it exists before implementation, and is updated in the same change that changes the feature.

## Step 5 — Build

Follow the repo's Conventions and whatever development discipline `AGENTS.md` (and the human's global rules) define — this workflow imposes none. Keep to one branch, small batches.

## Step 6 — Verify (definition of done)

Run `AGENTS.md`'s Verification list in order, plus the feature doc's "How to verify". Execute the commands and include their real output — do not paraphrase. If a step isn't wired up in this repo, say so explicitly instead of skipping it silently.

## Step 7 — Merge with evidence

Every merge carries its evidence: the verification output and the three self-check answers from `AGENTS.md` — did this change make any doc stale (fix it here); did I hit harness friction (log it in `docs/harness/friction.md`); what did I not attempt (say so).
