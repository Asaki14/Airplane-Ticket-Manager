# Codebase Concerns

**Analysis Date:** 2026-04-12

## Tech Debt

**Public feed data source split (mock first, CMS not wired):**
- Issue: Public listing and detail read path is built on static mock data instead of Payload collection data.
- Files: `src/app/api/deals/feed/route.ts`, `src/lib/deals/mock-data.ts`, `src/app/page.tsx`, `src/app/deals/[id]/page.tsx`, `src/collections/Deals.ts`
- Impact: Admin/CMS updates do not flow into public pages, causing stale or inconsistent discovery results.
- Fix approach: Replace `mockDeals` reads with Payload query layer, then centralize read model mapping in one server-side data access module.

**Admin UI is scaffold-only (no persistence actions):**
- Issue: Admin list and edit pages render hardcoded sample rows and buttons without submit/update handlers.
- Files: `src/app/admin/deals/page.tsx`, `src/app/admin/deals/[id]/page.tsx`
- Impact: Operators cannot actually create/update/publish/archive deals through the current interface.
- Fix approach: Bind forms/actions to Payload APIs (create/update/status transitions), add optimistic/error states, and remove hardcoded demo records.

**Validation logic duplicated across schema layers:**
- Issue: Required-field and status checks are maintained in app validation plus collection config fields separately.
- Files: `src/lib/deals/validation.ts`, `src/collections/Deals.ts`
- Impact: Drift risk (one layer accepts/rejects values differently), leading to inconsistent behavior between API/UI and CMS write hooks.
- Fix approach: Define a single schema contract (typed validator) and generate/derive both collection constraints and app-side checks from it.

## Known Bugs

**Deal detail endpoint can expose non-public deals:**
- Symptoms: `/deals/[id]` renders by ID from mapped data without enforcing `status === published` and `expiresAt > now`.
- Files: `src/app/deals/[id]/page.tsx`, `src/lib/deals/feed-query.ts`, `src/lib/deals/mock-data.ts`
- Trigger: Access detail URL for a draft/expired record ID that exists in the underlying source array.
- Workaround: Manually avoid linking non-public IDs; temporary guard in page loader to reuse public-filter logic before `find`.

**Taxonomy mismatch in sample data causes filter ambiguity:**
- Symptoms: One record stores `region` value as a travel-window style label (`周末捡漏`) instead of region taxonomy values used in quick entry links.
- Files: `src/lib/deals/mock-data.ts`, `src/app/page.tsx`
- Trigger: Region filtering/aggregation with mixed semantic categories.
- Workaround: Normalize `region` values in data set and keep `travelWindowLabel` only for scenario labels.

## Security Considerations

**Weak default secret fallback in production path:**
- Risk: `PAYLOAD_SECRET` falls back to a predictable hardcoded string when env var is absent.
- Files: `src/payload.config.ts`
- Current mitigation: None in config; only admin gate env is enforced by startup script for a different secret set.
- Recommendations: Fail fast when `PAYLOAD_SECRET` is missing outside local dev; add explicit environment-mode guard.

**Admin Basic Auth lacks brute-force protections:**
- Risk: Middleware checks credentials directly with no rate limit, lockout, or backoff.
- Files: `src/middleware.ts`
- Current mitigation: Path restriction (`/admin/:path*`) and required non-empty env variables via `scripts/check-admin-gate-env.mjs`.
- Recommendations: Add request throttling/IP-based rate limits and audit logging for failed attempts.

## Performance Bottlenecks

**Server-side self-HTTP call on homepage render:**
- Problem: Home page performs `fetch(${base}/api/deals/feed...)` on each render with `cache: 'no-store'`, adding intra-app HTTP overhead.
- Files: `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`
- Cause: Data transformation duplicated and routed through network boundary instead of direct function call/repository access.
- Improvement path: Move feed query logic into shared server module and call directly from page and API route.

**In-memory full-scan filtering/sorting path:**
- Problem: Every feed request filters/sorts full in-memory array in application process.
- Files: `src/lib/deals/feed-query.ts`, `src/app/api/deals/feed/route.ts`
- Cause: No indexed DB query path; all filters (`departureCity`, `region`, `airline`, `q`) are evaluated in JS loops.
- Improvement path: Push predicates/sort to database queries and paginate response.

## Fragile Areas

**Filter/sort parsing logic duplicated between page and API:**
- Files: `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`
- Why fragile: Parameter parsing rules and defaults can diverge silently when one side changes.
- Safe modification: Extract shared parser helpers for `FeedFilters` and `FeedSort`, consume from both entry points.
- Test coverage: `tests/discovery-filters.test.ts` validates query behavior, but no test asserts parser parity between page and API handlers.

**Client preference flow assumes success path only:**
- Files: `src/components/deals/DiscoveryPreferences.tsx`, `src/app/api/preferences/departure/route.ts`
- Why fragile: UI always sets "saved" and hard reloads even if network/API fails.
- Safe modification: Check `response.ok`, handle error state in component, avoid unconditional reload.
- Test coverage: `tests/preference-and-compare.test.ts` checks source-code presence strings, not runtime failure handling.

## Scaling Limits

**Feed capacity tied to in-repo mock array:**
- Current capacity: 5 records in `mockDeals` sample set.
- Limit: Growth in deal volume increases linear filter/sort cost and operational burden of code-based content updates.
- Scaling path: Move to DB-backed querying with pagination, indexing, and operational CMS publish workflow.

**Comparison feature hard cap:**
- Current capacity: Max 3 simultaneous compare items enforced by UI state.
- Limit: Advanced comparison use cases (batch shortlist) cannot scale beyond 3 in current interaction model.
- Scaling path: Keep quick-compare cap for UX, add persisted shortlist table/page for larger decision sets.

## Dependencies at Risk

**SQLite as default runtime datastore for CMS:**
- Risk: File-based `payload.db` limits concurrent write/read scaling and operational robustness in multi-instance deployment.
- Impact: Throughput and availability degrade when traffic or editor concurrency increases.
- Migration plan: Replace sqlite adapter with managed relational DB adapter in `src/payload.config.ts` and apply migration workflow.

## Missing Critical Features

**No end-to-end publish pipeline from admin to public feed:**
- Problem: Admin pages do not persist to collection and public feed is not reading collection data.
- Blocks: Real operation of "录入/发布/归档 -> 用户发现" core product loop.

**No observability hooks for critical flows:**
- Problem: No request-level structured logging, no error monitoring integration in API/middleware paths.
- Blocks: Rapid diagnosis of auth failures, feed regressions, and production incidents.

## Test Coverage Gaps

**Behavioral UI/API failure-path tests are sparse:**
- What's not tested: Client-side error handling for preference save and compare persistence edge cases.
- Files: `src/components/deals/DiscoveryPreferences.tsx`, `src/components/deals/CompareAndSavePanel.tsx`, `tests/preference-and-compare.test.ts`
- Risk: Silent UX failures in flaky network/storage scenarios.
- Priority: High

**Admin CRUD integration is untested at runtime:**
- What's not tested: Real create/update/publish/archive operations through admin routes.
- Files: `src/app/admin/deals/page.tsx`, `src/app/admin/deals/[id]/page.tsx`, `tests/deal-crud.test.ts`
- Risk: False confidence from static string assertions while operational flows remain non-functional.
- Priority: High

**Public detail visibility guard is untested:**
- What's not tested: Access control for expired/draft deals on detail route.
- Files: `src/app/deals/[id]/page.tsx`, `tests/deal-detail.test.ts`
- Risk: Non-public content leakage remains undetected.
- Priority: High

---

*Concerns audit: 2026-04-12*
