# Leren Lezen Security Standards

## Secrets en data

- Commit geen secrets, tokens, credentials of echte persoonsgegevens.
- Gebruik alleen fictieve placeholders in voorbeelden.
- Behandel `localStorage`, URL-data en andere browserinput als onbetrouwbaar.

## Browserveiligheid

- Gebruik `textContent` voor dynamische tekst.
- Gebruik geen `innerHTML`, `eval` of `Function` met onbetrouwbare invoer.
- Valideer en normaliseer waarden voordat ze state of DOM bereiken.
- Gebruik geen externe scripts, fonts of services zonder expliciete goedkeuring.
- Laat fouten in optionele browser-API's geen blokkade of dataverlies veroorzaken.

## Dependencies en supply chain

- Geef voorkeur aan de bestaande dependencyvrije aanpak.
- Voeg geen package, CDN of remote snippet toe zonder expliciete goedkeuring.
- Leg bij een goedgekeurde dependency versie, onderhoudsstatus, licentie,
  transitive impact en noodzaak vast.

## Git en automation

- Push of merge niet zonder expliciete toestemming.
- Geef agents minimaal benodigde rechten.
- Laat read-only agents geen broncode wijzigen.
- Laat orchestration standaard in dry-run werken totdat budget en muterende
  rechten expliciet zijn goedgekeurd.

## Incidenten

- Meld mogelijke secret leaks of securitydefecten direct als blocker.
- Plaats gevoelige details niet in publieke issues of logs.
- Verzwak geen securitycheck om een workflow groen te maken.
