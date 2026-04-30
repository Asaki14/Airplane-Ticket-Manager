# Roadmap: 特价机票发现平台

## Phases

- [ ] **Phase 6: Source Connectors & Canonical Fares** - The system can ingest and normalize real fares from at least one usable source
- [ ] **Phase 7: Real Search Results** - Users can run real flight searches and filter actual results instead of browsing mock deals
- [ ] **Phase 8: Freshness & Failure Trust** - Users understand how current each fare is and the site degrades safely when sources fail
- [ ] **Phase 9: Real-Data Decision Surfaces** - Users can compare and inspect real fares with enough context to decide whether to buy
- [ ] **Phase 10: Operator Control Plane** - Operators can monitor, refresh, and contain source problems without breaking the public product

## Phase Details

### Phase 6: Source Connectors & Canonical Fares
**Goal**: The system can ingest and normalize real fares from at least one usable source
**Depends on**: Phase 5 (v1 foundation)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. Operator can configure and run at least one real-source collection flow end to end and persist usable fare snapshots
  2. Collected fares are normalized into one canonical schema regardless of whether they came from API access or controlled browser-assisted capture
  3. Invalid, incomplete, or duplicate fare records are blocked from publication by validation rules
  4. Operator can trace any stored fare back to its source, collection run, and raw payload/reference
**Plans**: TBD
**UI hint**: yes

### Phase 7: Real Search Results
**Goal**: Users can run real flight searches and filter actual results instead of browsing mock deals
**Depends on**: Phase 6
**Requirements**: LIVE-01, LIVE-02, LIVE-03
**Success Criteria** (what must be TRUE):
  1. User can search by route, date, and trip type and receive results backed by collected real fares rather than static demo data
  2. User can filter and sort search results using fields such as price, airline, stop pattern, baggage inclusion, time window, and freshness
  3. Result cards show enough itinerary and fare data for quick triage without opening the admin
  4. User can open a result and follow a valid booking deep link to the originating source
  5. Empty, partial, and no-result states clearly distinguish between no inventory and source-coverage limitations
**Plans**: TBD
**UI hint**: yes

### Phase 8: Freshness & Failure Trust
**Goal**: Users understand how current each fare is and the site degrades safely when sources fail
**Depends on**: Phase 7
**Requirements**: TRUST-01, TRUST-02, TRUST-03
**Success Criteria** (what must be TRUE):
  1. User can see collection time, freshness status, and source attribution everywhere a fare is presented
  2. User sees explicit stale, partial, or failed-source warnings before clicking out to buy
  3. When refresh jobs fail, the site can continue serving the last usable snapshot inside a defined grace window
  4. User can tell whether a fare is current or cached without reading backend jargon
**Plans**: TBD
**UI hint**: yes

### Phase 9: Real-Data Decision Surfaces
**Goal**: Users can compare and inspect real fares with enough context to decide whether to buy
**Depends on**: Phase 8
**Requirements**: RULE-05, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):
  1. Detail pages translate real fare facts into plain-language tradeoffs around baggage, refund/change, stopovers, and caveats
  2. Compare view works on real fares and exposes freshness, source, baggage, stop pattern, and fare-condition differences side by side
  3. Users can tell when two visually similar fares are actually different offers from different sources or conditions
  4. Users can move from search to decision to outbound booking without losing trust context
**Plans**: TBD
**UI hint**: yes

### Phase 10: Operator Control Plane
**Goal**: Operators can monitor, refresh, and contain source problems without breaking the public product
**Depends on**: Phase 9
**Requirements**: OPS-03, OPS-04, OPS-05
**Success Criteria** (what must be TRUE):
  1. Operator can manually refresh a route/date/source and immediately see whether the run succeeded, partially succeeded, or failed
  2. Operator can inspect recent collection runs, validation failures, and anomaly flags from one admin surface
  3. Operator can disable or suppress a degraded source without redeploying the app
  4. Public users continue to get a functioning experience even when one connector is unhealthy
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Source Connectors & Canonical Fares | 0/TBD | Not started | - |
| 7. Real Search Results | 0/TBD | Not started | - |
| 8. Freshness & Failure Trust | 0/TBD | Not started | - |
| 9. Real-Data Decision Surfaces | 0/TBD | Not started | - |
| 10. Operator Control Plane | 0/TBD | Not started | - |
