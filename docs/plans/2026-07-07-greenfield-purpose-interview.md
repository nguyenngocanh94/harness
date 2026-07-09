# Onboarding a greenfield repo — establish purpose by interview

Date: 2026-07-07.
Status: implemented in v0.1.2.
Origin: onboarding an empty repo produced a hallucinated "what this project is" — the command filled the purpose slot with invented data instead of asking the human.

## The bug

`/harness-onboard` was built around inventorying an existing codebase.
Phase 1 detects the stack from manifests; phase 2 tells the agent to fill the `what-the-project-is` slot.
For an empty repo the stack/command slots correctly stayed open (no manifests to read), but the purpose slot — prose the command explicitly asked to fill — got invented, because a greenfield project's purpose is not a fact discoverable in the repo.
There was no branch for "purpose cannot be established from facts."

## The fix

The kit's own principle already dictated the answer: *records what is, never creates what isn't.*
An undiscoverable purpose lives in the human, so it is elicited by interview — the same human-in-the-loop mechanism phase 3 already uses for gates — never guessed.

- Phase 1 now assesses whether the repo makes its own purpose legible (source, README, manifest metadata).
- New **phase 1b** runs a short Socratic interview (one question at a time: problem/audience, consumers, boundaries, stack decisions) **only when** phase 1 could not establish purpose. It records the result as *stated intent*, not verified fact, and skips entirely when the repo already says what it is.
- Intended-stack answers from the interview go to the pillars plan as decisions to confirm; the CLAUDE.md stack slot stays open until real manifests back it.
- A new whole-run rule forbids inventing purpose outright.

## Why not just leave the slot open

Leaving purpose blank on a greenfield repo throws away the one moment the human's vision is easiest to capture, and an empty orientation slot invites the next agent to guess again.
Eliciting-and-tagging-as-intent keeps the facts-only spine intact (the claim is honestly labelled as unproven) while giving the repo a real starting orientation.
