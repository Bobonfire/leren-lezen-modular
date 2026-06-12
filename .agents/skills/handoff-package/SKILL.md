---
name: handoff-package
description: Maak een complete overdracht wanneer werk naar een andere agent, eigenaar of workflowstate gaat, inclusief opdracht, productcontext, criteria, constraints, bewijs en Dev Summary. Gebruik deze skill ook bij herstart na blocker, reviewfeedback of acceptatiefeedback.
---

# Handoff Package

Gebruik voor uitvoerende subagents standaard `$compact-handoff`. Gebruik dit
uitgebreide pakket alleen bij Full Delivery, scopewijziging, blockerherstart of
overdracht aan een menselijke eigenaar.

Gebruik deze structuur:

## Handoff Target

Benoem ontvangende agent en gewenste volgende workflowstate.

## Assignment

Beschrijf de concrete begrensde opdracht.

## Product Context

Noem gebruiker, reden en gewenste uitkomst.

## Work Item

Voeg het geldende epic-, feature-, story- of bugfixitem toe.

## Acceptance Criteria

## Constraints

Noem scope, architectuur, UX, security, accessibility, content en proces.

## Required Evidence

Beschrijf output, tests, verificatie en documentatie-impact die nodig zijn.

## Workflow State

Noem huidige owner, status, blocker en verwachte volgende status.

## Dev Summary

Gebruik `$dev-summary`.

Verberg geen productbeslissingen in de overdracht. De ontvangende agent moet
zonder aanvullende interpretatie kunnen starten.
