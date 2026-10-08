# Harness review workflow

You are running periodic harness maintenance. The harness grows entropy like any codebase — friction entries pile up unclosed, closed entries stay as prose nobody rereads, docs outlive the code they described. This ritual keeps entropy control and the feedback loop actually working, instead of leaving them as good intentions.

**When to run this (cadence):** at each release, or when any budget below is crossed, whichever comes first. If you were sent here by a merge hook or CI reminder, a budget was likely crossed.

Principle for the whole run: **detect mechanically, decide with the human.** Counting and listing are safe to automate; closing entries, archiving, promoting a theme to a rule, and deleting docs are judgment — you propose, the human confirms. Never auto-close friction, auto-archive, or auto-delete a doc.

## Step 1 — Friction sweep

Read `docs/harness/friction.md`. For each live entry whose `Outcome` is still `open`:

- **Close it** if a later session has shown the prediction happening or failing — set `Outcome` to the date and cite what was observed.
- **Mark it inconclusive** if enough time passed with no signal either way — say so, so it stops counting as live.
- **Act on it** if the same friction keeps recurring: this is the signal to escalate. Route it to the pillar-thickening workflow (`docs/harness/workflows/pillar.md`), a hook, or CI — and record that as the entry's `Change`.

Report the count: how many entries were open at the start, how many you closed or marked inconclusive, and the resulting closed/open ratio. That ratio is the harness's feedback-loop health (bet #4).

Entries about the kit's own templates (not this repo's domain) get ported back to the kit's friction log while you are here.

## Step 2 — Pattern pass

Read every entry — live and archived — once, and group them by theme (the same rule bypassed, the same doc misleading, the same kind of wasted reading). A theme with **two or more entries** is no longer an event; it is a missing rule. For each such theme propose one of:

- a convention or gate line in `AGENTS.md`;
- a pillar thickening (`docs/harness/workflows/pillar.md`);
- a hook or CI check.

Record the proposal as the `Change` of the theme's newest entry, with a prediction. The human confirms each promotion before it is written.

## Step 3 — Distil and archive

A closed entry has done its job once its learning lives in a rule. For each closed entry in the live log:

- **Name where the learning now lives** — an `AGENTS.md` line, a gate, a `HARNESS.md` row, a design record, a test. If it lives nowhere, that is a Step 2 proposal, not an archive candidate.
- **Archive it** when it is encoded somewhere, or when one review cycle has passed since it closed: collapse it to one line in the `## Archive` section at the top of `friction.md` (format in that file) and remove the full entry. Git history keeps the full text.

**Present the archive list and let the human confirm it** before editing. Archiving is how the live log stays within its budget without ever losing a learning.

## Step 4 — Docs prune

Walk `docs/features/*`, `docs/plans/*`, and `AGENTS.md`'s "What to read for a task". Propose anything that no longer earns its existence in its current shape:

- **Delete:** feature docs for features that shipped and stabilised or were removed; reading-map lines that point at docs which no longer exist or no longer matter.
- **Trim:** feature docs over the 60-line budget — move rationale to `docs/plans/`, cut what the code or a command already answers.
- **Mark superseded:** a design record replaced by a later decision gets a `Superseded by: <path>` line under its title. A record of a *decision* stays; only a record of a *plan* that was replaced may go.

**Present the list and let the human confirm each deletion, trim, and mark.** Docs are cheap to keep and expensive to delete wrongly — this is judgment, never automatic. Apply only what is confirmed, in this same change.

## Step 5 — Report

End with the three self-check answers: did this pass make any doc stale (fix it here); did the sweep reveal harness friction of its own (log it); what did you deliberately leave (say so, with the counts still open and still over budget).

---

## Budgets (defaults — adjusted at onboarding, B5)

| What | Budget | Why |
| --- | --- | --- |
| Open friction entries | ≤ 5 | more than this and the sweep is overdue |
| Live friction log | ≤ ~120 lines | archive lines cost one line each; prose entries cost seven |
| One feature doc | ≤ 60 lines | the feature template's own budget |

## Mechanical trigger (the recipe a hook or CI runs)

The *detection* half can run unattended; keep it separate from the judgment above. Every check is a pure text check against the friction and feature formats; each one lists or counts, none decides.

```sh
# open friction entries; nonzero exit when the budget is crossed
count=$(grep -c '^Outcome: open' docs/harness/friction.md)
echo "open friction entries: $count"
[ "$count" -le 5 ]

# live friction log size (archived entries are one line each)
[ "$(wc -l < docs/harness/friction.md)" -le 120 ]

# feature docs over budget, and prune candidates
for f in docs/features/*.md; do
  [ "$(wc -l < "$f")" -le 60 ] || echo "over budget: $f"
  grep -qE '^\*\*Status:\*\* (shipped|deprecated)' "$f" && echo "prune candidate: $f"
done

# reading-map links that do not resolve
grep -oE '(^|[^A-Za-z0-9_./-])docs/[A-Za-z0-9_./-]+\.md' AGENTS.md |
  sed -E 's/^[^A-Za-z0-9_./-]//' | sort -u |
  while read -r p; do [ -e "$p" ] || echo "dangling: $p"; done
```

## Wiring it after a merge (thickening — opt-in, not installed)

Escalate to a mechanical trigger only when friction shows the manual cadence is being skipped. When you do, keep the core tool-neutral and add a per-environment adapter:

- **A step in `verify`:** run the recipe as a warning at the end of the definition of done. Cheapest adapter; every agent sees the counts on every change.
- **CI on merge to main:** run the recipe above as a job step; on failure, warn or open a reminder issue. Portable, safe — it only flags.
- **Per-tool agent hook (e.g. Claude Code / Kiro `post-merge`):** remind someone to run `/harness-review`. The hook reminds; it does not close entries, archive, or delete docs.

In every case the hook detects and reminds; the agent and human decide and cut.
