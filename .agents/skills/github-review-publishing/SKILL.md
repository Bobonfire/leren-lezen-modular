---
name: github-review-publishing
description: Publiceer geverifieerde Reviewer-bevindingen als formele GitHub PR-review en werk de agent-reviewstatus bij zonder broncode of mergebesluit te wijzigen. Gebruik dit alleen op de exacte beoordeelde PR-SHA en met pull-requests write.
---

# GitHub Review Publishing

1. Verifieer PR-nummer, open status en head-SHA.
2. Publiceer inline comments alleen voor concrete findings met bestand en regel.
3. Gebruik `REQUEST_CHANGES` bij blocking findings en zet
   `evidence:changes-required`; verwijder `evidence:review-passed`.
4. Gebruik `COMMENT`, een groene `agent-review` status of een formele review
   wanneer geen blocking findings bestaan. Zet daarna
   `evidence:review-passed` en verwijder `evidence:changes-required`.
5. Vermeld resterende testgaten en de exact beoordeelde SHA.
6. Lees review, status en evidence-labels terug.

Een agentreview is technisch bewijs en geen menselijke productapproval. Gebruik
geen `APPROVE` wanneer dezelfde GitHub-identiteit auteur is of wanneer branch
protection een onafhankelijke menselijke review vereist. Merge nooit.
