# Harness friction log (harness-kit's own)

The kit dogfoods its patterns; this is its own log.
Entries here are about the kit's harness and its templates — including entries ported back from onboarded repos when their friction concerns the kit rather than their domain.
Protocol and format: identical to `template/docs/harness/friction.md`.

---

## 2026-07-05 — re-run dropped reference copies beside kit-created files
Friction: after a first run created HARNESS.md, the second run treated it as "existing" and dropped a pointless HARNESS.md.harness-kit reference identical to the template.
Change: reference copies are only created when the existing file differs from the template (nothing to merge otherwise).
Prediction: re-runs on already-onboarded repos create zero reference files unless the human actually adapted a merge-worthy file.
Outcome: 2026-07-05 — covered by the test suite (idempotency + reference tests pass); confirmed in the dry run.

## 2026-07-07 — onboarding an empty repo hallucinated the project's purpose
Friction: `/harness-onboard` on an empty repo filled the "what this project is" slot with invented data — no branch existed for a purpose that isn't discoverable from the repo.
Change: added phase 1b (a Socratic purpose interview run only when inventory can't establish purpose) and a whole-run rule forbidding invented purpose; recorded in `docs/plans/2026-07-07-greenfield-purpose-interview.md`; VERSION → 0.1.2.
Prediction: onboarding an empty/near-empty repo now interviews the human for purpose instead of guessing, and skips the interview when the repo already states what it is.
Outcome: open — confirm on the next real greenfield onboarding.
