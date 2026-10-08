# Reference copies for every template file

Date: 2026-10-08.
Status: accepted; implemented in v0.6.1.
Origin: the first `/harness-review` pattern pass on the kit's own log found one theme with four entries — cache pin (2026-07-10), stale command wrappers (2026-07-10), workflow bodies (2026-08-02), and the 0.6.0 friction-protocol change — all the same gap: `init.ts` decided which existing files get a `<name>.harness-kit` reference copy by allowlist (`AGENTS.md`, `HARNESS.md`, `.claude/commands/*`, `docs/harness/workflows/*`). Every time a new kind of template file changed, the allowlist was one category short and a kit release reached no onboarded repo for that file.

## Decision

Remove the allowlist. Any template file that already exists in the target and differs from the kit's current template gets a one-time `<name>.harness-kit` reference copy beside it. No exclusion list: no template file earned one.

What each reference means stays the same per kind, and the onboarding workflow says so:

- manuals and workflow bodies — a merge source (human merges);
- command wrappers — a swap source (stale inlined workflow replaced by the current thin wrapper);
- logs, risk profile, feature template (new) — a protocol or template update to merge into the file's structure, never into its content.

## Why not an exclusion list, or version gating

- An **exclusion list** would be the same allowlist upside down, with the same failure mode in reverse (a file excluded by mistake stays dark). Nothing in the template is meant to stay dark: even the friction log carries protocol that changes.
- **Gating references on a kit-version change** would silence the known noise (an adapted file differs forever, so a deleted reference reappears on the next init) but it also breaks a documented expectation: a file adapted between two inits of the *same* version still gets its reference (`init.test.ts`, "changed workflow body"). The noise is pre-existing and bounded — one file per differing file, created only if absent — and is left as is. If friction shows it matters, that is a separate decision.

## Contract change

`init.ts`'s stated contract named four categories; it now says "any existing template file that differs". Never-overwrite is untouched; the reference is still created once, beside, never over. This is a widening of what init may *add*, not of what it may change.

## Prediction (close in the friction log)

The 0.6.0 friction-protocol change reaches every onboarded repo as `docs/harness/friction.md.harness-kit` on its next init, and the "kit changes not reaching onboarded repos" theme produces no further entries.
