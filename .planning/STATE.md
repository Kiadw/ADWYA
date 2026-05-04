---
status: idle
milestone: v3.0 (completed)
name: Platform Enrichment & ADWYA Data
progress:
  total: 12
  completed: 12
---

# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** To transition from merely storing information to actively predicting and securing the lifecycle of drug development and supply under constraints.
**Current focus:** Idle -- awaiting next milestone definition

## Milestone History

| Milestone | Name | Phases | Status |
|-----------|------|--------|--------|
| v1.0 | Platform Foundation | 1-5 | Completed |
| v2.0 | Live Molecular Intelligence | 6-9 | Completed |
| v3.0 | Platform Enrichment & ADWYA Data | 10-12 | Completed |

## Completed Phases (v3.0)

### Phase 10: UX Fixes
- Supplier panel always visible with placeholder when no molecule is drawn
- Scroll isolation (overscrollBehavior: contain) on map, table, sidebar
- Page overflow fixed with overflow: hidden on root container

### Phase 11: Medications Database
- 45 ADWYA products across 11 therapeutic categories
- Search by name, DCI, or therapeutic class
- Category filter badges with counts
- Sortable columns, expandable detail rows
- CSV Export/Import functionality
- Dashboard KPIs updated to show real ADWYA medication count
- Sidebar "Medicaments" navigation entry added

### Phase 12: Wiki
- 6 sections, 20 articles (Premiers pas, Editeur, Fournisseurs, Medicaments, Conformite, API)
- Searchable sidebar with collapsible tree navigation
- Article rendering with styled headings, code blocks, tables, lists
- Category cards on landing page
- Replaced "Guide Utilisateur" with "Wiki ADWYA" in sidebar

## Architecture Decisions

- Proxy all external APIs via Supabase Edge Functions
- Ketcher V3 Standalone hosted locally in public/ketcher/
- Bidirectional Ketcher API via ketcher-bridge.ts
- PubChem for molecular properties + vendor data
- FDA Drug Shortages API for shortage alerts
- Leaflet for interactive supplier map
- ADWYA medications stored as TypeScript data with CSV import/export
- Wiki built natively in Next.js for theme consistency
- Always use Lucide React icons, never emojis

## Current Todos

*(None -- milestone complete)*

## Known Issues

- PubChem IUPACName not available via /property/ endpoint -- use /synonyms/ instead (fixed)
- Some novel molecules may not have PubChem CIDs -- graceful degradation in place
