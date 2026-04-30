# Requirements: 特价机票发现平台

**Defined:** 2026-04-11
**Core Value:** 用户能在几分钟内判断一张“看起来便宜”的机票到底值不值得买，并能立即采取下一步。

## v1 Requirements

### Discovery

- [x] **DISC-01**: User can browse a public deal feed showing departure city, destination, travel window, airline, and headline price
- [x] **DISC-02**: User can filter deals by departure city, destination region, travel date window, airline, and price ceiling
- [x] **DISC-03**: User can sort deals by publish time, headline price, and value score
- [x] **DISC-04**: User can search deals using city or destination keywords

### Rule Decode

- [x] **RULE-01**: User can open a deal detail page that shows fare snapshot, source platform, publish time, update time, and expiry time
- [x] **RULE-02**: User can read a plain-language summary of baggage allowance, refund/change rules, stopover or transfer pattern, cabin class, and booking restrictions
- [x] **RULE-03**: User can see an explicit explanation of why the platform marks a fare as high value
- [x] **RULE-04**: User can jump from a deal detail page to the original OTA or airline booking page

### Comparison

- [x] **COMP-01**: User can add up to three deals into a comparison panel
- [x] **COMP-02**: User can compare candidate deals side by side across price, schedule, baggage, refund/change, transfer, and value score
- [x] **COMP-03**: User can save deals to a local favorites list and revisit them later
- [x] **COMP-04**: User can copy or share a deal detail link

### Preferences

- [x] **PREF-01**: User can set a default departure city for faster future browsing
- [x] **PREF-02**: User can browse curated entry sections such as weekend escapes, holiday windows, islands, and nearby international trips
- [x] **PREF-03**: User can complete key browse, filter, detail, and compare flows on both mobile and desktop layouts

### Operations

- [x] **OPS-01**: Operator can create, edit, publish, archive, and tag deal entries with structured fields
- [x] **OPS-02**: Operator can set freshness metadata and expired deals stop appearing in the public discovery feed

## v2 Requirements

### Source Access & Normalization

- [ ] **DATA-01**: Operator can configure at least one real flight source using an official API, authorized partner access, or a controlled browser-assisted collection flow
- [ ] **DATA-02**: System stores normalized fare snapshots including source, airline, flight numbers, departure/arrival airports, times, cabin, baggage facts, price, currency, deep link, and collection timestamps
- [ ] **DATA-03**: System validates collected results for required fields, sane prices, sane date/time order, and duplicate itinerary collisions before publishing them to user-facing surfaces
- [ ] **DATA-04**: System preserves provenance for every displayed fare so operators can inspect exactly which source and collection run produced it

### Real Search & Filtering

- [ ] **LIVE-01**: User can search real tickets by departure city, destination city, departure date, and trip type using source-backed results rather than mock deals
- [ ] **LIVE-02**: User can filter and sort real results by price, departure time window, airline, stop pattern, baggage inclusion, and freshness
- [ ] **LIVE-03**: User can open a result and jump to the originating OTA or airline booking page using a valid deep link tied to the observed fare

### Freshness, Trust & Degradation

- [ ] **TRUST-01**: User can see when each fare was collected, when it should be considered stale, and which source supplied it
- [ ] **TRUST-02**: User sees explicit stale, partial, or failed-source warnings when the platform is showing older cached data or incomplete source coverage
- [ ] **TRUST-03**: When a source refresh fails, the platform keeps the last known usable snapshot available if it is still within an operator-defined grace window

### Decision Support on Real Data

- [ ] **RULE-05**: User can view a detail page that translates real source facts into plain-language tradeoffs for baggage, refund/change, stopovers, and booking caveats
- [ ] **COMP-05**: User can compare up to three real fares side by side with freshness, source, baggage, stop pattern, and total-cost context
- [ ] **COMP-06**: User can distinguish duplicate-looking fares from materially different offers because the compare and list views show source and fare-condition differences

### Operator Controls

- [ ] **OPS-03**: Operator can manually trigger a refresh for a route/date/source and see whether the run succeeded, partially succeeded, or failed
- [ ] **OPS-04**: Operator can review recent connector runs, validation failures, and anomaly flags before deciding whether to publish or suppress results
- [ ] **OPS-05**: Operator can disable a degraded source connector without taking down the rest of the public discovery experience

## Out of Scope

| Feature | Reason |
|---------|--------|
| In-app booking and payment | Not core to MVP validation and adds heavy transactional complexity |
| Full real-time metasearch across all airlines worldwide | Too expensive and integration-heavy for first release |
| Multi-city itinerary builder | High complexity, weak alignment with initial value proposition |
| User-generated comments/community | Useful later, but not required to validate discovery and rule-decoding value |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| OPS-01 | Phase 1 | Complete |
| OPS-02 | Phase 1 | Complete |
| PREF-03 | Phase 1 | Complete |
| DISC-01 | Phase 2 | Complete |
| DISC-02 | Phase 2 | Complete |
| DISC-03 | Phase 2 | Complete |
| DISC-04 | Phase 2 | Complete |
| RULE-01 | Phase 3 | Complete |
| RULE-02 | Phase 3 | Complete |
| RULE-03 | Phase 3 | Complete |
| RULE-04 | Phase 3 | Complete |
| PREF-01 | Phase 4 | Complete |
| PREF-02 | Phase 4 | Complete |
| COMP-01 | Phase 5 | Complete |
| COMP-02 | Phase 5 | Complete |
| COMP-03 | Phase 5 | Complete |
| COMP-04 | Phase 5 | Complete |
| DATA-01 | Phase 7 | Pending |
| DATA-02 | Phase 7 | Pending |
| DATA-03 | Phase 7 | Pending |
| DATA-04 | Phase 7 | Pending |
| LIVE-01 | Phase 8 | Pending |
| LIVE-02 | Phase 8 | Pending |
| LIVE-03 | Phase 8 | Pending |
| TRUST-01 | Phase 9 | Pending |
| TRUST-02 | Phase 9 | Pending |
| TRUST-03 | Phase 9 | Pending |
| RULE-05 | Phase 10 | Pending |
| COMP-05 | Phase 10 | Pending |
| COMP-06 | Phase 10 | Pending |
| OPS-03 | Phase 11 | Pending |
| OPS-04 | Phase 11 | Pending |
| OPS-05 | Phase 11 | Pending |

**Coverage:**
- v1 requirements: 17 total
- v2 requirements: 15 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---

*Requirements defined: 2026-04-11*
*Last updated: 2026-04-30 after redefining milestone v2.0 requirements*
