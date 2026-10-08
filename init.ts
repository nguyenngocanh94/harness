#!/usr/bin/env bun
/**
 * harness-kit installer — copies the harness skeleton into a target repo.
 *
 * Contract (invariant — see the kit's own AGENTS.md/CLAUDE.md):
 *   create-if-missing, never overwrite, never merge. Merging is the
 *   onboarding workflow's job. The only writes beyond create-if-missing:
 *   - docs/harness/kit-version is always (re)stamped;
 *   - when any template file already exists in the target and differs from
 *     the template, a one-time `<name>.harness-kit` reference copy is
 *     dropped beside it (merge source for manuals and workflow bodies, swap
 *     source for command wrappers, protocol update for logs and templates);
 *   - a CLAUDE.md bridge (a symlink to AGENTS.md, or an `@AGENTS.md` shim
 *     when symlinks are unavailable) is created only when the target has no
 *     CLAUDE.md, so Claude Code — which ignores AGENTS.md — reads the manual.
 *   Migration: a repo onboarded by an older kit has a real CLAUDE.md manual
 *   and no AGENTS.md; init leaves CLAUDE.md untouched, drops
 *   AGENTS.md.harness-kit as a merge source, and lets the upgrade workflow
 *   move the content. Never overwrites anything.
 * Idempotent: re-running heals interrupted runs and applies kit updates.
 */
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const KIT_ROOT = import.meta.dir;
const TEMPLATE_ROOT = join(KIT_ROOT, "template");
const VERSION_FILE = join(KIT_ROOT, "VERSION");
const KIT_VERSION_MARKER = join("docs", "harness", "kit-version");
const CANONICAL_MANUAL = "AGENTS.md";
const CLAUDE_BRIDGE = "CLAUDE.md";
const CLAUDE_SHIM = "@AGENTS.md\n";

export interface InitReport {
  created: string[];
  skipped: string[];
  references: string[];
  bridge: "symlink" | "shim" | null;
  migrationPending: boolean;
  kitVersion: string;
  previousKitVersion: string | null;
}

export class InitError extends Error {}

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

/** True if a path exists on disk, including a broken or valid symlink. */
function pathPresent(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

/** True if an existing CLAUDE.md is already a bridge to AGENTS.md. */
function isClaudeBridge(path: string): boolean {
  try {
    if (lstatSync(path).isSymbolicLink()) return true;
    return readFileSync(path, "utf8").trim() === "@AGENTS.md";
  } catch {
    return false;
  }
}

export function runInit(
  targetDir: string,
  options: { force?: boolean } = {},
): InitReport {
  const target = resolve(targetDir);
  if (!existsSync(target)) {
    throw new InitError(`target does not exist: ${target}`);
  }
  if (!existsSync(join(target, ".git")) && !options.force) {
    throw new InitError(
      `${target} is not a git repository — pass --force to onboard it anyway`,
    );
  }

  const kitVersion = readFileSync(VERSION_FILE, "utf8").trim();
  const report: InitReport = {
    created: [],
    skipped: [],
    references: [],
    bridge: null,
    migrationPending: false,
    kitVersion,
    previousKitVersion: null,
  };

  const claudePath = join(target, CLAUDE_BRIDGE);
  const agentsPath = join(target, CANONICAL_MANUAL);
  // Old-kit repo: a real CLAUDE.md manual exists and AGENTS.md does not yet.
  const migration =
    pathPresent(claudePath) &&
    !isClaudeBridge(claudePath) &&
    !pathPresent(agentsPath);

  for (const templateFile of walk(TEMPLATE_ROOT)) {
    const rel = relative(TEMPLATE_ROOT, templateFile);
    const destination = join(target, rel);

    // Migration: do not lay an empty AGENTS.md beside the repo's real
    // CLAUDE.md. Drop a reference copy; the onboarding workflow moves content.
    if (migration && rel === CANONICAL_MANUAL) {
      const reference = `${destination}.harness-kit`;
      if (!existsSync(reference)) {
        copyFileSync(templateFile, reference);
        report.references.push(`${rel}.harness-kit`);
      }
      report.migrationPending = true;
      continue;
    }

    // Every template file is kit-owned at install time. If the target's copy
    // differs (adapted locally, or the kit changed it), leave the copy alone
    // and drop the current template beside it once, so a kit change to any
    // file is visible in every onboarded repo — never only to an allowlist
    // (see docs/plans/2026-10-08-reference-copies-for-all-template-files.md).
    if (existsSync(destination)) {
      report.skipped.push(rel);
      const reference = `${destination}.harness-kit`;
      const differsFromTemplate =
        readFileSync(destination, "utf8") !==
        readFileSync(templateFile, "utf8");
      if (differsFromTemplate && !existsSync(reference)) {
        copyFileSync(templateFile, reference);
        report.references.push(`${rel}.harness-kit`);
      }
      continue;
    }
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(templateFile, destination);
    report.created.push(rel);
  }

  // CLAUDE.md bridge: only when the target has no CLAUDE.md at all and the
  // canonical manual exists. Symlink where the OS allows it, shim otherwise.
  // Never touches an existing CLAUDE.md (bridge or real manual).
  if (!pathPresent(claudePath) && existsSync(agentsPath)) {
    try {
      symlinkSync(CANONICAL_MANUAL, claudePath);
      report.bridge = "symlink";
    } catch {
      writeFileSync(claudePath, CLAUDE_SHIM);
      report.bridge = "shim";
    }
    report.created.push(CLAUDE_BRIDGE);
  }

  const markerPath = join(target, KIT_VERSION_MARKER);
  if (existsSync(markerPath)) {
    report.previousKitVersion = readFileSync(markerPath, "utf8").trim();
  }
  mkdirSync(dirname(markerPath), { recursive: true });
  writeFileSync(markerPath, `${kitVersion}\n`);

  return report;
}

function printReport(report: InitReport, target: string): void {
  console.log(`harness-kit ${report.kitVersion} → ${target}`);
  for (const file of report.created) {
    console.log(`  created  ${file}`);
  }
  for (const file of report.skipped) {
    console.log(`  skipped  ${file} (exists — untouched)`);
  }
  for (const file of report.references) {
    console.log(
      `  ref      ${file} (kit changed it — merge via /harness-upgrade)`,
    );
  }
  if (report.bridge) {
    console.log(`  bridge   CLAUDE.md → AGENTS.md (${report.bridge})`);
  }
  if (
    report.previousKitVersion &&
    report.previousKitVersion !== report.kitVersion
  ) {
    console.log(
      `  updated  kit-version ${report.previousKitVersion} → ${report.kitVersion}`,
    );
  }
  console.log("");
  if (report.references.length > 0) {
    console.log(
      "References were dropped beside files the kit changed. Run the upgrade",
    );
    console.log(
      "workflow (/harness-upgrade) to merge them before continuing; the kit's",
    );
    console.log("CHANGELOG.md lists what moved between the two versions.");
    console.log("");
  }
  if (report.migrationPending) {
    console.log(
      "Existing CLAUDE.md found with no AGENTS.md — a migration is pending.",
    );
    console.log(
      "Run the upgrade workflow (/harness-upgrade): it moves CLAUDE.md into",
    );
    console.log("AGENTS.md and installs the bridge.");
  } else {
    console.log(
      "Skeleton landed — the repo is NOT onboarded yet. Next: open it in your",
    );
    console.log(
      "agent tool and run the onboarding workflow (/harness-onboard in Claude",
    );
    console.log(
      "Code, $harness-onboard in Codex, or follow docs/harness/workflows/onboard.md).",
    );
  }
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const target = positional[0] ?? ".";
  try {
    const report = runInit(target, { force });
    printReport(report, resolve(target));
  } catch (error) {
    console.error(
      `[harness-kit] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}
