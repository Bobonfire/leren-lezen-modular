import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const expectedAgents = new Set([
  "developer",
  "documentation",
  "orchestrator",
  "product_owner",
  "refactor",
  "reviewer",
  "tester",
]);
const expectedSkills = new Set([
  "acceptance-review",
  "backlog-refinement",
  "budget-control",
  "debug",
  "decision-record",
  "definition-of-ready",
  "dev-summary",
  "github-backlog-publishing",
  "handoff-package",
  "refactoring",
  "write-epic-descriptions",
  "write-feature-descriptions",
  "write-user-stories",
]);

await validateConfig();
await validateAgents();
await validateSkills();

console.log(
  `Agent config passed: ${expectedAgents.size} agents and ${expectedSkills.size} skills are valid.`,
);

async function validateConfig() {
  const config = await read(".codex/config.toml");

  assert(config.includes("[agents]"), ".codex/config.toml mist [agents]");
  assert(/max_threads\s*=\s*\d+/.test(config), "agents.max_threads ontbreekt");
  assert(/max_depth\s*=\s*\d+/.test(config), "agents.max_depth ontbreekt");
}

async function validateAgents() {
  const directory = path.join(root, ".codex", "agents");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".toml"));
  const found = new Set();

  for (const file of files) {
    const content = await read(path.join(".codex", "agents", file));
    const name = extractTomlString(content, "name", file);
    const description = extractTomlString(content, "description", file);

    assert(
      new RegExp(
        String.raw`^developer_instructions\s*=\s*"""[\s\S]+?"""`,
        "m",
      ).test(content),
      `${file} mist developer_instructions`,
    );
    assert(description.trim().length >= 30, `${file} heeft een te korte description`);
    assert(path.parse(file).name === name, `${file} moet overeenkomen met name=${name}`);
    assert(!found.has(name), `Dubbele agentnaam: ${name}`);
    found.add(name);
  }

  assertExpected(found, expectedAgents, "agent");
}

async function validateSkills() {
  const directory = path.join(root, ".agents", "skills");
  const entries = await readdir(directory, { withFileTypes: true });
  const found = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillPath = path.join(".agents", "skills", entry.name);
    const content = await read(path.join(skillPath, "SKILL.md"));
    const metadata = parseFrontmatter(content, entry.name);

    assert(metadata.name === entry.name, `${entry.name}: mapnaam en skillnaam verschillen`);
    assert(metadata.description.length >= 80, `${entry.name}: description is te kort`);
    assert(!content.includes("TODO"), `${entry.name}: bevat nog TODO`);
    assert(!found.has(metadata.name), `Dubbele skillnaam: ${metadata.name}`);

    const ui = await read(path.join(skillPath, "agents", "openai.yaml"));
    assert(ui.includes("display_name:"), `${entry.name}: display_name ontbreekt`);
    assert(ui.includes("short_description:"), `${entry.name}: short_description ontbreekt`);
    assert(
      ui.includes(`$${entry.name}`),
      `${entry.name}: default_prompt noemt de skill niet`,
    );

    found.add(metadata.name);
  }

  assertExpected(found, expectedSkills, "skill");
}

function parseFrontmatter(content, skillName) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(match, `${skillName}: ongeldige YAML-frontmatter`);

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    assert(separator > 0, `${skillName}: ongeldige frontmatterregel`);
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    assert(["name", "description"].includes(key), `${skillName}: onverwacht veld ${key}`);
    assert(value, `${skillName}: leeg veld ${key}`);
    metadata[key] = value;
  }

  assert(metadata.name, `${skillName}: name ontbreekt`);
  assert(metadata.description, `${skillName}: description ontbreekt`);
  return metadata;
}

function extractTomlString(content, field, file) {
  const match = content.match(new RegExp(`^${field}\\s*=\\s*"([^"]+)"`, "m"));
  assert(match, `${file} mist ${field}`);
  return match[1];
}

function assertExpected(found, expected, kind) {
  for (const name of expected) {
    assert(found.has(name), `Verplichte ${kind} ontbreekt: ${name}`);
  }
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

