# The harness

This repo runs a **harness**: repo patterns that make agent-driven development reliable, installed by [harness-kit](https://github.com/nguyenngocanh94/harness) and adapted at onboarding.
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

## The seven pillars

The harness is assessed along seven pillars. Onboarding co-builds a **thin default layer** for each — the thinnest version that actually works or is honestly stubbed — with the human in the loop. Thickening a pillar later is `/harness-pillar`'s job, escalated only when the friction log shows the thin layer is not enough.

| Pillar | What it is | Thin default layer |
| --- | --- | --- |
| Knowledge in repo | Orientation lives in the repo, not in chat | Filled `CLAUDE.md`, a reading map pointing only at docs that exist, feature docs |
| Mechanical enforcement | Machines, not memory, hold the line | One runnable `verify` chaining the definition of done; heavier CI/rules deferred |
| Runtime legibility | The running system can be observed and reproduced | A short note: where logs go, how to reproduce a bug, what state matters |
| Entropy control | Docs and rules stay lean; cruft is deleted | Friction log + "docs earn their existence, deleted when premature" |
| Merge philosophy | How a change earns its way in | Branch-per-task, evidence carried, DoD stands in until CI exists |
| Human role | Where human judgment is mandatory | Hard gates (generic four + domain gates from the interview) |
| Feedback loop | The harness learns from its own friction | Friction log with prediction → outcome; kit-template friction ports upstream |

A pillar left thin is not a gap to hide — its thin state and the path to thicken it are recorded at onboarding. Thickening is co-built, never auto-generated.

## Installed mechanisms

| Mechanism | Where | Status |
| --- | --- | --- |
| Thin operating manual | `CLAUDE.md` | installed by kit; adapted at onboarding |
| Task→reading map + stop rule | `CLAUDE.md` | TODO(harness): entries filled at onboarding |
| Hard gates | `CLAUDE.md` | generic four installed; domain gates from the onboarding interview |
| Definition of done + self-check | `CLAUDE.md` | TODO(harness): commands wired at onboarding |
| Merge philosophy | `CLAUDE.md` | installed |
| Feature docs (invariants, verify-as-command) | `docs/features/_template.md` | installed |
| Feature-start workflow (intake → gate check → doc → done) | `.claude/commands/feature.md` | installed; optional to use |
| Pillar thickening workflow | `.claude/commands/harness-pillar.md` | installed; run when a thin layer needs to grow |
| Design records | `docs/plans/` | convention installed |
| Friction log (prediction → outcome) | `docs/harness/friction.md` | installed |
| Definition-of-done runner (thin enforcement) | a `verify` entry point | TODO(harness): wired at onboarding (Stage B, pillar 3) |
| Mechanical enforcement (CI, lint, architecture rules) | — | thin layer at onboarding; thicken via `/harness-pillar` |
| Runtime legibility (logs, state dumps, replay) | — | thin note at onboarding; thicken via `/harness-pillar` |

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
