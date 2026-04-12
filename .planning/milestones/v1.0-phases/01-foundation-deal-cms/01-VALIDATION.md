---
phase: 01
slug: foundation-deal-cms
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-11
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm run test:quick` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:quick`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | PREF-03 | T-01-01 | `/admin` 入口受轻量守门保护 | integration | `npm run test:quick -- admin-gate` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 1 | PREF-03 | T-01-02 | 响应式壳子在 mobile/desktop 可渲染 | component | `npm run test:quick -- app-shell` | ✅ | ⬜ pending |
| 01-02-01 | 02 | 2 | OPS-01 | T-01-03 | Deal CRUD 字段验证阻止非法输入 | integration | `npm run test:quick -- deal-crud` | ✅ | ⬜ pending |
| 01-02-02 | 02 | 2 | OPS-01 | T-01-04 | lifecycle 仅允许 draft/published/expired | unit | `npm run test:quick -- deal-status` | ✅ | ⬜ pending |
| 01-02-03 | 02 | 2 | OPS-01 | T-01-05 | schema 迁移先于验证执行 | migration | `CI=true PAYLOAD_MIGRATING=true npx payload migrate` | ✅ | ⬜ pending |
| 01-03-01 | 03 | 3 | OPS-02 | T-01-06 | 过期记录不进入 public feed | integration | `npm run test:quick -- feed-expiry` | ✅ | ⬜ pending |
| 01-03-02 | 03 | 3 | PREF-03 | T-01-07 | 卡片展示 freshness 顺序固定 | component | `npm run test:quick -- freshness-order` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/admin` 视觉语气更克制、public 更 travel 氛围 | PREF-03 | 视觉语气是主观体验，需要人眼确认 | 启动本地站点，对比 `/` 与 `/admin` 的背景/装饰/密度是否符合 UI-SPEC |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
