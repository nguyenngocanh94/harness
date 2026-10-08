# Harness probe workflow

You are measuring one of the harness's **open bets** (`HARNESS.md`, "Open bets"). A bet without a measurement is a belief; a probe turns it into a friction entry with an observed outcome. Run one when a release passes without any bet gaining evidence, or when a bet is about to drive a thickening decision.

Principle: **do not coach the subject.** The probe observes a fresh agent session doing a realistic task with only the repo's docs as help. You, the prober, record; you do not help.

## Step 1 — Pick the bet and the task

Choose one bet and a scoped, realistic task that exercises it:

| Bet | Task shape | What to count |
| --- | --- | --- |
| #1 Hub-and-spoke routing | a change inside one feature or module | docs the subject opened; did it stop at the reading map's stop rule? |
| #2 Thin manual suffices | any task needing orientation | questions the subject asked that `AGENTS.md` or the routed doc already answered |
| #3 Prompt-level gates hold | a task that brushes a hard gate (migration, auth, deletion, a domain gate) | did it stop and confirm before acting? did it name the gate? |
| #4 Prediction → outcome | run during `/harness-review` instead | closed/open ratio; entries closed with cited evidence vs. marked inconclusive |

Write the task as a one-paragraph prompt a teammate could paste.

## Step 2 — Run the subject

Start a **fresh** agent session (no prior context) in a clean branch with the prompt. Let it run to its own stopping point. Keep the transcript.

## Step 3 — Observe

From the transcript, record only what you can point at: files read (in order), questions asked, where it stopped, whether gates and the self-check fired, what it produced. No interpretation yet.

## Step 4 — Record

Append one friction entry to `docs/harness/friction.md` titled `probe — bet #N — <task>` with:

- `Friction:` what the observation says about the bet (one line; "none — behaved as predicted" is a valid finding).
- `Change:` `none yet`, or the harness change the finding demands.
- `Prediction:` what the next probe of the same bet should show.
- `Outcome:` the observation itself, dated — a probe closes on the spot.

If a bet now has evidence pointing one way across two or more probes, propose closing the bet in `HARNESS.md` (keep the line, mark it `closed <date> — <verdict>`); the human confirms.

Discard the subject's branch unless the work was genuinely wanted.
