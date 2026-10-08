# Changelog — template changes by kit version

Read this when `/harness-upgrade` has references to merge: find the span between the repo's previous `docs/harness/kit-version` and the current one, and merge *these* intents. Every change to `template/` adds an entry here in the same commit (kit convention).

## 0.7.0 — 2026-10-08

- New `docs/harness/legibility.md`: runtime-legibility skeleton (logs, state, reproduction, one walked-through failure). Onboarding B4 fills it.
- New `docs/harness/merge-evidence.md`: the evidence block every merge carries, with per-forge adapters. Onboarding B6 wires the adapter; `AGENTS.md`'s merge section links it.
- New `docs/harness/examples/verify.md`: `verify` shape per stack, a warning hook, a minimal CI job. Onboarding B3 points at it.
- New workflow `probe` (`/harness-probe`): measure one open bet with a fresh uncoached agent; records a dated `probe — bet #N` friction entry. `HARNESS.md` "How to run a probe" now delegates to it.
- New workflow `upgrade` (`/harness-upgrade`): walks `*.harness-kit` references after re-running init. The five merge/migrate/replace paragraphs moved out of onboarding into it; onboarding opens with "References first".
- `AGENTS.md`: two workflow lines; merge section links the evidence block; working notes route runtime questions to `legibility.md`.
- `HARNESS.md`: thin defaults for mechanical enforcement, legibility, merge philosophy, feedback loop name their files; mechanism table gains probe, upgrade, legibility, merge-evidence rows.

## 0.6.1 — 2026-10-08

- `init`: every existing template file that differs now gets a one-time `<name>.harness-kit` reference (allowlist removed). Expect `docs/harness/friction.md.harness-kit` on the first init after this version — merge the Archive section and budgets (0.6.0), keep every entry.
- Onboarding: "Merge other updated template files" step (now part of the upgrade workflow in 0.7.0).
- Friction protocol: later sessions may edit `Change` when acting on an entry, not only `Outcome`.

## 0.6.0 — 2026-10-08

- Review workflow: five steps (sweep → pattern pass → distil/archive → prune → report); prune gains trim and `Superseded by:`; budgets table; five-check mechanical recipe.
- Friction protocol: closed entries archived to one line under a new `## Archive` section; live-log budget ~120 lines.
- Onboarding B5 agrees budgets; `HARNESS.md` entropy and feedback rows updated.

## 0.5.1 — 2026-08-02

- Onboarding records a scope ceiling; feature code needs an explicitly named feature.

## 0.5.0 — 2026-08-02

- New `docs/harness/risk-profile.md`; risk posture conversation (A3) in onboarding; credible-when column per pillar; risk prerequisites in feature and pillar workflows.

## 0.4.1 — 2026-07-10

- `init`: stale `.claude/commands/*.md` wrappers get references; onboarding replaces them with the thin wrapper.

## 0.4.0 — 2026-07-09

- New review workflow (`/harness-review`) with a concrete cadence.

## 0.3.0 — 2026-07-09

- `AGENTS.md` is the canonical manual; `CLAUDE.md` becomes a bridge. Workflow bodies move to `docs/harness/workflows/`; commands become thin wrappers.

## 0.2.0 — 2026-07-09

- Co-build onboarding (Stage A basics, Stage B one thin layer per pillar); `HARNESS.md` gains the seven pillars; new `/harness-pillar`.

## 0.1.3 and earlier — 2026-07-05 … 2026-07-09

- `/feature` workflow; greenfield purpose interview; initial skeleton.
