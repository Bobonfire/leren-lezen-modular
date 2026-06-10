# Debug Skill

## Skill Name

Debug

## Purpose

Help the Developer Agent investigate and fix bugs, regressions, failing tests, broken UI interactions, runtime errors, build failures, and responsive layout defects in small, controlled iterations.

The goal is not to solve every visible problem at once. The goal is to make one bug reproducible, isolate the cause, apply the smallest safe fix, verify it, and document the evidence before moving to the next bug.

## Invocation Rules

The Debug skill must be executed when:

* A user reports that existing approved behavior no longer works.
* A test, build, CI job, smoke test, or runtime check fails.
* A button, route, form, mode, or interaction does not respond.
* The app does not initialize, renders blank, or logs blocking browser errors.
* The UI is not usable on required viewport sizes.
* A regression is found during testing, review, or product validation.
* The Developer Agent cannot explain a failure from the first error signal.

## Core Rules

* Debug one bug per iteration.
* Start with evidence, not guesses.
* Reproduce the bug before changing code when reproduction is possible.
* Change the smallest set of files needed to test the current hypothesis.
* Do not refactor while debugging unless the refactor is the smallest safe fix.
* Do not combine unrelated bugs in one patch.
* Do not expand product scope or change expected behavior without Product Owner approval.
* Preserve existing worktree changes that are unrelated to the bug.
* Add or update a regression check when the bug can reasonably be caught automatically.

## Debug Loop

### 1. Scope the Bug

Before editing files, identify:

* Reported symptom.
* Expected behavior.
* Actual behavior.
* User story or acceptance criteria affected.
* Suspected user impact.
* In-scope and out-of-scope areas.

Escalate to the Product Owner Agent when expected behavior is ambiguous or the fix would change product scope.

### 2. Reproduce the Bug

Record the smallest known reproduction:

* Steps to trigger the bug.
* Browser, device, viewport, command, or environment used.
* Required app state, data, storage, or route.
* Console errors, stack traces, failing assertions, screenshots, or logs.

If reproduction is not possible, document why and use the strongest available evidence, such as a static import error, missing asset path, or deterministic test failure.

### 3. Isolate the Cause

Investigate in narrow passes. Prefer this order unless the evidence points elsewhere:

* Recent diff and files touched by the failing story.
* App entrypoints and asset paths.
* Imports, exports, module loading, and startup errors.
* DOM selectors and event handler wiring.
* Disabled states, overlays, z-index, pointer events, and focus states.
* State transitions, storage, timers, and browser APIs.
* Data shape assumptions.
* CSS layout constraints and responsive breakpoints.
* Test setup, mocks, environment variables, and CI-only differences.

Maintain a short hypothesis log:

```text
Hypothesis:
Evidence:
Test:
Result:
Next action:
```

Only keep hypotheses that influence a decision. Do not document every command or trivial observation.

### 4. Apply the Smallest Fix

Patch only the cause under investigation.

Allowed:

* Correct a broken path, selector, import, event handler, state update, guard, or CSS constraint.
* Add a small helper when it removes real duplication or makes the fix safer.
* Add a focused smoke, unit, integration, or end-to-end regression check.

Avoid:

* Broad cleanup.
* Reformatting unrelated files.
* Rewriting architecture.
* Adding dependencies.
* Changing copy, layout, or behavior beyond the approved bugfix.
* Fixing adjacent bugs unless they are required to verify the current bug.

If a new bug is discovered, record it as a separate follow-up item unless it blocks verification of the current fix.

### 5. Verify the Fix

Run the smallest check that proves the fix, then broaden only as needed.

For UI bugs, verify:

* Original reproduction steps no longer fail.
* Relevant click, keyboard, and focus behavior.
* Required viewport sizes.
* Browser console has no blocking runtime errors.
* Critical content does not overlap, clip, or require unintended horizontal scrolling.

For test or build bugs, verify:

* The original failing command.
* The nearest related test scope.
* Any CI command affected by the change when available locally.

For runtime bugs, verify:

* Startup path.
* Error path.
* Success path.
* Optional browser API failures do not block core behavior when relevant.

### 6. Decide Next Iteration

After each bug iteration, decide one of:

* Fixed: evidence confirms the bug is resolved.
* Continue: same bug remains and the next hypothesis is clear.
* Split: a different bug was found and should become a separate item.
* Blocked: missing product intent, environment access, credentials, or unavailable tooling prevents progress.
* Escalation Required: guardrails require Product Owner or Chief Product Officer decision.

Stop after three failed independent hypotheses on the same bug and follow the Developer Agent failure mode: pair-programming, secondary Developer Agent, then escalation if still unresolved.

## Required Output

Every completed debug iteration must produce:

### Bug

Short title for the defect.

### Reproduction

Minimal steps or evidence that showed the defect.

### Root Cause

Plain-language explanation understandable by a non-technical stakeholder.

### Fix

Files changed and what changed at a high level.

### Verification

Commands, browser checks, viewport checks, screenshots, logs, or other evidence used.

### Risks

Remaining uncertainty, checks not run, or known limitations.

### Status

One of:

* Fixed
* Partially Fixed
* Split Into Follow-Up
* Blocked
* Escalation Required

## Handoff Requirements

Before handing work back to the Product Owner Agent, include:

* Dev Summary from `ai-agents/skills/shared-skills.md`.
* Bug iteration output.
* Test and verification evidence.
* GitHub Project Board update status when available.
* Pull request link when one exists.
* Known limitations and follow-up bugs.

## Forbidden Behavior

The Debug skill must never:

* Hide uncertainty.
* Mark a bug fixed without verification evidence.
* Change product intent.
* Create new features.
* Rewrite user stories or acceptance criteria.
* Ignore failing checks that are relevant to the bug.
* Replace the Dev Summary skill for handoff, escalation, completion, or closure.
