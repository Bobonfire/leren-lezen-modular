import { access, readdir, readFile } from "node:fs/promises";
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
const expectedAgentProfiles = new Map([
  ["developer", { model: "gpt-5.4", effort: "medium" }],
  ["documentation", { model: "gpt-5.4-mini", effort: "low" }],
  ["orchestrator", { model: "gpt-5.4-mini", effort: "low" }],
  ["product_owner", { model: "gpt-5.4-mini", effort: "medium" }],
  ["refactor", { model: "gpt-5.5", effort: "high" }],
  ["reviewer", { model: "gpt-5.4", effort: "medium" }],
  ["tester", { model: "gpt-5.4-mini", effort: "medium" }],
]);
const expectedSkills = new Set([
  "acceptance-review",
  "backlog-refinement",
  "budget-control",
  "compact-handoff",
  "debug",
  "decision-record",
  "definition-of-ready",
  "dev-summary",
  "github-backlog-publishing",
  "github-documentation-publishing",
  "github-review-publishing",
  "github-workflow-publishing",
  "handoff-package",
  "refactoring",
  "workflow-routing",
  "write-epic-descriptions",
  "write-feature-descriptions",
  "write-user-stories",
]);

await validateConfig();
await validateAgents();
await validateSkills();
await validateStructure();
await validateInstructionOwnership();

console.log(
  `Agent config passed: ${expectedAgents.size} agents and ${expectedSkills.size} skills are valid.`,
);

async function validateConfig() {
  const config = await read(".codex/config.toml");

  assert(config.includes("[agents]"), ".codex/config.toml mist [agents]");
  assert(/max_threads\s*=\s*\d+/.test(config), "agents.max_threads ontbreekt");
  assert(/max_depth\s*=\s*\d+/.test(config), "agents.max_depth ontbreekt");
  assert(
    /job_max_runtime_seconds\s*=\s*\d+/.test(config),
    "agents.job_max_runtime_seconds ontbreekt",
  );
}

async function validateAgents() {
  const directory = path.join(root, ".codex", "agents");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".toml"));
  const found = new Set();

  for (const file of files) {
    const content = await read(path.join(".codex", "agents", file));
    const name = extractTomlString(content, "name", file);
    const description = extractTomlString(content, "description", file);
    const model = extractTomlString(content, "model", file);
    const effort = extractTomlString(content, "model_reasoning_effort", file);
    const expectedProfile = expectedAgentProfiles.get(name);

    assert(
      new RegExp(
        String.raw`^developer_instructions\s*=\s*"""[\s\S]+?"""`,
        "m",
      ).test(content),
      `${file} mist developer_instructions`,
    );
    assert(description.trim().length >= 30, `${file} heeft een te korte description`);
    assert(path.parse(file).name === name, `${file} moet overeenkomen met name=${name}`);
    assert(expectedProfile, `${file} heeft geen verwacht modelprofiel`);
    assert(model === expectedProfile.model, `${file} verwacht model ${expectedProfile.model}`);
    assert(
      effort === expectedProfile.effort,
      `${file} verwacht reasoning effort ${expectedProfile.effort}`,
    );
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

async function validateInstructionOwnership() {
  const agents = await Promise.all(
    [...expectedAgents].map((name) =>
      read(path.join(".codex", "agents", `${name}.toml`))),
  );
  const joinedAgents = agents.join("\n");

  for (const phrase of [
    "CODE_QUALITY.md",
    "CODE_SECURITY.md",
    "docs/DOCUMENTATION.md",
    "docs/PROJECT_STRUCTURE.md",
    "docs/engineering/code-quality.md",
    "docs/engineering/code-security.md",
    "docs/engineering/project-structure.md",
    "docs/engineering/project-structure.svg",
    "Push of merge",
    "Push of merge nooit",
    "Voeg geen dependencies",
  ]) {
    assert(
      !joinedAgents.includes(phrase),
      `Agent-TOML dupliceert globale of domeininstructie: ${phrase}`,
    );
  }

  const agentsInstructions = await read("AGENTS.md");
  for (const requiredSource of [
    "docs/engineering/code-quality.md",
    "docs/engineering/code-security.md",
    "docs/engineering/project-structure.md",
    "docs/DOCUMENTATION.md",
    "docs/agents/README.md",
  ]) {
    assert(
      agentsInstructions.includes(requiredSource),
      `AGENTS.md contextmatrix mist ${requiredSource}`,
    );
  }

  const compactHandoff = await read(
    path.join(".agents", "skills", "compact-handoff", "SKILL.md"),
  );
  assert(
    compactHandoff.includes("Context sources:"),
    "compact-handoff mist Context sources",
  );

  const instructionFiles = [
    "AGENTS.md",
    ".github/workflows/ci.yml",
    "docs/DOCUMENTATION.md",
    "docs/HUMAN_GUIDE.md",
    "docs/ANGULAR_MIGRATION_PREPARATION.md",
    ...(await collectFiles(".codex")),
    ...(await collectFiles(".agents")),
    ...(await collectFiles("docs/agents")),
    ...(await collectFiles("docs/engineering")),
  ];
  const instructionCorpus = (
    await Promise.all(instructionFiles.map((file) => read(file)))
  ).join("\n");

  for (const stalePath of [
    "ai-agents/",
    "ai/ai_instructions/",
    "ai/README.ai.md",
    "docs/PROJECT_STRUCTURE.md",
    "docs/agents/AGENT_HANDBOOK.md",
    "docs/agents/AGENT_WORKFLOW_V2_PLAN.md",
    "docs/agents/agent-collaboration.md",
  ]) {
    assert(
      !instructionCorpus.includes(stalePath),
      `Agentdocumentatie bevat verouderd pad: ${stalePath}`,
    );
  }

  for (const staleProjectPhrase of ["SWR 4.5%", "Vite+vanilla", "EUR;"]) {
    assert(
      !instructionCorpus.includes(staleProjectPhrase),
      `Instructies bevatten projectvreemde regel: ${staleProjectPhrase}`,
    );
  }
}

async function validateStructure() {
  const requiredFiles = [
    "docs/agents/README.md",
    "docs/agents/collaboration.md",
    "docs/agents/workflows/fast-delivery.md",
    "docs/agents/workflows/full-delivery.md",
    "docs/agents/workflows/github-orchestration.md",
    "docs/agents/workflows/refactoring.md",
    "docs/agents/decisions/workflow-v2.md",
    "docs/agents/decisions/refactor-agent-research.md",
    "docs/engineering/code-quality.md",
    "docs/engineering/code-security.md",
    "docs/engineering/project-structure.md",
  ];
  for (const file of requiredFiles) {
    assert(await exists(file), `Verplicht structuurpad ontbreekt: ${file}`);
  }

  for (const forbiddenRoot of ["ai", "ai-agents"]) {
    assert(
      !(await exists(forbiddenRoot)),
      `Legacy agentmap moet verwijderd zijn: ${forbiddenRoot}`,
    );
  }

  for (const directory of [".codex", ".agents", "docs/agents", "docs/engineering"]) {
    const emptyDirectories = await findEmptyDirectories(directory);
    assert(
      emptyDirectories.length === 0,
      `Lege agentmappen gevonden: ${emptyDirectories.join(", ")}`,
    );
  }

  for (const file of await collectFiles("docs/agents")) {
    const basename = path.basename(file);
    assert(
      basename === "README.md"
        || /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(basename),
      `Agentdocument gebruikt geen lowercase kebab-case: ${file}`,
    );
  }
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

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files;
}

async function findEmptyDirectories(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  const empty = entries.length === 0 ? [relativeDirectory] : [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      empty.push(...await findEmptyDirectories(path.join(relativeDirectory, entry.name)));
    }
  }
  return empty;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
