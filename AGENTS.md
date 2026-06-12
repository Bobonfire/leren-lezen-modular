# AGENTS.md

Algemene werkafspraken voor AI coding agents in dit project.

## Instructiebronnen

Lees voor iedere wijziging eerst de projectinstructies:

- `.codex/agents/<rol>.toml` wanneer je als native custom agent bent gestart
- relevante native skills onder `.agents/skills/`
- `ai/README.ai.md`
- `ai/ai_instructions/ai-codex-instructions.md`
- `ai/ai_instructions/CODE_QUALITY.md`
- `ai/ai_instructions/CODE_SECURITY.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/DOCUMENTATION.md`
- `docs/agents/AGENT_HANDBOOK.md`
- `docs/CONTRIBUTING.md` wanneer de wijziging proces, review of samenwerking raakt.

Meld in je antwoord welke instructiebestanden je hebt gebruikt.

## Native Codex-structuur

- `.codex/agents/` is de bron van waarheid voor uitvoerbare custom agents.
- `.agents/skills/<naam>/SKILL.md` is de bron van waarheid voor herbruikbare
  Codex-workflows.
- `ai-agents/workflows/` bevat blijvende delivery- en orchestrationprocessen,
  maar definieert geen automatisch laadbare agents of skills.
- Start subagents alleen wanneer de gebruiker daar expliciet om vraagt.
- Houd agentrollen smal: laat review-, test- en productagents geen broncode
  wijzigen en laat uitvoerende agents geen productscope bepalen.

## Werkwijze

- Werk lokaal en maak wijzigingen klein, gericht en omkeerbaar.
- Raak geen bestaande wijzigingen van anderen terug zonder expliciete opdracht.
- Voeg geen dependencies toe zonder expliciete goedkeuring.
- Update documentatie wanneer structuur, gedrag of workflow verandert.
- Voer bij iedere wijziging een documentatie-impactcheck uit volgens `docs/DOCUMENTATION.md`.
- Werk agentgerichte en mensgerichte documentatie apart bij; een codecommentaar of PR-samenvatting vervangt geen gebruikersdocumentatie.
- Houd UI-wijzigingen toegankelijk, responsief en consistent met de bestaande vanilla HTML/CSS/JS aanpak.
- Gebruik Nederlands voor projectdocumentatie en issue/PR communicatie, tenzij bestaande code of externe tooling Engels vereist.

## Kwaliteit en veiligheid

- Volg `CODE_QUALITY.md` voor HTML, CSS, JavaScript en tooling.
- Volg `CODE_SECURITY.md` voor secrets, dependencies, DOM-veiligheid en supply chain.
- Gebruik `textContent` voor dynamische tekst en vermijd `innerHTML` met onbetrouwbare input.
- Test relevante paden voordat werk als klaar wordt gemeld.

## Git-afspraken

- Niet pushen zonder expliciete toestemming.
- Niet mergen zonder expliciete merge-opdracht.
- Rapporteer gewijzigde bestanden, uitgevoerde checks en eventuele niet-uitgevoerde checks.
