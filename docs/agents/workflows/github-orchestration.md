# GitHub Orchestration Workflow V2

## Doel

GitHub is de overdrachtsbus en audit trail voor Fast Track en Full Delivery.
De Orchestrator berekent route, state, exacte SHA, volgende agents en guards.

## Centrale Status

Per issue of PR bestaat maximaal één comment met marker:

```md
<!-- agent-workflow-state -->
```

De Orchestrator actualiseert deze comment en de beheerde `route:*`, `state:*`,
`agent:*` en `evidence:*` labels idempotent.

## Routes

- `route:fast`: regressies, kleine bugfixes, documentatiecorrecties en beperkt
  onderhoud zonder risicosignalen.
- `route:full`: features, onduidelijke productintentie, security/privacy,
  dependencies, data, architectuur, migraties en brede refactors.

De route volgt `$workflow-routing`. Een expliciet routelabel heeft voorrang.

## States

Fast Track:

- `state:fast-triage`
- `state:fast-development`
- `state:fast-verification`
- `state:fast-documentation`
- `state:fast-approval`

Full Delivery:

- `state:full-refinement`
- `state:full-development`
- `state:full-verification`
- `state:full-documentation`
- `state:full-acceptance`
- `state:full-approval`

Gedeeld:

- `state:ready-for-merge`
- `state:blocked`
- `state:done`

Evidence:

- `evidence:test-passed`
- `evidence:review-passed`
- `evidence:changes-required`
- `evidence:documentation-none`
- `evidence:documentation-complete`
- `evidence:product-accepted`

Een PR-update wist bestaand evidencebewijs omdat het niet langer bij de nieuwe
head-SHA hoort.

- succesvolle CI-completion zet `evidence:test-passed`;
- een blocking review zet `evidence:changes-required`;
- een non-blocking Reviewer-uitkomst zet `evidence:review-passed`;
- Documentation zet `evidence:documentation-none` of
  `evidence:documentation-complete`;
- Product Owner zet na Full Delivery-acceptatie
  `evidence:product-accepted`.

## Events

De Action reageert op issues, pull requests, comments, CI-completion,
handmatige runs en pushes naar niet-hoofdbranches.

Push-events controleren of een branch al aan een gemergede of gesloten PR was
gekoppeld. Zo'n branch wordt `state:blocked`; delivery moet opnieuw starten op
een verse branch vanaf actuele `main`.

## Agentuitvoering

- iedere rol gebruikt een afzonderlijke agentthread;
- Orchestrator geeft `$compact-handoff`, deadline en toolcalllimiet;
- Tester en Reviewer starten parallel op dezelfde PR-SHA;
- schrijvende parallelle agents gebruiken aparte worktrees;
- timeout krijgt één verkorte afrondprompt en maximaal één smallere herstart.

De GitHub Action routeert en publiceert status, maar start niet zelfstandig
betaalde modelcalls. Agentstarts gebeuren vanuit een expliciet geautoriseerde
Codex-parentthread of toekomstige gecontroleerde runner.

## GitHubrechten

De orchestrationjob gebruikt:

- `contents: read`;
- `actions: read`;
- `checks: read`;
- `issues: write`;
- `pull-requests: write`.

Reviewer- en Documentation-publicatie gebruiken aparte skills en alleen de
kleinst benodigde write-scope. Geen enkele agent mag zelfstandig mergen.

## Approval

`APPROVE FEATURE` wordt alleen geaccepteerd als exacte commenttekst van een
GitHub-gebruiker met author association `OWNER`, `MEMBER` of `COLLABORATOR`,
en alleen vanuit een approvalstate. Dit zet de workflow op
`state:ready-for-merge`.
Daadwerkelijk mergen vereist daarna nog een expliciete merge-opdracht.

## Checks

- `node scripts/agent-orchestrator-test.mjs`
- `node scripts/validate-agent-config.mjs`
- `node scripts/agent-orchestrator.mjs` voor lokale dry-run
