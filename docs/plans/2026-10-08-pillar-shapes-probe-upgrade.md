# Every pillar gets a shape: examples, skeletons, probe, upgrade

Date: 2026-10-08.
Status: accepted; implemented in v0.7.0.
Origin: a review scored the template 7.5/10 as a guide for any project. Four pillars had the full recipe — *why, the shape of the result, a minimal example, a done criterion* — and three had only the first and last: mechanical enforcement ("wire a `verify`"), runtime legibility ("write a short note"), merge philosophy ("every merge carries evidence"). The feedback loop had bets with no instrument: "How to run a probe" had never been run anywhere. The upgrade path — the theme behind four friction entries — lived as five paragraphs inside a 2300-word onboarding. And the template had no test of its own consistency, although two staleness bugs had already shipped (bet #2 wording in 0.4.0, Change/Outcome contradiction in 0.6.0).

## Decision

Stack-neutral does not mean example-free. Each thin pillar gets the shape of its result as a file the user can hold, without `init.ts` growing any mechanism:

| Gap | Added | Kind |
| --- | --- | --- |
| Mechanical enforcement has no shape | `docs/harness/examples/verify.md` — `verify` per stack, a warning hook, a minimal CI job | example (delete or keep) |
| Legibility has no skeleton | `docs/harness/legibility.md` — logs, state, reproduction steps, one walked-through failure, secrets; `TODO(harness)` slots | skeleton (filled at B4) |
| Evidence has no place | `docs/harness/merge-evidence.md` — the block every merge carries, per-forge adapters | source + adapter |
| Bets have no instrument | workflow `probe` (`/harness-probe`) — fresh uncoached session, observe, dated `probe — bet #N` entry; two probes close a bet | workflow |
| Upgrade path buried in onboarding | workflow `upgrade` (`/harness-upgrade`) — walk every `*.harness-kit` by kind; onboarding opens with "References first" | workflow |
| References are whole files, not diffs | kit `CHANGELOG.md` — one entry per template change; upgrade reads the span between the two stamped versions | kit doc + convention |
| Template cannot catch its own staleness | `template.test.ts` — every mentioned path exists, every workflow has a wrapper and an `AGENTS.md` line, wrappers only dispatch, mechanism table resolves, VERSION/package/CHANGELOG agree, protocol fields match | kit test |

## What this is not

- Not a stack-specific install: the examples are copy-and-adapt text, the same doctrine as the review recipe. `init.ts` is untouched; the new files are ordinary template files, create-if-missing, referenced on change like every other.
- Not a thickening by default: the hook and CI blocks are labelled "for later"; onboarding B3 still wires only `verify`.
- Not a shorter onboarding by cutting substance: the upgrade paragraphs (~400 words, only relevant on re-init) moved to their own workflow, and B3/B4/B6/B7 gained ~200 words of pointers to the new files — net 2301 → 2118 words.

## Prediction (close in the friction log)

On the next greenfield onboarding, B3, B4, and B6 each produce a filled artefact (a passing `verify`, a `legibility.md` with a walked-through failure, a wired evidence block) within the same session; the first `/harness-probe` runs before that repo's second release; and no template-path or version staleness reaches a tagged kit version again, because `template.test.ts` fails first.
