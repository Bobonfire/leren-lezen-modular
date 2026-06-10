# Budget Control

## Doel

Budget Control voorkomt dat agent workflows onbedoeld veel GitHub Actions
minuten, modeltokens of agentruns gebruiken. Deze skill is verplicht voordat de
Orchestrator Agent echte modelcalls, agentstarts, label-wijzigingen, PR-acties of
merge-acties mag uitvoeren.

De eerste versie is een beleidsdocument. Implementatie in scripts volgt pas
wanneer de dry-run orchestration betrouwbaar is.

## Invocation Rules

De Budget Control skill moet worden uitgevoerd:

- Voor elke modelcall.
- Voor elke overgang van dry-run naar muterende orchestration.
- Voor het starten van een PO, Developer, Tester, Reviewer of Documentation Agent.
- Voor het opnieuw starten van een agent na failure, blocker of review feedback.
- Voor elke merge-aanvraag.

## Budget Scope

Budgetten gelden per GitHub work item:

- Issue
- Pull request
- Handmatig gestarte workflow run

Een work item moet een budgetstatus hebben voordat orchestration muterend mag
worden uitgevoerd.

## Default Limits

Totdat Bob andere limieten vastlegt, gelden deze veilige defaults:

- Maximaal 1 Orchestrator dry-run per relevant GitHub event.
- Maximaal 0 modelcalls in dry-run mode.
- Maximaal 0 automatische merges.
- Maximaal 0 automatische branch- of PR-aanmaak.
- Maximaal 0 betaalde GitHub Models of OpenAI API calls.

Voor toekomstige muterende mode gelden als startpunt:

- Maximaal 1 PO Agent run per state transition.
- Maximaal 1 Developer Agent run per development attempt.
- Maximaal 1 Tester Agent run per PR update.
- Maximaal 1 Reviewer Agent run per PR update.
- Maximaal 3 autonomous repair rounds per work item.
- Maximaal 1 merge attempt na expliciete Bob approval.

## Model Policy

Modelgebruik moet per agentrol expliciet worden vastgelegd voordat het wordt
ingeschakeld.

Minimale vereisten:

- Agentrol
- Modelnaam
- Maximale input tokens
- Maximale output tokens
- Maximale calls per workflow state
- Verwachte kostenrange
- Escalatiegedrag bij overschrijding

De Orchestrator Agent mag geen model kiezen op basis van gemak of snelheid alleen.
Kosten, taakrisico en vereiste redeneercapaciteit moeten passen bij de agentrol.

## Approval Gates

Menselijke approval is verplicht wanneer:

- Een workflow voor het eerst van dry-run naar muterende mode gaat.
- Een betaald model wordt ingeschakeld.
- Een limiet moet worden verhoogd.
- Een agent na 3 herstelrondes nog niet klaar is.
- Een merge wordt aangevraagd.
- Een workflow state ambigu is en automatische interpretatie risico geeft.

Voor deze repo moet Bob approval geven met een expliciete phrase die in de
workflowdocumentatie staat.

## Required Budget Record

Voor elke muterende agentrun moet een budget record worden vastgelegd in een
issue of PR comment.

Format:

### Budget Record

- Work item:
- Agent:
- Mode:
- Model:
- Max input tokens:
- Max output tokens:
- Max calls:
- Estimated cost:
- Actual usage:
- Result:
- Escalation needed:

## Decision Rules

De Budget Control skill geeft een van deze beslissingen:

- `Budget Approved`
- `Budget Approved For Dry-Run Only`
- `Budget Blocked`
- `Escalation Required`

## Quality Rules

- Gebruik altijd de goedkoopste agentmode die past bij de taak.
- Gebruik dry-run wanneer een workflowwijziging nog wordt gevalideerd.
- Geef agents alleen relevante context, niet de volledige repo.
- Hergebruik bestaande Dev Summaries en Decision Records.
- Stop automatisch bij ontbrekende budgetinformatie.
- Escaleer naar Bob voordat kosten buiten de vooraf afgesproken limieten vallen.

## Forbidden Behavior

Budget Control mag nooit:

- Stilzwijgend betaalde modelcalls toestaan.
- Limieten verhogen zonder Bob.
- Een merge goedkeuren.
- Een product-, technische of reviewbeslissing vervangen.
- Kosten verbergen in algemene workflowlogs.
- Onbeperkte retries toestaan.

## Exit Criteria

Budget Control is correct toegepast wanneer:

- De budgetstatus expliciet is.
- De workflow weet of alleen dry-run is toegestaan.
- Eventuele kostenlimieten bekend zijn.
- Escalatie naar Bob plaatsvindt wanneer limieten ontbreken of overschreden worden.
- Het resultaat zichtbaar is in de audit trail.
