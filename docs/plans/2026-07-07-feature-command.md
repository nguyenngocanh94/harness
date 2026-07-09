# The `/feature` command — optional feature-start workflow

Date: 2026-07-07.
Status: implemented in v0.1.3.
Origin: the harness had a feature workflow scattered across CLAUDE.md (reading map, feature-doc convention, gates, definition of done, merge philosophy) but no explicit entry point when a feature request arrives.

## Decision

Install `template/.claude/commands/feature.md` at onboard time. It is optional and generic: it prescribes no development methodology of its own and instead threads *this repo's* adapted CLAUDE.md rules into one path — intake questions → orient → gate check → design-record-vs-feature-doc → build → definition of done → merge with evidence.

## Why a command, not a CLAUDE.md section

The kit believes "procedures become scripts as soon as they repeat," and feature-start is the canonical repeating procedure. A prose section would also fight the thin-manual bet (bet #2) by adding process weight to the always-loaded file. A command keeps the workflow out of the always-loaded core and invokes it only when wanted.

It stays opt-in because the kit does not mandate one development process — the human's global rules and the repo's own conventions own *how* to build; the command owns the repo-specific *where* (which doc, which gate, which proof command).

## What it deliberately does not do

- No methodology (TDD vs. not, review cadence) — that is global/CLAUDE.md, not the kit's to impose.
- No hardcoded project facts — it reads the adapted CLAUDE.md at runtime, so the template file stays generic (no `TODO(harness)` slots of its own).
- The one genuinely new decision it encodes: design record in `docs/plans/` first (cross-cutting/gated/design-heavy) vs. a `docs/features/<name>.md` (everything else).

## Escalation path

If the friction log later shows agents skipping the path even with the command available, escalate to a hook — the kit's standard "prompt-level until friction proves mechanical enforcement is needed" rule.
