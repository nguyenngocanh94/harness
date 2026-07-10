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
Note: 2026-07-10 — the `order_service` greenfield onboarding ran on a stale 0.1.1 cache (see the 2026-07-10 entry), so it exercised the pre-fix workflow and neither confirms nor refutes this. Its CLAUDE.md stayed honest (slots left open), but gates were inferred from the repo name alone. The 0.4.0 re-onboarding of the same repo is the confirmation run.

## 2026-07-10 — onboard.ts cache silently pinned users to kit 0.1.1
Friction: a real onboarding (`binanceSmartWatch/order_service`) ran against kit 0.1.1 while the published repo was at 0.4.0. The cache's `git pull --ff-only --depth 1` cannot fast-forward once the shallow cache and the remote history disconnect, and the failure was swallowed as a one-line "offline?" note — so every run kept installing the old skeleton and the old (pre-interview, pre-co-build) onboarding workflow without anyone noticing.
Change: `ensureKit` now updates by `fetch --depth 1` + `reset --hard FETCH_HEAD` (the cache is disposable, so hard reset is always safe), and a failed update warns loudly, naming the cached kit version and the cache path. Covered by two tests (diverged-history recovery, loud stale fallback).
Prediction: a cache in any state converges to the published head on the next run; the only way to onboard with a stale kit is a genuinely unreachable remote, and that now prints a WARNING naming the stale version instead of an aside.
Outcome: open — confirm on the next onboarding from a machine with an old cache.

## 2026-07-10 — stale command wrappers survive migration and shadow the new workflow
Friction: re-running init 0.4.0 on a repo onboarded by kit 0.1.1 (`order_service`) correctly skipped `.claude/commands/harness-onboard.md` (never-overwrite), but that file is the *old workflow inlined*, not a thin wrapper — so `/harness-onboard` in the migrated repo would still run the pre-interview, pre-co-build workflow even though `docs/harness/workflows/onboard.md` (new) now exists beside it. The migration path moves the manual (CLAUDE.md → AGENTS.md) but says nothing about kit-owned command bodies.
Change: init now drops a one-time `<name>.harness-kit` reference copy beside any `.claude/commands/*.md` that differs from the template (same mechanism as the AGENTS.md migration — never overwrites), and the onboarding workflow's Stage B gains a "Replace stale command wrappers" step that swaps the old inline body for the current thin wrapper with the human confirming what, if anything, was a deliberate local edit. Overwriting wrappers in init was rejected (would weaken the never-overwrite contract and clobber customizations). Decision record: `docs/plans/2026-07-10-stale-command-wrappers.md`; VERSION → 0.4.1. For `order_service` the wrapper was replaced by hand during its 0.4.0 re-onboarding.
Prediction: re-running init on a repo with stale wrappers drops a `.harness-kit` reference beside each one, and the next onboarding/migration run replaces them — after that, a migrated repo's slash commands always dispatch to the current workflow docs.
Outcome: open — confirm on the next old-kit repo migration (the wrapper reference should appear at init and be gone, replaced by the thin wrapper, after onboarding).
