# Example: the `verify` entry point, a warning hook, and a minimal CI job

Mechanical enforcement starts thin: **one command** that runs the definition of done in order, and fails on the first red step. Everything heavier (architecture rules, deny-lists, full pipelines) is pillar thickening and arrives only when the risk profile or the friction log justifies it.

Pick the block for this stack, adapt the inner commands to the ones that actually exist (every command must have run successfully before it is written down), and record the entry point in `AGENTS.md`'s Verification section. Delete this file once `verify` is wired, or keep it if the team wants the other adapters later — it is an example, not a mechanism.

**Done when:** `verify` passes from a clean checkout, and a deliberately broken test makes it fail.

## `verify` by stack

Order is always typecheck → lint → test; a step that is not wired yet is **left out and named** in `AGENTS.md`, never faked.

```jsonc
// TS/JS — package.json
"scripts": { "verify": "tsc --noEmit && biome check . && vitest run" }
```

```makefile
# Go / Rust / C — Makefile
verify:
	go vet ./... && golangci-lint run && go test ./...
# cargo: cargo check && cargo clippy -- -D warnings && cargo test
```

```toml
# Python — pyproject.toml, with a tiny runner (e.g. `just`, `poe`, `nox`) or a script
[tool.poe.tasks]
verify = "mypy . && ruff check . && pytest"
```

```json
// PHP — composer.json
"scripts": { "verify": ["phpstan analyse", "php-cs-fixer fix --dry-run", "phpunit"] }
```

```sh
# Anything else — scripts/verify.sh (chmod +x); the harness-check from the
# review workflow can be appended as a warning-only last step.
set -e
<typecheck>
<lint>
<test>
sh scripts/harness-check.sh || echo "harness budgets crossed — run /harness-review"
```

## A hook that reminds (never blocks, never cuts)

```sh
# .git/hooks/pre-push  (or a husky / lefthook / pre-commit entry)
sh -c 'bun run verify' || { echo "verify failed — fix before pushing"; exit 1; }
```

A hook may block a push on red `verify`; it must never close friction, delete docs, or edit the repo.

## A minimal CI job (portable shape)

```yaml
# .github/workflows/verify.yml — GitLab/Buildkite: same two steps
on: [pull_request, push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: <install>        # bun install / npm ci / go mod download / pip install -e .
      - run: <verify>         # bun run verify / make verify / poe verify
```

Once this is green on main, "green is a hard merge requirement" in `AGENTS.md`'s merge section stops being a stand-in and becomes the rule.
