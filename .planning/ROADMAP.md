# Roadmap

## Proposed Roadmap

**5 phases** | **7 requirements mapped** | All covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Backend Infrastructure & Proxy | Setup Supabase API proxies and audit trails | UIUX-02, COMP-01 | 2 |
| 2 | Scientist Molecule Builder | Integrate external 2D/3D molecule builder for scientists | FORM-02 | 2 |
| 3 | AI Formulation Scoring | Connect scoring engine & allow testing drawn molecules | FORM-01, FORM-03 | 2 |
| 4 | Supply Chain Live APIs | Ingest external APIs for shortage prediction | SUPP-01 | 2 |
| 5 | User Guide Integration | Add comprehensive interactive guide to left sidebar | UIUX-01 | 2 |

### Phase Details

**Phase 1: Backend Infrastructure & Proxy**
Goal: Setup Supabase API proxies and audit trails
Requirements: UIUX-02, COMP-01
Success criteria:
1. ChEMBL/PubChem data is securely fetched via Supabase proxy rather than client-side.
2. All data manipulations are logged in a 21 CFR Part 11 compliant table.

**Phase 2: Scientist Molecule Builder**
Goal: Integrate external 2D/3D molecule builder for scientists
Requirements: FORM-02
Success criteria:
1. User can open a dedicated view to draw molecules from scratch.
2. The builder supports seamless toggling between 2D sketch and 3D visual modes.

**Phase 3: AI Formulation Scoring**
Goal: Connect scoring engine & allow testing drawn molecules
Requirements: FORM-01, FORM-03
Success criteria:
1. External AI/ML service is successfully called to score formulations.
2. User can pass a molecule drawn in Phase 2 directly into the scoring engine and receive a viability score.

**Phase 4: Supply Chain Live APIs**
Goal: Ingest external APIs for shortage prediction
Requirements: SUPP-01
Success criteria:
1. Supply chain view reflects live data from external APIs instead of static mock data.
2. Shortage prediction algorithms correctly flag risks based on the ingested live data.

**Phase 5: User Guide Integration**
Goal: Add comprehensive interactive guide to left sidebar
Requirements: UIUX-01
Success criteria:
1. Left sidebar contains a new "Guide" section.
2. The guide explains the Formulation, Molecule Builder, and Supply Chain features clearly.
