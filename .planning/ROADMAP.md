# Roadmap: 特价机票发现平台

## Phases

- [ ] **Phase 7: Source Connectors & Canonical Fares** - The system can ingest and normalize real fares from at least one usable source
- [ ] **Phase 8: Real Search Results** - Users can run real flight searches and filter actual results instead of browsing mock deals
- [ ] **Phase 9: Freshness & Failure Trust** - Users understand how current each fare is and the site degrades safely when sources fail
- [ ] **Phase 10: Real-Data Decision Surfaces** - Users can compare and inspect real fares with enough context to decide whether to buy
- [ ] **Phase 11: Operator Control Plane** - Operators can monitor, refresh, and contain source problems without breaking the public product

## Phase Details

### Phase 7: Source Connectors & Canonical Fares
**Goal**: The system can ingest and normalize real fares from at least one usable source
**Depends on**: Phase 6 (v1 foundation)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. Operator can run at least one real-source collection flow end to end and persist usable fare snapshots
  2. Collected fares are normalized into one canonical schema regardless of whether they came from API access or controlled browser-assisted capture
  3. Invalid, incomplete, or duplicate fare records are blocked from publication by validation rules
  4. Every stored fare can be traced back to a concrete source, run, and raw payload/reference
  5. Existing public pages can consume canonical fare records without depending on mock-only fields
**Plans**: TBD
**UI hint**: yes

### Phase 8: Real Search Results
**Goal**: Users can run real flight searches and filter actual results instead of browsing mock deals
**Depends on**: Phase 7
**Requirements**: LIVE-01, LIVE-02, LIVE-03
**Success Criteria** (what must be TRUE):
  1. User can search by route and date and receive results backed by collected real fares rather than static demo data
  2. User can filter and sort search results using live fields such as price, airline, stop pattern, baggage, time window, and freshness
  3. Result cards show enough itinerary and fare data for quick triage without opening the admin
  4. User can open a result and follow a valid booking deep link to the originating source
  5. Empty, partial, and no-result states clearly distinguish between no inventory and source-coverage limitations
**Plans**: TBD
**UI hint**: yes

### Phase 9: Freshness & Failure Trust
**Goal**: Users understand how current each fare is and the site degrades safely when sources fail
**Depends on**: Phase 8
**Requirements**: TRUST-01, TRUST-02, TRUST-03
**Success Criteria** (what must be TRUE):
  1. User can see collection time, freshness status, and source attribution everywhere a fare is presented
  2. Stale or partially refreshed results are visibly labeled before the user clicks out to buy
  3. When refresh jobs fail, the site can continue serving the last usable snapshot inside a defined grace window
  4. Operators can set and enforce rules for when stale data must be hidden instead of shown
  5. Users understand the trust level of a fare without reading backend jargon
**Plans**: TBD
**UI hint**: yes

### Phase 10: Real-Data Decision Surfaces
**Goal**: Users can compare and inspect real fares with enough context to decide whether to buy
**Depends on**: Phase 9
**Requirements**: RULE-05, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):
  1. Detail pages translate real fare facts into plain-language tradeoffs around baggage, refund/change, stopovers, and caveats
  2. Compare view works on real fares and exposes freshness, source, baggage, and fare-condition differences side by side
  3. Users can tell when two visually similar fares are actually different offers from different sources or conditions
  4. Value framing and warnings are grounded in real collected data rather than editor-only copy
  5. Users can move from search to decision to outbound booking without losing trust context
**Plans**: TBD
**UI hint**: yes

### Phase 11: Operator Control Plane
**Goal**: Operators can monitor, refresh, and contain source problems without breaking the public product
**Depends on**: Phase 10
**Requirements**: OPS-03, OPS-04, OPS-05
**Success Criteria** (what must be TRUE):
  1. Operator can manually refresh a route/date/source and immediately see the outcome
  2. Operator can inspect recent collection runs, validation failures, and anomaly flags from one admin surface
  3. Operator can disable or suppress a degraded source without redeploying the app
  4. Public users continue to get a functioning experience even when one connector is unhealthy
  5. The system provides enough operational visibility to safely add a second source later
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Source Connectors & Canonical Fares | 0/5 | Not started | - |
| 8. Real Search Results | 0/5 | Not started | - |
| 9. Freshness & Failure Trust | 0/5 | Not started | - |
| 10. Real-Data Decision Surfaces | 0/5 | Not started | - |
| 11. Operator Control Plane | 0/5 | Not started | - |
