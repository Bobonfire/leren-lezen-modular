---
name: github-documentation-publishing
description: Publiceer een geverifieerde documentatie-impactuitkomst op GitHub, actualiseer relevante PR-tekst en commit uitsluitend goedgekeurde documentatiebestanden. Gebruik dit na non-blocking test en review, met expliciete doel-PR en write-scope.
---

# GitHub Documentation Publishing

1. Verifieer repository, open PR, stabiele head-SHA en test-/reviewbewijs.
2. Classificeer impact als `agent`, `human`, `beide` of `geen`.
3. Bij `geen`: werk alleen de centrale workflowcomment en PR-body bij, zet
   `evidence:documentation-none` en verwijder
   `evidence:documentation-complete`.
4. Bij andere impact:
   - wijzig uitsluitend afgesproken documentatiebestanden;
   - gebruik een docs-worktree of expliciet overgedragen PR-branch;
   - commit met een herkenbare documentatiemelding;
   - actualiseer PR-body en plaats een korte impactcomment;
   - zet `evidence:documentation-complete` en verwijder
     `evidence:documentation-none`.
5. Controleer links, paden, commando's en gebruikersflows.
6. Lees PR-body, comment, evidence-labels en commit-SHA terug.

Wijzig geen broncode, tests, requirements of productscope. Publiceer geen
onbewezen gedrag.
