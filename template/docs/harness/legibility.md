# Runtime legibility

How the running system is observed and reproduced. This is the thin layer for the runtime-legibility pillar: a short note, not infrastructure. It exists so that an agent or a new developer can reproduce one failure and name the evidence that explains it, without guessing and without exposing secrets.

Keep every answer to a few lines and point at real files, commands, or dashboards. Delete a section only if it genuinely does not apply; an unknown stays as `TODO(harness)` with an owner.

**Done when:** a developer who has never run this system can follow this file to reproduce one representative failure and say which log line or state proves what happened.

## Where to look

- Logs: TODO(harness) — where they go locally and in each environment, how to tail them, the format (structured? which field is the correlation id?).
- Metrics / traces / dashboards: TODO(harness) — links, or "none yet".
- Errors: TODO(harness) — where exceptions land (tracker, log level, alert).

## State that matters

TODO(harness) — the handful of runtime state that explains most incidents (a queue, a cache, a session table, a feature flag, an external account), where it lives, and the command or query that dumps it safely.

## How to reproduce a bug end-to-end

1. TODO(harness) — start the system locally with the real command.
2. TODO(harness) — seed or capture the input (fixture, recorded request, test account — never production personal data).
3. TODO(harness) — the fastest way to observe the failure (a test, a curl, a UI step), and where its evidence appears.

## Representative failure

TODO(harness) — one real or realistic failure, walked through the steps above once, with the log line or state that proved the cause. This is the file's own proof; it stays until a better example replaces it.

## Secrets and sensitive data

TODO(harness) — what must never appear in logs or dumps, and how that is enforced today (redaction, allow-lists, "by convention only" is an honest answer and a thickening candidate).

## Thickening (when the thin layer is not enough)

Structured logging, request ids across services, state snapshots, deterministic replay — via `docs/harness/workflows/pillar.md`, when an incident or friction entry shows this note did not suffice.
