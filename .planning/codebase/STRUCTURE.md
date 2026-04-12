# Codebase Structure

**Analysis Date:** 2026-04-12

## Directory Layout

```text
[project-root]/
├── src/                 # Next.js app code: routes, components, domain logic, CMS config
│   ├── app/             # App Router pages and API route handlers
│   ├── collections/     # Payload collection schemas and hooks
│   ├── components/      # Reusable UI components grouped by domain
│   ├── lib/             # Domain utilities and data helpers
│   └── styles/          # Design tokens and global stylesheet
├── tests/               # Vitest test suites for domain logic, routes, and UI contracts
├── scripts/             # Node scripts for environment preflight checks
├── .planning/           # GSD planning artifacts and generated codebase docs
├── payload.db           # Local SQLite database file used by Payload
├── package.json         # NPM scripts and dependency manifest
├── tsconfig.json        # TypeScript compiler config and path alias
├── vitest.config.ts     # Test runner configuration
└── eslint.config.js     # Lint configuration
```

## Directory Purposes

**`src/app/`:**
- Purpose: Define route entry points and HTTP handlers using Next.js App Router.
- Contains: UI pages (`src/app/page.tsx`, `src/app/deals/[id]/page.tsx`, `src/app/admin/**/*.tsx`), layout (`src/app/layout.tsx`), API handlers (`src/app/api/**/route.ts`).
- Key files: `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`, `src/app/api/preferences/departure/route.ts`, `src/app/layout.tsx`.

**`src/components/`:**
- Purpose: Host reusable UI blocks consumed by page routes.
- Contains: Deal-focused components under `src/components/deals/`.
- Key files: `src/components/deals/DealCard.tsx`, `src/components/deals/DiscoveryPreferences.tsx`, `src/components/deals/CompareAndSavePanel.tsx`.

**`src/lib/`:**
- Purpose: Keep business/domain logic and reusable helpers out of route files.
- Contains: Feed query utilities and data models under `src/lib/deals/`.
- Key files: `src/lib/deals/feed-query.ts`, `src/lib/deals/mock-data.ts`, `src/lib/deals/validation.ts`.

**`src/collections/`:**
- Purpose: Define Payload CMS collections and hooks.
- Contains: Collection config objects.
- Key files: `src/collections/Deals.ts`.

**`src/styles/`:**
- Purpose: Global CSS and design tokens for both public/admin shells.
- Contains: Variable tokens and global/layout/component class rules.
- Key files: `src/styles/tokens.css`, `src/styles/globals.css`.

**`tests/`:**
- Purpose: Validate feed rules, schema behavior, middleware auth, and UI design contracts.
- Contains: `.test.ts` files run by Vitest in Node environment.
- Key files: `tests/discovery-filters.test.ts`, `tests/feed-expiry.test.ts`, `tests/admin-gate.test.ts`, `tests/deal-schema.test.ts`.

**`scripts/`:**
- Purpose: Execute local development prechecks.
- Contains: ESM scripts called by npm lifecycle.
- Key files: `scripts/check-admin-gate-env.mjs`.

**`.planning/`:**
- Purpose: Store requirements, milestones, phase docs, and mapping output used by GSD workflow.
- Contains: Planning markdown docs and generated codebase reference docs.
- Key files: `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/codebase/`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Global HTML/body wrapper and style imports.
- `src/app/page.tsx`: Public discovery homepage route.
- `src/app/deals/[id]/page.tsx`: Deal detail dynamic route.
- `src/middleware.ts`: Admin auth middleware entry.
- `src/payload.config.ts`: Payload CMS bootstrap configuration.

**Configuration:**
- `package.json`: Scripts (`dev`, `lint`, `test`) and dependencies.
- `tsconfig.json`: Strict TS options and alias `@/* -> src/*`.
- `eslint.config.js`: ESLint + TypeScript ESLint setup.
- `vitest.config.ts`: Test include pattern `tests/**/*.test.ts`.

**Core Logic:**
- `src/lib/deals/feed-query.ts`: Feed filter/sort/mapping logic and shared types.
- `src/lib/deals/validation.ts`: Deal input validation and status constants.
- `src/collections/Deals.ts`: Payload schema and `beforeValidate` hook.

**Testing:**
- `tests/admin-gate-auth-success.test.ts`: Middleware auth pass case.
- `tests/admin-gate.test.ts`: Middleware unauthorized/misconfigured cases.
- `tests/deal-detail.test.ts`: Deal detail rendering behavior.
- `tests/deal-crud.test.ts`: Deal CRUD-related behavior checks.

## Naming Conventions

**Files:**
- Use kebab-case for utility/script/test files: `src/lib/deals/feed-query.ts`, `scripts/check-admin-gate-env.mjs`, `tests/freshness-order.test.ts`.
- Use PascalCase for Payload collection modules: `src/collections/Deals.ts`.
- Use Next.js route conventions for app files: `src/app/**/page.tsx`, `src/app/**/route.ts`, `src/app/layout.tsx`.

**Directories:**
- Group by feature/domain first under `src/components/deals/` and `src/lib/deals/`.
- Use route-segment directories in `src/app/` including dynamic segments such as `src/app/deals/[id]/`.

## Where to Add New Code

**New Feature:**
- Primary code: Add/extend route orchestrations in `src/app/` and business rules in `src/lib/deals/`.
- Tests: Add matching `*.test.ts` under `tests/` (follow existing top-level test directory pattern).

**New Component/Module:**
- Implementation: Place deal-facing UI in `src/components/deals/`; add a new domain folder under `src/components/` when introducing a new bounded area.

**Utilities:**
- Shared helpers: Add typed pure functions under `src/lib/` (prefer domain subfolders like `src/lib/deals/`).

## Special Directories

**`src/app/api/`:**
- Purpose: Server-side route handlers exposed as application API endpoints.
- Generated: No.
- Committed: Yes.

**`src/collections/`:**
- Purpose: Payload collection schemas and lifecycle hooks.
- Generated: No.
- Committed: Yes.

**`.planning/codebase/`:**
- Purpose: Architecture/stack/conventions reference docs used by planning/execution agents.
- Generated: Yes (by mapper workflow).
- Committed: Yes.

**`.next/`:**
- Purpose: Next.js build artifacts and generated types (e.g., `.next/types/**/*.ts` referenced by `tsconfig.json`).
- Generated: Yes.
- Committed: No.

**`node_modules/`:**
- Purpose: Installed dependencies.
- Generated: Yes.
- Committed: No.

---

*Structure analysis: 2026-04-12*
