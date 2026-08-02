# Risk profile

This file records how failure can matter in this repository and which controls are prerequisites. It guides engineering effort; it is not a compliance certification or a substitute for specialist review.

## Confirmed posture

TODO(harness): `baseline`, `elevated`, or `critical`, confirmed with the human during onboarding.

Rationale and evidence:

TODO(harness): facts from the product, code, data, users, external effects, and obligations. Separate verified facts from stated intent and unknowns.

## Exposure inventory

Mark each row `yes`, `no`, or `unknown`. An `unknown` that could materially change the posture stays visible and gets an owner.

| Exposure | Status | Evidence / boundary | Owner of unknown |
| --- | --- | --- | --- |
| Sensitive or personal data | TODO | TODO | TODO |
| Multiple users or tenants | TODO | TODO | TODO |
| Authentication, credentials, or privileged access | TODO | TODO | TODO |
| Money movement or financial decisions | TODO | TODO | TODO |
| Destructive or irreversible operations | TODO | TODO | TODO |
| External side effects (messages, publishing, third-party writes) | TODO | TODO | TODO |
| Availability or recovery obligations | TODO | TODO | TODO |
| Audit, retention, deletion, geographic, contractual, or compliance obligations | TODO | TODO | TODO |

## Non-negotiable baselines

For every applicable exposure, name the smallest control that must exist before feature breadth. A statement such as “be careful” is not a control. Evidence must be observable: a command, test, configuration, review record, drill, or runtime signal.

| Failure to prevent or contain | Required control | Evidence | State (`present`, `prerequisite`, `accepted`) | Decision owner |
| --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO |

`accepted` means a human explicitly accepted the residual risk in a dated design record; it never means the row was silently deferred.

## Review triggers

Re-run the risk conversation when the system adds a new data class, tenant boundary, credential, external effect, destructive operation, deployment environment, contractual obligation, or materially larger blast radius. Update hard gates, verification, and the pillars plan in the same change.
