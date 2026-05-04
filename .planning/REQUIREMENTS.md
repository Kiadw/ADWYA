# Requirements — Milestone v2.0: Live Molecular Intelligence

## Formulation & AI Intelligence

- [ ] **KETCHER-01**: Scientist can draw/edit molecules in Ketcher and the system reads the structure in real-time via Ketcher API (`getSmiles()`, `getMolfile()`)
- [ ] **KETCHER-02**: System can programmatically inject highlights, annotations, and atom-level markers onto the Ketcher canvas via `setMolecule()` and highlight APIs
- [ ] **AI-01**: AI viability analysis runs automatically (debounced) whenever the molecule structure changes in Ketcher
- [ ] **AI-02**: AI scoring results (viability, ADMET predictions, incompatibilities) are displayed in a live sidebar panel that updates without page reload
- [ ] **AI-03**: AI visually annotates problematic functional groups/bonds directly on the Ketcher canvas with color-coded highlights and tooltips explaining each issue

## Supplier Intelligence

- [ ] **SUPPLY-01**: For each molecule or key ingredient, fetch real supplier data (company, location, price, availability status) from live public APIs (PubChem, ChEMBL, FDA/EMA)
- [ ] **SUPPLY-02**: Display supplier locations on an interactive geographical map (Leaflet/MapLibre) with color-coded availability markers
- [ ] **SUPPLY-03**: Show pricing comparison table with supplier details, lead times, and stock status
- [ ] **SUPPLY-04**: All supplier API calls are proxied through Supabase Edge Functions for audit compliance

## Data Integrity

- [ ] **DATA-01**: All molecule, supplier, and pricing data comes from real public APIs — zero mock/hardcoded data in production
- [ ] **DATA-02**: API responses are cached in Supabase with TTL to avoid rate limiting while keeping data fresh

## Traceability

| REQ-ID | Phase |
|--------|-------|
| KETCHER-01 | Phase 6 |
| KETCHER-02 | Phase 6 |
| AI-01 | Phase 7 |
| AI-02 | Phase 7 |
| AI-03 | Phase 7 |
| SUPPLY-01 | Phase 8 |
| SUPPLY-02 | Phase 8 |
| SUPPLY-03 | Phase 8 |
| SUPPLY-04 | Phase 8 |
| DATA-01 | Phase 9 |
| DATA-02 | Phase 9 |

## Future Requirements (Deferred)

- Molecule synthesis pathway planning
- Batch formulation comparison (side-by-side AI scoring)
- Supplier contract negotiation tools

## Out of Scope

- Building proprietary AI/ML models — external services used
- Direct client-side API calls — all proxied through Supabase
- Real-time multi-user collaboration on the same molecule — future milestone
