---
name: workflow-routing
description: Kies deterministisch tussen Fast Track en Full Delivery op basis van productduidelijkheid, risico, blast radius, dependencies, security, data en architectuur. Gebruik deze skill voordat een Orchestrator agents start of een GitHub-workflowstate toekent.
---

# Workflow Routing

Kies `fast` wanneer het werk bestaand duidelijk gedrag herstelt of klein
onderhoud uitvoert zonder nieuwe dependency, datawijziging, securityimpact,
architectuurwijziging of brede module-impact.

Kies `full` bij een van deze signalen:

- nieuwe of gewijzigde productfunctionaliteit;
- onduidelijke productintentie;
- security-, privacy- of persoonsgegevensimpact;
- dependency-, opslag-, data- of architectuurwijziging;
- refactor over meerdere modulegrenzen;
- migratie, hoge blast radius of risicovolle rollback.

Gebruik dit resultaat:

```text
Route: fast | full
Evidence:
Blocking signals:
Required roles:
Skipped roles and reason:
```

Fast Track gebruikt standaard Developer, Tester, Reviewer en alleen bij
documentatie-impact Documentation. Start PO alleen wanneer productbeslissingen
ontbreken.

