# Roadmap: 特价机票发现平台

## Phases

- [ ] **Phase 7: Real Data Foundation** - Users can see real ticket data collected from actual OTAs
- [ ] **Phase 8: Trustworthy Data Display** - Users can trust the freshness and source of ticket data
- [ ] **Phase 9: Informed Decision Making** - Users can make better decisions using real-time, verified data
- [ ] **Phase 10: Proactive Updates** - Users never miss good deals for their saved routes
- [ ] **Phase 11: Personalization & Scale** - Users have a personalized experience that works across devices and scales with their needs

## Phase Details

### Phase 7: Real Data Foundation
**Goal**: Users can see real ticket data collected from actual OTAs
**Depends on**: Phase 6 (v1 foundation)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, FRESH-05
**Success Criteria** (what must be TRUE):
  1. User can see ticket prices that match what's currently available on the source OTA site
  2. User can see essential flight details (airline, flight numbers, times, dates) for each deal
  3. User sees validation indicators showing data has been checked for reasonableness
  4. User sees consistent formatting regardless of which OTA the data came from
  5. When data collection fails, user sees last known good data with clear freshness warning instead of error
**Plans**: TBD
**UI hint**: yes

### Phase 8: Trustworthy Data Display
**Goal**: Users can trust the freshness and source of ticket data
**Depends on**: Phase 7
**Requirements**: FRESH-01, FRESH-02, FRESH-03, FRESH-04
**Success Criteria** (what must be TRUE):
  1. User can see when each deal's data was last collected
  2. User can see when each deal's data will expire/become stale
  3. User can see which OTA or airline provided each deal's information
  4. Operator can manually refresh data for specific sources when needed
  5. User understands that displayed information represents current market offerings
**Plans**: TBD
**UI hint**: yes

### Phase 9: Informed Decision Making
**Goal**: Users can make better decisions using real-time, verified data
**Depends on**: Phase 8
**Requirements**: COMP-05, COMP-06, COMP-07, COMP-08
**Success Criteria** (what must be TRUE):
  1. User can sort and filter deals based on current prices that reflect actual market rates
  2. User can visually identify potentially outdated deals in comparison views
  3. User sees value scores that factor in how fresh the data is
  4. User can check the freshness level of any deal when comparing multiple options
  5. User feels confident that comparisons are based on reliable, up-to-date information
**Plans**: TBD
**UI hint**: yes

### Phase 10: Proactive Updates
**Goal**: Users never miss good deals for their saved routes
**Depends on**: Phase 9
**Requirements**: ALRT-01, ALRT-02
**Success Criteria** (what must be TRUE):
  1. User can subscribe to receive alerts when prices drop for routes they're interested in
  2. User can subscribe to receive alerts when new deals appear for their saved routes
  3. User receives timely notifications through their preferred channel (WeChat, email, or browser)
  4. User can easily manage their alert subscriptions
  5. User feels the platform helps them act quickly on time-sensitive deals
**Plans**: TBD
**UI hint**: yes

### Phase 11: Personalization & Scale
**Goal**: Users have a personalized experience that works across devices and scales with their needs
**Depends on**: Phase 10
**Requirements**: AUTH-01, AUTH-02, AUTO-01, AUTO-02
**Success Criteria** (what must be TRUE):
  1. User can create an account and access their saved favorites from any device
  2. User can set different default departure cities for different travel contexts
  3. Operator can efficiently ingest deal candidates from configured sources with minimal manual work
  4. System helps operator maintain data quality by flagging potentially problematic deals
  5. User experiences consistent performance and functionality regardless of how many deals they save
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Real Data Foundation | 0/5 | Not started | - |
| 8. Trustworthy Data Display | 0/5 | Not started | - |
| 9. Informed Decision Making | 0/5 | Not started | - |
| 10. Proactive Updates | 0/5 | Not started | - |
| 11. Personalization & Scale | 0/5 | Not started | - |