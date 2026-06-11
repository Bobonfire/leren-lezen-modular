# Onderzoek: Refactor Agent

## Doel

Dit document onderbouwt de inrichting van de Refactor Agent, de samenwerking
met de Tester Agent en de manier waarop terugkerende kwaliteitsproblemen tot
betere Developer Agent-instructies leiden.

## Onderzochte agentpatronen

### Gespecialiseerde rol en beperkte context

Officiële Claude Code-documentatie adviseert gespecialiseerde subagents met een
duidelijke beschrijving, eigen context en beperkte toolrechten. Voorbeelden
scheiden een read-only reviewer van een debugger die wel wijzigingen mag maken.

Toepassing:

* De Refactor Agent krijgt een eigen rol en context.
* Schrijfrechten zijn beperkt tot goedgekeurde refactors.
* Tester en Reviewer blijven onafhankelijke rollen.

Bron:
`https://code.claude.com/docs/en/sub-agents`

### Duidelijke handoffs, guardrails en exitcriteria

OpenAI beschrijft zowel manager- als handoffpatronen voor multi-agentsystemen en
benadrukt duidelijke instructies, tools, guardrails en exitvoorwaarden.

Toepassing:

* De Orchestrator beheert states en start rollen.
* Refactor, test en review hebben eigen beslisrechten.
* Iedere overgang vereist gestructureerd bewijs.

Bron:
`https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf`

### Kleine stappen en gedragsbehoud

Martin Fowlers refactoringdefinitie draait om het verbeteren van intern ontwerp
zonder waarneembaar gedrag te wijzigen. Kleine stappen beperken de oorzaakruimte
wanneer een check faalt.

Toepassing:

* Eerst een baseline, daarna kleine transformaties.
* Dezelfde relevante checks worden voor en na de wijziging uitgevoerd.
* Features en bugfixes worden niet in een refactor verborgen.

Bron:
`https://martinfowler.com/books/refactoring.html`

## Taaloverstijgende codekwaliteit

De officiële taalrichtlijnen verschillen in syntax, maar delen dezelfde
onderliggende principes:

* Lokale projectconsistentie gaat voor generieke stijl.
* Gebruik de formatter en statische analyse van het ecosysteem.
* Houd publieke interfaces klein en expliciet.
* Organiseer code rond cohesieve verantwoordelijkheden.
* Maak dependencies, foutafhandeling en mutatie zichtbaar.
* Breek compatibiliteit niet alleen voor stijluniformiteit.

Onderzochte bronnen:

* Python PEP 8: `https://peps.python.org/pep-0008/`
* Effective Go: `https://go.dev/doc/effective_go`
* Rust API Guidelines: `https://rust-lang.github.io/api-guidelines/`
* Rust Cargo Workspaces:
  `https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html`
* Microsoft .NET coding conventions:
  `https://learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions`
* Google Java Style Guide:
  `https://google.github.io/styleguide/javaguide.html`
* Google JavaScript Style Guide:
  `https://google.github.io/styleguide/jsguide.html`
* typescript-eslint: `https://typescript-eslint.io/rules/`

## Codebase-organisatie

De agent gebruikt geen universele mappenstructuur. Hij detecteert eerst taal,
framework en bestaande repositorypatronen. Daarna beoordeelt hij:

* Cohesie: code met dezelfde reden om te veranderen staat bij elkaar.
* Coupling: modules kennen zo weinig mogelijk interne details van elkaar.
* Dependency direction: domeinlogica hangt niet onnodig af van UI of I/O.
* Entrypoints: opstart- en wiringcode blijft dun.
* Tests: contracten worden getest op de grens waar ze eigendom hebben.
* Publieke API: exports zijn bewust en implementatiedetails blijven intern.
* Configuratie: waarden en regels hebben een duidelijke bron van waarheid.

## Samenwerking met Tester Agent

De samenwerking is sequentieel en onafhankelijk:

1. Tester Agent legt baseline, bestaande afwijkingen en contracten vast.
2. Refactor Agent voert kleine gedragsbehoudende wijzigingen uit.
3. Tester Agent herhaalt de baseline en onderzoekt gewijzigde grenzen.
4. Reviewer Agent beoordeelt kwaliteit en architectuur.

De Tester Agent past geen source code aan en accepteert geen verklaring zonder
testbewijs. Characterization tests worden alleen toegevoegd om bestaand gedrag
vast te leggen, niet om een nieuwe verwachting te introduceren.

## Bijwerken van Developer Agent

Een instructiewijziging is gerechtvaardigd wanneer:

* Het probleem terugkeert in meerdere wijzigingen of modules.
* Het probleem aantoonbare onderhouds-, defect- of reviewkosten veroorzaakt.
* De bestaande instructies het probleem niet al afdekken.
* De nieuwe regel kort, specifiek en toetsbaar is.
* Automatische handhaving is overwogen.

Een enkel stijlverschil of persoonlijke voorkeur is geen geldige reden. Waar
mogelijk wordt de regel opgenomen in gedeelde kwaliteitsdocumentatie of tooling
in plaats van alleen in de Developer Agent-definitie.

## Gekozen architectuur

De Refactor Agent is een aparte uitvoerende rol omdat hij:

* Andere entrycriteria heeft dan featureontwikkeling.
* Strikter aan gedragsbehoud is gebonden.
* Een onafhankelijke pre/post-testrelatie nodig heeft.
* Code mag wijzigen, terwijl de Reviewer Agent read-only blijft.
* Structureel lessen terugkoppelt naar de Developer Agent.

De bestaande `agent-definition-template.md` blijft leidend voor naam, scope,
guardrails, quality gates, handoff, logging en failure mode.
