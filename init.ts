#!/usr/bin/env bun
/**
 * harness-kit installer — copies the harness skeleton into a target repo.
 *
 * Contract (invariant — see CLAUDE.md):
 *   create-if-missing, never overwrite, never merge. Merging is the
 *   /harness-onboard agent's job. Two exceptions only:
 *   - docs/harness/kit-version is always (re)stamped;
 *   - when a merge-worthy file (CLAUDE.md, HARNESS.md) already exists, a
 *     one-time `<name>.harness-kit` reference copy is dropped beside it.
 * Idempotent: re-running heals interrupted runs and applies kit updates.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const KIT_ROOT = import.meta.dir;
const TEMPLATE_ROOT = join(KIT_ROOT, "template");
const VERSION_FILE = join(KIT_ROOT, "VERSION");
const KIT_VERSION_MARKER = join("docs", "harness", "kit-version");
const MERGE_REFERENCE_FILES = new Set(["CLAUDE.md", "HARNESS.md"]);

export interface InitReport {
  created: string[];
  skipped: string[];
  references: string[];
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
    kitVersion,
    previousKitVersion: null,
  };

  for (const templateFile of walk(TEMPLATE_ROOT)) {
    const rel = relative(TEMPLATE_ROOT, templateFile);
    const destination = join(target, rel);
    if (existsSync(destination)) {
      report.skipped.push(rel);
      if (MERGE_REFERENCE_FILES.has(rel)) {
        const reference = `${destination}.harness-kit`;
        const differsFromTemplate =
          readFileSync(destination, "utf8") !==
          readFileSync(templateFile, "utf8");
        if (differsFromTemplate && !existsSync(reference)) {
          copyFileSync(templateFile, reference);
          report.references.push(`${rel}.harness-kit`);
        }
      }
      continue;
    }
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(templateFile, destination);
    report.created.push(rel);
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
    console.log(`  ref      ${file} (merge source for /harness-onboard)`);
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
  console.log(
    "Skeleton landed — the repo is NOT onboarded yet. Next: open it in",
  );
  console.log("Claude Code and run /harness-onboard.");
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
