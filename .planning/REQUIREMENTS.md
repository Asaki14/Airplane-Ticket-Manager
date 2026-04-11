# Requirements: 特价机票发现平台

**Defined:** 2026-04-11
**Core Value:** 用户能在几分钟内判断一张“看起来便宜”的机票到底值不值得买，并能立即采取下一步。

## v1 Requirements

### Discovery

- [ ] **DISC-01**: User can browse a public deal feed showing departure city, destination, travel window, airline, and headline price
- [ ] **DISC-02**: User can filter deals by departure city, destination region, travel date window, airline, and price ceiling
- [ ] **DISC-03**: User can sort deals by publish time, headline price, and value score
- [ ] **DISC-04**: User can search deals using city or destination keywords

### Rule Decode

- [ ] **RULE-01**: User can open a deal detail page that shows fare snapshot, source platform, publish time, update time, and expiry time
- [ ] **RULE-02**: User can read a plain-language summary of baggage allowance, refund/change rules, stopover or transfer pattern, cabin class, and booking restrictions
- [ ] **RULE-03**: User can see an explicit explanation of why the platform marks a fare as high value
- [ ] **RULE-04**: User can jump from a deal detail page to the original OTA or airline booking page

### Comparison

- [ ] **COMP-01**: User can add up to three deals into a comparison panel
- [ ] **COMP-02**: User can compare candidate deals side by side across price, schedule, baggage, refund/change, transfer, and value score
- [ ] **COMP-03**: User can save deals to a local favorites list and revisit them later
- [ ] **COMP-04**: User can copy or share a deal detail link

### Preferences

- [ ] **PREF-01**: User can set a default departure city for faster future browsing
- [ ] **PREF-02**: User can browse curated entry sections such as weekend escapes, holiday windows, islands, and nearby international trips
- [x] **PREF-03**: User can complete key browse, filter, detail, and compare flows on both mobile and desktop layouts

### Operations

- [x] **OPS-01**: Operator can create, edit, publish, archive, and tag deal entries with structured fields
- [x] **OPS-02**: Operator can set freshness metadata and expired deals stop appearing in the public discovery feed

## v2 Requirements

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
| DISC-01 | Phase 2 | Pending |
| DISC-02 | Phase 2 | Pending |
| DISC-03 | Phase 2 | Pending |
| DISC-04 | Phase 2 | Pending |
| RULE-01 | Phase 3 | Pending |
| RULE-02 | Phase 3 | Pending |
| RULE-03 | Phase 3 | Pending |
| RULE-04 | Phase 3 | Pending |
| PREF-01 | Phase 4 | Pending |
| PREF-02 | Phase 4 | Pending |
| COMP-01 | Phase 5 | Pending |
| COMP-02 | Phase 5 | Pending |
| COMP-03 | Phase 5 | Pending |
| COMP-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-11*
*Last updated: 2026-04-11 after initial definition*
