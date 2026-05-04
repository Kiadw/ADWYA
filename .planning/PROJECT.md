# ADWYA PharmaTech Hub

## What This Is

ADWYA PharmaTech Hub is an integrative DeepTech platform designed for bio-engineers and supply chain managers in the pharmaceutical industry. It provides computer-assisted formulation (predicting galenic incompatibilities), real-time bio-informatics integration (SMILES, 3D spectra), algorithmic supply chain resilience, a comprehensive pharmaceutical product management system, and real supplier intelligence sourced from verified trade databases.

## Core Value

To transition from merely storing information to actively predicting and securing the lifecycle of drug development and supply under constraints, while providing complete pharmaceutical portfolio visibility and documentation.

## Completed Milestones

### v1.0 -- Platform Foundation
- Interactive React 19 / Next.js 16 UI shell (Sidebar, Header, Layout)
- Basic data models for Ingredients, Formulations, and Activities
- Supabase Edge Function proxies for ChEMBL/PubChem
- Ketcher V3 Standalone molecule builder (locally hosted)
- 21 CFR Part 11 audit trail (immutable audit_logs)
- AI Scoring + Supply Chain Edge Functions

### v2.0 -- Live Molecular Intelligence
- Deep bidirectional Ketcher V3 API integration
- Live AI viability scoring, Lipinski, ADMET
- Real PubChem molecular property analysis
- AI visual annotation on Ketcher canvas
- Real supplier discovery via PubChem Chemical Vendors API
- Interactive Leaflet map + FDA Drug Shortages API

### v3.0 -- Platform Enrichment & ADWYA Data
- UX fixes: always-visible supplier panel, scroll isolation
- ADWYA Medications Database (45 products, 11 categories)
- CSV import/export, dashboard KPI integration
- Wiki ADWYA (6 sections, 20 articles)

### v4.0 -- Data Integrity & Supplier Intelligence (Completed)
- Removed /formulations page (redundant)
- Medications grouped by nom_commercial (no duplicates)
- Multiple dosages shown as badges per product
- Ketcher molecule viewer in expanded medication detail
- Real supplier matching per DCI with source citations
- New Fournisseurs page: 14 real ADWYA suppliers (6 countries)
- Data sourced from PharmaCompass, Volza, CPhI, Kilani Groupe
- Wiki converted to in-tab popup with X close button
- Source citations at bottom of supplier and medication lists

## Requirements

### Validated

- [x] Interactive React 19 / Next.js UI shell -- v1.0
- [x] Supabase Edge Function proxies -- v1.0
- [x] Ketcher V3 Standalone molecule builder -- v1.0
- [x] 21 CFR Part 11 audit trail -- v1.0
- [x] Deep Ketcher API integration -- v2.0
- [x] Live AI viability scoring -- v2.0
- [x] AI visual annotation -- v2.0
- [x] Real supplier discovery (PubChem Vendors) -- v2.0
- [x] Interactive geographical map -- v2.0
- [x] Medications database with CSV -- v3.0
- [x] Wiki documentation -- v3.0
- [x] Remove /formulations -- v4.0
- [x] Group medications by nom_commercial -- v4.0
- [x] Molecule viewer in medication detail -- v4.0
- [x] Real supplier data per medication -- v4.0
- [x] Fournisseurs page with verified real data -- v4.0
- [x] Wiki as in-tab popup -- v4.0

### Rules

- Always use Lucide React icons, never emojis
- Always update the wiki when features change
- No fake/mock data -- all supplier data from verified sources

### Out of Scope

- Building a bespoke AI model -- using PubChem + rule-based
- Direct client-side external API calls -- proxied via Supabase
- Synthesis pathway planning -- future milestone

## Context

- **Tech**: Next.js 16, React 19, Vanilla CSS, Supabase, Ketcher V3, Leaflet
- **APIs**: PubChem PUG REST, FDA Drug Shortages
- **Data**: 45 ADWYA medications, 14 verified suppliers, 45 ingredients
- **Supplier sources**: PharmaCompass, Volza.com, CPhI Online, Kilani Groupe, PCT, African Manager

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Group meds by nom_commercial | Avoid duplicate rows, show dosage variants | Implemented v4.0 |
| Ketcher iframe for molecule preview | Reuse existing editor for consistency | Implemented v4.0 |
| Verified supplier data only | User mandated no fake data | 14 suppliers from 6 verified sources |
| Wiki as popup, not page | Better UX -- stays in context | Implemented v4.0 |
| Remove /formulations | Redundant with medications page | Done v4.0 |

---
*Last updated: 2026-05-04 -- Milestone v4.0 completed*
