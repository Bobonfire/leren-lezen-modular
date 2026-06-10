# Agent Definition Template

## Agent Name

{name}

## Role Description

{Brief description of the agent's responsibility in the delivery workflow.}

## Objective

{The concrete outcome this agent is accountable for.}

## Mandatory Shared Skills

Must load and execute:

* Dev Summary (`ai-agents/skills/shared-skills.md`)

## Model Policy

Default model: {model}

Use higher reasoning model when:

* {condition}
* {condition}

Use lower-cost model when:

* {condition}
* {condition}

## Scope

Allowed tools:

* {tool}
* {tool}

Allowed repositories / folders:

* {path}
* {path}

Allowed GitHub objects:

* Issues: {read/write/none}
* Pull requests: {read/write/none}
* Project board: {read/write/none}
* Actions/CI: {read/write/none}

## Inputs

This agent may start only when the following inputs are available:

* {input}
* {input}

## Entry Criteria

* {condition}
* {condition}
* Dev Summary skill loaded from `ai-agents/skills/shared-skills.md`

## Responsibilities

* {responsibility}
* {responsibility}
* {responsibility}
* Keep the GitHub Project Board updated for every workflow-relevant state change, or request a board update from the Orchestrator Agent when direct write access is not allowed.

## Decision Rights

This agent may decide:

* {decision}
* {decision}

This agent may not decide:

* {decision}
* {decision}

## Guardrails

The agent must escalate to the Product Owner Agent when:

* {condition}
* {condition}

The Product Owner Agent must escalate to the Product Officer / human when:

* Agents fail to resolve the same issue after three interaction rounds.
* Product scope, priority, architecture, security, cost, or user impact is ambiguous.
* A decision changes the product vision, release scope, or risk profile.
* Required acceptance criteria are missing or contradictory.

## Forbidden Actions

This agent must never:

* {action}
* {action}

## Quality Gates

Before handoff, the agent must verify:

* {check}
* {check}
* {check}

## Outputs

The agent must produce:

* {output}
* {output}

## Handoff Contract

Next agent(s):

* {agent}

Handoff payload:

* Dev Summary
* GitHub Project Board status and any required board update
* {artifact}
* {artifact}
* {artifact}

## Agent Interaction Rules

This agent may interact with:

* {agent}: {purpose}
* {agent}: {purpose}

Maximum autonomous interaction rounds before escalation:

* {number}

## Context Boundaries

Must load:

* {context}

Must not load unless explicitly needed:

* {context}

Must ignore:

* {context}

## Logging and Audit Trail

The agent must document:

* Dev Summary before handoff, escalation, completion, user story closure, or human intervention
* GitHub Project Board updates, including status changes, blocked states, handoffs, escalations, and completion
* {decision}
* {test result}
* {issue update}
* {PR comment}
* {handoff summary}

## Exit Criteria

The agent may exit only when:

* Required quality gates are satisfied or a blocker is escalated.
* Dev Summary has been produced according to `ai-agents/skills/shared-skills.md`.
* GitHub Project Board reflects the current state, owner, blocker, handoff target, or completion status.
* Handoff, escalation, completion, or human intervention includes the Dev Summary.

## Failure Mode

If blocked, the agent must:

1. State the blocker.
2. Identify missing information.
3. Propose the smallest next action.
4. Escalate according to the guardrails.
