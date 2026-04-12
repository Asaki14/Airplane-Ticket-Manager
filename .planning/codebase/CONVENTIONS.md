# Coding Conventions

**Analysis Date:** 2026-04-12

## Naming Patterns

**Files:**
- Use `kebab-case` for most source and test files, such as `src/lib/deals/feed-query.ts`, `src/lib/deals/mock-data.ts`, `src/components/deals/DealCard.tsx`, and `tests/discovery-filters.test.ts`.
- Use Next.js route segment naming conventions for dynamic routes, such as `src/app/deals/[id]/page.tsx` and `src/app/admin/deals/[id]/page.tsx`.
- Use `PascalCase.tsx` for React component files that export UI components, such as `src/components/deals/CompareAndSavePanel.tsx`, `src/components/deals/DiscoveryPreferences.tsx`, and `src/components/deals/DealCard.tsx`.

**Functions:**
- Use `camelCase` for function names and helpers, including `firstValue`, `parseSearchFilters`, `buildOptions`, and `loadDeals` in `src/app/page.tsx`.
- Use verb-first naming for action functions in client components and utilities, such as `toggleCompare`, `toggleFavorite`, `savePreference` in `src/components/deals/CompareAndSavePanel.tsx` and `src/components/deals/DiscoveryPreferences.tsx`.
- Use framework-required names for HTTP handlers (`GET`, `POST`) in route handlers such as `src/app/api/deals/feed/route.ts` and `src/app/api/preferences/departure/route.ts`.

**Variables:**
- Use descriptive `camelCase` names for local values and params, including `preferredDepartureCity`, `filterMeta`, `selectedDeals`, and `maxPriceRaw` in `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`, and `src/components/deals/CompareAndSavePanel.tsx`.
- Use `UPPER_SNAKE_CASE` for constants that behave as fixed keys/config, such as `FAV_KEY` in `src/components/deals/CompareAndSavePanel.tsx` and `ALLOWED_SORTS` in `src/app/api/deals/feed/route.ts`.

**Types:**
- Use `PascalCase` and `Props` suffix for component prop types, for example `DealCardProps`, `CompareAndSavePanelProps`, and `DiscoveryPreferencesProps` in `src/components/deals/*.tsx`.
- Use `type` aliases heavily (over `interface`) for data contracts, including `DealFeedRecord`, `FeedFilters`, `FeedSort` in `src/lib/deals/feed-query.ts` and `DealEditPageProps` in `src/app/admin/deals/[id]/page.tsx`.

## Code Style

**Formatting:**
- Tool used: ESLint flat config is present in `eslint.config.js`; no dedicated Prettier config detected (`.prettierrc*` not detected).
- Style follows 2-space indentation, semicolon-free TypeScript/TSX, single-quoted strings, and trailing commas in multiline literals (examples: `src/app/page.tsx`, `src/lib/deals/feed-query.ts`, `src/components/deals/CompareAndSavePanel.tsx`).
- Keep CSS custom properties and style tokens centralized in `src/styles/tokens.css`; consume via `var(--color-*)` in TSX/CSS (examples in `src/app/page.tsx` and `src/styles/globals.css`).

**Linting:**
- Tool used: ESLint + TypeScript ESLint via `eslint.config.js` and `package.json` script `lint`.
- Key rules: base `@eslint/js` recommended + `typescript-eslint` recommended are enabled in `eslint.config.js`.
- Local override: `no-unused-vars` is explicitly disabled in `eslint.config.js`; rely on TypeScript strictness (`"strict": true`) in `tsconfig.json` for unused/typing discipline.

## Import Organization

**Order:**
1. Framework/runtime imports first (e.g., `next/headers`, `next/navigation`, React) in files like `src/app/page.tsx` and `src/app/deals/[id]/page.tsx`.
2. Internal aliased imports next (`@/...`) for app/lib/components, e.g., `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`.
3. Relative imports when used for local modules/tests, e.g., `../src/lib/deals/feed-query` in `tests/discovery-filters.test.ts` and `./feed-query` in `src/lib/deals/mock-data.ts`.

**Path Aliases:**
- Alias `@/* -> src/*` is configured in `tsconfig.json`.
- Prefer alias imports in app/runtime code (examples: `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`, `src/app/deals/[id]/page.tsx`).
- Tests currently prefer relative imports from `tests/` into `src/` (examples: `tests/feed-expiry.test.ts`, `tests/deal-schema.test.ts`).

## Error Handling

**Patterns:**
- Use graceful fallback patterns instead of throwing for user-facing flows:
  - Network fallback to local mock data in `src/app/page.tsx` using `fetch(...).catch(() => null)` and fallback to `mockDeals`.
  - JSON parse fallback in `src/components/deals/CompareAndSavePanel.tsx` via `try/catch` around `localStorage` parsing.
  - Request body parse fallback in `src/app/api/preferences/departure/route.ts` via `request.json().catch(() => ({}))`.
- Use explicit guard + early return style in middleware and filters:
  - Admin auth checks in `src/middleware.ts`.
  - Filter exits in `src/lib/deals/feed-query.ts`.
- Use framework-native response/error primitives:
  - `Response.json(...)` for API success payloads in `src/app/api/deals/feed/route.ts` and `src/app/api/preferences/departure/route.ts`.
  - `notFound()` for missing resources in `src/app/deals/[id]/page.tsx`.

## Logging

**Framework:** None detected in source runtime code; `console.*` usage in `src/` is not detected.

**Patterns:**
- Keep user-visible status through UI text and HTTP response payloads instead of console logging (e.g., status text in `src/components/deals/DiscoveryPreferences.tsx`, `meta` in `src/app/api/deals/feed/route.ts`).

## Comments

**When to Comment:**
- Minimal inline comments are used; code is mostly self-describing through naming and section headings.
- Prefer semantic sectioning through JSX structure (`<section>`, `<h2>`, `aria-label`) rather than explanatory comments (examples: `src/app/page.tsx`, `src/app/deals/[id]/page.tsx`, `src/app/admin/deals/[id]/page.tsx`).

**JSDoc/TSDoc:**
- Not detected in current codebase (`src/` and `tests/` do not show JSDoc/TSDoc blocks).

## Function Design

**Size:**
- Keep pure utility functions short and focused (`includesText`, `parseSort`, `toDateLabel`, `validateDealInput`) in `src/lib/deals/feed-query.ts`, `src/app/api/deals/feed/route.ts`, `src/components/deals/DealCard.tsx`, and `src/lib/deals/validation.ts`.
- Allow larger composition functions for page rendering where data-loading and JSX assembly are co-located (`HomePage` in `src/app/page.tsx`).

**Parameters:**
- Use typed object parameters for public functions and route/page props (`FeedFilters`, `DealEditPageProps`, `SearchParams`).
- Use optional fields with nullish fallback for resilient mapping (`mapPublicFeedResponse` in `src/lib/deals/feed-query.ts`).

**Return Values:**
- Prefer deterministic object returns for validators (`{ ok, errors }` in `src/lib/deals/validation.ts`).
- Keep transformation functions pure and return new arrays/objects (`filterPublicFeedDeals`, `sortPublicFeedDeals`, `mapPublicFeedResponse` in `src/lib/deals/feed-query.ts`).

## Module Design

**Exports:**
- Use named exports for reusable functions/types/constants in domain modules (`src/lib/deals/feed-query.ts`, `src/lib/deals/validation.ts`).
- Use default export for Next.js page entry modules (`src/app/page.tsx`, `src/app/admin/page.tsx`, `src/app/deals/[id]/page.tsx`).

**Barrel Files:**
- Not detected. Modules are imported directly by path (e.g., `@/components/deals/DealCard`, `@/lib/deals/feed-query`, and direct relative imports in tests).

---

*Convention analysis: 2026-04-12*
