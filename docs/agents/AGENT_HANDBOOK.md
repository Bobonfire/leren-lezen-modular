# Agent Handbook

## Snel Starten

Lees voor iedere taak in deze volgorde:

1. `AGENTS.md`
2. De automatisch geladen agentdefinitie uit `.codex/agents/`
3. Alleen de relevante native skills uit `.agents/skills/`
4. `ai/README.ai.md`
5. `ai/ai_instructions/ai-codex-instructions.md`
6. `ai/ai_instructions/CODE_QUALITY.md`
7. `ai/ai_instructions/CODE_SECURITY.md`
8. `docs/PROJECT_STRUCTURE.md`
9. `docs/DOCUMENTATION.md`
10. De relevante workflow in `ai-agents/workflows/`

Meld bij handoff welke instructiebestanden daadwerkelijk zijn gebruikt. Wanneer
bronnen botsen, volg de meest specifieke actuele projectinstructie en maak het
conflict zichtbaar.

## Codebasekaart

| Pad | Betekenis |
| --- | --- |
| `index.html` | Root-entrypoint voor statische hosting |
| `public/app.js` | Gegenereerde browserbundle; niet handmatig wijzigen |
| `public/styles.css` | Globale visuele stijl en responsive gedrag |
| `src/main.js` | Startup, home-toolbar en navigatiewiring |
| `src/router.js` | Wisselt tussen home en modeschermen |
| `src/modes/` | Functionele leeractiviteiten: emoji, CVC, klok en rekenen |
| `src/core/` | State, opslag, rewards, sampling, timer en tekst-naar-spraak |
| `src/data/` | Statische leerinhoud per modus |
| `src/ui/` | Gedeelde DOM-, overlay-, confetti- en prijzenkastfuncties |
| `scripts/` | Lokale en CI-controles, inclusief orchestration dry-run |
| `.codex/agents/` | Native, automatisch laadbare custom agents |
| `.agents/skills/` | Native, automatisch vindbare herbruikbare skills |
| `ai-agents/workflows/` | Delivery- en orchestration state machines |
| `docs/` | Blijvende agent- en mensgerichte projectkennis |

Voor Angular-migratieonderzoek geldt aanvullend
`docs/ANGULAR_MIGRATION_PREPARATION.md`; dit beschrijft een voorstel en geen
actieve Angular-runtime.

## Functionele Afhankelijkheden

```mermaid
flowchart LR
    Sources["src/**/*.js"] --> Build["scripts/build-browser-bundle.mjs"]
    Build --> Bundle["public/app.js"]
    Entry["index.html"] --> Bundle
    Bundle --> Main["src/main.js startup"]
    Main --> Router["src/router.js"]
    Main --> Modes["src/modes/*"]
    Modes --> Core["src/core/*"]
    Modes --> Data["src/data/*"]
    Modes --> UI["src/ui/*"]
    Core --> Browser["localStorage, timers, Web Speech API"]
```

Na een wijziging onder `src/` moet `node scripts/build-browser-bundle.mjs`
worden uitgevoerd. `node scripts/build-browser-bundle.mjs --check` bewaakt in
CI dat `public/app.js` overeenkomt met de modulaire broncode.

## Documenten En Artefacten

| Document | Gebruik |
| --- | --- |
| `docs/HUMAN_GUIDE.md` | Productidee, modules, klikroutes en C4-overzicht |
| `docs/PROJECT_STRUCTURE.md` | Bestandsstructuur en moduleverklaring |
| `docs/DOCUMENTATION.md` | Impactcheck en scheiding tussen doelgroepen |
| `docs/agents/agent-collaboration.md` | Compacte agent deliveryflow |
| `.agents/skills/dev-summary/SKILL.md` | Verplichte handoffsamenvatting |
| `.agents/skills/decision-record/SKILL.md` | Betekenisvolle beslissingen |
| `.codex/agents/*.toml` | Scope en gedrag per native agent |
| `ai-agents/workflows/feature-delivery-workflow.md` | Volledige state machine |
| `ai-agents/workflows/github-orchestration-workflow.md` | GitHub-labels en events |

## Native Agentrollen

| Agentnaam | Bestand | Schrijfrechten |
| --- | --- | --- |
| `orchestrator` | `.codex/agents/orchestrator.toml` | Read-only; coordineert proces |
| `product_owner` | `.codex/agents/product_owner.toml` | Read-only; beheert productintentie |
| `developer` | `.codex/agents/developer.toml` | Workspace-write |
| `tester` | `.codex/agents/tester.toml` | Read-only |
| `reviewer` | `.codex/agents/reviewer.toml` | Read-only |
| `documentation` | `.codex/agents/documentation.toml` | Workspace-write voor documentatie |
| `refactor` | `.codex/agents/refactor.toml` | Workspace-write binnen refactorscope |

Codex start subagents alleen na een expliciet verzoek. De Orchestrator kiest dus
geen agent door alleen een bestand te vinden; de parentthread moet de gewenste
agent expliciet laten spawnen.

## Agentflow

1. Bob stelt een feature of correctie voor.
2. Orchestrator bewaakt state, budget, artefacten en handoffs.
3. Product Owner maakt het werk agent-ready.
4. Developer implementeert en levert testbewijs plus documentatie-impactindicatie.
5. Tester valideert gedrag; Reviewer valideert techniek en architectuur.
6. Documentation Agent voert de definitieve impactcheck uit en actualiseert
   agentdocs, humandocs, beide of motiveert `geen`.
7. Product Owner valideert product en documentatie.
8. Bob geeft expliciete approval; pas daarna kan merge worden aangevraagd.

Iedere handoff bevat minimaal een Dev Summary, huidige workflowstatus, relevante
artefacten, risico's en het volgende verantwoordelijke agentdoel.

## Documentatie Voor Iedere Wijziging

Gebruik `docs/DOCUMENTATION.md`. Noem bij handoff:

- impactuitkomst: `agent`, `human`, `beide` of `geen`;
- geraakte modules en zichtbaar gedrag;
- vermoedelijk verouderde documenten;
- gebruikte bewijsbronnen.

De Documentation Agent is eigenaar van de eindcontrole, maar iedere uitvoerende
agent blijft verantwoordelijk voor een bruikbare impactindicatie.
