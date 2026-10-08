import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// The template must stay consistent with itself: every path a template doc
// points at exists in the template, every workflow has a wrapper per tool and
// its AGENTS.md line, and the kit's version is stamped in one place. These are
// the staleness classes the kit's own friction log has recorded.

const KIT = import.meta.dir;
const TEMPLATE = join(KIT, "template");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const templateFiles = walk(TEMPLATE).map((f) => relative(TEMPLATE, f));
const markdown = templateFiles.filter((f) => f.endsWith(".md"));
const read = (rel: string) => readFileSync(join(TEMPLATE, rel), "utf8");

// A concrete template-relative path: docs/…, .claude/… or .agents/… ending in
// .md, with no placeholder segment (<name>, *, <date>, …).
const PATH_RE =
  /(?:^|[^A-Za-z0-9_./-])((?:docs|\.claude|\.agents)\/[A-Za-z0-9_./-]+\.md)/g;

// Per-tool entry points: Claude Code slash commands and Codex skills. Each is a
// thin shim that dispatches to one workflow body.
const WRAPPER_DIRS = [".claude/commands/", ".agents/skills/"];
const isWrapper = (f: string) => WRAPPER_DIRS.some((d) => f.startsWith(d));

describe("template self-consistency", () => {
  test("every concrete doc path mentioned in the template exists", () => {
    const missing: string[] = [];
    for (const file of markdown) {
      for (const match of read(file).matchAll(PATH_RE)) {
        const p = match[1] ?? "";
        if (p.endsWith(".harness-kit")) continue;
        // Repo-created files the template describes but does not ship.
        if (
          p.startsWith("docs/features/") &&
          p !== "docs/features/_template.md"
        )
          continue;
        if (p.startsWith("docs/plans/")) continue;
        if (!existsSync(join(TEMPLATE, p))) missing.push(`${file} → ${p}`);
      }
    }
    expect(missing).toEqual([]);
  });

  test("every workflow body has a wrapper per tool that dispatches to it and a line in AGENTS.md", () => {
    const workflows = templateFiles.filter((f) =>
      f.startsWith("docs/harness/workflows/"),
    );
    expect(workflows.length).toBeGreaterThan(0);
    const agents = read("AGENTS.md");
    for (const dir of WRAPPER_DIRS) {
      const wrappers = templateFiles
        .filter((f) => f.startsWith(dir))
        .map((f) => read(f));
      for (const wf of workflows) {
        expect(agents).toContain(wf);
        expect(wrappers.some((w) => w.includes(wf))).toBe(true);
      }
    }
  });

  test("Claude Code and Codex wrappers carry the same workflow names", () => {
    const commands = templateFiles
      .filter((f) => f.startsWith(".claude/commands/"))
      .map((f) => f.slice(".claude/commands/".length, -".md".length))
      .sort();
    const skills = templateFiles
      .filter((f) => f.startsWith(".agents/skills/") && f.endsWith("/SKILL.md"))
      .map((f) => f.split("/")[2])
      .sort();
    expect(skills).toEqual(commands);
    for (const name of skills) {
      expect(read(`.agents/skills/${name}/SKILL.md`)).toContain(
        `name: ${name}`,
      );
    }
  });

  test("every wrapper only dispatches — no inlined workflow", () => {
    for (const f of templateFiles.filter(isWrapper)) {
      const body = read(f).split("---").at(-1) ?? "";
      expect(body.trim().split("\n").length).toBeLessThanOrEqual(2);
      expect(body).toContain("docs/harness/workflows/");
    }
  });

  test("HARNESS.md mechanism table points at files that exist", () => {
    const missing: string[] = [];
    for (const line of read("HARNESS.md").split("\n")) {
      if (!line.startsWith("| ")) continue;
      for (const m of line.matchAll(
        /`((?:docs|\.claude|\.agents)\/[A-Za-z0-9_./-]+\.md)`/g,
      )) {
        const p = m[1] ?? "";
        if (!existsSync(join(TEMPLATE, p))) missing.push(p);
      }
    }
    expect(missing).toEqual([]);
  });

  test("VERSION, package.json, and CHANGELOG agree", () => {
    const version = readFileSync(join(KIT, "VERSION"), "utf8").trim();
    const pkg = JSON.parse(readFileSync(join(KIT, "package.json"), "utf8"));
    expect(pkg.version).toBe(version);
    expect(readFileSync(join(KIT, "CHANGELOG.md"), "utf8")).toContain(
      `## ${version} —`,
    );
  });

  test("friction protocol fields match the format the review workflow edits", () => {
    const protocol = read("docs/harness/friction.md");
    for (const field of ["Friction:", "Change:", "Prediction:", "Outcome:"]) {
      expect(protocol).toContain(field);
    }
    expect(protocol).toContain("## Archive");
    const review = read("docs/harness/workflows/review.md");
    expect(review).toContain("^Outcome: open");
    expect(review).toContain("## Archive");
  });

  test("template text stays generic — project facts live in TODO(harness) slots", () => {
    // Each slot must be the recognisable marker, never a filled-in guess.
    for (const f of markdown) {
      const text = read(f);
      expect(text).not.toMatch(/TODO\(harnes\)|TODO harness|TODO\(harness\s/);
    }
    expect(read("AGENTS.md")).toContain("TODO(harness)");
    expect(read("docs/harness/risk-profile.md")).toContain("TODO(harness)");
    expect(read("docs/harness/legibility.md")).toContain("TODO(harness)");
  });
});
