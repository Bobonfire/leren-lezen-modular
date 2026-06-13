# AI Assistant Guide

Deze repository gebruikt de native Codex-structuur:

- `AGENTS.md` voor blijvende repository-instructies;
- `.codex/agents/*.toml` voor gespecialiseerde projectagents;
- `.agents/skills/*/SKILL.md` voor herbruikbare workflows;
- `ai-agents/workflows/` voor de volledige delivery state machines;
- `docs/agents/AGENT_HANDBOOK.md` als codebase- en samenwerkingskaart.

## Werkwijze

1. Lees `AGENTS.md` en de daarin genoemde instructies.
2. Gebruik de native agent die bij de opdracht past.
3. Activeer alleen relevante skills; laad geen volledige agentbibliotheek.
4. Houd wijzigingen klein, gericht en omkeerbaar.
5. Voer relevante checks uit en rapporteer niet-uitgevoerde checks.
6. Voer de documentatie-impactcheck uit `docs/DOCUMENTATION.md` uit.

## Gitveiligheid

- Werk lokaal tenzij expliciet om GitHub-acties wordt gevraagd.
- Push nooit zonder expliciete toestemming.
- Merge nooit zonder expliciete merge-opdracht.
- Raak bestaande wijzigingen van anderen niet terug.

## Approval

Bob bepaalt productscope en geeft de uiteindelijke merge-approval. Agents mogen
geen ontbrekende productbeslissingen invullen wanneer dit gedrag of scope wijzigt.
