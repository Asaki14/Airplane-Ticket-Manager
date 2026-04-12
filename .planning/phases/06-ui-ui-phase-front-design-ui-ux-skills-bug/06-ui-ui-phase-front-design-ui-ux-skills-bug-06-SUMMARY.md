---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 06
subsystem: ui
tags: [nextjs, homepage, carousel, accessibility, css, vitest]
requires:
  - phase: 06-05
    provides: 详情页与后台布局稳定基线
provides:
  - 首页 Hero 轮换卡片（自动播放、暂停/继续、上一张/下一张、页码指示）
  - Aurora/Atmospheric 氛围层级样式与 180ms 统一交互节奏
  - reduced-motion 与轮播样式合同测试
affects: [home-feed, design-contract, app-shell]
tech-stack:
  added: []
  patterns: [首页前5条 deal 轻量轮播, prefers-reduced-motion 默认暂停, 样式合同断言防回退]
key-files:
  created: [src/components/home/HeroDealCarousel.tsx]
  modified: [src/app/page.tsx, src/styles/globals.css, tests/app-shell.test.ts, tests/design-contract.test.ts]
key-decisions:
  - "首页轮换复用现有 mapPublicFeedResponse 结果，不新增数据源与依赖"
  - "动效节奏统一 180ms，轮播位移过渡 280ms 并在 reduced-motion 下禁用"
patterns-established:
  - "主页氛围增强采用背景层/内容层/交互层三级结构，保证决策信息优先可读"
  - "交互增强必须同步补充源码级合同测试（组件接入 + 样式约束）"
requirements-completed: [PREF-03]
duration: 9min
completed: 2026-04-12
---

# Phase 06 Plan 06: Homepage Atmosphere Carousel Summary

**首页上线了可控自动轮播卡片与克制渐变氛围层级，在保持“查看详情与票规”决策路径不变的前提下提升首屏质感与可访问性。**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-12T03:34:40Z
- **Completed:** 2026-04-12T03:42:40Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- 新增 `HeroDealCarousel` 客户端组件，支持自动轮播（4500ms）、上一张/下一张、暂停/继续、页码指示与 `aria-current`。
- 首页 `public-hero` 下接入轮换组件，复用首页前 5 条 deal 数据，不改变既有筛选、列表和 CTA 语义。
- 新增 `hero-carousel` 系列样式与 reduced-motion 保护，并在测试中锁定组件/样式关键合同，支持后续回归。

## Task Commits

1. **Task 1: 实现首页轮换卡片组件（可访问 + 移动端适配 + 自动播放可控）** - `581436a` (feat)
2. **Task 2: 强化首页底色与布局层级，并锁定动效一致性回归测试** - `b07d37f` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `src/components/home/HeroDealCarousel.tsx` - 首页轮换卡片核心交互与 a11y 语义。
- `src/app/page.tsx` - 接入 HeroDealCarousel 到首页 Hero 区域后。
- `src/styles/globals.css` - 新增轮换卡片层级、控件、动效与 reduced-motion 样式。
- `tests/app-shell.test.ts` - 增加轮换组件接入与文案/a11y 合同断言。
- `tests/design-contract.test.ts` - 增加轮换样式类、reduced-motion、过渡节奏断言。

## Decisions Made
- 轮换组件只消费已有首页数据流（`deals.slice(0, 5)`），避免扩大数据边界与复杂度。
- 自动播放遵循可访问性优先：系统偏好 reduced-motion 时默认暂停，并保留手动控制。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- 工作区存在大量与本计划无关的已修改/未跟踪文件，本次提交仅按任务文件精确暂存并原子提交。

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 首页视觉氛围与交互质感 gap 已完成代码闭环，具备自动化回归保护。
- 可进入下一轮 UAT 验证“氛围感不足”是否关闭。

## Self-Check: PASSED

- FOUND: .planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-06-SUMMARY.md
- FOUND: 581436a
- FOUND: b07d37f

---
*Phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug*
*Completed: 2026-04-12*
