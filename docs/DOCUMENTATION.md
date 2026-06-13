# Documentatiebeleid

## Doel

Documentatie is onderdeel van iedere wijziging. De Documentation Agent controleert
na een stabiele implementatie of informatie voor agents, mensen, beide of geen
van beide doelgroepen moet veranderen.

## Twee informatielagen

### Agentgerichte documentatie

Helpt een agent een taak correct en met minimale zoekkosten uit te voeren:

- instructievolgorde en guardrails;
- codebasekaart, modulegrenzen en belangrijke entrypoints;
- betekenis en eigenaar van documenten en workflowartefacten;
- agentrollen, handoffs, quality gates en escalaties;
- architectuur- en besliscontext die uitvoering beïnvloedt;
- commando's en controles die in deze repository bestaan.

Startpunt: `docs/agents/README.md`.

### Mensgerichte documentatie

Helpt Bob het product en de levering te begrijpen zonder de broncode te lezen:

- het idee en de doelgroep van de app;
- functionele modules en zichtbaar gedrag;
- waar te klikken om een taak uit te voeren;
- bekende beperkingen en status;
- human-friendly C4-visuals;
- hoe agents samenwerken en waar menselijke goedkeuring nodig is.

Startpunt: `docs/HUMAN_GUIDE.md`.

## Impactcheck

Beantwoord na iedere wijziging:

1. Verandert een map, module, entrypoint, configuratie, instructie of commando?
   Dan is er **agentimpact**.
2. Verandert zichtbaar gedrag, een scherm, knop, gebruikersflow, beperking of
   productconcept? Dan is er **humanimpact**.
3. Verandert een agentrol, workflowstate, handoff, artefact of approvalmoment?
   Dan is er vrijwel altijd impact op **beide** lagen.
4. Is geen antwoord van toepassing? Leg `geen documentatie-impact` vast met de
   gecontroleerde onderwerpen.

Mogelijke uitkomsten: `agent`, `human`, `beide`, `geen`.

## Update Matrix

| Wijziging | Agentdocs | Humandocs |
| --- | --- | --- |
| Nieuwe of verplaatste module | Codebasekaart en paden | Module-uitleg als gedrag zichtbaar is |
| Nieuw scherm of nieuwe knop | Relevante featuremodule | Klikroute en resultaat |
| Gewijzigd functioneel gedrag | Technische flow indien nodig | Gebruikersflow en beperking |
| Agent- of workflowwijziging | Rollen, handoff en quality gates | Samenwerkingsflow en approvalmoment |
| Build-, test- of deploywijziging | Commando's en pipeline | Alleen wanneer gebruik of beschikbaarheid wijzigt |
| Interne refactor zonder contractwijziging | Alleen bij gewijzigde navigatie | Meestal geen |

## Definition Of Done

Een wijziging is documentatie-compleet wanneer:

- de impactuitkomst en motivatie zijn vastgelegd;
- relevante teksten, diagrammen, links en paden actueel zijn;
- nieuwe claims tegen code, tests of goedgekeurde workflowdocs zijn gecontroleerd;
- agent- en humaninformatie niet onnodig door elkaar lopen;
- open conflicten of gaten zichtbaar zijn geescaleerd.

Een PR-samenvatting, codecommentaar of Dev Summary is auditinformatie en vervangt
geen blijvende projectdocumentatie.
