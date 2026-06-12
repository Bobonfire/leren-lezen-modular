# Angular migratievoorbereiding

Datum: 2026-06-09

Status: voorbereidend document voor issues #3 t/m #8. Dit document introduceert geen Angular-code en installeert geen dependencies.

## Gebruikte instructies

- `AGENTS.md`
- `ai/README.ai.md`
- `ai/ai_instructions/ai-codex-instructions.md`
- `ai/ai_instructions/CODE_QUALITY.md`
- `ai/ai_instructions/CODE_SECURITY.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/CONTRIBUTING.md`
- `.codex/agents/developer.toml`

Opmerking: `ai/README.ai.md` verwijst naar `ai/instructions/quick-modes.txt`, maar dat bestand bestaat niet in deze repo. Er bestaat wel `ai/ai_instructions/quick control block`.

## #3 CPO approval and migration scope

Status: blocked voor technische implementatie.

Developer Agent kan dit item niet zelf afvinken, omdat Angular-migratie een product- en scopebesluit is. Nodig voor voortgang:

- CPO/human approval dat Angular de gewenste frameworkrichting is.
- Productdoel van de migratie, bijvoorbeeld onderhoudbaarheid, testbaarheid, schaalbaarheid of deploymentstandaardisatie.
- Expliciete in-scope gebieden: app-shell, navigatie, spelmodi, beloningen, opslag, timer/cooldown, TTS/audio, styling.
- Expliciete out-of-scope gebieden: nieuwe leerinhoud, nieuwe spelmodi, redesign, accountfunctionaliteit, analytics, backend of monetisatie, tenzij apart goedgekeurd.
- Success metrics: feature parity, geen regressies in bestaande flows, automatische checks in CI, acceptatie per slice door PO/CPO.
- Risico's en tradeoffs: hogere toolchaincomplexiteit, dependencybeheer, migratiekosten, tijdelijke dubbeling van oude en nieuwe code.

## #4 Inventaris huidige vanilla JS applicatie

### Routes en schermen

- `public/index.html` bevat de volledige statische shell.
- `#screen-home` is het startscherm met navigatie naar vier spelmodi.
- `#screen-emoji`, `#screen-cvc`, `#screen-clock` en `#screen-math` zijn lege containers die runtime door mode-modules worden gevuld.
- `src/router.js` schakelt schermen door `.hidden` te toggelen.
- Browser history wordt in `src/main.js` met `history.pushState` en `window.onpopstate` gebruikt. Terug navigeren toont Home.

### Spelmodi

- `src/modes/emoji.js`: kies het juiste woord bij een emoji. Vier antwoordknoppen, anti-repeat, feedback, sterren, streak, confetti, stickers en reset.
- `src/modes/cvc.js`: bouw een CVC-woord met lettertegels. Slots, delete-knop, hints na foutpogingen, sterren per juiste letter en beloningen bij volledig juist woord. Deze modus heeft geen resetknop.
- `src/modes/clock.js`: kies de juiste kloktijd. SVG-klok, hard-mode na meerdere goede rondes, sterrenoverlay, reset.
- `src/modes/math.js`: kies het juiste antwoord voor sommen tot en met 10, reset.

### Core modules

- `src/core/state.js`: centrale mutable state, pub/sub, sterren, stickers, streak, firstTry, audioOn, recentWords en sessiereset.
- `src/core/storage.js`: `localStorage` persistence voor `ll_stars`, `ll_stickers` en `ll_cooldown_until`.
- `src/core/rewards.js`: reward thresholds, stickers toekennen en anti-guess sterrentelling.
- `src/core/sampler.js`: selectie met no-repeat venster.
- `src/core/timer.js`: sessielimiet en cooldown via `Date.now`, `setInterval` en persisted cooldown.
- `src/core/tts.js`: wrapper rond `SpeechSynthesisUtterance` en `speechSynthesis`.

### UI modules

- `src/ui/dom.js`: DOM selector en element factory. Dynamische tekst wordt via `textContent` of text nodes geplaatst.
- `src/ui/confetti.js`: visueel confetti-effect in `#confetti`.
- `src/ui/overlay.js`: pauze/cooldown overlay.
- `src/ui/trophy.js`: prijzenkast, volgende sticker tekst en stickeranimatie.

### Data modules

- `src/data/emoji_words.js`: emoji-woordparen.
- `src/data/cvc_words.js`: CVC woorden en beschikbare letters.
- `src/data/clock_hours.js`: hele uren 1 t/m 12.
- `src/data/math_problems.js`: gegenereerde optelsommen met antwoord <= 10.

Migratiekandidaten: data kan eerst als readonly TypeScript constants blijven bestaan en later optioneel naar typed JSON of Angular services verhuizen.

### Browser APIs en effecten

- DOM: `querySelector`, `createElement`, `createElementNS`, classes, inline event handlers via properties.
- History API: `history.pushState`, `window.onpopstate`.
- Storage: `localStorage`.
- Audio: Web Speech API via `SpeechSynthesisUtterance`.
- Timers: `setTimeout`, `setInterval`, `Date.now`.
- SVG: klok wordt runtime opgebouwd met `document.createElementNS`.
- Animatie: CSS animations en class toggles.

### Bestaand gedrag dat gelijk moet blijven

- Home toont sterren, streak, countdown naar volgende sticker en prijzenkast.
- Navigatie naar een spelmodus start een frisse sessie met lege stickers.
- Terug navigeren toont Home.
- Eerste poging bepaalt ster/streak gedrag; fouten resetten streak.
- No-repeat venster voorkomt directe herhaling.
- Beloningen worden toegekend op thresholds 3, 7, 12, 20 en 30.
- Cooldown blokkeert spelen na sessielimiet en blijft via `localStorage` bewaard.
- UI blijft Nederlands, kindgericht en keyboard-bediend via native buttons.

### Bekende documentatiegaps

- `docs/PROJECT_STRUCTURE.md` noemt nog alleen emoji en CVC en mist clock/math.
- `docs/PROJECT_STRUCTURE.md` zegt dat reset nog nodig is in CVC en Home; CVC mist inderdaad reset, Home heeft geen reset, clock/math hebben reset.
- `ai/ai_instructions/ai-codex-instructions.md` bevat actuele Leren Lezen- en native Codex-instructies.
- README is zeer beperkt en documenteert geen lokale start-, test- of buildstappen.
- Er is geen root `package.json`, `package-lock.json` of Angular/tooling-configuratie.

## #5 Doelarchitectuur Angular

### Versie- en toolingassumpties

- Richting: Angular 22.x, omdat Angular 22 op 2026-06-03 actief ondersteund is volgens de officiele Angular releasepagina.
- Node: gebruik Node 22 LTS in de projecttooling waar mogelijk. Angular 22 ondersteunt volgens de Angular compatibiliteitstabel Node `^22.22.3`, `^24.15.0` of `^26.0.0`; verifieer de exacte lokale Node-versie voor installatie.
- TypeScript: Angular 22 vereist TypeScript `>=6.0.0 <6.1.0`.
- RxJS: Angular 22 ondersteunt `^6.5.3` of `^7.4.0`.
- Gebruik Angular CLI met gelijke major versie als Angular core.
- Bronnen: https://angular.dev/reference/releases en https://angular.dev/reference/versions.

Geen installatie uitvoeren voordat #3 is goedgekeurd en dependencybeleid expliciet akkoord is.

### Voorgestelde folderstructuur

```text
src/
  app/
    app.component.ts
    app.routes.ts
    core/
      app-state.service.ts
      storage.service.ts
      rewards.service.ts
      sampler.service.ts
      session-timer.service.ts
      tts.service.ts
    data/
      emoji-words.ts
      cvc-words.ts
      clock-hours.ts
      math-problems.ts
    features/
      home/
      emoji/
      cvc/
      clock/
      math/
    shared/
      trophy-case/
      pause-overlay/
      confetti/
  styles.css
```

### Mapping huidige modules naar Angular

- `public/index.html` -> Angular host `index.html` plus `AppComponent`.
- `src/main.js` -> Angular bootstrap, app shell en route entrypoints.
- `src/router.js` -> `app.routes.ts` met routes voor home, emoji, cvc, clock en math.
- `src/core/state.js` -> `AppStateService`, bij voorkeur met Angular signals voor eenvoudige reactive state.
- `src/core/storage.js` -> `StorageService` met defensive parsing en key constants.
- `src/core/rewards.js` -> `RewardsService` of pure utility met typed `RewardTier`.
- `src/core/sampler.js` -> pure helper/service.
- `src/core/timer.js` -> `SessionTimerService`, testbaar met fake timers.
- `src/core/tts.js` -> `TtsService`, browser API achter feature-detectie.
- `src/modes/*.js` -> standalone feature components met templates en component tests.
- `src/ui/trophy.js`, `overlay.js`, `confetti.js` -> shared components/directives/services.
- `public/styles.css` -> globale `src/styles.css` plus component styles waar logisch.

### Routingstrategie

- Routes: `/`, `/emoji`, `/cvc`, `/clock`, `/math`.
- Home blijft de default route.
- Navigatie gebruikt Angular Router in plaats van handmatige class toggles.
- Back/forward gedrag moet feature parity houden: terug vanuit een mode toont Home.
- Besluit nodig: start iedere route-entry opnieuw een sessie, zoals de huidige `go*` functies doen.

### State en storage

- Houd state initieel client-side en lokaal, zonder backend.
- Gebruik typed state in een singleton service.
- Gebruik `localStorage` alleen via `StorageService`; alle parsing defensief houden.
- Behoud bestaande storage keys tenzij CPO/PO expliciet datareset toestaat.
- Maak migratiegedrag expliciet: bestaande `ll_stars`, `ll_stickers`, `ll_cooldown_until` moeten blijven werken.

### Styling

- Start met globale CSS-migratie om visuele regressie te beperken.
- Splits pas later naar component styles waar de grenzen stabiel zijn.
- Behoud Nederlandse UI-copy, grote touch targets, responsive layout en native buttons.
- Geen UI redesign in de migratie zonder apart goedgekeurde scope.

### Accessibility en security

- Native buttons blijven de basis voor keyboard support.
- Focus states mogen niet verdwijnen.
- Dynamische tekst blijft via Angular interpolation/property binding; geen `[innerHTML]` voor onbetrouwbare input.
- Browser APIs krijgen feature-detectie en testbare wrappers.
- CSP/Netlify headers blijven een separaat deployment item.

### Aanbevolen migratieaanpak

Aanbevolen: phased feature-parity migration.

Reden: de app heeft duidelijke mode-grenzen en gedeelde core-services. Een big-bang rewrite vergroot regressierisico; een hybride aanpak met twee runtime-apps is waarschijnlijk te zwaar voor deze kleine statische app. Bouw eerst een Angular shell naast of in een aparte branch, migreer gedeelde services, daarna feature slices per mode.

## #6 Build, test en CI strategie

### Benodigde tooling

- Angular CLI 22.x.
- Angular packages 22.x.
- TypeScript binnen Angular 22 range.
- Test runner: Angular default unit/component tooling of een expliciet gekozen alternatief.
- E2E: Playwright is aanbevolen voor route- en browser-API-regressies.
- Formatter/linter: Angular CLI defaults plus bestaande projectnormen; geen nieuwe dependencies zonder approval.

### Voorgestelde lokale commando's

Na goedkeuring en installatie:

```bash
npm run start
npm run build
npm run test
npm run test:e2e
npm run lint
```

### Testaanpak

- Unit: pure rewards, sampler, storage parsing en math-problem generation.
- Component: home, trophy case, pause overlay en elke mode met mocked services.
- Integration: route-entry resetgedrag, state updates, persistence, cooldown.
- E2E: kritieke journeys per mode in een echte browser, inclusief back navigation en responsive smoke checks.

### CI voorstel

- Behoud Node 22 als CI-basis, maar stem patchversie af op Angular 22 compatibiliteit.
- Nieuwe CI-stappen pas na Angular-tooling approval:
  - dependency install via lockfile
  - lint
  - unit/component tests
  - build
  - E2E smoke waar haalbaar
- Huidige CI-syntaxcheck (`node --check`) blijft nuttig zolang vanilla JS bestaat.

### Dependencybeleid

- Geen `npm install`, `ng add` of framework scaffolding uitvoeren zonder expliciete toestemming.
- Lockfile committen zodra dependencies goedgekeurd zijn.
- Geen third-party UI libraries in de migratiebaseline zonder apart besluit.

## #7 Feature parity slices

Volgorde is een technische aanbeveling op risico en acceptatiegemak; finale productprioriteit blijft PO/CPO-besluit.

### Slice 1: App shell en navigatie

Scope: Angular app shell, routes, home, mode containers, toolbarwaarden en back navigation.

Acceptatie:
- Home toont dezelfde vier navigatieknoppen.
- Routes voor home, emoji, cvc, clock en math bestaan.
- Back vanuit een mode toont Home.
- Start van een mode reset sessie zoals nu.

Regressiechecks:
- Geen console errors bij openen en navigeren.
- Keyboard tabt door alle navigatieknoppen.

### Slice 2: Core state, rewards en storage

Scope: state service, localStorage, rewards, thresholds, anti-guess, no-repeat.

Acceptatie:
- Sterren, streak en stickers volgen hetzelfde gedrag.
- Storage keys blijven compatibel.
- Reward thresholds blijven 3, 7, 12, 20 en 30.

Regressiechecks:
- Unit tests voor rewards en storage.
- E2E check dat een sticker verschijnt op threshold.

### Slice 3: Emoji mode

Scope: emoji-word flow, vier opties, feedback, no-repeat, confetti/sticker trigger.

Acceptatie:
- Correct antwoord geeft ster en volgende ronde.
- Fout antwoord blokkeert kort en reset firstTry/streak.
- Resetknop werkt zoals huidig.

Regressiechecks:
- Component test met vaste dataset.
- E2E smoke met mocked/random-controle waar mogelijk.

### Slice 4: CVC mode

Scope: letterkeuze, slots, delete, hints na fouten, beloning bij compleet woord.

Acceptatie:
- Letters vullen slots in volgorde.
- Delete verwijdert laatste letter.
- Na drie fouten worden juiste letters gehighlight.
- Geen productwijziging: ontbreken van reset blijft gelijk, tenzij PO apart reset toevoegt.

Regressiechecks:
- Component test voor letterplaatsing en delete.
- E2E smoke voor volledig correct woord.

### Slice 5: Clock mode

Scope: SVG-klok component, uurkeuze, hard-mode, reset.

Acceptatie:
- Klok toont hele uren 1 t/m 12.
- Hard-mode verschijnt na drie normale correcte rondes en duurt twee rondes.
- Reset herstart mode state.

Regressiechecks:
- Unit/component test voor SVG-handposities.
- E2E smoke voor correct antwoord.

### Slice 6: Math mode

Scope: optelsommen tot 10, antwoordopties, reset.

Acceptatie:
- Alleen sommen met antwoord <= 10.
- Correct antwoord beloont; fout antwoord reset firstTry/streak.

Regressiechecks:
- Unit test voor probleemgeneratie.
- E2E smoke voor correct antwoord.

### Slice 7: Timer, TTS en polish

Scope: cooldown overlay, Web Speech wrapper, confetti/sticker animatie, responsive/a11y pass.

Acceptatie:
- Cooldown blijft persistent.
- TTS faalt veilig wanneer browser API ontbreekt.
- Animaties blokkeren interactie niet.

Regressiechecks:
- Fake timer tests.
- Browser smoke voor responsive home en mode-schermen.

## #8 Acceptatie- en regressiechecklist

### Kritieke user journeys

- Open app -> Home verschijnt zonder console errors.
- Navigeer naar elke mode -> mode toont content en toolbar.
- Beantwoord correct -> ster/streak/countdown werken.
- Beantwoord fout -> feedback verschijnt en streak reset.
- Verdien sticker -> prijzenkast wordt bijgewerkt.
- Gebruik browser back -> Home verschijnt.
- Herlaad app -> persisted sterren/stickers/cooldown blijven conform huidig gedrag.

### Per-mode checks

- Emoji: vier opties, correcte woordmatch, resetknop, no-repeat.
- CVC: clue, slots, lettergrid, delete, hint-highlighting.
- Clock: SVG klok, opties, hard-mode, reset.
- Math: somlabel, numerieke opties, reset.

### Cross-cutting checks

- Rewards: thresholds, anti-guess, streakbonus.
- Timer: sessielimiet en cooldown overlay.
- Storage: bestaande keys en corrupte storage data.
- TTS/audio: veilige fallback zonder Web Speech API.
- Confetti/sticker: animatie zonder layoutbreuk.

### Accessibility

- Alle interactieve elementen zijn buttons of links.
- Keyboard focus is zichtbaar.
- Labels/copy blijven begrijpelijk in Nederlands.
- Geen tekst alleen via kleur.
- Overlay is niet permanent onsluitbaar buiten cooldown-verwachting.

### Responsive layout

- Mobile: 360px breedte smoke check.
- Tablet: 768px breedte smoke check.
- Desktop: 1280px breedte smoke check.
- Geen overlappende tekst in toolbar, knoppen, slots of tiles.

### Browsercompatibiliteit

- Richt op de browserbaseline van de gekozen Angular-versie.
- Smoke test minimaal Chromium/Chrome en waar haalbaar Firefox/WebKit.
- Web Speech API gedrag is browserafhankelijk en moet optioneel blijven.

### Data preservation

- Behoud `ll_stars`, `ll_stickers` en `ll_cooldown_until`.
- Defensieve parsing blijft vereist.
- Geen automatische wipe zonder expliciet productbesluit.

### Definition of Done per migratieslice

- Acceptance criteria van de slice zijn voldaan.
- Relevante unit/component/integration/E2E checks zijn toegevoegd of bewust gemotiveerd niet van toepassing.
- `npm run build`, lint en tests slagen zodra Angular-tooling bestaat.
- Geen ongeaccordeerde dependencies.
- Geen productgedrag gewijzigd zonder PO/CPO-besluit.
- Issue/PR verwijst naar deze checklist en noemt eventuele afwijkingen.
