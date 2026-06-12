# Codex Project Instructions

## Product

Leren Lezen is een statische Nederlandstalige leerapp voor jonge kinderen. De
app gebruikt vanilla HTML, CSS en JavaScript-modules en bevat leeractiviteiten
voor onder andere emojiwoorden, CVC-woorden, kloklezen en rekenen.

## Codex

- Gebruik `AGENTS.md` als primaire repository-instructie.
- Gebruik projectagents uit `.codex/agents/`.
- Gebruik herbruikbare workflows uit `.agents/skills/`.
- Gebruik `ai-agents/workflows/` alleen als procesreferentie.
- Vraag alleen om verduidelijking wanneer productintentie niet uit de repository
  of opdracht kan worden afgeleid zonder risicovolle aannames.

## Development

- Volg `CODE_QUALITY.md` en `CODE_SECURITY.md`.
- Gebruik bestaande vanilla HTML/CSS/JS-patronen.
- Voeg geen dependency toe zonder expliciete goedkeuring.
- Houd UI toegankelijk, keyboardbedienbaar en bruikbaar op 360px, 768px en
  1280px wanneer de wijziging layout of interactie raakt.
- Gebruik `textContent` voor dynamische tekst en geen `innerHTML` met
  onbetrouwbare invoer.
- Werk tests en documentatie bij wanneer gedrag, structuur of workflow verandert.

## Verification

- Voer minimaal `node scripts/smoke-test.mjs` uit voor appwijzigingen.
- Voer `node scripts/validate-agent-config.mjs` uit voor agent- of skillwijzigingen.
- Controleer gewijzigde JavaScriptbestanden met `node --check`.
- Rapporteer gewijzigde bestanden, uitgevoerde checks en resterende risico's.

## Git

- Niet pushen zonder expliciete toestemming.
- Niet mergen zonder expliciete merge-opdracht.
- Geen force push of destructieve reset.
