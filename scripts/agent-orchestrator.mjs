import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APPROVAL_PHRASE = "APPROVE FEATURE";
const COMMENT_MARKER = "<!-- agent-workflow-state -->";
const MANAGED_LABEL_PREFIXES = ["route:", "state:", "agent:", "evidence:"];
const LABEL_COLORS = {
  "route:fast": "0E8A16",
  "route:full": "5319E7",
  "state:fast-triage": "FBCA04",
  "state:fast-development": "1D76DB",
  "state:fast-verification": "0052CC",
  "state:fast-documentation": "006B75",
  "state:fast-approval": "B60205",
  "state:full-refinement": "FBCA04",
  "state:full-development": "1D76DB",
  "state:full-verification": "0052CC",
  "state:full-documentation": "006B75",
  "state:full-acceptance": "D4C5F9",
  "state:full-approval": "B60205",
  "state:ready-for-merge": "0E8A16",
  "state:blocked": "B60205",
  "state:done": "0E8A16",
  "agent:po": "C2E0C6",
  "agent:developer": "C2E0C6",
  "agent:tester": "C2E0C6",
  "agent:reviewer": "C2E0C6",
  "agent:documentation": "C2E0C6",
  "agent:human-approval-required": "F9D0C4",
  "evidence:ci-passed": "0E8A16",
  "evidence:test-passed": "0E8A16",
  "evidence:review-passed": "0E8A16",
  "evidence:changes-required": "B60205",
  "evidence:documentation-none": "BFDADC",
  "evidence:documentation-complete": "0E8A16",
  "evidence:product-accepted": "0E8A16",
};
const EVIDENCE_LABELS = Object.keys(LABEL_COLORS).filter((label) =>
  label.startsWith("evidence:"),
);

export function buildPlan({
  event = {},
  eventName = "manual",
  existingPullRequests = [],
} = {}) {
  const workItem = getWorkItem(event);
  const labels = getLabels(workItem);
  const workflowRunMatchesHead = isWorkflowRunForCurrentHead({
    event,
    eventName,
    workItem,
  });
  const evidenceLabels = getEvidenceLabels({
    event,
    eventName,
    labels,
    workflowRunMatchesHead,
  });
  const effectiveLabels = [
    ...labels.filter((label) => !label.startsWith("evidence:")),
    ...evidenceLabels,
  ];
  const route = determineRoute({ event, eventName, workItem, labels: effectiveLabels });
  const staleBranch = detectStaleBranch({ event, eventName, existingPullRequests });
  const approvalDetected = hasAuthorizedApprovalComment(event);
  const state = determineState({
    eventName,
    eventAction: event.action,
    workItem,
    labels: effectiveLabels,
    route,
    approvalDetected,
    staleBranch,
  });
  const next = determineNext({ state, route, approvalDetected });
  const sha = getSha(event, workItem);
  const number = workItem.number || event.workflow_run?.pull_requests?.[0]?.number || null;

  return {
    route,
    state,
    nextAction: next.action,
    nextAgents: next.agents,
    labels: buildDesiredLabels(route, state, next.agents, evidenceLabels),
    approvalDetected,
    staleBranch,
    shouldPublish: workflowRunMatchesHead,
    sha,
    number,
    workItem: formatWorkItem(workItem, number),
    workflowComment: buildWorkflowComment({
      route,
      state,
      sha,
      next,
      evidenceLabels,
      approvalDetected,
      staleBranch,
    }),
  };
}

export function determineRoute({ event, eventName, workItem, labels }) {
  if (labels.includes("route:fast")) return "fast";
  if (labels.includes("route:full")) return "full";

  const text = [
    workItem.title,
    workItem.body,
    event.comment?.body,
  ].filter(Boolean).join(" ").toLowerCase();

  const fullSignals = [
    "feature",
    "security",
    "privacy",
    "architect",
    "migration",
    "dependency",
    "database",
    "storage",
    "refactor",
    "breaking",
  ];

  if (
    labels.some((label) => ["feature", "security", "refactor", "architecture"].includes(label))
    || fullSignals.some((signal) => text.includes(signal))
  ) {
    return "full";
  }

  if (
    labels.some((label) => ["bug", "documentation", "maintenance", "ci"].includes(label))
    || eventName === "pull_request"
  ) {
    return "fast";
  }

  return eventName === "issues" ? "full" : "fast";
}

export function determineState({
  eventName,
  eventAction,
  workItem,
  labels,
  route,
  approvalDetected,
  staleBranch,
}) {
  if (staleBranch) return "state:blocked";

  if (
    eventName === "pull_request"
    && (workItem.merged || workItem.state === "closed")
  ) {
    return "state:done";
  }

  if (eventName === "pull_request" && eventAction === "synchronize") {
    return workItem.draft
      ? `state:${route}-development`
      : `state:${route}-verification`;
  }

  if (eventName === "pull_request_review" && eventAction === "dismissed") {
    return workItem.draft
      ? `state:${route}-development`
      : `state:${route}-verification`;
  }

  const explicitState = labels.find((label) => label.startsWith("state:"));
  if (approvalDetected && explicitState?.endsWith("-approval")) {
    return "state:ready-for-merge";
  }
  if (explicitState) {
    return advanceState(explicitState, labels);
  }

  if (eventName === "issues") {
    return route === "fast" ? "state:fast-triage" : "state:full-refinement";
  }

  if (eventName === "pull_request") {
    if (workItem.merged || workItem.state === "closed") return "state:done";
    return workItem.draft
      ? `state:${route}-development`
      : `state:${route}-verification`;
  }

  if (eventName === "workflow_run") {
    return `state:${route}-verification`;
  }

  return route === "fast" ? "state:fast-triage" : "state:full-refinement";
}

export function advanceState(state, labels) {
  if (labels.includes("evidence:changes-required")) {
    return state.includes("full")
      ? "state:full-development"
      : "state:fast-development";
  }

  const verified = labels.includes("evidence:ci-passed")
    && labels.includes("evidence:test-passed")
    && labels.includes("evidence:review-passed");
  if (state === "state:fast-verification" && verified) {
    return labels.includes("evidence:documentation-none")
      ? "state:fast-approval"
      : "state:fast-documentation";
  }
  if (
    state === "state:fast-documentation"
    && labels.includes("evidence:documentation-complete")
  ) {
    return "state:fast-approval";
  }
  if (state === "state:full-verification" && verified) {
    return "state:full-documentation";
  }
  if (
    state === "state:full-documentation"
    && labels.includes("evidence:documentation-complete")
  ) {
    return "state:full-acceptance";
  }
  if (
    state === "state:full-acceptance"
    && labels.includes("evidence:product-accepted")
  ) {
    return "state:full-approval";
  }
  return state;
}

export function determineNext({ state, route, approvalDetected }) {
  if (state === "state:blocked") {
    return { action: "Stop delivery and create a fresh branch from current main.", agents: [] };
  }
  if (state === "state:done") {
    return { action: "No action. Workflow is complete.", agents: [] };
  }
  if (state === "state:ready-for-merge") {
    return {
      action: approvalDetected
        ? "Human approval found. Verify required checks, then await an explicit merge command."
        : "Await explicit human approval.",
      agents: [],
    };
  }

  const actions = {
    "state:fast-triage": {
      action: "Start Developer. Start Product Owner only when product decisions are missing.",
      agents: ["developer"],
    },
    "state:fast-development": {
      action: "Developer completes the draft PR and local evidence.",
      agents: ["developer"],
    },
    "state:fast-verification": {
      action: "Start Tester and Reviewer in parallel on the exact same PR SHA.",
      agents: ["tester", "reviewer"],
    },
    "state:fast-documentation": {
      action: "Start Documentation only when impact is agent, human, or both.",
      agents: ["documentation"],
    },
    "state:fast-approval": {
      action: "Ask Bob for explicit approval.",
      agents: [],
    },
    "state:full-refinement": {
      action: "Start Product Owner for refinement and Definition of Ready.",
      agents: ["po"],
    },
    "state:full-development": {
      action: "Start Developer or Refactor according to the approved scope.",
      agents: ["developer"],
    },
    "state:full-verification": {
      action: "Start Tester and Reviewer in parallel on the exact same PR SHA.",
      agents: ["tester", "reviewer"],
    },
    "state:full-documentation": {
      action: "Start Documentation for repository and GitHub documentation impact.",
      agents: ["documentation"],
    },
    "state:full-acceptance": {
      action: "Start Product Owner for final product acceptance.",
      agents: ["po"],
    },
    "state:full-approval": {
      action: "Ask Bob for explicit approval.",
      agents: [],
    },
  };

  return actions[state] || {
    action: `No transition defined for ${state} on route ${route}.`,
    agents: [],
  };
}

export function detectStaleBranch({ event, eventName, existingPullRequests }) {
  if (eventName !== "push") return false;
  return existingPullRequests.some((pull) =>
    pull.merged_at || pull.state === "closed",
  );
}

export function canPublishPlan({
  event,
  eventName,
  mode,
  repository,
  actor,
}) {
  if (mode !== "mutate") return false;
  const pullRequestScoped = ["pull_request", "pull_request_review", "issue_comment"]
    .includes(eventName) && event.pull_request;
  if (!pullRequestScoped) return true;

  const pullRequest = event.pull_request;
  const dependabot = "dependabot[bot]";
  return Boolean(
    repository
    && pullRequest?.head?.repo?.full_name === repository
    && pullRequest.user?.login !== dependabot
    && actor !== dependabot,
  );
}

function getWorkItem(payload) {
  return payload.pull_request
    || payload.issue
    || payload.workflow_run?.pull_requests?.[0]
    || {};
}

function getLabels(item) {
  if (!Array.isArray(item.labels)) return [];
  return item.labels
    .map((label) => typeof label === "string" ? label : label.name)
    .filter(Boolean);
}

function isWorkflowRunForCurrentHead({ event, eventName, workItem }) {
  if (eventName !== "workflow_run") return true;

  const workflowSha = event.workflow_run?.head_sha;
  const pullRequestSha = workItem.head?.sha;
  return Boolean(workflowSha && pullRequestSha && workflowSha === pullRequestSha);
}

function getEvidenceLabels({
  event,
  eventName,
  labels,
  workflowRunMatchesHead,
}) {
  if (eventName === "pull_request" && event.action === "synchronize") {
    return [];
  }

  const evidence = new Set(labels.filter((label) => label.startsWith("evidence:")));
  if (eventName === "pull_request_review") {
    const reviewState = event.review?.state?.toLowerCase();
    if (reviewState === "approved") {
      evidence.delete("evidence:changes-required");
      evidence.add("evidence:review-passed");
    }
    if (reviewState === "changes_requested") {
      evidence.delete("evidence:review-passed");
      evidence.add("evidence:changes-required");
    }
    if (event.action === "dismissed") {
      evidence.delete("evidence:review-passed");
      evidence.delete("evidence:changes-required");
    }
  }
  if (
    eventName === "workflow_run"
    && workflowRunMatchesHead
    && event.workflow_run?.status === "completed"
  ) {
    if (event.workflow_run.conclusion === "success") {
      evidence.add("evidence:ci-passed");
    } else {
      evidence.delete("evidence:ci-passed");
      evidence.add("evidence:changes-required");
    }
  }
  return [...evidence];
}

function hasAuthorizedApprovalComment(payload) {
  const body = payload.comment?.body;
  const authorizedAssociations = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
  return typeof body === "string"
    && body.trim() === APPROVAL_PHRASE
    && authorizedAssociations.has(payload.comment?.author_association);
}

function getSha(event, workItem) {
  return workItem.head?.sha
    || event.workflow_run?.head_sha
    || event.pull_request?.head?.sha
    || event.after
    || null;
}

function buildDesiredLabels(route, state, agents, evidenceLabels) {
  return [
    `route:${route}`,
    state,
    ...agents.map((agent) => `agent:${agent}`),
    ...(state.endsWith("-approval") ? ["agent:human-approval-required"] : []),
    ...evidenceLabels,
  ];
}

function buildWorkflowComment({
  route,
  state,
  sha,
  next,
  evidenceLabels,
  approvalDetected,
  staleBranch,
}) {
  const evidence = new Set(evidenceLabels);
  const documentation = evidence.has("evidence:documentation-complete")
    ? "complete"
    : evidence.has("evidence:documentation-none")
      ? "no update required"
      : "pending";

  return [
    COMMENT_MARKER,
    "## Agent Workflow",
    "",
    `- Route: \`${route}\``,
    `- State: \`${state}\``,
    `- Commit: \`${sha || "unknown"}\``,
    `- CI: \`${evidence.has("evidence:ci-passed") ? "pass" : "pending"}\``,
    `- Tester: \`${evidence.has("evidence:test-passed") ? "pass" : "pending"}\``,
    `- Reviewer: \`${evidence.has("evidence:review-passed") ? "pass" : "pending"}\``,
    `- Documentation impact: \`${documentation}\``,
    `- Human approval: \`${approvalDetected ? "received" : "pending"}\``,
    `- Branch guard: \`${staleBranch ? "blocked: previously completed PR branch" : "pass"}\``,
    "",
    `**Next action:** ${next.action}`,
    "",
    `**Next agents:** ${next.agents.length ? next.agents.join(", ") : "none"}`,
  ].join("\n");
}

function formatWorkItem(item, number) {
  const formattedNumber = number ? `#${number}` : "unknown";
  const title = item.title || item.name || item.display_title || "unknown";
  return `${formattedNumber} ${title}`;
}

async function loadExistingPullRequests(eventName, event) {
  if (eventName !== "push" || !process.env.GITHUB_REPOSITORY || !process.env.GITHUB_TOKEN) {
    return [];
  }

  const branch = event.ref?.replace("refs/heads/", "");
  const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
  if (!branch) return [];

  return githubRequest(
    `/repos/${process.env.GITHUB_REPOSITORY}/pulls?state=all&head=${owner}:${encodeURIComponent(branch)}`,
  );
}

async function publishPlan(plan, eventName) {
  if (!process.env.GITHUB_REPOSITORY || !process.env.GITHUB_TOKEN) {
    throw new Error("Mutation mode requires GITHUB_REPOSITORY and GITHUB_TOKEN.");
  }
  if (!plan.number) {
    if (eventName === "push") return;
    throw new Error("Mutation mode requires an issue or pull request number.");
  }

  await ensureLabels([...new Set([...plan.labels, ...EVIDENCE_LABELS])]);
  const existingLabels = await githubRequest(
    `/repos/${process.env.GITHUB_REPOSITORY}/issues/${plan.number}/labels`,
  );
  const retained = existingLabels
    .map((label) => label.name)
    .filter((label) => !MANAGED_LABEL_PREFIXES.some((prefix) => label.startsWith(prefix)));
  await githubRequest(
    `/repos/${process.env.GITHUB_REPOSITORY}/issues/${plan.number}/labels`,
    { method: "PUT", body: { labels: [...retained, ...plan.labels] } },
  );

  const comments = await githubRequest(
    `/repos/${process.env.GITHUB_REPOSITORY}/issues/${plan.number}/comments?per_page=100`,
  );
  const workflowComment = comments.find((comment) => comment.body?.includes(COMMENT_MARKER));
  if (workflowComment) {
    await githubRequest(
      `/repos/${process.env.GITHUB_REPOSITORY}/issues/comments/${workflowComment.id}`,
      { method: "PATCH", body: { body: plan.workflowComment } },
    );
  } else {
    await githubRequest(
      `/repos/${process.env.GITHUB_REPOSITORY}/issues/${plan.number}/comments`,
      { method: "POST", body: { body: plan.workflowComment } },
    );
  }
}

async function ensureLabels(labels) {
  for (const label of labels) {
    try {
      await githubRequest(`/repos/${process.env.GITHUB_REPOSITORY}/labels`, {
        method: "POST",
        body: {
          name: label,
          color: LABEL_COLORS[label] || "D4C5F9",
          description: "Managed by the agent workflow orchestrator.",
        },
      });
    } catch (error) {
      if (error.status !== 422) throw error;
    }
  }
}

async function githubRequest(apiPath, { method = "GET", body } = {}) {
  const response = await fetch(`https://api.github.com${apiPath}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "leren-lezen-agent-orchestrator",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`GitHub API ${method} ${apiPath} failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

function writeSummary(plan, mode, eventName, publicationAllowed) {
  const summary = [
    "# Agent Orchestrator",
    "",
    `Mode: ${mode}`,
    `Event: ${eventName}`,
    `Work item: ${plan.workItem}`,
    `Route: ${plan.route}`,
    `State: ${plan.state}`,
    `Commit: ${plan.sha || "unknown"}`,
    `Approval detected: ${plan.approvalDetected ? "yes" : "no"}`,
    `Branch guard: ${plan.staleBranch ? "blocked" : "pass"}`,
    `GitHub mutation: ${publicationAllowed ? "allowed" : "skipped"}`,
    "",
    "## Next action",
    "",
    plan.nextAction,
    "",
    `Next agents: ${plan.nextAgents.length ? plan.nextAgents.join(", ") : "none"}`,
    "",
  ].join("\n");

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, "utf8");
  }
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, [
      `route=${plan.route}`,
      `state=${plan.state}`,
      `next_agents=${plan.nextAgents.join(",")}`,
      `blocked=${plan.staleBranch}`,
      "",
    ].join("\n"), "utf8");
  }
  console.log(summary);
}

async function main() {
  const eventName = process.env.GITHUB_EVENT_NAME || "manual";
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const mode = process.env.AGENT_ORCHESTRATOR_MODE || "dry-run";
  let event = eventPath && existsSync(eventPath)
    ? JSON.parse(readFileSync(eventPath, "utf8"))
    : {};
  event = await hydrateEvent(eventName, event);
  const existingPullRequests = await loadExistingPullRequests(eventName, event);
  const plan = buildPlan({ event, eventName, existingPullRequests });
  const publicationAllowed = canPublishPlan({
    event,
    eventName,
    mode,
    repository: process.env.GITHUB_REPOSITORY,
    actor: process.env.GITHUB_ACTOR,
  });

  if (publicationAllowed && plan.shouldPublish) {
    await publishPlan(plan, eventName);
  }
  writeSummary(plan, mode, eventName, publicationAllowed);

  if (plan.staleBranch) {
    process.exitCode = 2;
  }
}

async function hydrateEvent(eventName, event) {
  if (
    !process.env.GITHUB_REPOSITORY
    || !process.env.GITHUB_TOKEN
  ) {
    return event;
  }

  const number = eventName === "workflow_run"
    ? event.workflow_run?.pull_requests?.[0]?.number
    : eventName === "issue_comment" && event.issue?.pull_request
      ? event.issue.number
      : null;
  if (!number) return event;

  const pullRequest = await githubRequest(
    `/repos/${process.env.GITHUB_REPOSITORY}/pulls/${number}`,
  );
  return { ...event, pull_request: pullRequest };
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  await main();
}
