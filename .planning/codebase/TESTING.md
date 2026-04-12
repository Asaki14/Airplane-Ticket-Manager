# Testing Patterns

**Analysis Date:** 2026-04-12

## Test Framework

**Runner:**
- Vitest `3.1.1` (configured via `package.json` and `vitest.config.ts`).
- Config: `vitest.config.ts` with `environment: 'node'` and `include: ['tests/**/*.test.ts']`.

**Assertion Library:**
- Vitest built-in assertions (`expect`) from `vitest` imports, e.g., `tests/feed-expiry.test.ts`, `tests/admin-gate.test.ts`.

**Run Commands:**
```bash
npm run test           # Run all tests (vitest run)
npm run test:quick     # Quick run alias (vitest run)
npx vitest --watch     # Watch mode (direct vitest CLI)
npx vitest run --coverage  # Coverage output (CLI flag; no dedicated script)
```

## Test File Organization

**Location:**
- Separate top-level test directory: `tests/`.
- Test files target `src/` modules through relative imports and file-content checks.

**Naming:**
- Use `kebab-case` with `.test.ts` suffix, such as:
  - `tests/discovery-filters.test.ts`
  - `tests/admin-gate-auth-success.test.ts`
  - `tests/deal-schema.test.ts`

**Structure:**
```
tests/
├── app-shell.test.ts
├── design-contract.test.ts
├── deal-schema.test.ts
├── feed-expiry.test.ts
└── ...
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, expect, it } from 'vitest'

describe('feed-expiry', () => {
  const now = new Date('2026-04-11T12:00:00.000Z')

  it('excludes published deals with expiresAt <= now', () => {
    const result = filterPublicFeedDeals([{ id: '2', status: 'published', expiresAt: '2026-04-11T12:00:00.000Z' }], now)
    expect(result).toHaveLength(0)
  })
})
```
Pattern from `tests/feed-expiry.test.ts`.

**Patterns:**
- Setup pattern:
  - Inline deterministic fixtures inside each test/suite (`tests/feed-expiry.test.ts`, `tests/discovery-filters.test.ts`).
  - Env capture/reset using `beforeEach` + `afterEach` in `tests/admin-gate.test.ts` and `tests/admin-gate-auth-success.test.ts`.
- Teardown pattern:
  - Restore process env via helper (`applyAdminEnv`) after each case in admin middleware tests (`tests/admin-gate.test.ts`, `tests/admin-gate-auth-success.test.ts`).
- Assertion pattern:
  - Value assertions (`toBe`, `toEqual`, `toHaveLength`, `toContain`) for domain logic.
  - Negative assertions (`not.toContain`) for contract checks in `tests/deal-crud.test.ts` and `tests/design-contract.test.ts`.

## Mocking

**Framework:**
- No dedicated mocking framework usage detected (`vi.mock` not detected in `tests/`).

**Patterns:**
```typescript
const content = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
expect(content).toContain('/api/deals/feed')
expect(content).toContain('<DealCard')
```
Pattern from `tests/deal-card-pricing.test.ts` and multiple contract tests.

```typescript
const request = new NextRequest('http://localhost/admin/deals', {
  headers: { authorization: buildAuth('uat', 'secret') }
})
const response = middleware(request)
expect(response.status).toBe(200)
```
Pattern from `tests/admin-gate-auth-success.test.ts`.

**What to Mock:**
- Prefer deterministic in-memory data over mocks for domain logic (`mockDeals` and inline arrays in `tests/discovery-filters.test.ts`, `tests/feed-expiry.test.ts`).
- For env-dependent behavior, simulate by mutating `process.env` with explicit restore hooks (`tests/admin-gate.test.ts`).

**What NOT to Mock:**
- Do not mock core pure functions in `src/lib/deals/feed-query.ts` and `src/lib/deals/validation.ts`; call them directly.
- Do not mock static file contracts when enforcing UI/content constraints; use direct source assertions (`readFileSync`) as done across `tests/*.test.ts`.

## Fixtures and Factories

**Test Data:**
```typescript
const now = new Date('2026-04-11T12:00:00.000Z')
const result = filterPublicFeedDeals(
  [{ id: '3', status: 'published', expiresAt: '2026-04-11T12:00:01.000Z' }],
  now
)
expect(result[0].id).toBe('3')
```
Pattern from `tests/feed-expiry.test.ts`.

```typescript
const result = validateDealInput({
  title: '',
  departureCity: '',
  destination: '',
  headlinePrice: null,
  expiresAt: ''
})
expect(result.errors).toContain('headlinePrice')
```
Pattern from `tests/deal-schema.test.ts`.

**Location:**
- No separate fixtures/factories directory detected.
- Reusable fixture source is `src/lib/deals/mock-data.ts`; tests either import this or create inline objects.

## Coverage

**Requirements:**
- No enforced coverage threshold detected (no `coverage` block in `vitest.config.ts`, no coverage script in `package.json`).

**View Coverage:**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Core business logic unit tests directly invoke pure functions:
  - `tests/feed-expiry.test.ts` for visibility/expiry logic in `src/lib/deals/feed-query.ts`.
  - `tests/discovery-filters.test.ts` for filters/sorting in `src/lib/deals/feed-query.ts`.
  - `tests/deal-schema.test.ts` for input validation in `src/lib/deals/validation.ts`.

**Integration Tests:**
- Light integration around middleware + framework request object:
  - `tests/admin-gate-auth-success.test.ts` constructs `NextRequest` and validates `src/middleware.ts` response behavior.
  - `tests/admin-gate.test.ts` combines env checks, middleware behavior, and script execution (`scripts/check-admin-gate-env.mjs`).

**E2E Tests:**
- Not used. No Playwright/Cypress E2E suite detected (`playwright.config.*` and `cypress.config.*` not detected).

## Common Patterns

**Async Testing:**
```typescript
async function loadMiddleware() {
  const mod = await import('../src/middleware')
  return mod.middleware
}

it('returns 401 challenge for /admin without authorization header', async () => {
  const middleware = await loadMiddleware()
  const response = middleware(new NextRequest('http://localhost/admin/deals'))
  expect(response.status).toBe(401)
})
```
Pattern from `tests/admin-gate.test.ts`.

**Error Testing:**
```typescript
const result = spawnSync('node', [resolve('scripts/check-admin-gate-env.mjs')], {
  env: { ...process.env, ADMIN_GATE_USERNAME: '', ADMIN_GATE_PASSWORD: '' },
  encoding: 'utf-8'
})

expect(result.status).not.toBe(0)
expect(`${result.stdout}\n${result.stderr}`).toContain('ADMIN_GATE_USERNAME')
```
Pattern from `tests/admin-gate.test.ts`.

Additional negative-contract pattern:
```typescript
expect(content).not.toContain('bulkPublish')
```
From `tests/deal-crud.test.ts`.

---

*Testing analysis: 2026-04-12*
