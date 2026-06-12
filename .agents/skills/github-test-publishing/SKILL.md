---
name: github-test-publishing
description: Publiceer geverifieerd Testerbewijs voor exact de beoordeelde PR-SHA zonder CI-bewijs, reviewbewijs of een mergebesluit over te nemen.
---

# GitHub Test Publishing

1. Verifieer PR-nummer, open status en head-SHA.
2. Controleer dat alle vereiste acceptatiecriteria, regressies en negatieve
   paden op exact die SHA zijn beoordeeld.
3. Zet bij een non-blocking Tester-uitkomst `evidence:test-passed`.
4. Verwijder `evidence:test-passed` en zet `evidence:changes-required` wanneer
   een blocking gedragsbevinding bestaat.
5. Verwijder `evidence:changes-required` bij een latere pass alleen wanneer geen
   blocking Reviewer-thread of andere blocking evidence resteert.
6. Publiceer commando's, scenario's, resultaten en resterende testgaten.
7. Lees head-SHA, labels en centrale workflowcomment terug.

`evidence:ci-passed` is uitsluitend CI-bewijs en vervangt Testerbewijs niet.
Merge nooit vanuit deze skill.
