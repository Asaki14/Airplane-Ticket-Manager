---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 02
subsystem: ui
tags: [deal-card, compare-panel, information-density, accessibility, css]
requires:
  - phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug-01
    provides: 春日 token、全局骨架与交互动效基线
provides:
  - 发现流 DealCard 三段骨架与 2 行摘要截断，控制不同文案长度下的高度波动
  - 比较/收藏区 compare-card-shell 统一骨架、字段顺序与 destructive 操作语义
affects: [06-03, discovery-feed, compare-save, ui-consistency]
tech-stack:
  added: []
  patterns: [header/body/footer card shell, min-height consistency, line clamp summary, aria-label destructive actions]
key-files:
  created: []
  modified:
    - src/components/deals/DealCard.tsx
    - src/components/deals/CompareAndSavePanel.tsx
    - src/styles/globals.css
key-decisions:
  - "DealCard 与 compare 卡统一为三段式骨架并固定最小高度 320px，优先稳定信息阅读节奏。"
  - "危险操作按钮保留原文案语义并补充 aria-label，降低误操作风险。"
patterns-established:
  - "Pattern 1: 决策主字段在 body 固定顺序展示，CTA 固定在 footer。"
  - "Pattern 2: 可变长文案统一使用 2 行摘要截断，避免卡片高度失控。"
requirements-completed: [PREF-03]
duration: 5 min
completed: 2026-04-12
---

# Phase 6 Plan 02: 统一发现流与比较区卡片结构和信息密度 Summary

**发现流与比较区卡片已统一为三段骨架与一致最小高度，并通过文本截断与语义化操作标签修复“卡片高低不齐 + 误触达风险”。**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-12T02:13:00Z
- **Completed:** 2026-04-12T02:17:52Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- DealCard 重构为 `deal-card-shell__header/body/footer`，主价格与参考总成本、价值分和 freshness 信息按决策优先布局。
- 为标题、航旅窗口、航司、航线信息接入 2 行截断规则，显著降低长文案造成的卡片高度跳变。
- CompareAndSavePanel 的动作卡与比较列统一接入 `compare-card-shell`，字段顺序固定为价格→总成本→行李→退改→经停→价值分。
- `取消收藏` 与 `移出比较` 操作补充 destructive 语义 `aria-label`，保持 UI-SPEC 文案语义一致。

## Task Commits

Each task was committed atomically:

1. **Task 1: 重构发现流 DealCard 为统一三段骨架与摘要策略** - `6c81fd8` (feat)
2. **Task 2: 统一比较/收藏区卡片骨架与交互文案** - `f7598d3` (feat)

## Files Created/Modified
- `src/components/deals/DealCard.tsx` - 改为三段骨架结构，新增标题/路由/meta 的摘要截断类绑定。
- `src/components/deals/CompareAndSavePanel.tsx` - 动作卡与比较卡统一骨架，补充 destructive 行为 aria-label。
- `src/styles/globals.css` - 新增 `text-clamp-2` 与 `compare-card-shell*` 规则，并统一 compare 卡圆角与边框值（14px / `#cdd8d1`）。

## Decisions Made
- 使用共享 shell 模式（DealCard 与 CompareCard 同构）替代分散卡片结构，降低后续 UI 改造成本。
- 通过“视觉文案不变 + aria-label 强语义”方式落实 threat model 中 T-06-04 的误操作缓解。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
06-03 可在统一卡片骨架上继续重排详情页单列/双列结构，并复用摘要策略处理长票规文本。

## Self-Check: PASSED
- FOUND: `.planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-02-SUMMARY.md`
- FOUND: `6c81fd8`
- FOUND: `f7598d3`

---
*Phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug*
*Completed: 2026-04-12*
