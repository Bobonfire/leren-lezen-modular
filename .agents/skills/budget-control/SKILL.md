---
name: budget-control
description: Controleer kosten-, token-, retry- en approvalgrenzen voordat een orchestrator een modelcall, subagent, muterende GitHub-actie, workflowherstart of merge-aanvraag uitvoert. Gebruik deze skill bij iedere overgang van dry-run naar muterende orchestration en blokkeer wanneer budgetinformatie of expliciete approval ontbreekt.
---

# Budget Control

Beoordeel het budget per issue, pull request of handmatige workflowrun.

## Default Policy

- Sta in dry-run geen modelcalls, automatische merges, branches of PR-creatie toe.
- Sta per state transition maximaal een run per benodigde agentrol toe.
- Sta maximaal drie autonome herstelrondes per work item toe.
- Sta maximaal een mergepoging toe na expliciete Bob-approval.
- Herstart een Refactor Agent alleen bij nieuw concreet test- of reviewbewijs,
  gewijzigde scope of expliciete menselijke herstart.

## Required Budget Record

Leg vast:

```text
Work item:
Agent:
Mode:
Model:
Max input tokens:
Max output tokens:
Max calls:
Estimated cost:
Actual usage:
Result:
Escalation needed:
```

## Decision

Kies exact een uitkomst:

- Budget Approved
- Budget Approved For Dry-Run Only
- Budget Blocked
- Escalation Required

Sta nooit stilzwijgend betaalde calls, hogere limieten, onbeperkte retries of een
merge toe. Escaleer naar Bob wanneer kosten of approval buiten vooraf afgesproken
grenzen vallen.

