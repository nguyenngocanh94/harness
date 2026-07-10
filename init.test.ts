import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  lstatSync,
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

// Files created by walking the template. CLAUDE.md is created separately as a
// bridge, so it is asserted in its own test, not here.
const EXPECTED_FILES = [
  "AGENTS.md",
  "HARNESS.md",
  "docs/harness/friction.md",
  "docs/features/_template.md",
  "docs/harness/workflows/onboard.md",
  "docs/harness/workflows/feature.md",
  "docs/harness/workflows/pillar.md",
  "docs/harness/workflows/review.md",
  ".claude/commands/harness-onboard.md",
  ".claude/commands/feature.md",
  ".claude/commands/harness-pillar.md",
  ".claude/commands/harness-review.md",
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

  test("creates a CLAUDE.md bridge to the AGENTS.md manual", () => {
    const dir = scratch();
    const report = runInit(dir);
    expect(report.created).toContain("CLAUDE.md");
    expect(report.bridge).not.toBeNull();
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    if (report.bridge === "symlink") {
      expect(lstatSync(join(dir, "CLAUDE.md")).isSymbolicLink()).toBe(true);
      // Following the symlink yields the canonical manual's content.
      expect(readFileSync(join(dir, "CLAUDE.md"), "utf8")).toBe(
        readFileSync(join(dir, "AGENTS.md"), "utf8"),
      );
    } else {
      expect(readFileSync(join(dir, "CLAUDE.md"), "utf8").trim()).toBe(
        "@AGENTS.md",
      );
    }
  });

  test("existing AGENTS.md is untouched and gets a merge reference copy", () => {
    const dir = scratch();
    const original = "# My project\n\nPre-existing instructions.\n";
    writeFileSync(join(dir, "AGENTS.md"), original);
    const report = runInit(dir);
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toBe(original);
    expect(report.skipped).toContain("AGENTS.md");
    expect(report.references).toContain("AGENTS.md.harness-kit");
    expect(existsSync(join(dir, "AGENTS.md.harness-kit"))).toBe(true);

    const second = runInit(dir);
    expect(second.references).toEqual([]);
  });

  test("migrates an old CLAUDE.md-only repo without overwriting it", () => {
    const dir = scratch();
    const oldManual = "# Old manual\n\nfilled by an older kit.\n";
    writeFileSync(join(dir, "CLAUDE.md"), oldManual);
    const report = runInit(dir);
    // The repo's own CLAUDE.md is left exactly as it was.
    expect(readFileSync(join(dir, "CLAUDE.md"), "utf8")).toBe(oldManual);
    // No empty AGENTS.md is laid down beside it.
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
    // A reference is dropped for the onboarding workflow to migrate from.
    expect(report.migrationPending).toBe(true);
    expect(report.references).toContain("AGENTS.md.harness-kit");
    expect(existsSync(join(dir, "AGENTS.md.harness-kit"))).toBe(true);
    // No bridge is created while a real CLAUDE.md is present.
    expect(report.bridge).toBeNull();
    expect(report.created).not.toContain("CLAUDE.md");
  });

  test("stale command wrapper is untouched and gets a reference copy", () => {
    const dir = scratch();
    // A repo onboarded by kit 0.1.1: the command file holds the old workflow
    // inline, not the current thin dispatch wrapper.
    const oldWrapper = "# Old onboarding workflow, inlined by kit 0.1.1\n";
    mkdirSync(join(dir, ".claude/commands"), { recursive: true });
    writeFileSync(join(dir, ".claude/commands/harness-onboard.md"), oldWrapper);
    const report = runInit(dir);
    expect(
      readFileSync(join(dir, ".claude/commands/harness-onboard.md"), "utf8"),
    ).toBe(oldWrapper);
    expect(report.skipped).toContain(".claude/commands/harness-onboard.md");
    expect(report.references).toContain(
      ".claude/commands/harness-onboard.md.harness-kit",
    );
    // The reference is the current template wrapper, ready to swap in.
    expect(
      readFileSync(
        join(dir, ".claude/commands/harness-onboard.md.harness-kit"),
        "utf8",
      ),
    ).toBe(
      readFileSync(
        join(import.meta.dir, "template/.claude/commands/harness-onboard.md"),
        "utf8",
      ),
    );

    const second = runInit(dir);
    expect(second.references).toEqual([]);
  });

  test("command wrapper identical to the template gets no reference copy", () => {
    const dir = scratch();
    runInit(dir);
    const second = runInit(dir);
    expect(second.references).toEqual([]);
    expect(
      existsSync(join(dir, ".claude/commands/harness-onboard.md.harness-kit")),
    ).toBe(false);
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
