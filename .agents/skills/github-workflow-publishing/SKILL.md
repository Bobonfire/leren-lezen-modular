---
name: github-workflow-publishing
description: Publiceer of actualiseer één idempotente centrale workflowcomment en route- en statelabels op het juiste GitHub issue of pull request. Gebruik dit alleen met expliciete GitHub-writebevoegdheid en verifieer doel, marker, SHA en readback.
---

# GitHub Workflow Publishing

Gebruik exact één comment met marker:

```md
<!-- agent-workflow-state -->
Route:
State:
Commit:
CI:
Tester:
Reviewer:
Documentation impact:
Human approval:
Next action:
```

Werkwijze:

1. Verifieer repository, issue/PR-nummer, open status en exacte SHA.
2. Blokkeer wanneer de branch al aan een gemergede of gesloten PR gekoppeld is.
3. Zoek de bestaande markercomment.
4. Werk die comment bij of maak hem eenmaal aan.
5. Vervang oude `route:*`, `state:*`, `agent:*` en `evidence:*` labels door de
   berekende set. Behoud alleen evidence voor de exacte actuele commit-SHA.
6. Lees comment en labels terug.

Publiceer geen chattranscript, secrets of onbewezen claims. Merge nooit vanuit
deze skill.
