# AGENTS.md

Globale repositoryregels voor mensen en AI-agents. Lees niet standaard alle
projectdocumentatie: laad alleen bronnen die volgens de contextmatrix nodig zijn.

## Instructiehiërarchie

Bij conflict geldt, van hoog naar laag:

1. expliciete gebruikersopdracht;
2. dit bestand en eventuele geneste `AGENTS.md`-bestanden;
3. het rolcontract in `.codex/agents/<rol>.toml`;
4. de actieve skill in `.agents/skills/<naam>/SKILL.md`;
5. exact één routeworkflow onder `docs/agents/workflows/`;
6. conditioneel geladen domeindocumentatie.

Procedures horen in skills of workflows. Feitelijke architectuur, security- en
kwaliteitsregels horen niet in prompts of workflows te worden gedupliceerd.

## Altijd Laden

- `AGENTS.md`;
- het automatisch gekozen rolcontract;
- het compacte handoffpakket met scope, SHA, bewijs en contextbronnen.

## Contextmatrix

| Signaal in taak of diff | Aanvullende bron |
| --- | --- |
| Appcode, HTML, CSS, JavaScript of tooling | `docs/engineering/code-quality.md` |
| Input, DOM-sinks, opslag, secrets, rechten, dependency of externe service | `docs/engineering/code-security.md` |
| Modulegrens, entrypoint, buildflow of architectuurwijziging | `docs/engineering/project-structure.md` |
| Zichtbaar gedrag of gebruikersflow | `docs/HUMAN_GUIDE.md` |
| Documentatie-impact of documentatiewijziging | `docs/DOCUMENTATION.md` |
| Agent-, skill- of workflowwijziging | `docs/agents/README.md` |
| Angular-migratie | `docs/ANGULAR_MIGRATION_PREPARATION.md` |

De Orchestrator zet alleen toepasselijke bronnen in `Context sources` van
`$compact-handoff`. Een subagent mag extra documentatie openen wanneer de diff
een nieuw concreet signaal toont en vermeldt dat in zijn bewijs.

## Globale Guardrails

- Houd wijzigingen klein en behoud niet-gerelateerde worktreewijzigingen.
- Voeg geen dependency toe zonder expliciete goedkeuring.
- Push niet zonder expliciete toestemming; merge alleen op expliciete opdracht.
- Test relevante paden en rapporteer niet-uitgevoerde checks.
- Gebruik Nederlands voor projectdocumentatie en GitHub-communicatie, tenzij
  code of externe tooling Engels vereist.
- Meld in de eindhandoff welke conditionele instructiebronnen zijn gebruikt.

## Reviewrichtlijnen

- Review de PR-diff en alleen concrete afhankelijkheden daarvan.
- Prioriteer correctness, security, privacy, regressies en ontbrekende tests.
- Controleer bundleversheid bij wijzigingen onder `src/`.
- Vereis Tester- en Reviewerbewijs op dezelfde head-SHA.
- Een agentreview vervangt geen menselijke mergeapproval.
