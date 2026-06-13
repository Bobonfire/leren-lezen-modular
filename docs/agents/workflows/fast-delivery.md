# Fast Delivery Workflow

## Doel

Fast Track levert duidelijke regressies, kleine bugfixes, documentatiecorrecties
en lokaal onderhoud met minimale agentoverhead.

## Entry

Deze route wordt uitsluitend gekozen met `$workflow-routing`. Routecriteria
worden niet in dit document gedupliceerd.

## States

| State | Owner | Vereist bewijs | Volgende stap |
| --- | --- | --- | --- |
| `fast:triage` | Orchestrator | routebewijs, work item, branch/PR-status | Developer of PO bij ontbrekende productbeslissing |
| `fast:development` | Developer | commit-SHA, lokale checks, draft PR, docsimpactindicatie | CI |
| `fast:verification` | Tester + Reviewer parallel | testresultaat en reviewresultaat op dezelfde SHA | Documentation gate |
| `fast:documentation` | Documentation, conditioneel | impact `agent`, `human`, `beide` of `geen` | Human approval |
| `fast:approval` | Bob | centrale workflowcomment en risico's | Merge-opdracht |
| `fast:done` | Workflow | merge en gezonde main | Gesloten |

## Compact Handoff

Iedere agent krijgt `$compact-handoff`. Fast Track-agents lezen niet standaard
de volledige workflow- of documentatieset.

## Parallelle Verificatie

Tester en Reviewer starten tegelijk zodra:

- de draft PR open is;
- CI voor de head-SHA beschikbaar is;
- de SHA gedurende de review niet verandert.

Een nieuwe commit maakt beide resultaten stale en vereist nieuwe verificatie.
Voor dezelfde PR-SHA voeren Tester en Reviewer samen hoogstens drie
opeenvolgende verificatiecycli uit. Als na drie cycli nog geen overeenstemming
of duidelijke non-blocking uitkomst bestaat, escaleert de Orchestrator naar Bob
in plaats van opnieuw een lus te starten.

## Budget

Gebruik het Fast Track-beleid uit `$budget-control`.

## Exitcriteria

- CI groen;
- Tester non-blocking;
- Reviewer non-blocking;
- documentatie-impact afgehandeld;
- expliciete Bob-approval;
- merge alleen na aparte merge-opdracht.
