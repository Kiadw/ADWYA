# ADWYA PharmaTech Hub

## What This Is

ADWYA PharmaTech Hub is an integrative DeepTech platform designed for bio-engineers and supply chain managers in the pharmaceutical industry. It provides computer-assisted formulation (predicting galenic incompatibilities), real-time bio-informatics integration (SMILES, 3D spectra), algorithmic supply chain resilience to mitigate drug shortages, and a comprehensive pharmaceutical product management system with a built-in knowledge wiki.

## Core Value

To transition from merely storing information to actively predicting and securing the lifecycle of drug development and supply under constraints, while providing complete pharmaceutical portfolio visibility and documentation.

## Completed Milestones

### v1.0 -- Platform Foundation (Completed)
- Interactive React 19 / Next.js 16 UI shell (Sidebar, Header, Layout)
- Basic data models for Ingredients, Formulations, and Activities
- Supabase Edge Function proxies for ChEMBL/PubChem
- Ketcher V3 Standalone molecule builder (locally hosted)
- 21 CFR Part 11 audit trail (immutable audit_logs)
- AI Scoring + Supply Chain Edge Functions

### v2.0 -- Live Molecular Intelligence (Completed)
- Deep bidirectional Ketcher V3 API integration (getSmiles, setMolecule, highlightAtoms, change listener)
- Live AI viability scoring triggered on molecule changes (debounced 1.5s)
- Real PubChem molecular property analysis (MW, LogP, TPSA, HBD, HBA)
- Lipinski Rule of Five compliance checking
- ADMET predictions (oral bioavailability, BBB penetration)
- Structural alert detection (aldehydes, epoxides, peroxides, etc.)
- AI visual annotation -- problematic atoms highlighted on Ketcher canvas
- Real supplier discovery via PubChem Chemical Vendors API
- Interactive Leaflet map with color-coded vendor markers
- FDA Drug Shortages API integration
- Supply chain risk assessment (Low/Moderate/Elevated)

### v3.0 -- Platform Enrichment & ADWYA Data (Completed)
- UX fixes: supplier panel always visible, scroll isolation, live map updates
- ADWYA Medications Database: 45 products, 11 therapeutic categories
- CSV import/export for medication lists
- Dashboard KPIs updated with real ADWYA product data
- Wiki ADWYA: 6 sections, 20 articles, searchable tree navigation
- Full documentation covering molecules, suppliers, compliance, and API

## Requirements

### Validated

- [x] Interactive React 19 / Next.js UI shell -- v1.0
- [x] Basic data models for Ingredients, Formulations, Activities -- v1.0
- [x] Supabase Edge Function proxies -- v1.0
- [x] Ketcher V3 Standalone molecule builder -- v1.0
- [x] 21 CFR Part 11 audit trail -- v1.0
- [x] KETCHER-01: Deep Ketcher API integration -- v2.0
- [x] AI-01: Live AI viability scoring -- v2.0
- [x] AI-02: AI visual annotation on Ketcher canvas -- v2.0
- [x] SUPPLY-01: Real supplier discovery (PubChem Vendors) -- v2.0
- [x] SUPPLY-02: Interactive geographical map (Leaflet) -- v2.0
- [x] DATA-01: All data from real live APIs -- v2.0
- [x] UX-01/02/03: Map always visible, scroll isolation, live updates -- v3.0
- [x] MED-01/02/03/04/05: Medications database with CSV and dashboard -- v3.0
- [x] WIKI-01/02/03: Rich wiki-style documentation -- v3.0

### Out of Scope

- Building a bespoke foundational AI model -- using PubChem + rule-based analysis
- Direct client-side calls to external APIs -- proxied via Supabase for compliance
- Molecule synthesis pathway planning -- future milestone
- Separate wiki server (Wiki.js, BookStack) -- built natively in Next.js for theme consistency

## Context

- **Technical environment**: Next.js 16 (App Router), React 19, Vanilla CSS, Supabase (PostgreSQL + Edge Functions + RLS), Ketcher V3 Standalone, Leaflet, Chart.js
- **APIs**: PubChem PUG REST (properties, vendors, synonyms), FDA Drug Shortages
- **Data**: 45 ADWYA medications across 11 categories, 45 ingredients, formulations
- **Deployment**: localhost:3001 (dev), Supabase Cloud (backend)

## Constraints

- **Regulatory**: FDA / GMP (21 CFR Part 11) -- audit trail on every action
- **Security**: Supabase RLS partitions R&D from Supply Chain data
- **Architecture**: External API calls proxied through Edge Functions for auditability
- **Design System**: Sober, white, professional (Kilani / ADWYA corporate identity)
- **Data Integrity**: No mock data -- all from real public APIs
- **Icons**: Always use Lucide React icons, never emojis

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use PubChem + rule-based analysis | Building a bespoke ML model too slow for MVP | Implemented via ai-scoring Edge Function |
| Proxy all external APIs via Supabase | Ensures caching and audit trails | Implemented (ai-scoring, supply-chain-proxy) |
| Host Ketcher Standalone locally | EPAM blocks iframe embedding | Implemented in public/ketcher/ |
| Use Ketcher API for AI annotation | editor.selection() for direct manipulation | Implemented via ketcher-bridge.ts |
| Build wiki in Next.js (not external) | Theme consistency, no separate server | Implemented at /wiki with 20 articles |
| ADWYA medications as TypeScript data | Fast iteration, CSV import/export for flexibility | Implemented in src/lib/medications.ts |
| Leaflet for supplier map | Lightweight, no API key required, OSM tiles | Implemented in SupplierMap component |
| PubChem IUPACName via /synonyms/ | /property/ endpoint doesn't support IUPACName | Fixed critical CID lookup bug |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-05-04 -- Milestones v1.0, v2.0, v3.0 completed*
