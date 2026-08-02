# Risk-aware onboarding

Status: implemented (v0.5.0).

## Context

The harness intentionally starts thin and previously treated repeated friction as the main reason to thicken a pillar. That is insufficient guidance for repositories whose inherent exposure is already known: sensitive data, tenant boundaries, credentials, money movement, destructive/external effects, or material operational obligations. Waiting for a failure in those domains is not a responsible discovery mechanism.

## Decision

Add a risk-profile record to every onboarded repository. Onboarding establishes exposure and an agreed baseline/elevated/critical posture, then maps applicable failure modes to non-negotiable controls and observable evidence. Risk labels guide effort and do not claim compliance.

“Thin” becomes risk-adjusted. Friction remains a valid escalation signal, but inherent exposure, known failure modes, incidents, and external obligations also justify pillar thickening. Missing elevated/critical prerequisites block feature breadth unless a human explicitly changes the decision in a design record.

Each pillar also gains a concise credible-when criterion so onboarding can distinguish a working thin layer from a placeholder.

## Rejected alternatives

- Ship a universal security stack: violates tool neutrality and would invent requirements before understanding the repo.
- Keep risk entirely in domain-specific AGENTS.md gates: leaves greenfield users without a structured conversation that discovers those gates.
- Wait for friction in every case: appropriate for low-impact process rules, inappropriate for known high-consequence failure modes.

## Compatibility

The installer remains create-if-missing and never overwrites adapted files. Existing repos receive the new risk-profile file plus merge references for changed manuals and tool-neutral workflow bodies; onboarding merges the new guidance with the human.
