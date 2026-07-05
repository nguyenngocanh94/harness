#!/usr/bin/env bun
/**
 * harness-kit single-command onboarder — the only file you need to distribute.
 *
 *   curl -fsSL <raw-url-to-this-file> | bun - [target] [--force]
 *   bun onboard.ts [target] [--force] [--repo=<git-url>] [--ref=<branch>]
 *
 * It ensures a fresh local clone of the kit repo (clone into a cache on first
 * run, fast-forward update afterwards; offline falls back to the cached copy),
 * then delegates to that clone's init.ts — which owns the actual install
 * contract (create-if-missing, never overwrite). This script never touches
 * the target directly.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const DEFAULT_REPO = "https://example.invalid/CHANGE-ME/harness-kit.git";
const DEFAULT_CACHE = join(homedir(), ".cache", "harness-kit");

export class OnboardError extends Error {}

interface GitResult {
  ok: boolean;
  output: string;
}

function git(args: string[], cwd?: string): GitResult {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  return { ok: result.status === 0, output };
}

/** Clone the kit into the cache, or fast-forward an existing cache. */
export function ensureKit(
  repo: string,
  ref: string | undefined,
  cacheDir: string,
): { updated: boolean; note: string } {
  if (!existsSync(join(cacheDir, ".git"))) {
    mkdirSync(dirname(cacheDir), { recursive: true });
    const cloneArgs = ["clone", "--depth", "1"];
    if (ref) cloneArgs.push("--branch", ref);
    cloneArgs.push(repo, cacheDir);
    const clone = git(cloneArgs);
    if (!clone.ok) {
      throw new OnboardError(
        `could not clone the kit from ${repo}\n${clone.output}`,
      );
    }
    return { updated: true, note: `cloned ${repo}` };
  }
  const pull = git(["-C", cacheDir, "pull", "--ff-only", "--depth", "1"]);
  if (!pull.ok) {
    return {
      updated: false,
      note: "update failed — using the cached kit (offline?)",
    };
  }
  return { updated: true, note: "cache up to date" };
}

export interface OnboardArgs {
  target: string;
  force: boolean;
  repo: string;
  ref: string | undefined;
  cacheDir: string;
}

export function parseArgs(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
): OnboardArgs {
  let target = ".";
  let force = false;
  let repo = env.HARNESS_KIT_REPO ?? DEFAULT_REPO;
  let ref: string | undefined;
  const cacheDir = env.HARNESS_KIT_CACHE ?? DEFAULT_CACHE;
  for (const arg of argv) {
    if (arg === "--force") force = true;
    else if (arg.startsWith("--repo=")) repo = arg.slice("--repo=".length);
    else if (arg.startsWith("--ref=")) ref = arg.slice("--ref=".length);
    else if (!arg.startsWith("--")) target = arg;
    else throw new OnboardError(`unknown flag: ${arg}`);
  }
  return { target, force, repo, ref, cacheDir };
}

export function runOnboard(args: OnboardArgs): number {
  if (args.repo === DEFAULT_REPO) {
    throw new OnboardError(
      "no kit repo configured — set HARNESS_KIT_REPO, pass --repo=<git-url>, or edit DEFAULT_REPO after publishing the kit",
    );
  }
  const kit = ensureKit(args.repo, args.ref, args.cacheDir);
  console.log(`[harness-kit] ${kit.note} (${args.cacheDir})`);
  const initPath = join(args.cacheDir, "init.ts");
  if (!existsSync(initPath)) {
    throw new OnboardError(`kit cache is broken: ${initPath} missing`);
  }
  const child = spawnSync(
    process.execPath,
    [initPath, resolve(args.target), ...(args.force ? ["--force"] : [])],
    { stdio: "inherit" },
  );
  return child.status ?? 1;
}

if (import.meta.main) {
  try {
    process.exitCode = runOnboard(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(
      `[harness-kit] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}
