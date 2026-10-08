# Harness friction log

The harness grows from friction, and this file is the evidence.
Append an entry when the harness itself fails you: a missing rule, a stale or misleading doc, wasted reading, a question the docs should have answered, a mistake a guardrail should have caught.

Protocol:

- One entry per friction event, newest at the bottom; live entries are append-only — edit only the `Outcome` field.
- A closed entry is archived by `/harness-review` once its learning lives in a rule (or one review cycle after it closed): it collapses to one line under `## Archive` below, and the full text lives on in git history. The human confirms the archive list; nothing auto-archives.
- Live log budget: ~120 lines (adjust at onboarding). Crossing it is the signal to run `/harness-review`, not to write shorter friction.
- Keep every field to one line; if it needs more, it is a design discussion, not a log entry.
- `Change` names the harness change made in response — or `none yet` if only recording.
- `Prediction` states the measurable behavior change expected from that change; a change without a prediction is not an experiment.
- `Outcome` starts as `open`; close it (human or agent) when a later session shows the predicted behavior happening or failing — cite what was observed.
- Friction about the product goes to a feature doc or `docs/plans/`; this file is only about the harness.
- `/harness-review` (`docs/harness/workflows/review.md`) closes, archives, and promotes entries on a cadence — entries must not rot open, and closed entries must not rot as prose.
- Two or more entries on one theme are a missing rule, not two events; the review's pattern pass promotes the theme to a convention, gate, hook, or pillar thickening.
- Entries about the harness-kit templates themselves (not this repo's domain) should also be ported back to the kit's own friction log.

Format:

```markdown
## YYYY-MM-DD — short title
Friction: what was hard.
Change: harness change made in response, or "none yet".
Prediction: measurable expected behavior change.
Outcome: open | YYYY-MM-DD — what was observed.
```

Archive line format (one per archived entry, newest at the bottom of the section):

```markdown
- YYYY-MM-DD — short title → where the learning lives now (`AGENTS.md` line, gate, `HARNESS.md` row, `docs/plans/<file>`, test).
```

## Archive

---
