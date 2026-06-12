---
name: write-user-stories
description: Schrijf of verfijn Nederlandse agent-ready user stories voor features, regressies, bugfixes en verbeteringen. Gebruik deze skill wanneer productintentie naar een uitvoerbaar backlogitem met Given/When/Then, acceptance criteria, scope en agenttaak moet worden vertaald; gebruik haar niet om ongeautoriseerde nieuwe scope te bedenken.
---

# Write User Stories

Gebruik de volgende vaste structuur.

## Title

Schrijf exact: `als {persona}, wil ik {actie}, omdat {waarde}`.

## Description

Gebruik:

```text
Given {context en voorwaarden}
When {actie of gebeurtenis}
Then {zichtbare gewenste uitkomst}
```

## Acceptance Criteria

Maak ieder criterium specifiek, observeerbaar en verifieerbaar. Neem relevante
edge cases, accessibility, contentregels en beperkingen op zonder technische
implementatie voor te schrijven.

## Scope

Beschrijf `In scope` en `Out of scope`.

## Task

Benoem:

- uitvoerende agent;
- concrete begrensde opdracht;
- vereiste inputs en outputs;
- constraints;
- vereist test- en handoffbewijs.

Markeer de story als niet ready wanneer productbeslissingen ontbreken. Behandel
regressies als herstel van eerder goedgekeurd gedrag en voeg geen feature-scope toe.

