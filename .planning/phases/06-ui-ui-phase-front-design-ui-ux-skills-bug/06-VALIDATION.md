---
phase: 6
slug: ui-ui-phase-front-design-ui-ux-skills-bug
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | PREF-03 | T-06-01 | focus ring 与可读性对比度保持 | unit | `npm test -- tests/design-contract.test.ts` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | PREF-03 | T-06-03 | 动效时长受控，不引入长动画 | unit | `npm run lint` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 2 | PREF-03 | T-06-01 | 发现卡决策信息优先且结构统一 | unit | `npm test -- tests/deal-card-pricing.test.ts` | ✅ | ⬜ pending |
| 06-02-02 | 02 | 2 | PREF-03 | T-06-02 | 比较卡 CTA 可达且文案符合 UI 合同 | unit | `npm test -- tests/preference-and-compare.test.ts` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 2 | PREF-03 | T-06-01 | 详情页双列重排可读，票规短卡可控 | unit | `npm test -- tests/deal-detail.test.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 春日视觉氛围与整体和谐度 | PREF-03 | 设计审美需人工判断 | 启动 `npm run dev`，检查首页 Hero、卡片、按钮在移动端与桌面端的整体一致性与春日气质 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
