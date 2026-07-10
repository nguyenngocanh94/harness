import { afterEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
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

  test("defaults to the published kit repo", () => {
    const args = parseArgs([], { HARNESS_KIT_CACHE: "/tmp/cache" });
    expect(args.repo).toBe("https://github.com/nguyenngocanh94/harness.git");
  });
});

describe("ensureKit", () => {
  test("clones from a local repo path, then reuses the cache", () => {
    const cache = join(scratch(), "kit-cache");
    const first = ensureKit(KIT_REPO, undefined, cache);
    expect(first.updated).toBe(true);
    expect(existsSync(join(cache, "init.ts"))).toBe(true);
    expect(existsSync(join(cache, "template", "AGENTS.md"))).toBe(true);

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

  test("recovers a cache whose history diverged from the remote", () => {
    const remote = makeKitRemote("1.0.0");
    const cache = join(scratch(), "kit-cache");
    ensureKit(remote, undefined, cache);
    expect(readFileSync(join(cache, "VERSION"), "utf8").trim()).toBe("1.0.0");

    // Upstream history rewritten (rebase/force-push): a fast-forward can
    // never succeed again, which is exactly how caches got pinned at 0.1.1.
    writeFileSync(join(remote, "VERSION"), "2.0.0\n");
    gitIn(remote, ["add", "VERSION"]);
    gitIn(remote, ["commit", "--amend", "-q", "-m", "rewritten"]);

    const result = ensureKit(remote, undefined, cache);
    expect(result.updated).toBe(true);
    expect(readFileSync(join(cache, "VERSION"), "utf8").trim()).toBe("2.0.0");
  });

  test("failed update falls back loudly, naming the cached kit version", () => {
    const remote = makeKitRemote("1.0.0");
    const cache = join(scratch(), "kit-cache");
    ensureKit(remote, undefined, cache);

    rmSync(remote, { recursive: true, force: true }); // remote unreachable

    const result = ensureKit(remote, undefined, cache);
    expect(result.updated).toBe(false);
    expect(result.note).toContain("1.0.0");
    expect(result.note.toLowerCase()).toContain("stale");
  });
});

function gitIn(dir: string, args: string[]): void {
  const result = spawnSync(
    "git",
    ["-C", dir, "-c", "user.email=test@test", "-c", "user.name=test", ...args],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed:\n${result.stdout}${result.stderr}`,
    );
  }
}

/** A throwaway upstream kit repo with a single commit at the given version. */
function makeKitRemote(version: string): string {
  const dir = join(scratch(), "kit-remote");
  mkdirSync(dir);
  gitIn(".", ["init", "-q", dir]);
  writeFileSync(join(dir, "VERSION"), `${version}\n`);
  writeFileSync(join(dir, "init.ts"), "// stub kit entry point\n");
  gitIn(dir, ["add", "."]);
  gitIn(dir, ["commit", "-q", "-m", `kit ${version}`]);
  return dir;
}

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
