# Harness friction log

The harness grows from friction, and this file is the evidence.
Append an entry when the harness itself fails you: a missing rule, a stale or misleading doc, wasted reading, a question the docs should have answered, a mistake a guardrail should have caught.

Protocol:

- One entry per friction event, newest at the bottom; entries are append-only.
- Keep every field to one line; if it needs more, it is a design discussion, not a log entry.
- `Change` names the harness change made in response — or `none yet` if only recording.
- `Prediction` states the measurable behavior change expected from that change; a change without a prediction is not an experiment.
- `Outcome` starts as `open`; close it (human or agent) when a later session shows the predicted behavior happening or failing — cite what was observed.
- Friction about the product goes to a feature doc or `docs/plans/`; this file is only about the harness.
- Review open entries at every milestone: close with evidence or mark inconclusive — entries must not rot open.
- Entries about the harness-kit templates themselves (not this repo's domain) should also be ported back to the kit's own friction log.

Format:

```markdown
## YYYY-MM-DD — short title
Friction: what was hard.
Change: harness change made in response, or "none yet".
Prediction: measurable expected behavior change.
Outcome: open | YYYY-MM-DD — what was observed.
```

---
