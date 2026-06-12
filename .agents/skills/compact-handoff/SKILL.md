---
name: compact-handoff
description: Maak een begrensd agenthandoffpakket met alleen work item, route, exacte SHA, opdracht, criteria, scope, bewijs, budget en stopvoorwaarden. Gebruik dit voor iedere subagentstart om contextduplicatie, drift en onnodig tokengebruik te beperken.
---

# Compact Handoff

Lever exact:

```text
Work item:
Route: fast | full
Current state:
Exact commit or PR SHA:
Assignment:
Acceptance criteria:
Allowed files or read scope:
Context sources:
Required commands:
Existing evidence:
Expected output schema:
Max tool calls:
Deadline:
Stop conditions:
```

Regels:

- Neem geen chattranscript, ruwe logs of volledige repositorydocumentatie op.
- Selecteer `Context sources` met de contextmatrix uit `AGENTS.md`.
- Noem geen bron die geen concreet signaal in taak, scope of diff heeft.
- Neem nooit de inhoud van quality-, security- of architectuurdocumenten over
  in het handoffpakket; verwijs alleen naar de normatieve bron.
- Gebruik geen volledige contextfork wanneer issue, PR en handoffpakket alle
  benodigde beslissingen bevatten.
- Geef bij herstel alleen nieuw bewijs en de resterende opdracht mee.
