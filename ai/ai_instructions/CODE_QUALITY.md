# CODE_QUALITY.md
FIRE Calculator — Code Quality Standards
=======================================

These standards are *enforced by our AI pair‑programmers (ChatGPT/Copilot/Claude Code)* and by local tooling.
They cover HTML, CSS, JavaScript, and Python. Keep changes minimal and reversible; follow our VCS Safety Rules.

## Global rules (all languages)
- Small, composable functions; clear naming; early returns over deep nesting.
- Comments only when non-obvious; keep them truthful and updated.
- DRY: prefer extracting helpers over copy/paste.
- Deterministic builds: no network in tests; pin versions; avoid flaky logic.
- Accessibility first: keyboard focus, labels, ARIA where needed, color‑contrast ≥ WCAG AA.
- Performance: O(n) preferred; avoid unnecessary reflows; measure with Lighthouse/DevTools.
- i18n-ready: no hard-coded currency formatting; use EUR helpers in `src/core/calc.js`.

## HTML
- Structure with semantic elements (`header`, `main`, `section`, `nav`, `footer`).
- One `h1` per page; meaningful heading hierarchy.
- Form controls must have `<label for>`, `aria-*` only when necessary.
- Keep markup lean; avoid presentational attributes. No inline event handlers.
- Validate with HTMLHint; fix **errors** before commit.

## CSS
- Single source of truth: `src/styles/main.css` (+ modules when needed).
- Use CSS custom properties (tokens) for colors/spacing/typography.
- No CSS-in-JS. No inline styles except for dynamic sizing that cannot be expressed via classes.
- BEM-ish naming: `.block__element--modifier` (lowercase, hyphenated).
- Responsive by default: mobile-first, `min()`/`clamp()` for type/spacing.
- Avoid `!important`; prefer specificity control.
- Lint with Stylelint (standard config) + Prettier formatting.

## JavaScript (Vite + ES modules, no frameworks)
- Use ES modules; no globals; exports live with the module.
- Side-effect free modules; put startup wiring in `app.js`.
- Keep logic in `src/core/calc.js` (deterministic, pure functions where possible).
- DOM access goes through small utilities in `src/ui/`.
- Errors: fail fast; never swallow exceptions silently.
- Types via JSDoc for public APIs; keep function signatures small.
- No new deps without approval. If added, explain why and impact.
- Lint with ESLint (recommended + import + compat). Format with Prettier.
- Tests for behavior changes in `tests/` (Vitest or web-test-runner).

## Python (tooling/scripts only)
- Black for formatting; Ruff for linting (E/F/I/B rules). Target Python 3.11+.
- No runtime Python in the web app. Python is for tooling/data prep only.
- Use `__main__` guards; pure functions; type hints encouraged.
- Virtual env via `uv`/`venv`; lock dependencies when used.

## Commit quality
- Keep diffs small; include tests when behavior changes.
- No dead code, `console.log`, or commented blocks in final patches.
- All files must be formatted and linted before commit.
