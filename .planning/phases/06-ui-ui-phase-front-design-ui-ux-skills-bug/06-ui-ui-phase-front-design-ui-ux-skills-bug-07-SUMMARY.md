---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 07
subsystem: ui
tags: [spring-atmosphere, hero-carousel, deal-card, css, vitest]
requires:
  - phase: 06-06
    provides: 首页可控轮换卡片与详情/admin 防高窄基线
provides:
  - 首页容器与 Hero 轮换区域的轻量春日氛围层
  - 发现流卡片统一虚化装饰层与交互层级保护
  - 氛围层与防高窄不回退的源码级合同测试
affects: [home-page, deal-card, visual-regression, uat-gap-closure]
tech-stack:
  added: []
  patterns: [pointer-events-none-decor-layer, z-index-content-priority, reduced-motion-respect]
key-files:
  created: []
  modified:
    - src/app/page.tsx
    - src/components/home/HeroDealCarousel.tsx
    - src/components/deals/DealCard.tsx
    - src/styles/globals.css
    - tests/app-shell.test.ts
    - tests/design-contract.test.ts
    - tests/deal-detail.test.ts
key-decisions:
  - "氛围层统一走 CSS 渐变/纹理方案，不引入重型库与实时大范围 blur。"
  - "装饰层必须 pointer-events: none 且位于低层，价格/时效/CTA/轮播控制保持更高 z-index。"
patterns-established:
  - "Atmosphere Layer Pattern: 容器层负责 decor，内容层统一 z-index:2 保证可读可点"
  - "Regression Guard Pattern: 通过源码合同测试锁定氛围 class 与防高窄关键约束"
requirements-completed: [PREF-03]
duration: 9min
completed: 2026-04-12
---

# Phase 06 Plan 07: Atmosphere Gap Closure Summary

**首页与发现卡片新增轻量春日虚化氛围层，并通过合同测试确保关键决策信息始终可读可点且防高窄布局不回退。**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-12T12:12:00Z
- **Completed:** 2026-04-12T12:21:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- 首页主容器与 Hero 轮换区接入 `spring-atmosphere` / `hero-carousel--atmosphere` 语义化氛围层。
- 发现流 `DealCard` 接入 `deal-card--atmosphere` 装饰层，同时保持信息骨架与 CTA 路径不变。
- 增强源码级回归测试，覆盖氛围层存在、reduced-motion 合同、详情页防三列回退约束。

## Task Commits

1. **Task 1: 在首页背景与 Hero 区引入轻量虚化图案/图片氛围层（不遮挡决策信息）** - `19fd012` (feat)
2. **Task 2: 为发现流卡片加入统一虚化装饰层并建立“防高窄不回退”联合回归** - `4108b47` (feat)

## Files Created/Modified
- `src/app/page.tsx` - 首页容器绑定 `spring-atmosphere`。
- `src/components/home/HeroDealCarousel.tsx` - Hero 轮换区加入氛围层容器。
- `src/components/deals/DealCard.tsx` - 发现卡片接入装饰层 class 与无障碍隐藏层。
- `src/styles/globals.css` - 氛围层视觉样式、层级保护、375px 溢出保护与 reduced-motion 兼容。
- `tests/app-shell.test.ts` - 首页氛围层与轮换可访问文案合同断言。
- `tests/design-contract.test.ts` - 氛围层 class、轻量动效、reduced-motion 合同断言。
- `tests/deal-detail.test.ts` - 详情页防三列回退断言。

## Decisions Made
- 统一 180ms 节奏用于轮换轨道过渡契约，符合本轮动效约束并降低干扰。
- 装饰层全部非交互化（`pointer-events: none`）并固定低层渲染，确保 CTA 与控制按钮永远优先。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 06-HUMAN-UAT 的 GAP-01（氛围不足）已具备可验证实现与自动化防回退护栏。
- 可进入下一阶段体验精修或内容运营效率优化。

## Self-Check: PASSED
- FOUND: `.planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-07-SUMMARY.md`
- FOUND: `19fd012`
- FOUND: `4108b47`
