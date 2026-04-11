---
phase: 01-foundation-deal-cms
plan: 04
subsystem: auth
tags: [nextjs, middleware, basic-auth, vitest, uat]
requires:
  - phase: 01-02
    provides: Deal CMS CRUD pages and admin routes
  - phase: 01-03
    provides: Public feed delivery without changing admin gate contract
provides:
  - middleware admin gate now returns consistent 401 Basic challenge even under misconfiguration
  - startup env precheck blocks missing ADMIN_GATE credentials before dev/UAT
  - regression tests cover both challenge contract and positive credential pass-through paths
affects: [uat, admin, middleware, local-dev]
tech-stack:
  added: []
  patterns: [challenge-first admin gate, preflight env validation for local startup]
key-files:
  created:
    - scripts/check-admin-gate-env.mjs
    - tests/admin-gate-auth-success.test.ts
  modified:
    - src/middleware.ts
    - tests/admin-gate.test.ts
    - package.json
    - .planning/phases/01-foundation-deal-cms/01-UAT.md
key-decisions:
  - "Keep Phase 1 admin access as Basic Auth gate only; do not introduce session/cookie login."
  - "On missing admin gate env, keep 401 challenge contract and add observability marker instead of 503."
patterns-established:
  - "Admin gate misconfiguration still challenges: 401 + WWW-Authenticate + x-admin-gate-misconfigured"
  - "dev script must run check:admin-gate-env before Next startup"
requirements-completed: [OPS-01, PREF-03]
duration: 3min
completed: 2026-04-12
---

# Phase 01 Plan 04: Admin Gate Gap Closure Summary

**Admin Basic gate contract was restored for `/admin/deals` and `/admin/deals/{id}` by unifying 401 challenge behavior, adding startup env precheck, and codifying UAT replay steps.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-11T17:00:14Z
- **Completed:** 2026-04-11T17:03:17Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Replaced misconfigured-env 503 branch in middleware with stable 401 Basic challenge and observability marker.
- Added executable preflight script and wired `npm run dev` to validate `ADMIN_GATE_*` before startup.
- Updated UAT contract with explicit Basic gate expectations and deterministic re-verification commands.

## Task Commits

1. **Task 1: 修复 middleware 缺失配置分支，保持 Basic gate 契约** - `9ddc01c` (test, RED)
2. **Task 1: 修复 middleware 缺失配置分支，保持 Basic gate 契约** - `4b13541` (feat, GREEN)
3. **Task 2: 增加 admin gate 启动前预检并接入 npm 脚本** - `7f0d757` (test, RED)
4. **Task 2: 增加 admin gate 启动前预检并接入 npm 脚本** - `77c7cd6` (feat, GREEN)
5. **Task 3: 更新 Phase 1 UAT 操作契约与复验命令** - `4fe3192` (docs)

## Files Created/Modified
- `src/middleware.ts` - 缺失配置时保持 401 challenge，并暴露 `x-admin-gate-misconfigured`。
- `tests/admin-gate.test.ts` - 覆盖 challenge 契约、缺失配置可观测性、precheck 脚本行为与 npm 脚本串联。
- `tests/admin-gate-auth-success.test.ts` - 验证正确 Basic 凭证可放行 `/admin/deals` 与 `/admin/deals/{id}`。
- `scripts/check-admin-gate-env.mjs` - 启动前检查 `ADMIN_GATE_USERNAME/ADMIN_GATE_PASSWORD` 非空。
- `package.json` - 新增 `check:admin-gate-env`，并将 `dev` 串联为“预检后启动”。
- `.planning/phases/01-foundation-deal-cms/01-UAT.md` - 增补 admin 访问契约与复验步骤。

## Decisions Made
- 保持 D-02/D-03 既定方向：继续 Basic gate，不新增应用内登录体系。
- 将“配置缺失”视为可观测性问题而非协议变更：契约统一返回 401 challenge。

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] 新增 `scripts/` 目录以承载预检脚本**
- **Found during:** Task 2
- **Issue:** 目标脚本路径 `scripts/check-admin-gate-env.mjs` 的父目录不存在，阻塞实现。
- **Fix:** 创建 `scripts/` 目录后再写入预检脚本。
- **Files modified:** `scripts/check-admin-gate-env.mjs`
- **Verification:** `ADMIN_GATE_USERNAME=uat ADMIN_GATE_PASSWORD=secret node scripts/check-admin-gate-env.mjs`
- **Committed in:** `77c7cd6`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** 偏差仅用于消除落地阻塞，未引入额外范围。

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UAT Test 3/4 的同源阻塞已被工程化约束（challenge 契约 + 启动前校验 + 回归测试）。
- 可直接进入 phase-level verify，确认 gap closure 后更新 roadmap/state。

## Auth Gates
None.

---
*Phase: 01-foundation-deal-cms*
*Completed: 2026-04-12*

## Self-Check: PASSED
