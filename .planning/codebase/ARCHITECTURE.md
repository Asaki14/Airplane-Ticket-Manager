# Architecture

**Analysis Date:** 2026-04-12

## Pattern Overview

**Overall:** Next.js App Router + domain utility module + component composition + middleware gate

**Key Characteristics:**
- Use route-level server components as orchestration points in `src/app/page.tsx` and `src/app/deals/[id]/page.tsx`.
- Keep deal feed filtering/sorting/shape mapping in pure domain functions under `src/lib/deals/feed-query.ts`.
- Protect `/admin` paths centrally in `src/middleware.ts` instead of per-page checks.

## Layers

**Presentation Layer (App Router pages):**
- Purpose: Handle URL params/cookies, compose UI, trigger data loading.
- Location: `src/app/**/*.tsx`.
- Contains: Public page (`src/app/page.tsx`), detail page (`src/app/deals/[id]/page.tsx`), admin pages (`src/app/admin/**/*.tsx`), root layout (`src/app/layout.tsx`).
- Depends on: `src/components/deals/*`, `src/lib/deals/*`, `next/headers`, `next/navigation`.
- Used by: Next.js runtime as route entry points.

**UI Component Layer (Deal-focused components):**
- Purpose: Render reusable sections for cards, preferences, and compare/favorite interactions.
- Location: `src/components/deals/*.tsx`.
- Contains: `src/components/deals/DealCard.tsx`, `src/components/deals/DiscoveryPreferences.tsx`, `src/components/deals/CompareAndSavePanel.tsx`.
- Depends on: React hooks in client components; props provided by page layer.
- Used by: `src/app/page.tsx`.

**Domain/Data Transform Layer:**
- Purpose: Centralize feed record typing, filtering, sorting, and response normalization.
- Location: `src/lib/deals/*.ts`.
- Contains: Query logic in `src/lib/deals/feed-query.ts`, seed/mock records in `src/lib/deals/mock-data.ts`, input validation in `src/lib/deals/validation.ts`.
- Depends on: TypeScript primitives only (pure logic).
- Used by: API route `src/app/api/deals/feed/route.ts`, pages `src/app/page.tsx` and `src/app/deals/[id]/page.tsx`, collection config `src/collections/Deals.ts`.

**API Layer (Route Handlers):**
- Purpose: Expose server endpoints for filtered feed and user preference persistence.
- Location: `src/app/api/**/route.ts`.
- Contains: Feed endpoint `src/app/api/deals/feed/route.ts`, preference endpoint `src/app/api/preferences/departure/route.ts`.
- Depends on: Domain layer `src/lib/deals/feed-query.ts`, mock data `src/lib/deals/mock-data.ts`, cookies API from `next/headers`.
- Used by: `src/app/page.tsx` (server-side fetch) and `src/components/deals/DiscoveryPreferences.tsx` (client POST).

**Content Model / CMS Config Layer:**
- Purpose: Define persistent deal schema and validation hooks for Payload CMS.
- Location: `src/payload.config.ts` and `src/collections/Deals.ts`.
- Contains: SQLite adapter setup (`src/payload.config.ts`) and collection fields/hooks (`src/collections/Deals.ts`).
- Depends on: `payload`, `@payloadcms/db-sqlite`, validation helper `src/lib/deals/validation.ts`.
- Used by: Payload runtime configuration.

**Security Gate Layer:**
- Purpose: Enforce HTTP Basic Auth on admin routes.
- Location: `src/middleware.ts`.
- Contains: Header parsing, credential checks, unauthorized response handling.
- Depends on: `process.env.ADMIN_GATE_USERNAME`, `process.env.ADMIN_GATE_PASSWORD`.
- Used by: All requests matching `matcher: ['/admin/:path*']`.

## Data Flow

**Public Discovery Feed Flow:**

1. `src/app/page.tsx` parses query/cookie state into `FeedFilters` and `FeedSort`.
2. `src/app/page.tsx` fetches `GET /api/deals/feed` from `src/app/api/deals/feed/route.ts`.
3. `src/app/api/deals/feed/route.ts` calls `filterPublicFeedDeals` + `sortPublicFeedDeals` + `mapPublicFeedResponse` in `src/lib/deals/feed-query.ts` using `src/lib/deals/mock-data.ts`.
4. `src/app/page.tsx` renders normalized records through `src/components/deals/DealCard.tsx` and passes full list into `src/components/deals/CompareAndSavePanel.tsx`.

**Departure Preference Flow:**

1. `src/components/deals/DiscoveryPreferences.tsx` posts selected city to `POST /api/preferences/departure`.
2. `src/app/api/preferences/departure/route.ts` sets/deletes `preferredDepartureCity` cookie.
3. `src/components/deals/DiscoveryPreferences.tsx` reloads page.
4. `src/app/page.tsx` reads cookie via `cookies()` and injects it into default filters.

**Admin Access Control Flow:**

1. Request enters `src/middleware.ts`.
2. Non-`/admin` routes pass through directly.
3. `/admin` routes require configured env credentials and valid Basic Auth header.
4. On success, request reaches admin pages in `src/app/admin/**/*.tsx`; on failure, 401 is returned by middleware.

**State Management:**
- Keep server state in URL query params and cookies (`src/app/page.tsx`, `src/app/api/preferences/departure/route.ts`).
- Keep client-only compare/favorite state in `useState` + `localStorage` (`src/components/deals/CompareAndSavePanel.tsx`).

## Key Abstractions

**DealFeedRecord model:**
- Purpose: Canonical deal record for filtering/sorting/mapping.
- Examples: Type definition in `src/lib/deals/feed-query.ts`; sample instances in `src/lib/deals/mock-data.ts`.
- Pattern: Define optional raw-like fields in source model, then normalize before UI output.

**Feed filters and sort contracts:**
- Purpose: Keep query parsing and business rules aligned across page and API.
- Examples: `FeedFilters` and `FeedSort` in `src/lib/deals/feed-query.ts`; parser usage in `src/app/page.tsx` and `src/app/api/deals/feed/route.ts`.
- Pattern: Parse untyped query input early, pass typed objects through domain functions.

**Validation gate for deal writes:**
- Purpose: Reject incomplete/invalid deal input before collection validation proceeds.
- Examples: `validateDealInput` in `src/lib/deals/validation.ts`; `beforeValidate` hook in `src/collections/Deals.ts`.
- Pattern: Keep reusable validation helper in lib, invoke from collection hooks.

## Entry Points

**Web app shell:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render in App Router.
- Responsibilities: Load global styles (`src/styles/tokens.css`, `src/styles/globals.css`) and provide base HTML/body shell.

**Public homepage:**
- Location: `src/app/page.tsx`
- Triggers: `GET /`.
- Responsibilities: Parse filters, fetch feed, provide filter/options, render discovery + compare UI.

**Deal detail page:**
- Location: `src/app/deals/[id]/page.tsx`
- Triggers: `GET /deals/:id`.
- Responsibilities: Resolve deal by id from mapped feed data and render freshness/rules/value explanation.

**Feed API endpoint:**
- Location: `src/app/api/deals/feed/route.ts`
- Triggers: `GET /api/deals/feed`.
- Responsibilities: Parse query params, apply domain filter/sort/map pipeline, return JSON with `data` and `meta`.

**Preference API endpoint:**
- Location: `src/app/api/preferences/departure/route.ts`
- Triggers: `POST /api/preferences/departure`.
- Responsibilities: Persist/remove departure preference cookie.

**Admin middleware gate:**
- Location: `src/middleware.ts`
- Triggers: Requests matching `/admin/:path*`.
- Responsibilities: Enforce Basic Auth and block unauthorized/misconfigured access.

**Payload configuration entry:**
- Location: `src/payload.config.ts`
- Triggers: Payload initialization.
- Responsibilities: Configure secret, SQLite DB adapter, and load `DealsCollection` from `src/collections/Deals.ts`.

## Error Handling

**Strategy:** Fail soft for public feed data loading, fail closed for admin auth, and fail fast for invalid collection input.

**Patterns:**
- Use fetch fallback to in-memory data when feed API is unavailable in `src/app/page.tsx`.
- Return HTTP 401 with `WWW-Authenticate` header for auth failures in `src/middleware.ts`.
- Throw explicit validation errors in `src/collections/Deals.ts` when `validateDealInput` fails.
- Use `notFound()` for missing dynamic route records in `src/app/deals/[id]/page.tsx`.

## Cross-Cutting Concerns

**Logging:** Minimal runtime logging in app code; environment preflight logging exists in `scripts/check-admin-gate-env.mjs`.

**Validation:** Central deal input validation helper in `src/lib/deals/validation.ts`, reused by Payload hook in `src/collections/Deals.ts`.

**Authentication:** Global Basic Auth enforcement for admin pages via `src/middleware.ts` and startup env checks via `scripts/check-admin-gate-env.mjs`.

---

*Architecture analysis: 2026-04-12*
