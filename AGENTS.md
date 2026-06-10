# AGENTS.md

Algemene werkafspraken voor AI coding agents in dit project.

## Instructiebronnen

Lees voor iedere wijziging eerst de projectinstructies:

- `ai/README.ai.md`
- `ai/ai_instructions/ai-codex-instructions.md`
- `ai/ai_instructions/CODE_QUALITY.md`
- `ai/ai_instructions/CODE_SECURITY.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/CONTRIBUTING.md` wanneer de wijziging proces, review of samenwerking raakt.

Meld in je antwoord welke instructiebestanden je hebt gebruikt.

## Werkwijze

- Werk lokaal en maak wijzigingen klein, gericht en omkeerbaar.
- Raak geen bestaande wijzigingen van anderen terug zonder expliciete opdracht.
- Voeg geen dependencies toe zonder expliciete goedkeuring.
- Update documentatie wanneer structuur, gedrag of workflow verandert.
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
