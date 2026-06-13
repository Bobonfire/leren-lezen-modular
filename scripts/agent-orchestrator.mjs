import { appendFileSync, existsSync, readFileSync } from "node:fs";

const STATE_LABEL_PREFIX = "state:";
const APPROVAL_PHRASE = "APPROVE FEATURE";

const stateActions = new Map([
  ["state:feature-proposed", "Start PO Agent for refinement."],
  ["state:ready-for-refinement", "Start PO Agent for backlog refinement."],
  ["state:ready-for-development", "Start Developer Agent."],
  ["state:ready-for-testing", "Start Tester Agent when a PR exists and CI is green."],
  ["state:ready-for-review", "Start Reviewer Agent when testing is non-blocking."],
  ["state:ready-for-documentation", "Start Documentation Agent and require a documented impact outcome."],
  ["state:ready-for-product-validation", "Start PO Agent for product validation."],
  ["state:ready-for-cpo-approval", "Ask Bob for explicit approval."],
  ["state:ready-for-merge", "Request merge only after explicit approval and green CI."],
  ["state:done", "No action. Workflow is complete."],
  ["state:blocked", "Escalate or pause until the blocker is resolved."],
]);

const eventName = process.env.GITHUB_EVENT_NAME || "manual";
const eventPath = process.env.GITHUB_EVENT_PATH;
const mode = process.env.AGENT_ORCHESTRATOR_MODE || "dry-run";

const event = readEventPayload(eventPath);
const workItem = getWorkItem(event);
const labels = getLabels(workItem);
const state = getState(labels, eventName, workItem);
const approvalDetected = hasApprovalComment(event);
const nextAction = getNextAction(state, eventName, approvalDetected);

const summary = [
  "# Agent Orchestrator",
  "",
  `Mode: ${mode}`,
  `Event: ${eventName}`,
  `Work item: ${formatWorkItem(workItem)}`,
  `Detected state: ${state}`,
  `Approval detected: ${approvalDetected ? "yes" : "no"}`,
  "",
  "## Next action",
  "",
  nextAction,
  "",
  "## Guardrail",
  "",
  "Dry-run mode does not start model calls, change labels, create pull requests, or merge code.",
  "",
].join("\n");

writeSummary(summary);
console.log(summary);

function readEventPayload(path) {
  if (!path || !existsSync(path)) {
    return {};
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

function getWorkItem(payload) {
  return payload.issue || payload.pull_request || payload.workflow_run || {};
}

function getLabels(item) {
  if (!Array.isArray(item.labels)) {
    return [];
  }

  return item.labels
    .map((label) => (typeof label === "string" ? label : label.name))
    .filter(Boolean);
}

function getState(labels, currentEventName, item) {
  const explicitState = labels.find((label) => label.startsWith(STATE_LABEL_PREFIX));

  if (explicitState) {
    return explicitState;
  }

  if (currentEventName === "issues" && item.title) {
    return "state:feature-proposed";
  }

  if (currentEventName === "pull_request" && item.html_url) {
    return "state:ready-for-testing";
  }

  if (currentEventName === "workflow_run") {
    return "state:ready-for-testing";
  }

  return "state:unknown";
}

function hasApprovalComment(payload) {
  const body = payload.comment?.body;
  return typeof body === "string" && body.trim().includes(APPROVAL_PHRASE);
}

function getNextAction(currentState, currentEventName, approvalDetected) {
  if (approvalDetected && currentState === "state:ready-for-merge") {
    return "Approval phrase found. Merge may be requested after required checks are confirmed green.";
  }

  if (approvalDetected) {
    return "Approval phrase found, but the work item is not in `state:ready-for-merge`.";
  }

  if (currentEventName === "issue_comment") {
    return "Comment received. Re-evaluate state labels and required agent artifacts.";
  }

  return stateActions.get(currentState) || "No valid state found. Add a workflow state label or escalate to Bob.";
}

function formatWorkItem(item) {
  const number = item.number ? `#${item.number}` : "unknown";
  const title = item.title || item.name || item.display_title || "unknown";
  return `${number} ${title}`;
}

function writeSummary(content) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryPath) {
    return;
  }

  appendFileSync(summaryPath, `${content}\n`, "utf8");
}
