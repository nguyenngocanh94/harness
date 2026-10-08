import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "scripts", "harness-check.sh");
const scratchDirs: string[] = [];

function scratch(): string {
  const dir = mkdtempSync(join(tmpdir(), "harness-check-test-"));
  scratchDirs.push(dir);
  mkdirSync(join(dir, "docs", "harness"), { recursive: true });
  mkdirSync(join(dir, "docs", "features"), { recursive: true });
  return dir;
}

function run(dir: string): { code: number; out: string } {
  const proc = Bun.spawnSync(["sh", SCRIPT, dir]);
  return {
    code: proc.exitCode,
    out: `${proc.stdout.toString()}${proc.stderr.toString()}`,
  };
}

afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("harness-check", () => {
  test("passes a repo within every budget and ignores the feature template", () => {
    const dir = scratch();
    writeFileSync(
      join(dir, "docs/harness/friction.md"),
      "## Archive\n\n---\n\n## 2026-01-01 — x\nOutcome: open\n",
    );
    writeFileSync(
      join(dir, "docs/features/_template.md"),
      `${"line\n".repeat(80)}`,
    );
    writeFileSync(join(dir, "AGENTS.md"), "read docs/harness/friction.md\n");
    const { code, out } = run(dir);
    expect(code).toBe(0);
    expect(out).toContain("open friction entries: 1");
    expect(out).not.toContain("over 60-line budget");
    expect(out).not.toContain("does not resolve");
  });

  test("fails and names every crossed budget", () => {
    const dir = scratch();
    writeFileSync(
      join(dir, "docs/harness/friction.md"),
      "Outcome: open\n".repeat(6),
    );
    writeFileSync(join(dir, "docs/features/big.md"), "x\n".repeat(70));
    writeFileSync(join(dir, "docs/features/old.md"), "**Status:** shipped\n");
    writeFileSync(
      join(dir, "AGENTS.md"),
      "see docs/features/missing.md and docs/features/old.md\n",
    );
    const { code, out } = run(dir);
    expect(code).toBe(1);
    expect(out).toContain("open friction entries: 6");
    expect(out).toContain("over 60-line budget");
    expect(out).toContain("big.md");
    expect(out).toContain("prune candidate");
    expect(out).toContain("old.md");
    expect(out).toContain("does not resolve: docs/features/missing.md");
    expect(out).not.toContain("does not resolve: docs/features/old.md");
  });

  test("a path inside a longer path is not read as a reading-map link", () => {
    const dir = scratch();
    writeFileSync(join(dir, "docs/harness/friction.md"), "");
    writeFileSync(
      join(dir, "AGENTS.md"),
      "the kit keeps template/docs/harness/workflows/onboard.md\n",
    );
    const { code, out } = run(dir);
    expect(code).toBe(0);
    expect(out).not.toContain("does not resolve");
  });
});
