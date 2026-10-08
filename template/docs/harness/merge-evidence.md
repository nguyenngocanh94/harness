# Merge evidence

"Every merge carries its evidence" needs a place to put the evidence. This is that block: paste it into the pull/merge request description (or the commit message when there is no forge), filled in, every time.

**Done when:** the last three merges on the default branch each carry this block with real command output, and the reviewer could decide from the block alone.

## The block

```markdown
## Evidence

**Verification** — ran the definition of done (`<verify command>`):
<paste the real tail of the output; not a paraphrase>

**Feature verify** — <feature doc path or "none">:
<output, or "n/a">

**Gates** — crossed: none | <gate> → decision record `docs/plans/<file>.md`
**Risk profile** — prerequisites touched: none | <row> (state before → after)

**Self-check**
- Doc made stale? <none | fixed: path>
- Harness friction? <none | logged: friction.md entry title>
- Not attempted: <say so>
```

## Wiring it (per forge — optional, pick one)

- GitHub: copy the block into `.github/pull_request_template.md`.
- GitLab: `.gitlab/merge_request_templates/Default.md`.
- No forge / trunk-based: the block goes at the end of the merge commit message.

The forge file is an adapter; this doc is the source. Change the block here and re-copy.

## What a reviewer looks at

Hard-gate territory, design decisions, and the block above — not every generated line. A block with pasted output and three honest self-check answers is the review surface; a missing block is a blocked merge once the team has agreed to this.
