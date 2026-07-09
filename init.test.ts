import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { InitError, runInit } from "./init";

const KIT_VERSION = readFileSync(
  join(import.meta.dir, "VERSION"),
  "utf8",
).trim();

const scratchDirs: string[] = [];

function scratch(withGit = true): string {
  const dir = mkdtempSync(join(tmpdir(), "harness-kit-test-"));
  scratchDirs.push(dir);
  if (withGit) mkdirSync(join(dir, ".git"));
  return dir;
}

afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

const EXPECTED_FILES = [
  "CLAUDE.md",
  "HARNESS.md",
  "docs/harness/friction.md",
  "docs/features/_template.md",
  ".claude/commands/harness-onboard.md",
  ".claude/commands/feature.md",
];

describe("runInit", () => {
  test("refuses a non-git directory unless forced", () => {
    const dir = scratch(false);
    expect(() => runInit(dir)).toThrow(InitError);
    expect(runInit(dir, { force: true }).created.length).toBeGreaterThan(0);
  });

  test("fresh repo gets the full skeleton and a version stamp", () => {
    const dir = scratch();
    const report = runInit(dir);
    for (const file of EXPECTED_FILES) {
      expect(report.created).toContain(file);
      expect(existsSync(join(dir, file))).toBe(true);
    }
    expect(readFileSync(join(dir, "docs/harness/kit-version"), "utf8")).toBe(
      `${KIT_VERSION}\n`,
    );
    expect(report.skipped).toEqual([]);
    expect(report.previousKitVersion).toBeNull();
  });

  test("re-run is idempotent: nothing created, everything skipped", () => {
    const dir = scratch();
    runInit(dir);
    const second = runInit(dir);
    expect(second.created).toEqual([]);
    expect(second.skipped.length).toBeGreaterThanOrEqual(EXPECTED_FILES.length);
    expect(second.previousKitVersion).toBe(KIT_VERSION);
  });

  test("existing CLAUDE.md is untouched and gets a merge reference copy", () => {
    const dir = scratch();
    const original = "# My project\n\nPre-existing instructions.\n";
    writeFileSync(join(dir, "CLAUDE.md"), original);
    const report = runInit(dir);
    expect(readFileSync(join(dir, "CLAUDE.md"), "utf8")).toBe(original);
    expect(report.skipped).toContain("CLAUDE.md");
    expect(report.references).toContain("CLAUDE.md.harness-kit");
    expect(existsSync(join(dir, "CLAUDE.md.harness-kit"))).toBe(true);

    const second = runInit(dir);
    expect(second.references).toEqual([]);
  });

  test("non-merge files are skipped without reference copies", () => {
    const dir = scratch();
    mkdirSync(join(dir, "docs/harness"), { recursive: true });
    writeFileSync(join(dir, "docs/harness/friction.md"), "existing log\n");
    const report = runInit(dir);
    expect(report.skipped).toContain("docs/harness/friction.md");
    expect(existsSync(join(dir, "docs/harness/friction.md.harness-kit"))).toBe(
      false,
    );
    expect(readFileSync(join(dir, "docs/harness/friction.md"), "utf8")).toBe(
      "existing log\n",
    );
  });
});
