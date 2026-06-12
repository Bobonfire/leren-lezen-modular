# Agent Handbook

Navigatie voor agent-, skill- en workflowonderhoud. Dit document bevat geen
kopie van uitvoerbare instructies.

## Startvolgorde

1. `AGENTS.md`
2. automatisch geladen `.codex/agents/<rol>.toml`
3. compact handoffpakket
4. alleen de `Context sources` uit dat pakket
5. alleen de skills die voor de opdracht nodig zijn

De Orchestrator leest daarnaast exact één routeworkflow. Andere subagents lezen
geen routeworkflow tenzij hun opdracht een workflowwijziging betreft.

## Broneigenaarschap

| Onderwerp | Enige normatieve bron |
| --- | --- |
| Instructiehiërarchie, contextselectie, globale guardrails | `AGENTS.md` |
| Rol, bevoegdheden en outputcontract | `.codex/agents/<rol>.toml` |
| Herbruikbare procedure | `.agents/skills/<naam>/SKILL.md` |
| Deliverystates en gates | `docs/agents/workflows/fast-delivery.md` of `docs/agents/workflows/full-delivery.md` |
| GitHub-state en evidence-events | `docs/agents/workflows/github-orchestration.md` |
| Codekwaliteit en controles per technologie | `docs/engineering/code-quality.md` |
| Security, data, DOM-sinks en supply chain | `docs/engineering/code-security.md` |
| Modules, entrypoints en buildrelaties | `docs/engineering/project-structure.md` |
| Documentatie-impact en doelgroepkeuze | `docs/DOCUMENTATION.md` |
| Productgedrag en gebruikersflows | `docs/HUMAN_GUIDE.md` |

Wijzig bij overlap de normatieve bron en vervang andere tekst door een verwijzing.

## Agentrollen

| Agent | Verantwoordelijkheid | Schrijfrechten |
| --- | --- | --- |
| Orchestrator | Route, state, budget en handoffs | read-only |
| Product Owner | Productcriteria en productacceptatie | read-only |
| Developer | Implementatie en gerichte tests | workspace-write |
| Tester | Onafhankelijke gedragsverificatie | read-only |
| Reviewer | Onafhankelijke diffreview | read-only |
| Documentation | Documentatie-impact en updates | docs workspace-write |
| Refactor | Goedgekeurde gedragsbehoudende refactor | begrensde worktree-write |

## Onderhoudsregel

Voeg geen algemene regel toe aan een agent-TOML, skill of workflow wanneer die
al in `AGENTS.md` of een domeindocument staat. Voeg geen procedure toe aan een
architectuur-, quality- of securitydocument. `scripts/validate-agent-config.mjs`
controleert de structuur en enkele anti-duplicatiecontracten.

## Mappen

```text
docs/agents/
|-- README.md
|-- collaboration.md
|-- workflows/
|   |-- fast-delivery.md
|   |-- full-delivery.md
|   |-- github-orchestration.md
|   `-- refactoring.md
`-- decisions/
    |-- workflow-v2.md
    `-- refactor-agent-research.md
```

`workflows/` is actief en normatief. `decisions/` bevat historische
onderbouwing en is nooit een runtime-instructiebron.
