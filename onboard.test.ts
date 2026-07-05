import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ensureKit, OnboardError, parseArgs, runOnboard } from "./onboard";

const KIT_REPO = import.meta.dir;

const scratchDirs: string[] = [];

function scratch(): string {
  const dir = mkdtempSync(join(tmpdir(), "harness-onboard-test-"));
  scratchDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("parseArgs", () => {
  test("defaults, flags, and env overrides", () => {
    const args = parseArgs(
      ["/tmp/x", "--force", "--repo=https://r", "--ref=main"],
      {
        HARNESS_KIT_CACHE: "/tmp/cache",
      },
    );
    expect(args).toEqual({
      target: "/tmp/x",
      force: true,
      repo: "https://r",
      ref: "main",
      cacheDir: "/tmp/cache",
    });
    expect(() => parseArgs(["--nope"], {})).toThrow(OnboardError);
  });

  test("refuses to run against the unpublished placeholder repo", () => {
    const args = parseArgs([], { HARNESS_KIT_CACHE: "/tmp/cache" });
    expect(() => runOnboard(args)).toThrow(OnboardError);
  });
});

describe("ensureKit", () => {
  test("clones from a local repo path, then reuses the cache", () => {
    const cache = join(scratch(), "kit-cache");
    const first = ensureKit(KIT_REPO, undefined, cache);
    expect(first.updated).toBe(true);
    expect(existsSync(join(cache, "init.ts"))).toBe(true);
    expect(existsSync(join(cache, "template", "CLAUDE.md"))).toBe(true);

    const second = ensureKit(KIT_REPO, undefined, cache);
    expect(existsSync(join(cache, "init.ts"))).toBe(true);
    expect(typeof second.note).toBe("string");
  });

  test("clear error when the repo is unreachable and no cache exists", () => {
    const cache = join(scratch(), "kit-cache");
    expect(() =>
      ensureKit("https://example.invalid/nope.git", undefined, cache),
    ).toThrow(OnboardError);
  });
});

describe("runOnboard end to end", () => {
  test("bootstraps the kit and installs the skeleton into a target", () => {
    const cache = join(scratch(), "kit-cache");
    const target = scratch();
    mkdirSync(join(target, ".git"));
    const code = runOnboard({
      target,
      force: false,
      repo: KIT_REPO,
      ref: undefined,
      cacheDir: cache,
    });
    expect(code).toBe(0);
    expect(existsSync(join(target, "HARNESS.md"))).toBe(true);
    expect(existsSync(join(target, "docs/harness/kit-version"))).toBe(true);
    expect(
      existsSync(join(target, ".claude/commands/harness-onboard.md")),
    ).toBe(true);
  });
});
