# Harness review workflow

You are running periodic harness maintenance. The harness grows entropy like any codebase — friction entries pile up unclosed, docs outlive the code they described. This ritual keeps entropy control and the feedback loop actually working, instead of leaving them as good intentions.

**When to run this (cadence):** at each release, or when open friction entries exceed ~5, whichever comes first. If you were sent here by a merge hook or CI reminder, that threshold was likely crossed.

Principle for the whole run: **detect mechanically, decide with the human.** Counting is safe to automate; closing entries and deleting docs are judgment — you propose, the human confirms. Never auto-close friction or auto-delete a doc.

## Step 1 — Friction sweep

Read `docs/harness/friction.md`. For each entry whose `Outcome` is still `open`:

- **Close it** if a later session has shown the prediction happening or failing — set `Outcome` to the date and cite what was observed.
- **Mark it inconclusive** if enough time passed with no signal either way — say so, so it stops counting as live.
- **Act on it** if the same friction keeps recurring: this is the signal to escalate. Route it to the pillar-thickening workflow (`docs/harness/workflows/pillar.md`), a hook, or CI — and record that as the entry's `Change`.

Report the count: how many entries were open at the start, how many you closed or marked inconclusive, and the resulting closed/open ratio. That ratio is the harness's feedback-loop health (bet #4).

Entries about the kit's own templates (not this repo's domain) get ported back to the kit's friction log while you are here.

## Step 2 — Docs prune

Walk `docs/features/*`, `docs/plans/*`, and `AGENTS.md`'s "What to read for a task". Propose for deletion anything that no longer earns its existence:

- feature docs for features that shipped and stabilised or were removed;
- design records superseded by a later decision (a record of a *decision* stays; a record of a *plan* that was replaced can go);
- reading-map lines that point at docs which no longer exist or no longer matter.

**Present the list and let the human confirm each deletion.** Docs are cheap to keep and expensive to delete wrongly — this is judgment, never automatic. Delete only what is confirmed, in this same change.

## Step 3 — Report

End with the three self-check answers: did this pass make any doc stale (fix it here); did the sweep reveal harness friction of its own (log it); what did you deliberately leave (say so, with the count still open).

---

## Mechanical trigger (the recipe a hook or CI runs)

The *detection* half can run unattended; keep it separate from the judgment above. The open-entry count is a pure text check against the friction format:

```sh
# open friction entries; nonzero exit when the threshold is crossed
count=$(grep -c '^Outcome: open' docs/harness/friction.md)
echo "open friction entries: $count"
[ "$count" -le 5 ]   # fail (exit 1) when > 5 → time to run /harness-review
```

## Wiring it after a merge (thickening — opt-in, not installed)

Escalate to a mechanical trigger only when friction shows the manual cadence is being skipped. When you do, keep the core tool-neutral and add a per-environment adapter:

- **CI on merge to main:** run the recipe above as a job step; on failure, warn or open a reminder issue. Portable, safe — it only flags.
- **Per-tool agent hook (e.g. Claude Code / Kiro `post-merge`):** remind someone to run `/harness-review`. The hook reminds; it does not close entries or delete docs.

In both cases the hook detects and reminds; the agent and human decide and cut.
