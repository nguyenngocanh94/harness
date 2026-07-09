# Periodic harness maintenance — the review ritual

Date: 2026-07-09.
Status: accepted; implemented in v0.4.0.
Origin: the harness covers entropy control and the feedback loop at the *principle* level — "docs earn their existence, deleted when premature," and "review open entries at every milestone: entries must not rot open." But there is no ritual and no cadence that makes either actually happen, so in practice friction entries rot open and stale docs accumulate. This adds the missing ritual.

## What was missing

- **No cadence.** "at every milestone" is undefined, so it never fires.
- **No runnable procedure.** There is a rule to review, but no workflow that does the review + cleanup. This violates the kit's own principle that "procedures become scripts as soon as they repeat" — periodic maintenance is the canonical repeating procedure and had no script.
- **Docs cleanup is passive.** "deleted when premature" only fires if someone happens to notice.
- **No friction-accumulation response.** When the log grows or the same friction repeats, nothing prompts a consolidation/escalation.

## Decision

Add a tool-neutral **review workflow** (`docs/harness/workflows/review.md`, wrapper `/harness-review`) that, on a concrete cadence, does two things:

1. **Friction sweep** — for each open entry: close with evidence, mark inconclusive, or act (escalate repeated friction to `/harness-pillar`, a hook, or CI). Report the closed/open ratio — this is the actual instrument for bet #4, which was previously only a vague "measure."
2. **Docs prune** — review `docs/features/*`, `docs/plans/*`, and the reading map; delete docs that no longer earn their existence (features shipped/deprecated, plans superseded, dead reading-map lines). **Deletions are judgment — the human confirms each.** The workflow never auto-deletes.

**Cadence (replaces "milestone"):** run at each release, or when open friction entries exceed ~5, whichever comes first. Onboarding sets this as part of the entropy-control / feedback-loop thin layer.

## The mechanical / judgment split

The trigger is mechanical; the work is judgment. These must not be conflated.

- **Mechanical (safe, portable, may run unattended):** count open friction entries. The open marker is defined by the friction format — `grep -c '^Outcome: open' docs/harness/friction.md`. Compare to the threshold; warn or fail when exceeded. It may also list doc *candidates* for pruning, but never concludes.
- **Judgment (agent + human, never unattended):** closing entries, escalating, and deleting docs. A hook that auto-closes friction or auto-deletes docs is destructive and reverses entropy control — forbidden. **The hook detects and reminds; the agent and human decide and cut.**

## Thickening: wiring it after a merge (opt-in, documented, not installed)

Following the escalation ladder (prompt-level first; mechanical only when friction shows the manual cadence is skipped) and the v0.3.0 portability rule (tool-neutral core, per-tool adapter):

- The review workflow ships as the thin default (prompt-level ritual + cadence).
- The mechanical count is described as a copy-pasteable recipe, not a committed script — the same doctrine as the `verify` runner (wired at onboarding/thickening, stack-appropriate, not shipped as a fixed runtime-dependent file).
- When friction shows the manual cadence is skipped, thicken by wiring the count into **CI on merge to main** (fails/warns and, ideally, opens a reminder) and/or a **per-tool agent hook** (Claude Code / Kiro post-merge) that reminds someone to run `/harness-review`. These are adapters, opt-in, and documented in the workflow — not part of the default skeleton.

## What does not change

- `init.ts` is untouched — the new files are ordinary template files, walked and copied create-if-missing. No contract change.
- The mechanical/judgment split is the same principle the kit already holds ("co-build, never auto-generate"); this only names where it applies to maintenance.

## Also in this change

Fix a v0.3.0 staleness: bet #2 in `HARNESS.md` still read "a thin **CLAUDE.md** does not starve agents"; the canonical manual is now `AGENTS.md`.

## Prediction (close in the friction log)

With the ritual and a concrete cadence in place, open friction entries get closed instead of rotting and stale docs get pruned — measured by: the closed/open ratio stops drifting toward all-open across releases, and no doc for a shipped/deprecated feature survives a review pass.
