---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 08
subsystem: ui
tags: [deal-card, atmosphere, avif, readability, reduced-motion]
requires:
  - phase: 06-07
    provides: 首页/卡片氛围层基线与防高窄回归护栏
provides:
  - 机票卡片按语境接入本地樱花/寺庙虚化背景图
  - 场景层遮罩与层级保护，确保价格/时效/CTA 可读可点
  - 场景层 a11y 与 reduced-motion 合同测试防回退
affects: [deal-card, home-feed, visual-regression, uat-gap-closure]
tech-stack:
  added: []
  patterns: [local-avif-atmosphere, scenic-overlay-contrast, decorative-layer-noninteractive]
key-files:
  created:
    - public/images/atmosphere/sakura-blur.avif
    - public/images/atmosphere/temple-blur.avif
  modified:
    - src/components/deals/DealCard.tsx
    - src/styles/globals.css
    - tests/design-contract.test.ts
    - tests/app-shell.test.ts
key-decisions:
  - "场景图采用本地轻量 AVIF 并通过 loading=lazy + decoding=async 渐进加载，不引入重型视觉库。"
  - "装饰层统一 pointer-events:none 且内容层保持 z-index:2，以保障价格/时效/CTA 交互优先级。"
patterns-established:
  - "Scenic Mapping Pattern: 根据 destination/title 关键词在 DealCard 选择 sakura/temple 背景图"
  - "Readability Guard Pattern: scene-layer + scene-overlay 双层并配合合同测试锁定可读性"
requirements-completed: [PREF-03]
duration: 5min
completed: 2026-04-12
---

# Phase 06 Plan 08: Scenic Atmosphere Gap Closure Summary

**DealCard 增加语境化樱花/寺庙虚化背景图与对比度遮罩，在移动端和桌面端保持价格、时效与 CTA 的可读可点。**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-12T04:32:57Z
- **Completed:** 2026-04-12T04:37:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- 新增本地轻量场景资源 `sakura-blur.avif` 与 `temple-blur.avif`，并完成 DealCard 场景映射接线。
- DealCard 接入 `deal-card--scenic`、`deal-card__scene-layer`、`deal-card__scene-overlay`，确保装饰层非交互且信息层优先。
- 扩展源码合同测试，锁定场景层 class/a11y/reduced-motion 与既有通过项（轮换卡片、详情/admin 防高窄）不回退。

## Task Commits

Each task was committed atomically:

1. **Task 1: 接入本地轻量场景虚化资源并建立卡片场景映射** - `08e35e8` (feat)
2. **Task 2: 强化遮罩对比度与源码级防回退断言（含已通过项守护）** - `e8f6224` (feat)

## Files Created/Modified
- `public/images/atmosphere/sakura-blur.avif` - 春日樱花语境虚化背景资源。
- `public/images/atmosphere/temple-blur.avif` - 文化旅行语境虚化背景资源。
- `src/components/deals/DealCard.tsx` - 场景图映射、装饰层语义与渐进加载属性。
- `src/styles/globals.css` - scenic 层/遮罩层样式、pointer-events 保护与 reduced-motion 兼容。
- `tests/design-contract.test.ts` - 场景层 class/a11y/资源路径/动效合同断言。
- `tests/app-shell.test.ts` - 卡片场景层非交互与内容层 z-index 防回退断言。

## Decisions Made
- 场景图不走运行时滤镜，采用静态预虚化 AVIF 控制体积与性能稳定性。
- 通过 overlay 渐变而非提升文本描边处理对比度，减少视觉噪声并保持春日风格一致。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 06-HUMAN-UAT 的场景化氛围 gap 已闭环，可直接进行终验。
- 现有轮换卡片与详情/admin 防高窄合同继续有效。

## Self-Check: PASSED
- FOUND: `.planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-08-SUMMARY.md`
- FOUND: `08e35e8`
- FOUND: `e8f6224`
