# Full Delivery Workflow

## Doel

Full Delivery levert features, productwijzigingen, securitygevoelig werk,
architectuurwijzigingen, migraties en brede refactors met expliciete
productvalidatie.

## Entry

Deze route wordt uitsluitend gekozen met `$workflow-routing`. Routecriteria
worden niet in dit document gedupliceerd.

## States

| State | Owner | Vereist bewijs | Volgende stap |
| --- | --- | --- | --- |
| `full:refinement` | Product Owner | doel, criteria, scope, DoR | Developer of Refactor |
| `full:development` | Developer/Refactor | commit-SHA, checks, draft PR, docsimpactindicatie | CI |
| `full:verification` | Tester + Reviewer parallel | test- en reviewresultaat op dezelfde SHA | Documentation |
| `full:documentation` | Documentation | impactrapport en bijgewerkte docs | Product acceptance |
| `full:acceptance` | Product Owner | acceptance review | Human approval |
| `full:approval` | Bob | cumulatieve samenvatting en risico's | Merge-opdracht |
| `full:done` | Workflow | merge en gezonde main | Gesloten |

## Uitvoering

- Iedere rol werkt in een afzonderlijke agentthread.
- Schrijvende parallelle agents gebruiken aparte worktrees en disjuncte
  bestandsgrenzen.
- Tester en Reviewer werken parallel op dezelfde stabiele PR-SHA.
- Refactorwerk volgt aanvullend `refactoring.md`.
- Decision Records zijn alleen verplicht bij betekenisvolle keuzes.

## Budget

Gebruik het Full Delivery-beleid uit `$budget-control`.

## Exitcriteria

- Definition of Ready en acceptance criteria voldaan;
- CI groen;
- Tester en Reviewer non-blocking;
- documentatie-impact compleet;
- PO accepteert productuitkomst;
- Bob geeft expliciete approval;
- merge gebeurt alleen op aparte opdracht.
