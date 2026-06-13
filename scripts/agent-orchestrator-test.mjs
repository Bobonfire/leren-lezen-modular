import assert from "node:assert/strict";
import {
  advanceState,
  buildPlan,
  canPublishPlan,
  determineRoute,
} from "./agent-orchestrator.mjs";

const fastIssue = {
  issue: {
    number: 21,
    title: "Bug: spelknoppen reageren niet",
    body: "Herstel bestaand gedrag.",
    labels: [{ name: "bug" }],
  },
};
const fullIssue = {
  issue: {
    number: 22,
    title: "Feature: nieuw voortgangsscherm",
    body: "Voeg nieuwe productfunctionaliteit toe.",
    labels: [{ name: "feature" }],
  },
};
const readyPull = {
  pull_request: {
    number: 23,
    title: "Fix navigation",
    state: "open",
    draft: false,
    head: { sha: "abc123" },
    labels: [{ name: "route:fast" }],
  },
};

assert.equal(determineRoute({
  event: fastIssue,
  eventName: "issues",
  workItem: fastIssue.issue,
  labels: ["bug"],
}), "fast");
assert.equal(determineRoute({
  event: fullIssue,
  eventName: "issues",
  workItem: fullIssue.issue,
  labels: ["feature"],
}), "full");

const fastPlan = buildPlan({ event: fastIssue, eventName: "issues" });
assert.equal(fastPlan.state, "state:fast-triage");
assert.deepEqual(fastPlan.nextAgents, ["developer"]);

const fullPlan = buildPlan({ event: fullIssue, eventName: "issues" });
assert.equal(fullPlan.state, "state:full-refinement");
assert.deepEqual(fullPlan.nextAgents, ["po"]);

const pullPlan = buildPlan({ event: readyPull, eventName: "pull_request" });
assert.equal(pullPlan.state, "state:fast-verification");
assert.deepEqual(pullPlan.nextAgents, ["tester", "reviewer"]);
assert.equal(pullPlan.sha, "abc123");

const approvalPlan = buildPlan({
  event: {
    issue: {
      number: 23,
      title: "Fix navigation",
      pull_request: { url: "https://api.github.com/repos/example/repo/pulls/23" },
    },
    pull_request: {
      number: 23,
      title: "Fix navigation",
      state: "open",
      draft: false,
      head: { sha: "approval123" },
      labels: [{ name: "route:fast" }, { name: "state:fast-approval" }],
    },
    comment: {
      body: "APPROVE FEATURE",
      author_association: "OWNER",
    },
  },
  eventName: "issue_comment",
});
assert.equal(approvalPlan.state, "state:ready-for-merge");
assert.equal(approvalPlan.sha, "approval123");

const persistedApprovalPlan = buildPlan({
  event: {
    action: "labeled",
    pull_request: {
      number: 23,
      title: "Approved fix",
      state: "open",
      draft: false,
      head: { sha: "approval123" },
      labels: [
        { name: "route:fast" },
        { name: "state:ready-for-merge" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(persistedApprovalPlan.state, "state:ready-for-merge");
assert.equal(persistedApprovalPlan.approvalDetected, true);
assert.equal(
  persistedApprovalPlan.workflowComment.includes("- Human approval: `received`"),
  true,
);

const unauthorizedApprovalPlan = buildPlan({
  event: {
    issue: {
      number: 23,
      title: "Fix navigation",
      labels: [{ name: "route:fast" }, { name: "state:fast-approval" }],
    },
    comment: {
      body: "APPROVE FEATURE",
      author_association: "NONE",
    },
  },
  eventName: "issue_comment",
});
assert.equal(unauthorizedApprovalPlan.state, "state:fast-approval");

assert.equal(advanceState("state:fast-verification", [
  "evidence:ci-passed",
  "evidence:test-passed",
  "evidence:review-passed",
  "evidence:documentation-none",
]), "state:fast-approval");
assert.equal(advanceState("state:full-verification", [
  "evidence:ci-passed",
  "evidence:test-passed",
  "evidence:review-passed",
]), "state:full-documentation");
assert.equal(advanceState("state:full-documentation", [
  "evidence:documentation-complete",
]), "state:full-acceptance");
assert.equal(advanceState("state:full-acceptance", [
  "evidence:product-accepted",
]), "state:full-approval");

const synchronizedPull = buildPlan({
  event: {
    action: "synchronize",
    pull_request: {
      number: 24,
      title: "Updated fix",
      state: "open",
      draft: false,
      head: { sha: "new123" },
      labels: [
        { name: "route:fast" },
        { name: "state:fast-verification" },
        { name: "evidence:ci-passed" },
        { name: "evidence:test-passed" },
        { name: "evidence:review-passed" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(synchronizedPull.state, "state:fast-verification");
assert.equal(
  synchronizedPull.labels.some((label) => label.startsWith("evidence:")),
  false,
);
assert.deepEqual(synchronizedPull.nextAgents, ["tester", "reviewer"]);

const synchronizedAcceptedPull = buildPlan({
  event: {
    action: "synchronize",
    pull_request: {
      number: 24,
      title: "Updated accepted feature",
      state: "open",
      draft: false,
      head: { sha: "new456" },
      labels: [
        { name: "route:full" },
        { name: "state:full-acceptance" },
        { name: "evidence:test-passed" },
        { name: "evidence:review-passed" },
        { name: "evidence:documentation-complete" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(synchronizedAcceptedPull.state, "state:full-verification");
assert.deepEqual(synchronizedAcceptedPull.nextAgents, ["tester", "reviewer"]);

const synchronizedReadyPull = buildPlan({
  event: {
    action: "synchronize",
    pull_request: {
      number: 24,
      title: "Updated approved feature",
      state: "open",
      draft: false,
      head: { sha: "new789" },
      labels: [
        { name: "route:full" },
        { name: "state:ready-for-merge" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(synchronizedReadyPull.state, "state:full-verification");

const synchronizedDraftPull = buildPlan({
  event: {
    action: "synchronize",
    pull_request: {
      number: 24,
      title: "Updated draft feature",
      state: "open",
      draft: true,
      head: { sha: "new-draft" },
      labels: [
        { name: "route:full" },
        { name: "state:full-acceptance" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(synchronizedDraftPull.state, "state:full-development");
assert.deepEqual(synchronizedDraftPull.nextAgents, ["developer"]);

const readyForReviewPull = buildPlan({
  event: {
    action: "ready_for_review",
    pull_request: {
      number: 24,
      title: "Feature ready for review",
      state: "open",
      draft: false,
      head: { sha: "ready123" },
      labels: [
        { name: "route:full" },
        { name: "state:full-development" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(readyForReviewPull.state, "state:full-verification");
assert.deepEqual(readyForReviewPull.nextAgents, ["tester", "reviewer"]);

const reopenedPull = buildPlan({
  event: {
    action: "reopened",
    pull_request: {
      number: 24,
      title: "Reopened fix",
      state: "open",
      draft: false,
      head: { sha: "reopened123" },
      labels: [
        { name: "route:fast" },
        { name: "state:done" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(reopenedPull.state, "state:fast-verification");
assert.deepEqual(reopenedPull.nextAgents, ["tester", "reviewer"]);

const approvedReview = buildPlan({
  event: {
    action: "submitted",
    pull_request: {
      number: 25,
      title: "Reviewed fix",
      state: "open",
      draft: false,
      head: { sha: "review123" },
      labels: [
        { name: "route:fast" },
        { name: "state:fast-verification" },
        { name: "evidence:ci-passed" },
        { name: "evidence:test-passed" },
        { name: "evidence:changes-required" },
        { name: "evidence:documentation-none" },
      ],
    },
    review: { state: "approved" },
  },
  eventName: "pull_request_review",
});
assert.equal(approvedReview.state, "state:fast-approval");
assert.equal(approvedReview.labels.includes("evidence:review-passed"), true);
assert.equal(approvedReview.labels.includes("evidence:changes-required"), false);

const dismissedReview = buildPlan({
  event: {
    action: "dismissed",
    pull_request: {
      number: 25,
      title: "Review dismissed",
      state: "open",
      draft: false,
      head: { sha: "review456" },
      labels: [
        { name: "route:full" },
        { name: "state:full-approval" },
        { name: "evidence:ci-passed" },
        { name: "evidence:test-passed" },
        { name: "evidence:review-passed" },
        { name: "evidence:documentation-complete" },
        { name: "evidence:product-accepted" },
      ],
    },
    review: { state: "approved" },
  },
  eventName: "pull_request_review",
});
assert.equal(dismissedReview.state, "state:full-verification");
assert.equal(dismissedReview.labels.includes("evidence:review-passed"), false);
assert.deepEqual(dismissedReview.nextAgents, ["tester", "reviewer"]);

const successfulCi = buildPlan({
  event: {
    workflow_run: {
      status: "completed",
      conclusion: "success",
      head_sha: "ci123",
      pull_requests: [{
        number: 26,
        title: "CI fix",
        state: "open",
        draft: false,
        head: { sha: "ci123" },
        labels: [
          { name: "route:full" },
          { name: "state:full-verification" },
          { name: "evidence:review-passed" },
        ],
      }],
    },
  },
  eventName: "workflow_run",
});
assert.equal(successfulCi.state, "state:full-verification");
assert.equal(successfulCi.labels.includes("evidence:ci-passed"), true);
assert.equal(successfulCi.labels.includes("evidence:test-passed"), false);
assert.equal(successfulCi.shouldPublish, true);
assert.equal(successfulCi.workflowComment.includes("- CI: `pass`"), true);
assert.equal(successfulCi.workflowComment.includes("- Tester: `pending`"), true);

for (const conclusion of ["success", "failure"]) {
  const staleCi = buildPlan({
    event: {
      pull_request: {
        number: 27,
        title: "Updated after CI started",
        state: "open",
        draft: false,
        head: { sha: "current456" },
        labels: [
          { name: "route:full" },
          { name: "state:full-verification" },
          { name: "evidence:review-passed" },
        ],
      },
      workflow_run: {
        status: "completed",
        conclusion,
        head_sha: "stale123",
        pull_requests: [{ number: 27 }],
      },
    },
    eventName: "workflow_run",
  });
  assert.equal(staleCi.shouldPublish, false);
  assert.equal(staleCi.labels.includes("evidence:ci-passed"), false);
  assert.equal(staleCi.labels.includes("evidence:test-passed"), false);
  assert.equal(staleCi.labels.includes("evidence:changes-required"), false);
}

const closedPull = buildPlan({
  event: {
    action: "closed",
    pull_request: {
      number: 28,
      title: "Completed feature",
      state: "closed",
      merged: true,
      draft: false,
      head: { sha: "merged123" },
      labels: [
        { name: "route:full" },
        { name: "state:ready-for-merge" },
        { name: "evidence:ci-passed" },
        { name: "evidence:test-passed" },
        { name: "evidence:review-passed" },
      ],
    },
  },
  eventName: "pull_request",
});
assert.equal(closedPull.state, "state:done");
assert.deepEqual(closedPull.nextAgents, []);

const stalePlan = buildPlan({
  event: {
    ref: "refs/heads/feature/old",
    after: "new-sha",
  },
  eventName: "push",
  existingPullRequests: [{
    state: "closed",
    merged_at: "2026-06-11T00:00:00Z",
    head: { sha: "old-sha" },
  }],
});
assert.equal(stalePlan.state, "state:blocked");
assert.equal(stalePlan.staleBranch, true);

const trustedPullRequest = {
  pull_request: {
    user: { login: "Bobonfire" },
    head: { repo: { full_name: "Bobonfire/leren-lezen-modular" } },
  },
};
assert.equal(canPublishPlan({
  event: trustedPullRequest,
  eventName: "pull_request",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "Bobonfire",
}), true);
assert.equal(canPublishPlan({
  event: {
    pull_request: {
      user: { login: "external-user" },
      head: { repo: { full_name: "external-user/leren-lezen-modular" } },
    },
  },
  eventName: "pull_request",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "external-user",
}), false);
assert.equal(canPublishPlan({
  event: {
    pull_request: {
      user: { login: "dependabot[bot]" },
      head: { repo: { full_name: "Bobonfire/leren-lezen-modular" } },
    },
  },
  eventName: "pull_request",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "dependabot[bot]",
}), false);
assert.equal(canPublishPlan({
  event: trustedPullRequest,
  eventName: "issue_comment",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "Bobonfire",
}), true);
assert.equal(canPublishPlan({
  event: {
    pull_request: {
      user: { login: "external-user" },
      head: { repo: { full_name: "external-user/leren-lezen-modular" } },
    },
  },
  eventName: "issue_comment",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "external-user",
}), false);
assert.equal(canPublishPlan({
  event: trustedPullRequest,
  eventName: "workflow_run",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "github-actions[bot]",
}), true);
assert.equal(canPublishPlan({
  event: {
    pull_request: {
      user: { login: "external-user" },
      head: { repo: { full_name: "external-user/leren-lezen-modular" } },
    },
  },
  eventName: "workflow_run",
  mode: "mutate",
  repository: "Bobonfire/leren-lezen-modular",
  actor: "github-actions[bot]",
}), false);

console.log("Agent orchestrator tests passed.");
