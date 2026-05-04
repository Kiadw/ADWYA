# ADWYA PharmaTech Hub

## What This Is

ADWYA PharmaTech Hub is an integrative DeepTech platform designed for bio-engineers and supply chain managers in the pharmaceutical industry. It provides computer-assisted formulation (predicting galenic incompatibilities), real-time bio-informatics integration (SMILES, 3D spectra), and algorithmic supply chain resilience to mitigate drug shortages.

## Core Value

To transition from merely storing information to actively predicting and securing the lifecycle of drug development and supply under constraints.

## Current Milestone: v2.0 Live Molecular Intelligence

**Goal:** Transform the molecule builder into a fully AI-aware, real-time analysis platform with supplier discovery, pricing, availability mapping, and visual AI annotation directly on Ketcher.

**Target features:**
- Live AI viability analysis as molecules are drawn/modified in Ketcher
- Supplier discovery with real pricing, location, and availability data
- Interactive geographical map showing supplier locations and availability
- AI visual annotation directly on the Ketcher canvas (highlighting problematic structures)
- Deep bidirectional Ketcher integration (read state, inject highlights, listen to changes)

## Requirements

### Validated

- ✓ Interactive React 19 / Next.js UI shell (Sidebar, Header, Layout) — v1.0
- ✓ Basic data models for Ingredients, Formulations, and Activities — v1.0
- ✓ Frontend capability for 3D molecular visualization (`3dmol`) — v1.0
- ✓ Supabase Edge Function proxies for ChEMBL/PubChem — v1.0
- ✓ AI Scoring Edge Function — v1.0
- ✓ Supply Chain proxy Edge Function — v1.0
- ✓ Ketcher V3 Standalone molecule builder — v1.0
- ✓ 21 CFR Part 11 audit trail (immutable audit_logs) — v1.0
- ✓ User Guide page — v1.0

### Active

- [ ] KETCHER-01: Deep Ketcher API integration — bidirectional communication with the editor
- [ ] AI-01: Live AI viability scoring triggered on molecule changes
- [ ] AI-02: AI visual annotation — highlight problematic groups directly on Ketcher canvas
- [ ] SUPPLY-01: Real supplier discovery with pricing and availability data
- [ ] SUPPLY-02: Interactive geographical map of supplier locations
- [ ] DATA-01: All supplier/pricing data must come from real, live APIs

### Out of Scope

- Building our own foundational AI model from scratch — We will integrate an external ML service.
- Direct client-side calls to ChEMBL/PubChem — Proxied via Supabase for compliance.
- Molecule synthesis pathway planning — Future milestone.

## Context

- **Technical environment**: Next.js 16 (App Router), React 19, Vanilla CSS, Supabase backend, Ketcher V3 Standalone (local).
- **Prior work**: V1.0 delivered molecule builder, AI scoring, supply chain alerts, and user guide. V2.0 deepens AI integration and adds supplier intelligence.
- **Current state**: Ketcher V3 is hosted locally. Edge Functions exist for ai-scoring, chembl-proxy, and supply-chain-proxy. The next step is deep Ketcher API integration and real-time AI feedback loops.

## Constraints

- **Regulatory**: FDA / GMP (21 CFR Part 11) — Every modification must have an inalterable, cryptographically versioned log.
- **Security**: Supabase Row Level Security (RLS) must strictly partition R&D data from Supply Chain data.
- **Architecture**: External API proxying must go through the backend (Supabase/Edge Functions) rather than client-side to enforce auditability.
- **Design System**: UI must remain sober, white, and professional (Kilani / ADWYA corporate identity).
- **Data Integrity**: All supplier pricing and availability data must come from real public APIs — no mock data.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use external ML service | Building a bespoke model for formulation prediction is too slow/expensive for V1 | ✓ Implemented via ai-scoring Edge Function |
| Proxy external APIs via Supabase | Ensures we can cache responses and maintain strict audit trails | ✓ Implemented (chembl-proxy, supply-chain-proxy) |
| Host Ketcher Standalone locally | EPAM's demo site blocks iframe embedding; local hosting ensures reliability | ✓ Implemented in public/ketcher/ |
| Use Ketcher API for AI annotation | Ketcher exposes `setMolecule()`, `getSmiles()`, and highlight APIs for direct manipulation | — Pending (v2.0) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-04 — Milestone v2.0 started*
