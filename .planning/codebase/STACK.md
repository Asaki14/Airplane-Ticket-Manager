# Technology Stack

**Analysis Date:** 2026-04-12

## Languages

**Primary:**
- TypeScript 5.8.3 - App code, API routes, middleware, and domain logic in `src/**/*.ts` and `src/**/*.tsx` (see `src/app/page.tsx`, `src/app/api/deals/feed/route.ts`, `src/middleware.ts`).

**Secondary:**
- JavaScript (ESM) - Tooling/config scripts in `eslint.config.js` and `scripts/check-admin-gate-env.mjs`.
- CSS - Global/tokens styles in `src/styles/globals.css` and `src/styles/tokens.css`, imported by `src/app/layout.tsx`.

## Runtime

**Environment:**
- Node.js runtime for Next.js server and scripts (`package.json` scripts, `src/app/**`, `scripts/check-admin-gate-env.mjs`).
- Node version: Not detected (`.nvmrc` / `.node-version` not found at repo root).

**Package Manager:**
- npm (from `package-lock.json` + `package.json` scripts).
- Lockfile: present (`package-lock.json`).

## Frameworks

**Core:**
- Next.js 15.3.3 - App Router web framework for pages, layouts, API routes, middleware (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/**/route.ts`, `src/middleware.ts`).
- React 19.1.0 + React DOM 19.1.0 - UI component rendering (`src/components/deals/*.tsx`, `src/app/**/*.tsx`).
- Payload CMS 3.82.1 - CMS config/schema layer (`src/payload.config.ts`, `src/collections/Deals.ts`).

**Testing:**
- Vitest 3.1.1 - Test runner and assertions (`vitest.config.ts`, `tests/*.test.ts`).

**Build/Dev:**
- TypeScript 5.8.3 - Type checking/transpilation settings (`tsconfig.json`).
- ESLint 9.25.0 + typescript-eslint 8.30.1 - Lint rules (`eslint.config.js`, `package.json` `lint` script).

## Key Dependencies

**Critical:**
- `next@15.3.3` - HTTP/app framework and routing backbone (`package.json`, `src/app/**`, `src/middleware.ts`).
- `react@19.1.0` / `react-dom@19.1.0` - Component model for public/admin UIs (`src/components/deals/*.tsx`, `src/app/**/*.tsx`).
- `payload@3.82.1` - Deal content schema and CMS runtime (`src/payload.config.ts`, `src/collections/Deals.ts`).
- `@payloadcms/db-sqlite@3.82.1` - Payload database adapter (`src/payload.config.ts`).

**Infrastructure:**
- `typescript@5.8.3` - Strict TS setup (`tsconfig.json`).
- `vitest@3.1.1` - Automated checks (`vitest.config.ts`, `tests/*.test.ts`).
- `eslint@9.25.0`, `@eslint/js@9.25.0`, `typescript-eslint@8.30.1` - Static analysis (`eslint.config.js`).

## Configuration

**Environment:**
- Environment variables are consumed via `process.env` in `src/payload.config.ts`, `src/middleware.ts`, `src/app/page.tsx`, and `scripts/check-admin-gate-env.mjs`.
- Required/used keys in code: `ADMIN_GATE_USERNAME`, `ADMIN_GATE_PASSWORD`, `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`.
- `.env.local` file is present at repo root (`.env.local`) and acts as local environment configuration source.

**Build:**
- TS compiler config: `tsconfig.json` (strict mode, path alias `@/*` to `src/*`).
- Lint config: `eslint.config.js`.
- Test config: `vitest.config.ts`.
- CMS config: `src/payload.config.ts`.

## Platform Requirements

**Development:**
- Node.js + npm required to run scripts in `package.json` (`dev`, `lint`, `test`).
- Local filesystem write access required for default SQLite DB path `file:./payload.db` from `src/payload.config.ts`.

**Production:**
- Deployment target not explicitly configured (no Dockerfile/hosting config detected at repo root).
- Runtime expectations align with Next.js server deployment plus Payload-backed data layer (`src/app/**`, `src/payload.config.ts`).

---

*Stack analysis: 2026-04-12*
