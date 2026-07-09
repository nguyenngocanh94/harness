# Feature: <name>

> Template usage — delete this block when copying.
> Copy to `docs/features/<kebab-name>.md` when implementation of the feature **starts** (not for every idea).
> Link to code, architecture docs, and `docs/plans/` instead of duplicating them — this doc orients, it does not re-explain.
> Update it in the same change that changes the feature; a stale doc is worse than no doc.
> Delete any section you would leave empty.
> Budget: keep the whole file under ~60 lines.

**Status:** designed | building | shipped | deprecated
**Scope:** <one line — what this feature owns, and what it explicitly does not own>

## What it does

<2–4 sentences of user-visible behavior. No implementation detail.>

## Where it lives

- Code: <entry-point paths only, not every file>
- Architecture: <links to the governing design docs>
- Design record: <link to `docs/plans/*.md`, if one exists>
- Tests: <paths to the tests that cover this feature>

## Invariants

<Numbered, testable statements that must survive any change — this is the review checklist for the feature.>
<Human-owned: an agent proposes these, the human confirms each. They encode domain truth, so they are never invented to fill the section.>

1. <…>
2. <…>

## How to verify

Run these from the repo root and include their output when claiming done — execute, do not paraphrase.
Mark human-only steps with `MANUAL:`.
These are feature-specific proof, on top of the global definition of done in AGENTS.md.

```bash
<test command for this feature>
```

MANUAL: <user-visible check, if any>

## Decisions

<Decision → why → rejected alternative, one line each. Longer rationale belongs in `docs/plans/`.>

- <…>

## Open items

<Explicit TBDs so agents do not invent answers. Remove the section when empty.>

- <…>
