# Stale command wrappers — reference copies + migration replacement, not overwrite

Date: 2026-07-10.
Status: implemented (v0.4.1).
Origin: friction entry "2026-07-10 — stale command wrappers survive migration and shadow the new workflow".
A repo onboarded by kit 0.1.1 (`order_service`) has `.claude/commands/harness-onboard.md` containing the *old workflow inlined*.
Re-running init 0.4.0 correctly skips it (never-overwrite), so `/harness-onboard` keeps dispatching the pre-interview, pre-co-build workflow even though the current `docs/harness/workflows/onboard.md` sits right beside it.
The migration path moved the manual (CLAUDE.md → AGENTS.md) but said nothing about kit-owned command bodies.

## Options weighed

1. **init overwrites `.claude/commands/*.md` as kit-owned.**
   Rejected.
   It weakens the never-overwrite contract (a hard gate), and it is genuinely unsafe, not just formally gated: a team may have customized a wrapper (extra frontmatter, tool permissions, repo-specific preamble), and a deterministic copier cannot tell a stale 0.1.1 inline body from a deliberate local edit.
   Silent clobbering is exactly the failure mode the contract exists to prevent.
2. **init drops `<name>.harness-kit` reference copies beside differing command files; the onboarding migration step replaces stale wrappers with the human in the loop.**
   Chosen.
   This reuses the exact mechanism the AGENTS.md/HARNESS.md migration already uses: the deterministic tool only ever *adds* a reference; the agent + human make the judgment call during onboarding.
   The distinction from the manuals is semantic, not mechanical: manuals are *merged* (repo content is preserved inside them), wrappers are *replaced* (they are dispatch shims — repo-specific content does not belong in them and moves to the workflow doc or AGENTS.md instead).

## Decision

- `init.ts`: the one-time `<name>.harness-kit` reference-copy behavior extends from `MERGE_REFERENCE_FILES` (`AGENTS.md`, `HARNESS.md`) to every template file directly under `.claude/commands/`.
  Same rules as before: only when the existing file differs from the template, only if the reference does not already exist, never touching the original.
- `template/docs/harness/workflows/onboard.md` Stage B gains a **"Replace stale command wrappers"** step beside the existing manual-migration step: replace the command file's content with the reference copy's, confirm with the human before discarding deliberate local additions (which belong in the workflow doc or AGENTS.md, not the shim), delete the `.harness-kit` file.
- The kit's `CLAUDE.md` contract description and `init.ts`'s header comment name command wrappers in the reference-copy list.

## Contract impact

The create-if-missing / never-overwrite / never-merge spine is unchanged — no existing file is written.
What changes is the documented enumeration of reference-worthy files, which is why this record exists per the "changing this contract requires a decision record" convention.
No hard gate is crossed: nothing is weakened, nothing onboarded repos depend on is removed.

## Why not migration-only

The reference copy is dropped for *any* differing command wrapper, not only in the CLAUDE.md-migration case: a 0.3.0 repo already has AGENTS.md (so the migration flag never trips) yet can still hold wrappers that a future kit revision changes.
Staleness is a property of the wrapper, not of the manual layout.

## Prediction

After the fix, re-running init on a migrated repo drops `.claude/commands/<name>.md.harness-kit` beside every stale wrapper, and the onboarding run replaces them — a migrated repo's slash commands always dispatch to the current workflow docs.
