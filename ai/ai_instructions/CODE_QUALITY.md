# Leren Lezen Code Quality Standards

## Algemeen

- Volg bestaande repositorypatronen en houd wijzigingen klein en gericht.
- Gebruik duidelijke namen, kleine functies en vroege returns.
- Voeg alleen commentaar toe waar intentie niet uit de code blijkt.
- Vermijd dode code, ongebruikte exports en brede formatting.
- Voeg geen dependencies toe zonder expliciete goedkeuring.

## HTML

- Gebruik semantische elementen en een logische headingstructuur.
- Koppel labels aan controls en gebruik ARIA alleen waar nodig.
- Gebruik geen inline event handlers.
- Houd beide entrypoints werkend: `index.html` en `public/index.html`.

## CSS

- Gebruik `public/styles.css` als globale stylesheet.
- Hergebruik bestaande custom properties, spacing en visuele patronen.
- Werk mobile-first en voorkom overlap, clipping en horizontaal scrollen.
- Maak interactieve focus zichtbaar met `:focus-visible`.
- Vermijd inline styles en `!important` tenzij de bestaande architectuur dit
  aantoonbaar vereist.

## JavaScript

- Gebruik ES modules met expliciete imports en exports.
- Houd startup en navigatiewiring in `src/main.js` en `src/router.js`.
- Plaats domeinlogica in `src/core/`, leerinhoud in `src/data/`, activiteiten in
  `src/modes/` en gedeelde DOM-functies in `src/ui/`.
- Vermijd mutable exported state en verborgen globale side effects.
- Laat optionele browser-API-fouten de kerninteractie niet blokkeren.

## Agentconfiguratie

- Definieer custom agents als een agent per `.codex/agents/*.toml`.
- Definieer skills als een map per `.agents/skills/<naam>/SKILL.md`.
- Houd skillbeschrijvingen specifiek genoeg voor betrouwbare implicit invocation.
- Houd agentinstructies smal en verwijs naar skills voor herbruikbare workflows.

## Checks

- Gebruik `node --check` voor gewijzigde JavaScriptbestanden.
- Gebruik `node scripts/smoke-test.mjs` voor appgedrag en entrypoints.
- Gebruik `node scripts/validate-agent-config.mjs` voor agents en skills.
- Voeg gerichte regressiechecks toe wanneer gedrag verandert.
