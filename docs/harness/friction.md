# Harness friction log (harness-kit's own)

The kit dogfoods its patterns; this is its own log.
Entries here are about the kit's harness and its templates — including entries ported back from onboarded repos when their friction concerns the kit rather than their domain.
Protocol and format: identical to `template/docs/harness/friction.md`.

## Archive

- 2026-07-05 — re-run dropped reference copies beside kit-created files → `init.ts` creates a reference only when the existing file differs; idempotency + reference tests in `init.test.ts`.
- 2026-07-07 — onboarding an empty repo hallucinated the project's purpose → onboard workflow phase 1b (purpose interview) and the whole-run rule against invented purpose; `docs/plans/2026-07-07-greenfield-purpose-interview.md`. Closed 2026-10-08: the 2026-08-02 Personal Data Vault greenfield onboarding ran post-fix and took purpose from the human instead of inventing it (it overreached in scope, logged separately).
- 2026-07-10 — onboard.ts cache silently pinned users to kit 0.1.1 → `ensureKit` fetch + hard reset, loud stale warning; diverged-history and stale-fallback tests in `onboard.test.ts`. Closed 2026-10-08: the 2026-08-02 Personal Data Vault upgrade 0.4.1 → 0.5.0 converged to the published head on the next run.
- 2026-08-02 — thin-first guidance did not distinguish low-impact and high-impact repositories → `docs/harness/risk-profile.md`, risk posture in onboarding, credible-when column per pillar; `docs/plans/2026-08-02-risk-aware-onboarding.md`.
- 2026-08-02 — changed workflow templates did not reach existing repositories → `wantsReferenceCopy` covers `docs/harness/workflows/`; regression test in `init.test.ts`.

---

## 2026-07-10 — stale command wrappers survive migration and shadow the new workflow
Friction: re-running init 0.4.0 on a repo onboarded by kit 0.1.1 (`order_service`) correctly skipped `.claude/commands/harness-onboard.md` (never-overwrite), but that file is the *old workflow inlined*, not a thin wrapper — so `/harness-onboard` in the migrated repo would still run the pre-interview, pre-co-build workflow even though `docs/harness/workflows/onboard.md` (new) now exists beside it. The migration path moves the manual (CLAUDE.md → AGENTS.md) but says nothing about kit-owned command bodies.
Change: init now drops a one-time `<name>.harness-kit` reference copy beside any `.claude/commands/*.md` that differs from the template (same mechanism as the AGENTS.md migration — never overwrites), and the onboarding workflow's Stage B gains a "Replace stale command wrappers" step that swaps the old inline body for the current thin wrapper with the human confirming what, if anything, was a deliberate local edit. Overwriting wrappers in init was rejected (would weaken the never-overwrite contract and clobber customizations). Decision record: `docs/plans/2026-07-10-stale-command-wrappers.md`; VERSION → 0.4.1. For `order_service` the wrapper was replaced by hand during its 0.4.0 re-onboarding.
Prediction: re-running init on a repo with stale wrappers drops a `.harness-kit` reference beside each one, and the next onboarding/migration run replaces them — after that, a migrated repo's slash commands always dispatch to the current workflow docs.
Outcome: open — confirm on the next old-kit repo migration (the wrapper reference should appear at init and be gone, replaced by the thin wrapper, after onboarding). Reviewed 2026-10-08: no old-kit migration has happened since; still live.

## 2026-08-02 — onboarding crossed into product features without an explicit scope ceiling
Friction: a broad request to build a new Personal Data Vault with the boilerplate was interpreted as permission to implement the first account/import/analytics vertical slice. The human intended only harness application and a basic modular foundation. The workflow did not force a separate decision between repository onboarding and product-feature implementation.
Change: onboarding now records a scope ceiling and defaults to foundation at most. Feature-specific domain code, schemas, endpoints, UI flows, and MCP tools require an explicitly named and confirmed feature, then follow the feature workflow. Decision record: `docs/plans/2026-08-02-onboarding-scope-ceiling.md`; VERSION → 0.5.1.
Prediction: greenfield onboarding stops with a reviewable harness/foundation unless the human separately names the first feature, reducing premature code and premature feature docs.
Outcome: open — validate on the next greenfield onboarding. Reviewed 2026-10-08: no greenfield onboarding since; still live.

## 2026-10-08 — review ritual existed on paper but never ran on the kit; closed friction and docs only accumulate
Friction: three releases after `/harness-review` shipped (0.4.1, 0.5.0, 0.5.1) no review pass ran on the kit itself; four entries sat open, one already naming its own confirmation run. Reviewing the template showed why the ritual could not keep the log lean even if it ran: closed entries are never archived, repeated themes (three entries on "kit changes not reaching onboarded repos") are fixed one at a time, and the only detector is one grep over open entries.
Change: review workflow gains a pattern pass and a distil/archive step; friction protocol gains an `## Archive` section and a live-log budget; docs prune gains trim and `Superseded by:`; the mechanical recipe grows to five portable checks; the kit dogfoods it as `bun run harness-check` in its own definition of done. Decision record: `docs/plans/2026-10-08-friction-distil-and-doc-budgets.md`; VERSION → 0.6.0. First review pass run the same day: 5 open → 3 open, 2 closed with evidence, 5 archived.
Prediction: `harness-check` fails on the kit before an entry can rot open across a release; after two review cycles on an onboarded repo the live log stays under budget, the archive grows, and at least one theme has been promoted to a rule.
Outcome: closed 2026-10-08 — two releases later (0.6.1, 0.7.0) the live log held at 45 lines and `harness-check` sat at 5/5 open; when the 0.8.0 release tried to log a sixth entry the check failed and forced this sweep before the log could grow. The onboarded-repo half of the prediction (two review cycles under budget) has not been observed yet — carried in the open 0.7.0 pillar-shapes entry.

## 2026-10-08 — friction protocol change will not reach onboarded repos (fourth recurrence of a theme)
Friction: the pattern pass found one theme with four entries — cache pin (07-10), stale wrappers (07-10), workflow bodies (08-02), and now this release: `docs/harness/friction.md` gains an Archive section and budgets, but `wantsReferenceCopy` in `init.ts` is an allowlist (manuals, command wrappers, workflow bodies) that excludes it, `risk-profile.md`, and `docs/features/_template.md`. Every time a new kind of template file changes, the same gap reopens.
Change: accepted 2026-10-08 — the allowlist is gone; every template file that exists in the target and differs gets a one-time `.harness-kit` reference (no exclusion list: nothing earned one). Onboarding gains a "Merge other updated template files" step. Contract line in the kit's CLAUDE.md updated. Decision record: `docs/plans/2026-10-08-reference-copies-for-all-template-files.md`; VERSION → 0.6.1.
Prediction: once generalized, a kit release can change any template file and the next `init` on every onboarded repo makes it visible as a reference; this theme stops producing new entries.
Outcome: open — close when the 0.6.0 friction-protocol change reaches an onboarded repo as `docs/harness/friction.md.harness-kit` on its next init.

## 2026-10-08 — three pillars had a principle and a done-criterion but no shape to copy
Friction: as a guide for any project, mechanical enforcement, runtime legibility, and merge philosophy told the user *why* and *when done* but not what the result looks like — no `verify` shape per stack, no legibility skeleton, no place to paste merge evidence. The bets in HARNESS.md had no instrument (no probe has ever run), the upgrade path sat as five paragraphs inside onboarding, and two template staleness bugs had shipped with nothing to catch them.
Change: `docs/harness/examples/verify.md`, `docs/harness/legibility.md`, `docs/harness/merge-evidence.md`; workflows `probe` and `upgrade` with wrappers; kit `CHANGELOG.md` read by upgrade; `template.test.ts` self-consistency suite. Decision record: `docs/plans/2026-10-08-pillar-shapes-probe-upgrade.md`; VERSION → 0.7.0.
Prediction: next greenfield onboarding fills B3/B4/B6 artefacts in-session; first probe runs before that repo's second release; `template.test.ts` fails before any path or version staleness reaches a tagged version.
Outcome: open — close on the next greenfield onboarding and the first kit release after it.

## 2026-10-08 — Codex users get the manual but no workflow entry point
Friction: the 0.3.0 portability record claimed Codex support via `AGENTS.md`, and the manual does load there — but a user opening an onboarded repo in Codex found no `/harness-onboard`. Only `.claude/commands/` shipped a wrapper; Codex ignores that directory, and its custom-prompt mechanism was removed in v0.117.0 in favour of repo-level skills. `HARNESS.md`'s mechanism table even pointed the workflows at `.claude/commands/` paths, so the one tool-neutral fact (the body lives in `docs/harness/workflows/`) was hidden behind a Claude-only path.
Change: six `.agents/skills/<name>/SKILL.md` shims (`$harness-onboard`, …) mirroring the Claude commands one-to-one; `AGENTS.md` names both entry points and tells other tools to read the body; `HARNESS.md` rows point at the bodies; upgrade workflow treats skills as replace-not-merge shims; `template.test.ts` enforces identical shim name sets. Addendum in `docs/plans/2026-07-09-agents-md-portability.md`; VERSION → 0.8.0.
Prediction: the next onboarded repo opened in Codex runs `$harness-onboard` end-to-end with no extra instruction, which also closes the 2026-07-09 portability prediction; no further "tool X has no command" entry appears without a matching shim directory already in the template.
Outcome: open — close on the first Codex-driven onboarding or upgrade in an onboarded repo.
