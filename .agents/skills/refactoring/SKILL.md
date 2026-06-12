---
name: refactoring
description: Verbeter aantoonbare onderhoudbaarheidsproblemen met kleine gedragsbehoudende wijzigingen, een verklaarde baseline, gerichte checks en rollbackinformatie. Gebruik deze skill voor goedgekeurde refactors; gebruik haar niet voor features, bugfixes, dependency-upgrades of speculatieve abstracties.
---

# Refactoring

1. Lees `AGENTS.md`, het handoffpakket en alleen de daarin gekozen
   contextbronnen. Architectuurdocumentatie is verplicht wanneer modulegrenzen,
   entrypoints of dependencyrichting wijzigen.
2. Inspecteer de worktree en behoud niet-gerelateerde wijzigingen.
3. Leg scope, out-of-scope, publieke contracten, zichtbaar gedrag, security,
   accessibility, dataformaten en verwachte kwaliteitswinst vast.
4. Vereis een Tester-baseline met exacte commando's, scenario's, failures,
   skips, flakiness en ontbrekende characterization coverage.
5. Voer per stap een coherente structurele wijziging uit.
6. Draai na iedere stap de kleinste relevante check en inspecteer de diff.
7. Herhaal onafhankelijk dezelfde baseline en laat niet-triviale wijzigingen
   door Reviewer beoordelen.
8. Voer de documentatie-impactcheck uit.

Vermijd brede formatting, testverzwakking, nieuwe dependencies, publieke
contractwijzigingen en cleanup buiten scope.

Lever een Refactor Report met:

- scope en bewijs;
- behouden contracten;
- gewijzigde bestanden;
- baseline- en eindresultaten;
- Tester- en Reviewerbevindingen;
- risico en rollback;
- eventueel onderbouwd instructievoorstel voor de Developer Agent.
