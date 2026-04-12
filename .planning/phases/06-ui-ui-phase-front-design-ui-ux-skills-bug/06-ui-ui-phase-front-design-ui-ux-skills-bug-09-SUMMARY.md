---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 09
subsystem: ui
tags: [deal-card, detail-hero, scenic-map, avif, readability]
requires:
  - phase: 06-08
    provides: 首页卡片场景化层级与非交互装饰层合同
provides:
  - 四路目的地场景图映射（首尔/曼谷/香港/大阪）与默认回退策略
  - 首页 DealCard 与详情页 Hero 统一消费共享场景映射函数
  - 详情页场景层/遮罩层/内容层级保护与源码级防回退断言
affects: [home-feed, deal-detail, visual-regression, uat-gap-closure]
tech-stack:
  added: []
  patterns: [shared-scenic-mapping, scenic-layer-readability-guard, noninteractive-decorative-layer]
key-files:
  created:
    - public/images/atmosphere/seoul-palace-blur.avif
    - public/images/atmosphere/bangkok-market-blur.avif
    - public/images/atmosphere/hongkong-harbor-blur.avif
    - public/images/atmosphere/osaka-castle-blur.avif
    - src/lib/deals/scene-image-map.ts
    - tests/deal-scenic-map.test.ts
  modified:
    - src/components/deals/DealCard.tsx
    - src/app/deals/[id]/page.tsx
    - src/styles/globals.css
    - tests/deal-detail.test.ts
    - tests/design-contract.test.ts
key-decisions:
  - "场景映射合同收敛到 src/lib/deals/scene-image-map.ts，首页与详情页均只消费 pickSceneImageByDeal。"
  - "详情 Hero 场景层强制 pointer-events:none + overlay + content z-index 分层，保障 CTA 与文本可读可点。"
patterns-established:
  - "Shared Scenic Contract: 目的地场景映射由单模块统一管理并提供默认回退"
  - "Detail Hero Readability Guard: scene-layer + scene-overlay + content 三层结构"
requirements-completed: [PREF-03]
duration: 5min
completed: 2026-04-12
---

# Phase 06 Plan 09: Four-Route Scenic Mapping Summary

**首页 DealCard 与详情页 Hero 同步接入四路目的地场景虚化映射，且通过层级与遮罩保护确保关键信息与 CTA 可读可点。**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-12T04:50:12Z
- **Completed:** 2026-04-12T04:54:30Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- 新增首尔、曼谷、香港、大阪四张本地轻量 AVIF 场景资源，并建立统一映射与默认回退策略。
- 首页 `DealCard` 移除原双路硬编码，改为消费共享 `pickSceneImageByDeal`，满足四路精确映射。
- 详情页 Hero 新增 `detail-hero--scenic`、`detail-hero__scene-layer`、`detail-hero__scene-overlay`、`detail-hero__content`，并补齐测试合同防回退。

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立四路场景映射合同与本地轻量资源** - `8d207e3` (feat)
2. **Task 2: 接线首页卡片与详情页 hero 场景层并加可读性保护** - `c2bb9dc` (feat)

## Files Created/Modified
- `public/images/atmosphere/seoul-palace-blur.avif` - 首尔场景轻量背景图。
- `public/images/atmosphere/bangkok-market-blur.avif` - 曼谷场景轻量背景图。
- `public/images/atmosphere/hongkong-harbor-blur.avif` - 香港场景轻量背景图。
- `public/images/atmosphere/osaka-castle-blur.avif` - 大阪场景轻量背景图。
- `src/lib/deals/scene-image-map.ts` - 四路映射与默认回退合同。
- `tests/deal-scenic-map.test.ts` - 四路映射与回退行为自动化断言。
- `src/components/deals/DealCard.tsx` - 卡片消费共享映射函数，保留场景层 a11y/性能属性。
- `src/app/deals/[id]/page.tsx` - 详情 Hero 场景层接线与内容保护层结构。
- `src/styles/globals.css` - 详情 Hero 场景层/遮罩层/内容层级样式。
- `tests/deal-detail.test.ts` - 详情页场景接线与 class 合同断言。
- `tests/design-contract.test.ts` - 卡片与详情页场景合同、pointer-events 与可读性防回退断言。

## Decisions Made
- 首页与详情页不再分别维护映射逻辑，统一由 `scene-image-map.ts` 输出，以免合同漂移。
- 场景层全部保持非交互（`pointer-events:none`），并通过内容层 `z-index` 隔离交互与阅读优先级。

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] 测试路径别名在 vitest 环境无法解析**
- **Found during:** Task 1 (TDD RED)
- **Issue:** `tests/deal-scenic-map.test.ts` 使用 `@/` 导入触发模块解析失败，导致无法进入映射行为断言。
- **Fix:** 调整为相对路径导入，恢复测试可执行性。
- **Files modified:** `tests/deal-scenic-map.test.ts`
- **Verification:** `npm test -- tests/deal-scenic-map.test.ts`
- **Committed in:** `8d207e3`

**2. [Rule 3 - Blocking] 初版生成的场景文件格式与 avif 扩展名不一致**
- **Found during:** Task 1 implementation
- **Issue:** 首次自动生成资源时内容格式不符合 AVIF 预期，存在浏览器解码风险。
- **Fix:** 使用本地图像工具重新生成真实 AVIF 轻量资源并覆盖四个文件。
- **Files modified:** `public/images/atmosphere/seoul-palace-blur.avif`, `public/images/atmosphere/bangkok-market-blur.avif`, `public/images/atmosphere/hongkong-harbor-blur.avif`, `public/images/atmosphere/osaka-castle-blur.avif`
- **Verification:** 四路映射测试与联合回归测试全通过
- **Committed in:** `8d207e3`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** 均为执行阻塞修复，不改变计划范围与目标。

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 主公终验提到的“卡片与详情页场景化覆盖 + 四路映射精度”已闭环。
- 06-06~06-08 已通过项（轮换卡片、详情/admin 防高窄）在联合测试中未回退。

## Self-Check: PASSED
- FOUND: `.planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-09-SUMMARY.md`
- FOUND: `8d207e3`
- FOUND: `c2bb9dc`
