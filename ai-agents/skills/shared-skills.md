# Shared Skills

## Skill Name

Dev Summary

## Purpose

Provide a concise, human-readable summary of work completed by an agent before handing work to another agent, escalating to the Chief Product Officer, or marking work as completed.

The summary must be understandable by a non-technical stakeholder and provide sufficient context to understand what happened without reading source code, pull requests, issue discussions, or agent conversations.

This skill is mandatory for every agent.

## Invocation Rules

The Dev Summary skill must be executed:

* Before handing work to another agent
* Before escalating to another agent
* Before escalating to the Chief Product Officer
* Before marking a task as completed
* Before closing a user story
* Before requesting human intervention

## Output Format

### Original Assignment

What was the agent asked to do?

Example:

"Implement the ability for users to export their cycling data to a CSV file."

### Outcome

What was completed?

Example:

"The export functionality was successfully implemented and users can now download their cycling data as a CSV file."

### Design Decisions

Which important decisions were made?

For each meaningful decision provide:

* Decision
* Reasoning
* Alternatives considered

Example:

Decision:
Store generated CSV files in temporary storage.

Reason:
Reduces database load and simplifies cleanup.

Alternative:
Store files permanently in the database.

Why rejected:
Would increase storage costs and complexity.

Decision records are only required for meaningful choices. Do not record microdetails such as routine renames, formatting changes, or obvious mechanical edits.

### Conflicts and Resolutions

Were there disagreements, blockers, or conflicting requirements?

For each conflict provide:

* Conflict
* Parties involved
* Resolution

Example:

Conflict:
Developer Agent wanted to cache export results.

Parties:
Developer Agent and Reviewer Agent.

Resolution:
Caching was removed because export performance was already acceptable and caching would introduce unnecessary complexity.

### Risks and Trade-Offs

What known risks remain?

Example:

Large exports above 1 million rows may take longer than expected.

### Outstanding Work

What still needs to happen?

Example:

Documentation update pending.

### Recommendation

One of:

* Ready for Development
* Ready for Testing
* Ready for Review
* Ready for Acceptance
* Ready for Release
* Escalation Required

## Quality Rules

The summary must:

* Be understandable by a non-technical stakeholder
* Avoid implementation jargon where possible
* Explain why decisions were made
* Explain rejected alternatives when relevant
* Highlight unresolved risks
* Be no longer than necessary
* Focus on decisions, not code details

## Forbidden Behavior

The summary must never:

* Dump source code
* Dump logs
* Dump chain-of-thought reasoning
* Include internal model reasoning
* Include speculative explanations

The goal is transparency of decisions, not transparency of reasoning.

## Skill Name

Decision Record

## Purpose

Record meaningful product, architecture, workflow, security, or quality decisions that affect how work is delivered, accepted, or maintained.

Decision Records are mandatory only when a meaningful choice is made. They must not be created for routine microdetails, mechanical edits, formatting changes, simple renames, or obvious implementation steps.

## Invocation Rules

The Decision Record skill must be executed when:

* A meaningful product, architecture, workflow, security, or quality decision is made
* A non-obvious trade-off is accepted
* Multiple viable alternatives were considered
* A risk is accepted instead of eliminated
* Agents resolve a substantive disagreement
* A workflow exception is approved

The Decision Record skill must not be executed for:

* Routine function or variable renames
* Formatting-only changes
* Mechanical file moves
* Obvious implementation details with no lasting impact
* Repeating decisions already documented elsewhere

## Output Format

### Decision

What was decided?

### Context

Why was a decision needed?

### Reasoning

What facts, constraints, or risks drove the decision?

### Alternatives Considered

Which realistic alternatives were considered?

### Why Alternatives Were Rejected

Why were the alternatives not chosen?

### Consequences

What changes, risks, or follow-up work result from this decision?

## Quality Rules

The decision record must:

* Capture only meaningful choices
* Be concise and understandable by stakeholders
* Explain trade-offs without dumping internal reasoning
* Identify consequences and accepted risks
* Link to the relevant work item, handoff, or escalation when available

## Forbidden Behavior

The decision record must never:

* Document trivial implementation details
* Replace acceptance criteria
* Override Product Owner, Reviewer, Tester, or Developer Agent decision rights
* Include chain-of-thought reasoning
* Include source code dumps or raw logs

## Skill Name

Write User Stories

## Purpose

Write clear, actionable user stories that express product intent, desired output, and agent-ready execution tasks.

This skill is primarily used by the Product Owner Agent when creating, refining, or updating backlog items for handoff to another agent.

## Invocation Rules

The Write User Stories skill must be executed when:

* A new user story is created.
* An existing user story is refined.
* A regression, bugfix, feature, or improvement is converted into backlog work.
* Work is handed off to the Developer Agent, Tester Agent, Documentation Agent, or another execution agent.
* A backlog item is checked for readiness before being marked Ready For Development, Ready For Testing, Ready For Review, or Ready For Acceptance.

## Required Output Format

Every user story must use this structure:

### Title

`als {persona}, wil ik {gewenste actie of mogelijkheid}, omdat {waarde of reden}`

Title rules:

* Always use the exact `als ..., wil ik ..., omdat ...` format.
* State one persona, one need, and one clear reason.
* Keep the title concise and understandable for non-technical stakeholders.
* Do not include implementation details, technology choices, or testing instructions in the title.

### Description

The description must always be written in Given/When/Then format:

```text
Given {context and preconditions}
When {trigger, user action, or event}
Then {expected product outcome and visible result}
```

Description rules:

* Describe the desired output clearly enough that an execution agent can understand what must be delivered.
* Focus on product behavior and user value.
* Include relevant constraints, boundaries, and out-of-scope behavior when needed.
* Avoid technical implementation decisions unless they are approved constraints.

### Acceptance Criteria

Acceptance criteria must:

* Be specific, observable, and verifiable.
* Describe what must be true for the user story to be accepted.
* Include relevant edge cases, accessibility expectations, content expectations, and business rules when applicable.
* Avoid prescribing implementation details unless they are approved constraints.

### Task

The task section must be agent ready.

Agent-ready task rules:

* State which agent should execute the task.
* Give the agent a clear, bounded assignment.
* Include required inputs, outputs, constraints, and handoff expectations.
* Make the task executable without requiring the agent to infer missing product intent.
* Avoid assigning a task to a human when an agent can execute it.
* If human clarification is required, state the exact missing decision and mark the story as not ready.

## Agent Ready Definition

A user story is agent ready only when:

* The title follows the required `als ..., wil ik ..., omdat ...` format.
* The description uses Given/When/Then.
* The desired output is explicit.
* The executing agent is named.
* The task has clear boundaries and does not require unstated assumptions.
* Dependencies, constraints, and required evidence are listed when relevant.
* The story can be handed off without additional product interpretation.

## Quality Rules

The user story must:

* Be written in Dutch unless existing tooling or external systems require English.
* Be understandable by non-technical stakeholders.
* Preserve approved scope and avoid adding new features without approval.
* Separate product intent from implementation choices.
* Use concise language without losing acceptance-critical detail.
* Make ambiguity visible instead of hiding it in broad wording.

## Forbidden Behavior

The Write User Stories skill must never:

* Create new epics or new feature scope without explicit Chief Product Officer approval.
* Add technical implementation details outside approved constraints.
* Mark a story as agent ready when required product decisions are missing.
* Replace the Dev Summary skill for handoff, escalation, completion, or closure.
* Assign execution work to a human when an available agent can perform it.
