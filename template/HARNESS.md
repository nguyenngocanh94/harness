# The harness

This repo runs a **harness**: repo patterns that make agent-driven development reliable, installed by [harness-kit](https://github.com/nguyenngocanh94/harness) and adapted at onboarding.
This document is the harness's map: what we believe, what is installed, and what bets are running.
Operational rules live in [`AGENTS.md`](./AGENTS.md) (the canonical manual; a `CLAUDE.md` bridge points Claude Code at it) and are linked, never restated, here.
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

| Pillar | What it is | Thin default layer | Credible when |
| --- | --- | --- | --- |
| Knowledge in repo | Orientation lives in the repo, not in chat | Filled `AGENTS.md`, a reading map pointing only at docs that exist, feature docs | A new agent can name the change surface and proof command without reading the whole repo or asking for facts already present. |
| Mechanical enforcement | Machines, not memory, hold the line | One runnable `verify` chaining the definition of done (shape per stack in `docs/harness/examples/verify.md`); heavier CI/rules risk-adjusted | `verify` passes from a clean checkout and every non-negotiable control in the risk profile has a mechanical owner or an explicit blocking plan. |
| Runtime legibility | The running system can be observed and reproduced | `docs/harness/legibility.md` filled: where logs go, what state matters, how to reproduce a bug, one failure walked through | A developer can reproduce one representative failure and identify the evidence needed to explain it without exposing secrets or sensitive data. |
| Entropy control | Docs and rules stay lean; cruft is deleted | Friction log with budgets + "docs earn their existence, deleted when premature" + a periodic `/harness-review` (sweep → pattern pass → distil/archive → prune) | Review cadence and owner are named; open friction, live-log size, over-budget feature docs, and dangling reading-map lines are counted by the recipe in the review workflow. |
| Merge philosophy | How a change earns its way in | Branch-per-task, the evidence block from `docs/harness/merge-evidence.md` on every merge, DoD stands in until CI exists | The actual merge path names required evidence and does not rely on a process the team will not follow. |
| Human role | Where human judgment is mandatory | Hard gates (generic four + domain gates from the interview) | Each irreversible, externally binding, money-moving, privacy, security, or compliance boundary has a recognizable stop condition and decision owner. |
| Feedback loop | The harness learns from its own friction | Friction log with prediction → outcome; `/harness-review` closes open entries, promotes repeated themes to rules, and archives closed entries on a cadence; `/harness-probe` measures the open bets; kit-template friction ports upstream | A prediction can be traced to an observed outcome, repeated friction has a defined escalation path, and every archived entry names the rule that now holds its learning. |

A pillar left thin is not a gap to hide — its thin state and the path to thicken it are recorded at onboarding. Thickening is co-built, never auto-generated.

“Thin” is risk-adjusted. The repo's exposure and non-negotiable baselines live in [`docs/harness/risk-profile.md`](./docs/harness/risk-profile.md). In elevated-risk repos, controls such as authorization isolation, destructive-operation protection, secret handling, or auditability may be prerequisites rather than optional thickening.

## Installed mechanisms

| Mechanism | Where | Status |
| --- | --- | --- |
| Thin operating manual | `AGENTS.md` | installed by kit; adapted at onboarding |
| Cross-tool bridge | `CLAUDE.md` → `AGENTS.md` (symlink/shim) | installed by init so Claude Code reads the manual |
| Task→reading map + stop rule | `AGENTS.md` | TODO(harness): entries filled at onboarding |
| Hard gates | `AGENTS.md` | generic four installed; domain gates from the onboarding interview |
| Definition of done + self-check | `AGENTS.md` | TODO(harness): commands wired at onboarding |
| Merge philosophy | `AGENTS.md` | installed |
| Feature docs (invariants, verify-as-command) | `docs/features/_template.md` | installed |
| Feature-start workflow (intake → gate check → doc → done) | `.claude/commands/feature.md` | installed; optional to use |
| Pillar thickening workflow | `.claude/commands/harness-pillar.md` | installed; run when a thin layer needs to grow |
| Maintenance workflow (friction sweep → pattern pass → distil/archive → docs prune) | `.claude/commands/harness-review.md` | installed; run per release or when a budget in the review workflow is crossed |
| Probe workflow (measure one open bet) | `.claude/commands/harness-probe.md` | installed; run before the second release, then whenever a release passes with no bet gaining evidence |
| Upgrade workflow (merge `*.harness-kit` references after re-running init) | `.claude/commands/harness-upgrade.md` | installed; run whenever init reports a `ref` line |
| Design records | `docs/plans/` | convention installed |
| Friction log (prediction → outcome, archive of distilled entries) | `docs/harness/friction.md` | installed |
| Risk profile + non-negotiable baselines | `docs/harness/risk-profile.md` | TODO(harness): classified and confirmed at onboarding |
| Definition-of-done runner (thin enforcement) | a `verify` entry point; shape in `docs/harness/examples/verify.md` | TODO(harness): wired at onboarding (Stage B, pillar 3) |
| Mechanical enforcement (CI, lint, architecture rules) | hook and CI shapes in `docs/harness/examples/verify.md` | thin layer at onboarding; thicken via `/harness-pillar` |
| Runtime legibility (logs, state, reproduction, one failure) | `docs/harness/legibility.md` | TODO(harness): filled at onboarding (Stage B, pillar 4); thicken via `/harness-pillar` |
| Merge evidence block | `docs/harness/merge-evidence.md` | installed; forge adapter (PR template) copied at onboarding (Stage B, pillar 6) |

## Open bets

Each bet names its measurement; evidence accumulates in the friction log and closes there.

1. **Hub-and-spoke routing works** — an agent given a scoped task loads only the relevant doc, not the whole tree.
   Measure: docs read during scoped probe tasks.
2. **A thin AGENTS.md does not starve agents** — orientation comes from the pointer structure, not a fat always-loaded file.
   Measure: orientation questions agents ask that the docs should have answered.
3. **Prompt-level gates hold** — agents stop at hard gates without mechanical enforcement.
   Measure: gate bypasses recorded as friction (target: zero; any bypass escalates that gate to a hook or CI rule).
4. **Prediction→outcome keeps harness edits honest** — changes carrying predictions get evaluated instead of accumulating on faith.
   Measure: ratio of closed to open friction entries at each milestone.

## How to run a probe

Follow `docs/harness/workflows/probe.md` (`/harness-probe`): pick one bet and a scoped task, run a fresh uncoached agent session, observe what it read, asked, and stopped at, and record the finding as a dated `probe — bet #N` friction entry. Two probes pointing the same way close a bet here (keep the line, mark it `closed <date> — <verdict>`).

## Changing the harness

Harness changes follow the same rules as product changes: update the affected doc in the same change, log the prediction in the friction log, and let the merge philosophy carry the evidence.
Weakening validation or the definition of done is a hard gate.
