# ADWYA PharmaTech Hub

## What This Is

ADWYA PharmaTech Hub is an integrative DeepTech platform designed for bio-engineers and supply chain managers in the pharmaceutical industry. It provides computer-assisted formulation (predicting galenic incompatibilities), real-time bio-informatics integration (SMILES, 3D spectra), and algorithmic supply chain resilience to mitigate drug shortages.

## Core Value

To transition from merely storing information to actively predicting and securing the lifecycle of drug development and supply under constraints.

## Requirements

### Validated

- ✓ Interactive React 19 / Next.js UI shell (Sidebar, Header, Layout) — existing
- ✓ Basic data models for Ingredients, Formulations, and Activities — existing
- ✓ Frontend capability for 3D molecular visualization (`3dmol`) — existing

### Active

- [ ] Integrate an external AI/ML service for the in silico formulation scoring engine.
- [ ] Connect and ingest live external API data for supply chain resilience and shortage prediction.
- [ ] Implement a Supabase backend proxy to securely fetch data from ChEMBL/PubChem (SMILES, ADMET).
- [ ] Establish 21 CFR Part 11 compliant audit trails for all data manipulations.

### Out of Scope

- [ ] Building our own foundational AI model from scratch — We will integrate an external ML service for the scoring engine to save time and resources.
- [ ] Direct client-side calls to ChEMBL/PubChem — We will proxy via Supabase for security, caching, and compliance logging.

## Context

- **Technical environment**: Next.js 16 (App Router), React 19, Vanilla CSS, Supabase backend, deployed on cloud-native infrastructure.
- **Prior work**: V1 was primarily an ingredient catalog. V2 is a strategic pivot to a predictive "DeepTech" tool.
- **Current state**: The UI shell and initial mockup data are in place. The next critical path is replacing local mock data (`src/lib/data.ts`) with live backend connections and external API proxies.

## Constraints

- **Regulatory**: FDA / GMP (21 CFR Part 11) — Every modification must have an inalterable, cryptographically versioned log.
- **Security**: Supabase Row Level Security (RLS) must strictly partition R&D data from Supply Chain data.
- **Architecture**: External API proxying must go through the backend (Supabase/Edge Functions) rather than client-side to enforce auditability.
- **Design System**: UI must remain sober, white, and professional (Kilani / ADWYA corporate identity).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use external ML service | Building a bespoke model for formulation prediction is too slow/expensive for V1 | — Pending |
| Proxy external APIs via Supabase | Ensures we can cache responses and maintain strict audit trails | — Pending |

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
*Last updated: 2026-05-04 after initialization*
