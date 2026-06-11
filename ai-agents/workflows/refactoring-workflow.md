# Workflow Definition: Refactoring Workflow

## Purpose

Deze workflow houdt de codebase onderhoudbaar door aantoonbaar
gedragsbehoudende refactors uit te voeren. De Tester Agent bewaakt onafhankelijk
de baseline en regressies. De Reviewer Agent beoordeelt niet-triviale
architectuur- en kwaliteitsgevolgen.

## State: Refactor Proposed

### Owner

Developer Agent, Reviewer Agent, Refactor Agent of human

### Required Evidence

* Concrete onderhoudbaarheidsprobleem
* Geraakte scope
* Verwachte kwaliteitswinst
* Bekende risico's

### Next State

Ready For Refactor Baseline

## State: Ready For Refactor Baseline

### Owner

Tester Agent

### Actions

* Leg relevante automatische checks en handmatige scenario's vast.
* Markeer bestaande failures, skips en flakiness.
* Leg publieke contracten en representatieve uitvoer vast.
* Vraag ontbrekende characterization tests aan.

### Exit Criteria

* Baseline is groen of bestaande afwijkingen zijn verklaard.
* Het te behouden gedrag is voldoende toetsbaar.

### Outcomes

Pass:
-> Ready For Refactoring

Insufficient evidence:
-> Blocked

## State: Ready For Refactoring

### Owner

Refactor Agent

### Actions

* Lees repository-instructies en de Refactoring skill.
* Bevestig scope, contracten en rollback.
* Voer kleine structurele stappen uit.
* Draai gerichte checks na iedere betekenisvolle stap.
* Houd gedrag, publieke API's en dataformaten gelijk.
* Leg terugkerende Developer Agent-problemen met bewijs vast.

### Exit Criteria

* Refactor is beperkt tot de goedgekeurde scope.
* Gerichte checks en volledige relevante suite slagen.
* Refactor report en Dev Summary zijn beschikbaar.

### Outcomes

Complete:
-> Ready For Refactor Testing

Behavior change required:
-> Product Owner Clarification

Blocked:
-> Blocked

## State: Ready For Refactor Testing

### Owner

Tester Agent

### Actions

* Herhaal dezelfde baselinecommando's en scenario's.
* Vergelijk publieke contracten en representatieve uitvoer.
* Test gewijzigde grenzen en negatieve paden aanvullend.
* Rapporteer regressies onafhankelijk van de Refactor Agent.

### Outcomes

Pass:
-> Ready For Refactor Review

Fail:
-> Back To Refactoring

## State: Ready For Refactor Review

### Owner

Reviewer Agent

### Actions

* Controleer gedragsbehoud en scope discipline.
* Beoordeel cohesie, coupling, complexiteit en dependency direction.
* Controleer op onnodige abstracties en verborgen risico's.
* Beoordeel voorgestelde Developer Agent-instructiewijzigingen.

### Outcomes

Approved:
-> Ready For Refactor Documentation

Changes Required:
-> Back To Refactoring

## State: Ready For Refactor Documentation

### Owner

Documentation Agent

### Actions

* Werk codebase-navigatie, architectuur en agentinstructies bij waar nodig.
* Leg een gemotiveerde `geen impact` vast wanneer documentatie niet verandert.

### Outcomes

Complete:
-> Ready For Refactor Approval

## State: Ready For Refactor Approval

### Owner

Chief Product Officer / human

### Required Artifacts

* Dev Summary
* Refactor report
* Baseline- en regressierapport
* Review report
* Documentatie-impact
* Developer Agent-instructievoorstel of gemotiveerd `geen voorstel`

### Outcomes

Approved:
-> Ready For Merge

Rejected:
-> Back To Refactoring

## Global Guardrails

* Refactoring en productgedragswijzigingen worden niet gecombineerd.
* De Tester Agent blijft onafhankelijk en wijzigt geen source code.
* Geen refactor start zonder verklaarde baseline.
* Geen refactor slaagt alleen op formatter- of lintresultaten.
* Nieuwe dependencies, publieke contractwijzigingen en architectuurwijzigingen
  vereisen aparte expliciete goedkeuring.
* Developer Agent-instructies veranderen alleen met herhaald bewijs en een
  concrete, toetsbare regel.
* Na drie mislukte interactierondes volgt escalatie.

## Mandatory Artifacts

Iedere state transition vereist:

* Actuele status
* Dev Summary
* Test- of reviewbewijs passend bij de state
* Decision Record voor betekenisvolle keuzes
* Project Board-update of update request
