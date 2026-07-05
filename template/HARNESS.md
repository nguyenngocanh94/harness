# The harness

This repo runs a **harness**: repo patterns that make agent-driven development reliable, installed by [harness-kit](https://github.com/TODO/harness-kit) and adapted at onboarding.
This document is the harness's map: what we believe, what is installed, and what bets are running.
Operational rules live in [`CLAUDE.md`](./CLAUDE.md) and are linked, never restated, here.
Kit version: see `docs/harness/kit-version`; update by re-running the kit's `init.ts`.

## Principles under test

- Knowledge lives in the repo, not in chat history; a decision that survives only in a conversation is lost.
- Docs record intent and design; state is derived by running commands, never stored in prose.
- Agents follow commands more reliably than prose — procedures become scripts as soon as they repeat.
- Rules start prompt-level and cheap; a rule escalates to mechanical enforcement only when the friction log shows it being bypassed.
- Docs must earn their existence: written when there is code or a decision to record, deleted when premature.
- Context is routed, not maximized: a thin always-loaded core, a reading map to one relevant doc, and an explicit stop rule.
- Every harness change is an experiment: it carries a prediction when made and gets closed with an observed outcome.

## Installed mechanisms

| Mechanism | Where | Status |
| --- | --- | --- |
| Thin operating manual | `CLAUDE.md` | installed by kit; adapted at onboarding |
| Task→reading map + stop rule | `CLAUDE.md` | TODO(harness): entries filled at onboarding |
| Hard gates | `CLAUDE.md` | generic four installed; domain gates from the onboarding interview |
| Definition of done + self-check | `CLAUDE.md` | TODO(harness): commands wired at onboarding |
| Merge philosophy | `CLAUDE.md` | installed |
| Feature docs (invariants, verify-as-command) | `docs/features/_template.md` | installed |
| Design records | `docs/plans/` | convention installed |
| Friction log (prediction → outcome) | `docs/harness/friction.md` | installed |
| Mechanical enforcement (CI, lint, architecture rules) | — | deferred → see the pillars plan in `docs/plans/` |
| Runtime legibility (logs, state dumps, replay) | — | deferred → see the pillars plan in `docs/plans/` |

## Open bets

Each bet names its measurement; evidence accumulates in the friction log and closes there.

1. **Hub-and-spoke routing works** — an agent given a scoped task loads only the relevant doc, not the whole tree.
   Measure: docs read during scoped probe tasks.
2. **A thin CLAUDE.md does not starve agents** — orientation comes from the pointer structure, not a fat always-loaded file.
   Measure: orientation questions agents ask that the docs should have answered.
3. **Prompt-level gates hold** — agents stop at hard gates without mechanical enforcement.
   Measure: gate bypasses recorded as friction (target: zero; any bypass escalates that gate to a hook or CI rule).
4. **Prediction→outcome keeps harness edits honest** — changes carrying predictions get evaluated instead of accumulating on faith.
   Measure: ratio of closed to open friction entries at each milestone.

## How to run a probe

1. Start a fresh agent session with a scoped, realistic task.
2. Do not coach it; let the docs do the work.
3. Observe: which docs it loaded, whether it stopped reading per the stop rule, whether gates and the self-check fired, what it asked that it should not have needed to ask.
4. Append findings to the friction log; close any bet the evidence answers.

## Changing the harness

Harness changes follow the same rules as product changes: update the affected doc in the same change, log the prediction in the friction log, and let the merge philosophy carry the evidence.
Weakening validation or the definition of done is a hard gate.
