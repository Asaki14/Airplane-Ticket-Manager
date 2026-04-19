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

### Real Data Collection

- [ ] **DATA-01**: System can collect real ticket data from at least one major OTA source (Ctrip, Qunar, or Fliggy)
- [ ] **DATA-02**: Collected data includes essential flight information: airline, flight numbers, departure/arrival times, dates, and price
- [ ] **DATA-03**: System validates collected data for reasonableness (positive prices, valid dates, etc.)
- [ ] **DATA-04**: System normalizes data from different sources into a common format

### Data Freshness & Reliability

- [ ] **FRESH-01**: Each deal displays clear collection timestamp indicating when data was fetched
- [ ] **FRESH-02**: Each deal displays expiry time when data becomes stale
- [ ] **FRESH-03**: System indicates data source (which OTA/airline provided the information)
- [ ] **FRESH-04**: Operator can manually trigger data collection for specific sources
- [ ] **FRESH-05**: System handles collection failures gracefully, showing last known good data with freshness warnings

### Accurate Comparison & Decision

- [ ] **COMP-05**: Comparison panel uses real-time collected prices for accurate sorting and filtering
- [ ] **COMP-06**: System flags potentially stale data in comparison view with visual indicators
- [ ] **COMP-07**: Value score calculation incorporates real-time data freshness as a factor
- [ ] **COMP-08**: Users can verify data freshness when comparing multiple deals

### Alerts

- **ALRT-01**: User can subscribe to price-drop or new-deal alerts for saved routes
- **ALRT-02**: User can receive notifications by WeChat, email, or browser push

### Automation

- **AUTO-01**: Operator can ingest deal candidates from configured OTA or airline sources with semi-automated extraction
- **AUTO-02**: System can flag suspected stale or duplicated deals for review

### Accounts

- **AUTH-01**: User can create an account and sync favorites across devices
- **AUTH-02**: User can manage saved preferences across multiple departure cities

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
| DATA-01 | Phase 6 | Pending |
| DATA-02 | Phase 6 | Pending |
| DATA-03 | Phase 6 | Pending |
| DATA-04 | Phase 6 | Pending |
| FRESH-01 | Phase 6 | Pending |
| FRESH-02 | Phase 6 | Pending |
| FRESH-03 | Phase 6 | Pending |
| FRESH-04 | Phase 6 | Pending |
| FRESH-05 | Phase 6 | Pending |
| COMP-05 | Phase 6 | Pending |
| COMP-06 | Phase 6 | Pending |
| COMP-07 | Phase 6 | Pending |
| COMP-08 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 17 total
- v2 requirements: 12 total
- Mapped to phases: 29
- Unmapped: 0 ✓

---

*Requirements defined: 2026-04-11*
*Last updated: 2026-04-19 after defining milestone v2.0 requirements*