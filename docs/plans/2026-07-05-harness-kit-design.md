# harness-kit — design record

Date: 2026-07-05.
Status: validated in a brainstorming session; v0.1.0 implements it.
Origin: signalv2's HARNESS.md recorded "an installer amortizes when the harness gains a second repo" as a revisit trigger; the trigger fired.

## The core split — the judgment line

Onboarding divides into what must be identical everywhere and what must be adapted per repo:

- **Deterministic (init.ts):** copy the skeleton, never overwrite, stamp `docs/harness/kit-version`, report, point at the next step.
- **Judgment (/harness-onboard, an agent inside the target):** verified facts into CLAUDE.md, domain gates via a one-question human interview, a reading map pointing only at docs that exist, and a pillar handoff.

Rejected alternatives: a pure file-copier (template arrives dead — placeholder gates and unwired commands rot, per the repository-harness observation) and a pure agent installer (non-deterministic, unversionable, slow for the mechanical 80%).

## Onboarding records what is; it never creates what isn't

Mechanical enforcement and runtime legibility cannot be created autonomously at onboard time — they need stack decisions, dependency changes, product knowledge, and human buy-in.
The onboard command therefore ends with a **pillar handoff**: a seven-pillar assessment written to `docs/plans/`, plus a ready-to-paste fresh-session brainstorming prompt per open pillar.
The final report teaches the human the pillar model and why each gap was deliberately left.

## Conflict handling

- Any existing file is skipped, always.
- For merge-worthy files (CLAUDE.md, HARNESS.md) that exist **and differ from the template**, init drops a one-time `<name>.harness-kit` reference copy; /harness-onboard merges it and deletes it.
- The differs-from-template guard exists because re-runs would otherwise drop pointless references beside files the kit itself created (found by the test suite during implementation).

## The experiment travels

Every target is born a lab: HARNESS.md arrives with the four generic bets seeded, the friction log arrives with the prediction→outcome protocol, and the onboarding run itself is the repo's first probe.
Return path: friction entries about kit templates (not repo domain) get ported to this repo's friction log; template changes bump VERSION; re-running init propagates additions.

## Honest maturity

The patterns come from a live experiment whose bets are still open.
The kit distributes the lab, not a proven doctrine — the README says so.
