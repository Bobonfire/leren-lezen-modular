# CODE_SECURITY.md
FIRE Calculator — Secure Coding & Supply Chain
==============================================

Security is part of definition of done. This document defines *musts* for contributors and AI tools.

## Secrets & credentials
- Never commit secrets. Use `YOUR_API_KEY` placeholders in examples.
- `.env` files are local only; `.env.example` documents keys with dummy values.
- Git history hygiene: if a secret leaks, rotate it and purge history with `git filter-repo`.

## Dependencies & supply chain
- Pin versions. Avoid transitive bloat; prefer zero‑dep utilities.
- Review new packages for maintenance, license, and size. Record rationale in PR.
- Run `npm audit --production` monthly; fix high/critical issues quickly.
- Lockfiles must be committed. No `--force` or `--legacy-peer-deps` unless approved.

## Browser security
- **CSP**: default-src 'self'; upgrade as features require. Avoid `unsafe-inline`.
- **XSS**: never `innerHTML` untrusted content; prefer `textContent`.
- **DOM injection**: sanitize if HTML is *unavoidable* (DOMPurify allowed by exception).
- **Clickjacking**: set `frame-ancestors 'none'` via Netlify headers.
- **Mixed content**: HTTPS everywhere; avoid third‑party inline scripts.
- **SRI**: if external script is approved, use Subresource Integrity.

## Data validation
- Validate and normalize all user inputs before processing.
- Enforce numeric parsing with `Number.parseFloat`/`Number.isFinite` for calculator inputs.
- Clamp ranges for rates, ages, and amounts; reject NaN/Infinity.
- Escape text in templates; never trust URL query params.

## Build & deploy
- CI runs lint, format check, tests, and a production build.
- Artifacts are immutable; deploy from CI only, not local developers.
- Set **strict Netlify headers** (CSP, HSTS, Referrer-Policy, Permissions-Policy).

## Git hygiene
- No force pushes to `dev`/`main`.
- Work in feature branches and PRs; require one approval for merge.
- Sign commits if possible; tag releases.

## Incident response
- SECURITY.md: disclose privately via email in repository topic or contact in README.
- Triage within 48h; severity labeled; hotfix branches for critical issues.
