# Project Structure Documentation

This document describes the folder and file structure of the **Leren Lezen** project,
including an architecture diagram and explanations of each component.

---

## 📂 Folder Structure

```
project-root/
│
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
│
├── src/
│   ├── constants.js
│   ├── main.js
│   ├── router.js
│   │
│   ├── core/
│   │   ├── state.js
│   │   ├── storage.js
│   │   ├── rewards.js
│   │   ├── sampler.js
│   │   ├── timer.js
│   │   └── tts.js
│   │
│   ├── data/
│   │   ├── emoji_words.js
│   │   └── cvc_words.js
│   │
│   ├── modes/
│   │   ├── emoji.js
│   │   └── cvc.js
│   │
│   └── ui/
│       ├── dom.js
│       ├── confetti.js
│       ├── overlay.js
│       └── trophy.js
```

---

## 🖼 Architecture Diagram

![Project Structure](project-structure.svg)

---

## 📖 Explanation

### **public/**
Contains static files served directly by the browser.
- **index.html** → zelfstandig public-folder entrypoint.
- **app.js** → gegenereerde browserbundle; niet handmatig wijzigen.
- **styles.css** → global styling, buttons, emoji sizes, trophies, animations.

### **src/**
Application logic and components.

- **constants.js**  
  Defines constants (timers, reward tiers, etc.).

- **main.js**  
  Entry point, initializes the app, sets up routing and UI.

- **router.js**  
  Manages navigation between screens (home, emoji, CVC).

---

### **src/core/**
Core business logic and state management.
- **state.js** → Central app state (stars, streak, stickers). Supports reset & pub/sub.
- **storage.js** → Persistence layer (localStorage).
- **rewards.js** → Reward system (stickers, thresholds).
- **sampler.js** → Random selection with no-repeat logic.
- **timer.js** → Session time limits and pause/cooldown system.
- **tts.js** → Text-to-speech for audio feedback.

---

### **src/data/**
Static datasets.
- **emoji_words.js** → Emoji → word pairs.
- **cvc_words.js** → Letters and simple words (CVC pattern).

---

### **src/modes/**
Game modes (learning exercises).
- **emoji.js** → Emoji & word matching game.
- **cvc.js** → Build-the-word (CVC) game.

---

### **src/ui/**
UI components and effects.
- **dom.js** → Helper functions (`$`, `el`) for DOM handling.
- **confetti.js** → 🎉 Celebration effect.
- **overlay.js** → Pause/cooldown overlay.
- **trophy.js** → Trophy case rendering, animations, next-sticker display.

---

## 🔄 Reset Functionality
- Implemented in `state.js` (`resetSession`).
- Already wired in **emoji.js** (`🔄 Reset` button).
- Needs to be added in **cvc.js** and optionally on **home screen**.

---

This document should be kept in `docs/engineering/project-structure.md` and updated whenever new files or modules are added.

---

## Native Codex agentconfiguratie

```text
.codex/
|-- config.toml
`-- agents/
    |-- orchestrator.toml
    |-- product_owner.toml
    |-- developer.toml
    |-- tester.toml
    |-- reviewer.toml
    |-- documentation.toml
    `-- refactor.toml

.agents/
`-- skills/
    `-- <skill-name>/
        |-- SKILL.md
        `-- agents/openai.yaml

docs/
|-- agents/
|   |-- README.md
|   |-- collaboration.md
|   |-- workflows/
|   `-- decisions/
`-- engineering/
    |-- code-quality.md
    |-- code-security.md
    |-- project-structure.md
    `-- project-structure.svg
```

- Iedere `.codex/agents/*.toml` definieert precies een custom agent.
- Iedere skill heeft een lowercase kebab-case map en exact `SKILL.md`.
- `docs/agents/workflows/` bevat actieve procesdefinities.
- `docs/agents/decisions/` bevat historische onderbouwing en geen runtime-instructies.
- `docs/engineering/` bevat de normatieve technische bronnen.
- `scripts/validate-agent-config.mjs` controleert verplichte agents, skillmetadata,
  UI-metadata en het modelprofiel per agent lokaal en in CI.
- `scripts/agent-orchestrator.mjs` routeert GitHub-items naar Fast Track of Full
  Delivery en publiceert een centrale workflowstatus.
- `scripts/agent-orchestrator-test.mjs` test routing, stateovergangen,
  approvalcommando's en stale-branch-detectie.
- `docs/agents/workflows/fast-delivery.md` beschrijft kleine,
  productduidelijke wijzigingen.
- `docs/agents/workflows/full-delivery.md` beschrijft features,
  risicovol werk en refactors.
- Agents draaien in afzonderlijke threads; schrijfwerk gebruikt waar nodig een
  eigen worktree. Tester en Reviewer beoordelen parallel exact dezelfde PR-SHA.
- De GitHub Actions-workflow `.github/workflows/agent-orchestrator.yml` beheert
  route-, state- en evidence-labels. Alleen een human mag merge-approval geven.

---

## Structuurupdate: statische root-entrypoint en smoke-test

- `index.html` is de root-entrypoint voor statische hosting vanaf de repository-root.
- `public/index.html` blijft beschikbaar als zelfstandig public-folder entrypoint.
- Beide entrypoints laden `public/app.js`, zodat de app ook bij rechtstreeks lokaal openen werkt.
- `scripts/build-browser-bundle.mjs` genereert deze dependencyvrije bundle uit de modules onder `src/`.
- `scripts/smoke-test.mjs` controleert entrypoints, assetpaden, primaire knoppen en responsive CSS-guards.
- `scripts/app-interaction-test.mjs` controleert dat alle vier homeknoppen een zichtbaar spel mounten.
