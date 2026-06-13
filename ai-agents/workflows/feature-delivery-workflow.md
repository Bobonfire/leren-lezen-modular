# Workflow Definition: Feature Delivery Workflow

## Purpose

This workflow governs the complete lifecycle of a feature from initial idea to production-ready implementation.

The workflow ensures:

* Alignment with product vision
* Proper refinement
* Engineering quality
* Automated testing
* Independent review
* Human approval before merge

---

# Workflow States

## State: Feature Proposed

### Owner

Chief Product Officer (Human)

### Trigger

A new feature idea is proposed.

### Actions

* Define business problem.
* Define desired outcome.
* Define expected value.
* Submit feature proposal.

### Next State

Ready For Refinement

---

## State: Ready For Refinement

### Owner

Product Owner Agent

### Trigger

Feature proposal received.

### Actions

* Validate feature aligns with approved vision.
* Request clarification from CPO if needed.
* Create or update:

  * Epic
  * Feature
  * User Stories
  * Acceptance Criteria
  * Definition of Done
* Refine with Developer Agent.

### Exit Criteria

* User stories are understandable.
* Acceptance criteria are testable.
* Dependencies identified.
* Work can be estimated.

### Outputs

* Refined backlog items
* Dev Summary
* Decision Records

### Next State

Ready For Development

---

## State: Ready For Development

### Owner

Developer Agent

### Trigger

Backlog item marked Ready For Development.

### Actions

* Review user story.
* Review acceptance criteria.
* Review architecture documentation.
* Review security documentation.
* Refine technical implementation details with Product Owner Agent.
* Implement functionality.
* Create required tests.
* Update CI/CD configuration when necessary.
* Create commits.
* Create pull request.

### Exit Criteria

* Acceptance criteria implemented.
* Tests pass.
* CI/CD passes.
* Pull request created.

### Outputs

* Source code
* Pull request
* Test results
* Dev Summary
* Decision Records

### Next State

Ready For Testing

---

## State: Ready For Testing

### Owner

Tester Agent

### Trigger

Pull request created.

### Actions

* Execute test strategy.
* Validate acceptance criteria.
* Identify regressions.
* Identify edge cases.
* Identify negative test scenarios.
* Validate Definition of Done.

### Exit Criteria

* No blocking defects.
* Acceptance criteria verified.
* Risks documented.

### Outputs

* Test report
* Defect report
* Dev Summary
* Decision Records

### Outcomes

Pass:
-> Ready For Review

Fail:
-> Back To Development

---

## State: Ready For Review

### Owner

Reviewer Agent

### Trigger

Testing completed successfully.

### Actions

* Review pull request.
* Review architecture compliance.
* Review security compliance.
* Review maintainability.
* Review performance implications.
* Review technical debt impact.

### Exit Criteria

* No critical findings.
* Architecture standards satisfied.
* Security standards satisfied.

### Outputs

* Review report
* PR comments
* Dev Summary
* Decision Records

### Outcomes

Approved:
-> Ready For Documentation

Changes Required:
-> Back To Development

---

## State: Ready For Documentation

### Owner

Documentation Agent

### Trigger

Testing en review zijn non-blocking en de implementatie is stabiel.

### Actions

* Voer de documentatie-impactcheck uit `docs/DOCUMENTATION.md` uit.
* Werk agentgerichte documentatie bij wanneer navigatie, architectuur,
  instructies, artefacten of agentsamenwerking verandert.
* Werk mensgerichte documentatie bij wanneer productgedrag, modules,
  klikroutes, beperkingen of visuals veranderen.
* Leg gemotiveerd vast wanneer geen documentatie-update nodig is.
* Valideer links, paden en diagrammen tegen de actuele bronnen.

### Exit Criteria

* Impactuitkomst is `agent`, `human`, `beide` of `geen`.
* Alle geraakte documentatie is bijgewerkt.
* Open conflicten of gaten zijn opgelost of geescaleerd.

### Outputs

* Documentatie-impactrapport
* Gewijzigde documentatie of gemotiveerde `geen impact`
* Dev Summary

### Outcomes

Complete:
-> Ready For Product Validation

Blocked:
-> Back To Development or Escalation

---

## State: Ready For Product Validation

### Owner

Product Owner Agent

### Trigger

Review completed successfully.

### Actions

* Validate implemented behavior.
* Compare implementation to user story.
* Compare implementation to acceptance criteria.
* Validate business value delivery.
* Validate Definition of Done.
* Validate dat de human documentatie het geleverde gedrag begrijpelijk beschrijft.

### Exit Criteria

* User story fulfilled.
* Acceptance criteria fulfilled.
* Business objective achieved.

### Outputs

* Acceptance report
* Dev Summary
* Decision Records

### Outcomes

Accepted:
-> Ready For CPO Approval

Rejected:
-> Back To Development

---

## State: Ready For CPO Approval

### Owner

Chief Product Officer (Human)

### Trigger

Product Owner Agent accepted delivery.

### Actions

Review:

* Feature objective
* Delivered outcome
* Dev Summary
* Decision Records
* Risks
* Open items

### Exit Criteria

Explicit human approval.

### Outcomes

Approved:
-> Ready For Merge

Rejected:
-> Back To Product Owner

---

## State: Ready For Merge

### Owner

Developer Agent

### Trigger

Human approval received.

### Actions

* Merge pull request.
* Verify CI/CD.
* Update release notes.
* Update issue status.

### Exit Criteria

* Merge completed.
* Main branch healthy.

### Outputs

* Merge confirmation
* Release summary
* Dev Summary

### Next State

Done

---

## State: Done

### Owner

Workflow

### Actions

* Close user story.
* Archive workflow artifacts.
* Store Decision Records.
* Store Dev Summaries.

### Outputs

* Complete audit trail
* Complete delivery history

### Terminal State

Workflow Complete

---

# Global Escalation Rules

Escalate to CPO when:

* Product scope changes.
* Product vision changes.
* New feature requests emerge.
* Security risk acceptance is required.
* Architecture changes impact roadmap.
* Two agents disagree after three interaction rounds.
* Two Developer Agents fail to resolve a technical issue.

---

# Mandatory Artifacts

Every workflow state must produce:

* Updated status
* Dev Summary
* Relevant Decision Records

No state transition may occur without these artifacts.

Daarnaast moet iedere wijziging voor afronding een documentatie-impactuitkomst
hebben. Een claim `geen documentatie-impact` is een expliciete, gemotiveerde
uitkomst en geen overgeslagen workflowstap.
