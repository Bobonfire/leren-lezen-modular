# Workflow V2 Decision Record

## Status

Geïmplementeerd. Dit bestand is historisch en niet normatief.

## Aanleiding

De eerste multi-agentrun laadde te veel gedeelde context, dupliceerde
samenvattingen en liet twee agents vastlopen. Ook waren route, modelkeuze,
GitHub-evidence en branchhergebruik onvoldoende begrensd.

## Besluiten

- gebruik Fast Track en Full Delivery als afzonderlijke routes;
- gebruik een aparte thread per gespecialiseerde agent;
- geef subagents een compact handoffpakket in plaats van de volledige chat;
- selecteer quality-, security-, architectuur- en documentatiebronnen
  conditioneel via de contextmatrix in `AGENTS.md`;
- stem model en reasoning per rol af in `.codex/agents/*.toml`;
- laat Tester en Reviewer parallel dezelfde commit-SHA beoordelen;
- gebruik GitHub als state- en evidencebus;
- beperk retries en agentruns met `$budget-control`;
- houd menselijke approval en merge gescheiden.

## Actieve Bronnen

| Onderwerp | Normatieve bron |
| --- | --- |
| Contextselectie | `AGENTS.md` |
| Rol- en modelprofielen | `.codex/agents/*.toml` |
| Routecriteria | `.agents/skills/workflow-routing/SKILL.md` |
| Handoffs | `.agents/skills/compact-handoff/SKILL.md` |
| Budget en timeouts | `.agents/skills/budget-control/SKILL.md` |
| Deliverystates | `docs/agents/workflows/fast-delivery.md`, `docs/agents/workflows/full-delivery.md` |
| GitHub-state | `docs/agents/workflows/github-orchestration.md` |
| Samenwerkingsoverzicht | `docs/agents/collaboration.md` |

Wijzig actieve regels uitsluitend in deze bronnen, niet in dit decision record.
