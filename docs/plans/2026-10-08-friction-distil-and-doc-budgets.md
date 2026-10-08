# Friction distillation, pattern pass, and doc budgets

Date: 2026-10-08.
Status: draft — pending human review.
Origin: a review of the template's entropy-control layer. The `/harness-review` ritual (v0.4.0) sweeps open friction and prunes docs, but nothing ever *consolidates*: closed entries stay in `friction.md` forever, repeated themes are fixed one entry at a time, and the only mechanical detector is one grep over open entries. The kit's own log is the evidence — three releases after the ritual shipped (0.4.1, 0.5.0, 0.5.1), no review pass has run, four entries sit open, and one of them already names its own confirmation run without being closed.

## What is missing

- **No compaction.** The friction protocol is append-only and the sweep only edits `Outcome`. A closed entry costs reading forever while staying invisible to the open-count trigger.
- **No distil step.** A closed entry's learning should land in a rule (`AGENTS.md`, a gate, a `HARNESS.md` row, a plan) and the entry should shrink to one line. The ritual has no branch for "closed and encoded elsewhere".
- **No pattern pass.** Three of the kit's seven entries share one theme (kit changes not reaching already-onboarded repos). Nothing asks the reviewer to group entries; a repeated theme never becomes one stated invariant.
- **Detectors are thinner than the pillar claims.** `HARNESS.md` says stale routing entries are detectable; no recipe exists. No budget on friction-log length, feature-doc count or size, or plan count — the only budget anywhere is the 60-line cap in the feature template, and nothing checks it.
- **`docs/plans/` grows by design with no index.** Decision records stay forever (correct), but nothing marks a record as superseded, so the folder becomes unnavigable.

## Decision

Extend the review workflow and the friction protocol; add portable text checks; dogfood them in the kit.

1. **Friction protocol:** entries stay append-only while live. A closed entry is *archived* by `/harness-review` — collapsed to one line in an `## Archive` section at the top of `friction.md` — once its learning is linked from a rule, or once one review cycle has passed since it closed. Git history keeps the full text. Live entries follow the archive, newest at the bottom, as before.
2. **Review workflow gains two steps between sweep and prune:**
   - *Pattern pass* — group all entries (live and archived) by theme; a theme with two or more entries becomes a proposed convention, gate, or pillar thickening, recorded as the newest entry's `Change`.
   - *Distil and archive* — for each closed entry, name where its learning now lives (or say nowhere and propose the rule), then collapse it to an archive line. Human confirms the archive list like deletions.
3. **Docs prune adds two checks:** feature docs over the 60-line budget are proposed for trimming, and superseded design records get a `Superseded by:` line under their title instead of deletion (decisions stay; navigation improves).
4. **Mechanical recipe grows** from one grep to a portable set: open-entry count, live friction-log length, reading-map links that do not resolve, feature docs over budget, feature docs whose status is `shipped` or `deprecated` (prune candidates). Every check is a text check; all of them detect, none decides.
5. **Budgets (defaults, adjust at onboarding B5):** open entries ≤ 5; live log ≤ ~120 lines; feature doc ≤ 60 lines.
6. **Dogfood:** the kit gains `scripts/harness-check.sh` (the recipe) and `bun run harness-check`, run as part of the kit's own definition of done as a warning step. This is the first mechanical thickening of the kit's own entropy pillar, justified by the observed skipped cadence.

## The mechanical / judgment split (unchanged)

Checks count and list. Archiving, promoting a theme to a rule, trimming a doc, marking a plan superseded, and deleting are judgment — the agent proposes, the human confirms. Nothing auto-archives.

## What does not change

- `init.ts` is untouched; no new template files, so the skeleton test list is unchanged.
- The never-overwrite contract and the hard gates are unchanged.
- Append-only still holds for live entries; archiving only touches entries already closed.

## First pass (same day, dogfood)

The five-step review ran once on the kit's own log: 5 open → 3 open (two closed with evidence from the 2026-08-02 Personal Data Vault onboarding and upgrade), five closed entries archived to one line each, no doc pruned (no feature docs; every plan still records a live decision). The pattern pass found one four-entry theme — kit changes not reaching onboarded repos — and logged a proposal to generalize `init.ts`'s reference-copy allowlist; that is a contract change and waits for a decision record.

## Prediction (close in the friction log)

After two review cycles on a repo running this version: the live friction log stays under budget while the archive grows, at least one archived theme has been promoted to a rule, and the kit's own `harness-check` fails before an entry can rot open across a release.
