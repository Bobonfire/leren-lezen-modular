---
name: debug
description: Onderzoek en herstel een reproduceerbare bug, regressie, falende test of build, runtimefout, defecte interactie of responsive layoutfout. Gebruik deze skill wanneer bestaand verwacht gedrag niet werkt; gebruik haar niet voor brede cleanup, refactoring of nieuwe features.
---

# Debug

Werk aan een bug per iteratie.

1. Leg symptoom, verwacht gedrag, werkelijk gedrag, impact en scope vast.
2. Reproduceer met de kleinste stappen en verzamel consolefouten, assertions,
   screenshots of logs.
3. Onderzoek smal: recente diff, startup, imports, selectors, events, state,
   browser-API's, data-aannames, CSS en testsetup.
4. Houd alleen beslissende hypotheses bij:

```text
Hypothesis:
Evidence:
Test:
Result:
Next action:
```

5. Pas de kleinste oorzaakgerichte fix toe. Combineer geen andere defecten of
   cleanup en verander geen productintentie.
6. Voeg een gerichte regressiecheck toe wanneer dat redelijk is.
7. Herhaal eerst de oorspronkelijke reproductie en verbreed daarna naar de
   relevante test-, build-, browser- en viewportchecks.

Rapporteer:

- Bug
- Reproduction
- Root Cause
- Fix
- Verification
- Risks
- Status: Fixed, Partially Fixed, Split Into Follow-Up, Blocked of Escalation Required

Stop na drie onafhankelijke mislukte hypotheses en volg de escalatieroute.

