# Product Owner Skills

PO-specifieke skills voor backlogkwaliteit, productbeschrijvingen, agent-ready handoffs en acceptatiebesluiten.

Deze skills worden gebruikt door de Product Owner Agent naast de gedeelde skills in `ai-agents/skills/shared-skills.md`.

## Skill Name

GitHub Backlog Publishing

## Purpose

Goedgekeurde user stories zichtbaar maken in GitHub Issues en het GitHub Project Board, zodat de backlog, agent-handoff en audit trail op dezelfde plek staan.

## Invocation Rules

Gebruik deze skill nadat:

* Een user story is geschreven of verfijnd.
* De user story door de gebruiker of bevoegde Product Owner/CPO is goedgekeurd.
* De story de Definition of Ready Check heeft doorstaan.
* Een GitHub-repository en, indien van toepassing, project board beschikbaar zijn.

## Required Output

### GitHub Issue

Maak of update een GitHub Issue met:

* User story titel.
* Description in Given/When/Then format.
* Acceptance criteria.
* Agent-ready task.
* Constraints.
* Required evidence.
* Dev Summary.
* Relevante labels, minimaal `agent:po`, `agent:developer` en `state:ready-for-development` wanneer de story ready is.

### GitHub Project Board

Koppel de GitHub Issue aan het juiste GitHub Project Board wanneer projecttoegang beschikbaar is.

Leg vast:

* Project board naam of nummer.
* Status/kolom wanneer instelbaar.
* Issue URL.
* Eventuele ontbrekende rechten of blokkades.

### Publishing Decision

Een van:

* Published to GitHub.
* Issue published, project board update blocked.
* Not published, approval required.
* Not published, GitHub access blocked.

## Quality Rules

* Publiceer geen user story naar GitHub zonder expliciet akkoord.
* Publiceer geen story die niet ready is, tenzij de issue duidelijk als refinement/blocker is gelabeld.
* Houd GitHub-inhoud gelijk aan de goedgekeurde story; voeg geen nieuwe scope toe tijdens publicatie.
* Documenteer elke GitHub-publicatie in de Dev Summary of handoff.
* Als een vergelijkbare issue al bestaat, update of hergebruik die in plaats van een duplicaat te maken.

## Forbidden Behavior

* Geen source code pushen, branches pushen of pull requests maken als onderdeel van deze skill.
* Geen project board status wijzigen naar een verdere workflowstate dan door de readiness of handoff is toegestaan.
* Geen GitHub publicatie uitvoeren wanneer expliciete goedkeuring ontbreekt.

## Skill Name

Backlog Refinement

## Purpose

Backlog-items aanscherpen tot duidelijke, geprioriteerde en agent-ready werkitems.

## Invocation Rules

Gebruik deze skill wanneer:

* Een nieuw idee, verzoek, defect of verbetering in de backlog komt.
* Een bestaand backlog-item te groot, te vaag of niet uitvoerbaar is.
* Een item richting Ready For Development, Ready For Testing, Ready For Review of Ready For Acceptance gaat.
* Scope, prioriteit, afhankelijkheden of acceptatiegrenzen onduidelijk zijn.

## Required Output

### Refined Backlog Item

Beschrijf:

* Type: epic, feature, user story, bugfix, taak of spike.
* Productdoel.
* Persona of stakeholder.
* Gewenste uitkomst.
* Business value.
* Scope in.
* Scope out.
* Afhankelijkheden.
* Risico's of onzekerheden.
* Prioriteit en reden.
* Readiness status.

### Refinement Decision

Een van:

* Ready for epic description.
* Ready for feature description.
* Ready for user story writing.
* Ready for handoff.
* Not ready, clarification required.
* Escalation required.

## Quality Rules

* Splits grote items wanneer meerdere onafhankelijke uitkomsten of agents nodig zijn.
* Maak onzekerheden expliciet.
* Houd bugfixes beperkt tot herstel van eerder goedgekeurd gedrag.
* Voeg geen nieuwe feature-scope toe zonder Chief Product Officer approval.

## Skill Name

Write Epic Descriptions

## Purpose

Epics beschrijven als grotere productuitkomsten met duidelijke scope, waarde, grenzen en onderliggende werkstructuur.

## Invocation Rules

Gebruik deze skill wanneer:

* Een goedgekeurd productdoel groter is dan een enkele feature.
* Meerdere features of user stories onder een gedeelde outcome vallen.
* De Chief Product Officer een nieuwe epic heeft goedgekeurd.

## Required Output Format

### Epic Title

Gebruik een korte outcome-gerichte titel.

### Objective

Beschrijf welk productresultaat de epic moet bereiken.

### Business Value

Beschrijf waarom deze epic belangrijk is voor gebruikers, ouders, productdoelen of operationele doelen.

### Scope In

Lijst wat expliciet binnen de epic valt.

### Scope Out

Lijst wat expliciet buiten de epic valt.

### Success Measures

Beschrijf observeerbare signalen dat de epic succesvol is.

### Candidate Features

Lijst de logische features die uit de epic volgen.

### Constraints

Beschrijf product-, architectuur-, security-, accessibility-, content- of procesconstraints.

### Risks and Open Questions

Maak onzekerheden expliciet en markeer ontbrekende beslissingen.

### Readiness

Een van:

* Ready for feature breakdown.
* Not ready, clarification required.
* Escalation required.

## Quality Rules

* Beschrijf epics op outcome-niveau, niet als implementatieplan.
* Maak duidelijk welke nieuwe scope CPO-goedkeuring vereist.
* Zorg dat de epic richting geeft zonder de uitvoering technisch vast te leggen.

## Skill Name

Write Feature Descriptions

## Purpose

Features beschrijven als concrete productmogelijkheden die kunnen worden opgesplitst in agent-ready user stories.

## Invocation Rules

Gebruik deze skill wanneer:

* Een epic moet worden uitgewerkt naar features.
* Een goedgekeurde feature moet worden verduidelijkt voor story writing.
* Een feature moet worden beoordeeld op scope, waarde of readiness.

## Required Output Format

### Feature Title

Gebruik een korte titel die de productmogelijkheid benoemt.

### User Problem

Beschrijf welk probleem of welke behoefte de feature oplost.

### Desired Outcome

Beschrijf de gewenste productuitkomst.

### Target Users

Benoem de persona's of stakeholders.

### Functional Description

Beschrijf wat de gebruiker of het systeem moet kunnen, in producttaal.

### Scope In

Lijst wat expliciet binnen de feature valt.

### Scope Out

Lijst wat expliciet buiten de feature valt.

### Acceptance Boundaries

Beschrijf wanneer de feature voldoende is en wanneer niet.

### Candidate User Stories

Lijst de user stories die nodig zijn om de feature te leveren.

### Constraints

Beschrijf relevante product-, UX-, accessibility-, content-, security- of architectuurconstraints.

### Readiness

Een van:

* Ready for user story writing.
* Not ready, clarification required.
* Escalation required.

## Quality Rules

* Beschrijf gedrag en uitkomst, niet technische implementatie.
* Houd features klein genoeg om door stories geleverd te worden.
* Maak afhankelijkheden en ontbrekende beslissingen zichtbaar.

## Skill Name

Definition of Ready Check

## Purpose

Controleren of een backlog-item voldoende duidelijk, begrensd en agent-ready is voor handoff.

## Invocation Rules

Gebruik deze skill voordat:

* Een story Ready For Development wordt.
* Een item naar Tester Agent, Documentation Agent of een andere agent gaat.
* Een refinementronde wordt afgesloten.
* Een handoff package wordt opgesteld.

## Required Checklist

Een item is ready only when:

* Het type werkitem duidelijk is.
* Productdoel en gewenste output expliciet zijn.
* Persona of stakeholder duidelijk is.
* Scope in en scope out duidelijk zijn.
* Acceptance criteria observeerbaar en verifieerbaar zijn.
* Constraints en afhankelijkheden zijn benoemd.
* De uitvoerende agent is benoemd.
* De taak agent ready is.
* Benodigde input beschikbaar is.
* Verwachte output en handoff evidence duidelijk zijn.
* Open vragen zijn opgelost of expliciet geblokkeerd.

## Required Output

### Ready Decision

Een van:

* Ready.
* Not ready.
* Blocked.
* Escalation required.

### Missing Information

Lijst exact welke informatie ontbreekt.

### Required Action

Benoem wie of welke agent de volgende actie moet uitvoeren.

## Quality Rules

* Markeer niets als ready op basis van aannames die productgedrag veranderen.
* Vermijd brede formuleringen zoals "verbeter de UX" zonder concrete output.
* Readiness gaat over uitvoerbaarheid, niet over technische oplossingsrichting.

## Skill Name

Handoff Package Writing

## Purpose

Consistente overdracht maken naar een uitvoerende agent met voldoende context, constraints en verwachte output.

## Invocation Rules

Gebruik deze skill wanneer:

* Werk wordt overgedragen aan Developer Agent, Tester Agent, Documentation Agent of een andere agent.
* Een backlog-item van status of eigenaar verandert.
* Een agent opnieuw moet worden aangehaakt na blokkade, review of acceptatiefeedback.

## Required Output Format

### Handoff Target

Benoem de ontvangende agent.

### Assignment

Beschrijf de concrete opdracht.

### Product Context

Geef de relevante productreden, gebruiker en gewenste uitkomst.

### Work Item

Voeg epic, feature of user story toe.

### Acceptance Criteria

Voeg de geldende acceptatiecriteria toe.

### Constraints

Noem scope, architectuur-, UX-, security-, accessibility-, content- en procesconstraints.

### Required Evidence

Beschrijf welke output, verificatie of documentatie de agent moet opleveren.

### Dev Summary

Voeg de Dev Summary toe volgens `ai-agents/skills/shared-skills.md`.

## Quality Rules

* De ontvangende agent moet direct kunnen starten.
* Handoff mag geen verborgen productbeslissingen bevatten.
* Handoff moet status, eigenaar, blocker en verwachte volgende status duidelijk maken wanneer relevant.

## Skill Name

Acceptance Review

## Purpose

Valideren of geleverd werk voldoet aan productintentie, user story, acceptance criteria en Definition of Done.

## Invocation Rules

Gebruik deze skill wanneer:

* Een agent werk oplevert voor acceptatie.
* Een regressie als hersteld wordt aangeboden.
* Een feature, story of bugfix gesloten kan worden.
* Acceptatiefeedback of herwerk nodig is.

## Required Output Format

### Reviewed Work

Benoem het werkitem en de geleverde output.

### Acceptance Criteria Result

Geef per criterium:

* Pass.
* Fail.
* Not verified.
* Not applicable.

### Product Fit

Beoordeel of het werk aansluit op productdoel, persona en gewenste uitkomst.

### Scope Check

Beoordeel of het werk binnen goedgekeurde scope blijft.

### Evidence Review

Beoordeel of de vereiste output en verificatie-evidence aanwezig zijn.

### Decision

Een van:

* Accepted.
* Accepted with documented limitations.
* Changes required.
* Rejected.
* Escalation required.

### Follow-up

Benoem eventuele volgende agent, blocker, backlog-update of CPO-escalatie.

## Quality Rules

* Accepteer geen werk zonder bewijs tegen de acceptance criteria.
* Vraag geen specifieke technische teststrategie aan; beoordeel wel of bewijs voldoende is.
* Houd acceptatie gescheiden van code review en testuitvoering.
* Escaleer scopewijzigingen of productconflicten volgens de PO-agent guardrails.
