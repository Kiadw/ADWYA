# Roadmap — Milestone v2.0: Live Molecular Intelligence

## Proposed Roadmap

**4 phases** | **11 requirements mapped** | All covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 6 | Deep Ketcher API Integration | Establish bidirectional communication with Ketcher V3 | KETCHER-01, KETCHER-02 | 3 |
| 7 | Live AI Analysis & Visual Annotation | Real-time AI scoring with visual annotation on Ketcher canvas | AI-01, AI-02, AI-03 | 4 |
| 8 | Supplier Intelligence & Map | Real supplier data with interactive geographical map | SUPPLY-01, SUPPLY-02, SUPPLY-03, SUPPLY-04 | 4 |
| 9 | Data Integrity & Production Hardening | Replace all mocks with real APIs, add caching | DATA-01, DATA-02 | 3 |

### Phase Details

**Phase 6: Deep Ketcher API Integration**
Goal: Establish full bidirectional communication with Ketcher V3 Standalone
Requirements: KETCHER-01, KETCHER-02
Success criteria:
1. The app reads the current molecule from Ketcher in real-time via `getSmiles()` and `getMolfile()` on every structural change
2. The app can programmatically set molecules, add atom highlights, and inject annotations into Ketcher via its API
3. A change listener fires a debounced callback whenever the scientist modifies the molecule structure

**Phase 7: Live AI Analysis & Visual Annotation**
Goal: Real-time AI viability scoring with visual annotation directly on the Ketcher canvas
Requirements: AI-01, AI-02, AI-03
Success criteria:
1. AI scoring runs automatically (debounced ~1s) whenever the molecule structure changes — no manual button click required
2. A live results sidebar shows viability score, ADMET predictions, and incompatibility warnings that update in real-time
3. Problematic functional groups/bonds are highlighted with color-coded markers directly on the Ketcher canvas
4. Each highlighted issue has a tooltip or label explaining what the AI detected (e.g., "Reactive aldehyde — stability risk")

**Phase 8: Supplier Intelligence & Map**
Goal: Fetch real supplier data and display on an interactive geographical map
Requirements: SUPPLY-01, SUPPLY-02, SUPPLY-03, SUPPLY-04
Success criteria:
1. For a given molecule, the system fetches real supplier data (company, country, price, availability) from PubChem/ChEMBL APIs
2. Supplier locations are plotted on an interactive Leaflet/MapLibre map with color-coded availability markers
3. A pricing comparison table shows supplier details, estimated costs, lead times, and stock status
4. All supplier API calls go through a Supabase Edge Function with audit logging

**Phase 9: Data Integrity & Production Hardening**
Goal: Eliminate all mock data, add response caching, and harden for production use
Requirements: DATA-01, DATA-02
Success criteria:
1. Zero hardcoded/mock data remains in the supply chain proxy, AI scoring, or molecule data flows
2. Supabase caches API responses with configurable TTL to respect rate limits while maintaining data freshness
3. Error handling gracefully degrades when external APIs are unavailable (shows cached data or informative messages)
