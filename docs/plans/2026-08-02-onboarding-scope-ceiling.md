# Onboarding scope ceiling

Status: implemented (v0.5.1).

## Context

While applying the kit to a new Personal Data Vault repository, a broad instruction to build the project caused onboarding to flow directly into account/import/analytics code. The human intended only the boilerplate and basic modular foundation. The existing workflow clearly separated onboarding from pillar thickening, but did not explicitly separate repository foundation from the first product feature.

## Decision

Onboarding records one of three scope ceilings: harness only, harness plus runnable foundation, or harness plus an explicitly named first feature. The default is foundation at most. Feature-specific domain code, schemas, endpoints, UI flows, and MCP tools require separate human confirmation and then follow the feature workflow.

The closing step becomes a hard stop when the ceiling excludes feature implementation.

## Prediction

Future greenfield onboarding will not interpret a broad project-build request as permission to implement product behavior before the human has reviewed the adapted harness and foundation.
