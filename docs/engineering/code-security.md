# Leren Lezen Security Standards

## Secrets en data

- Commit geen secrets, tokens, credentials of echte persoonsgegevens.
- Gebruik alleen fictieve placeholders in voorbeelden.
- Behandel `localStorage`, URL-data en andere browserinput als onbetrouwbaar.

## Browserveiligheid

- Gebruik `textContent` voor dynamische tekst.
- Gebruik geen `innerHTML`, `eval` of `Function` met onbetrouwbare invoer.
- Valideer en normaliseer waarden voordat ze state of DOM bereiken.
- Behandel externe scripts, fonts en services als supply-chainrisico en volg
  voor autorisatie de globale guardrails uit `AGENTS.md`.
- Laat fouten in optionele browser-API's geen blokkade of dataverlies veroorzaken.

## Dependencies en supply chain

- Geef voorkeur aan de bestaande dependencyvrije aanpak.
- Voeg alleen een package, CDN of remote snippet toe nadat de autorisatiegate
  uit `AGENTS.md` is voldaan.
- Leg bij een goedgekeurde dependency versie, onderhoudsstatus, licentie,
  transitive impact en noodzaak vast.

## Automation

- Geef agents minimaal benodigde rechten.
- Laat read-only agents geen broncode wijzigen.
- Plaats tokens en gevoelige uitvoer niet in workflowlogs.

## Incidenten

- Meld mogelijke secret leaks of securitydefecten direct als blocker.
- Plaats gevoelige details niet in publieke issues of logs.
- Verzwak geen securitycheck om een workflow groen te maken.
