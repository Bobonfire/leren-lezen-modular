# GitHub Orchestration Workflow

## Doel

Deze workflow vertaalt de agent delivery workflow naar concrete GitHub-events,
labels, comments en pull requests. GitHub is hiermee de zichtbare cockpit voor
Bob en de audit trail voor alle agents.

Deze eerste versie is bewust een dry-run orchestration laag: de workflow bepaalt
de volgende agentstap, maar start nog geen modelcalls en voert geen merge uit.

## Bronnen

De orchestration laag gebruikt:

- `AGENTS.md`
- `ai/README.ai.md`
- `ai/ai_instructions/ai-codex-instructions.md`
- `ai/ai_instructions/CODE_QUALITY.md`
- `ai/ai_instructions/CODE_SECURITY.md`
- `ai-agents/workflows/feature-delivery-workflow.md`
- `ai-agents/workflows/refactoring-workflow.md`
- `ai-agents/agents/orchestrator-agent.md`
- `ai-agents/skills/shared-skills.md`
- `ai-agents/skills/budget-control.md`

## GitHub Objecten

Issues:

- Bevatten featureverzoeken, bugfixes of proceswerk.
- Worden gekoppeld aan een workflow state label.
- Bevatten agentrapporten als comments.

Pull requests:

- Bevatten implementatie, testresultaten en reviewstatus.
- Worden gekoppeld aan het oorspronkelijke issue.
- Worden pas gemerged na expliciete menselijke goedkeuring.

Labels:

- `agent:orchestrate` activeert orchestration voor een issue of PR.
- `state:feature-proposed`
- `state:refactor-proposed`
- `state:ready-for-refactor-baseline`
- `state:ready-for-refactoring`
- `state:ready-for-refactor-testing`
- `state:ready-for-refactor-review`
- `state:ready-for-refactor-documentation`
- `state:ready-for-refactor-approval`
- `state:ready-for-refinement`
- `state:ready-for-development`
- `state:ready-for-testing`
- `state:ready-for-review`
- `state:ready-for-documentation`
- `state:ready-for-product-validation`
- `state:ready-for-cpo-approval`
- `state:ready-for-merge`
- `state:done`
- `state:blocked`
- `agent:po`
- `agent:developer`
- `agent:refactor`
- `agent:tester`
- `agent:reviewer`
- `agent:documentation`
- `agent:human-approval-required`

Comments:

- Agent handoffs moeten een Dev Summary bevatten.
- Menselijke approval moet expliciet zijn.
- Voor deze repo is de approval phrase: `APPROVE FEATURE`.

## Event Triggers

De GitHub Action reageert op:

- Issue geopend, bewerkt of gelabeld.
- Pull request geopend, bijgewerkt, heropend of klaar voor review.
- Issue of PR comment toegevoegd.
- CI workflow afgerond.
- Handmatige `workflow_dispatch`.

## State Machine

| Huidige state | Event | Volgende actie |
| --- | --- | --- |
| Geen state + feature issue | Issue geopend | Zet `state:feature-proposed`; vraag PO refinement |
| Geen state + refactor issue | Issue geopend | Zet `state:refactor-proposed`; vraag baseline |
| `state:refactor-proposed` | Scope en motivatie aanwezig | Start Tester Agent voor baseline |
| `state:ready-for-refactor-baseline` | Baseline-opdracht aanwezig | Start Tester Agent |
| `state:ready-for-refactoring` | Baseline verklaard | Start Refactor Agent |
| `state:ready-for-refactor-testing` | Refactor report aanwezig | Start Tester Agent voor regressiecontrole |
| `state:ready-for-refactor-review` | Regressierapport non-blocking | Start Reviewer Agent |
| `state:ready-for-refactor-documentation` | Review non-blocking | Start Documentation Agent |
| `state:ready-for-refactor-approval` | Alle refactorartefacten aanwezig | Vraag Bob om approval |
| `state:feature-proposed` | Orchestration actief | Start PO Agent |
| `state:ready-for-refinement` | PO handoff aanwezig | Start PO Agent refinement |
| `state:ready-for-development` | Acceptatiecriteria aanwezig | Start Developer Agent |
| `state:ready-for-testing` | PR aanwezig en CI groen | Start Tester Agent |
| `state:ready-for-review` | Test report non-blocking | Start Reviewer Agent |
| `state:ready-for-documentation` | Review non-blocking | Start Documentation Agent |
| `state:ready-for-product-validation` | Documentatie-impact afgerond | Start PO Agent validation |
| `state:ready-for-cpo-approval` | Samenvatting aanwezig | Vraag Bob om approval |
| `state:ready-for-merge` | `APPROVE FEATURE` comment + CI groen | Merge mag worden aangevraagd |
| `state:done` | Geen | Geen actie |
| `state:blocked` | Geen unblock bewijs | Escalatie of pauze |

## Guardrails

- De Orchestrator Agent wijzigt geen source code.
- De Orchestrator Agent maakt geen product- of technische beslissingen.
- De Orchestrator Agent start geen dure modelcalls zonder budget-control skill.
- De Orchestrator Agent blijft in dry-run zolang Budget Control niet expliciet
  `Budget Approved` geeft.
- Merge gebeurt alleen na expliciete menselijke approval.
- Geen automatische merge wanneer `state:blocked` aanwezig is.
- Elke agentoverdracht moet een Dev Summary bevatten.
- Productvalidatie start pas na een vastgelegde documentatie-impactuitkomst.
- Refactorwerk vereist onafhankelijke Tester Agent-baselines voor en na de wijziging.
- Refactorwerk mag geen feature, bugfix of publieke contractwijziging verbergen.

## Dry-Run Gedrag

In dry-run mode:

- Wordt het GitHub event gelezen.
- Wordt de workflow state bepaald uit labels en eventtype.
- Wordt de volgende agentstap berekend.
- Wordt een GitHub Actions job summary geschreven.
- Worden er geen labels, comments, branches, PR's of merges uitgevoerd.

## Budget Control

Budget control is apart vastgelegd als shared skill:

- `ai-agents/skills/budget-control.md`

Die skill bepaalt:

- Maximaal aantal agentruns per issue.
- Maximaal aantal modelcalls per workflow.
- Max input/output tokens per agentrol.
- Toegestane modellen per agentrol.
- Escalatie naar Bob bij budgetoverschrijding.
