# External Integrations

**Analysis Date:** 2026-04-12

## APIs & External Services

**Internal HTTP APIs (same app):**
- Next.js Route Handler: Public deals feed API used by homepage data loading.
  - Usage: `src/app/page.tsx` calls `fetch(`${base}/api/deals/feed?...`)` to retrieve feed data.
  - Endpoint implementation: `src/app/api/deals/feed/route.ts`.
  - SDK/Client: Native `fetch` in Next.js/Node runtime.
  - Auth: None detected for this endpoint.

- Next.js Route Handler: Departure preference persistence API.
  - Usage: `src/components/deals/DiscoveryPreferences.tsx` posts to `/api/preferences/departure`.
  - Endpoint implementation: `src/app/api/preferences/departure/route.ts`.
  - SDK/Client: Native `fetch`.
  - Auth: Cookie-based preference write, no user identity provider detected.

**Third-party APIs:**
- Not detected. No Stripe/Supabase/AWS/other external SDK imports in `src/**/*.ts` or `src/**/*.tsx`.

## Data Storage

**Databases:**
- SQLite via Payload adapter.
  - Connection: `DATABASE_URL` in `src/payload.config.ts` (fallback `file:./payload.db`).
  - Client: `@payloadcms/db-sqlite` with Payload in `src/payload.config.ts`.
  - Content model: Deals collection in `src/collections/Deals.ts`.

**File Storage:**
- Local filesystem only detected (SQLite file path `file:./payload.db` in `src/payload.config.ts`).

**Caching:**
- No external cache service detected (no Redis/Memcached clients imported).

## Authentication & Identity

**Auth Provider:**
- Custom Basic Auth gate for admin routes.
  - Implementation: Next.js middleware in `src/middleware.ts` validates `Authorization: Basic ...` against `ADMIN_GATE_USERNAME` and `ADMIN_GATE_PASSWORD`.
  - Scope: `/admin/:path*` via matcher config in `src/middleware.ts`.

**Identity Platform:**
- Not detected (no OAuth/SSO/Auth0/Clerk/NextAuth integration files or imports).

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/Datadog/Rollbar SDK usage in `src/**`).

**Logs:**
- Script-level console output in `scripts/check-admin-gate-env.mjs` (startup env validation log/error).
- No centralized application logging integration detected.

## CI/CD & Deployment

**Hosting:**
- Not explicitly declared by config files in repository root (no deployment manifest/Dockerfile found).

**CI Pipeline:**
- Not detected (no workflow pipeline files identified in explored config set).

## Environment Configuration

**Required env vars:**
- `ADMIN_GATE_USERNAME` and `ADMIN_GATE_PASSWORD` are required by development startup check `scripts/check-admin-gate-env.mjs` and used by `src/middleware.ts`.
- `PAYLOAD_SECRET` used by `src/payload.config.ts`.
- `DATABASE_URL` used by `src/payload.config.ts`.
- `NEXT_PUBLIC_SITE_URL` used by `src/app/page.tsx` when building feed API URL.

**Secrets location:**
- `.env.local` present at repository root for local secret/config injection.
- Runtime reads through `process.env` in `src/payload.config.ts`, `src/middleware.ts`, `src/app/page.tsx`, and `scripts/check-admin-gate-env.mjs`.

## Webhooks & Callbacks

**Incoming:**
- None detected (no webhook endpoints under `src/app/api/**` beyond app-local feed/preferences routes).

**Outgoing:**
- None detected (no outbound webhook emitters or third-party callback clients in `src/**`).

---

*Integration audit: 2026-04-12*
