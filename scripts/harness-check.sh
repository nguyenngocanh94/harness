#!/bin/sh
# Mechanical half of /harness-review: detect, never decide.
# Exit 1 when a budget is crossed so a verify step or CI can flag it.
# Same recipe as template/docs/harness/workflows/review.md — keep them in sync.
set -u
root=${1:-.}
log="$root/docs/harness/friction.md"
status=0

# grep -c prints 0 and exits 1 when nothing matches; only a missing file prints nothing
open=$(grep -c '^Outcome: open' "$log" 2>/dev/null); open=${open:-0}
echo "open friction entries: $open (budget 5)"
[ "$open" -le 5 ] || status=1

lines=$(( $(wc -l < "$log" 2>/dev/null || echo 0) ))
echo "live friction log lines: $lines (budget 120)"
[ "$lines" -le 120 ] || status=1

for f in "$root"/docs/features/*.md; do
  [ -e "$f" ] || continue
  case "$f" in */_template.md) continue ;; esac
  n=$(wc -l < "$f")
  [ "$n" -le 60 ] || { echo "feature doc over 60-line budget: $f ($((n)))"; status=1; }
  grep -qE '^\*\*Status:\*\* (shipped|deprecated)' "$f" && echo "prune candidate (shipped/deprecated): $f"
done

manual="$root/AGENTS.md"
[ -e "$manual" ] || manual="$root/CLAUDE.md"
if [ -e "$manual" ]; then
  # a path must start at a word boundary so template/docs/... is not read as docs/...
  grep -oE '(^|[^A-Za-z0-9_./-])docs/[A-Za-z0-9_./-]+\.md' "$manual" |
    sed -E 's/^[^A-Za-z0-9_./-]//' | sort -u | while read -r p; do
    [ -e "$root/$p" ] || echo "reading-map link does not resolve: $p"
  done
fi

exit $status
