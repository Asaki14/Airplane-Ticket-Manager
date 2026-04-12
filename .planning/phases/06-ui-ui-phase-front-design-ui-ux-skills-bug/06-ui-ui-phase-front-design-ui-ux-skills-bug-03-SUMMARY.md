---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 03
subsystem: ui
tags: [detail-page, responsive-layout, rule-card, css-grid, vitest]

# Dependency graph
requires:
  - phase: 06-01
    provides: 春日视觉 token 与全局样式基线
  - phase: 06-02
    provides: 统一卡片骨架与断言策略
provides:
  - 详情页从三列改为移动单列/桌面双列分组布局
  - 票规区短卡化与可控折叠，长文默认摘要展示
  - 防回退测试覆盖布局变体与外链安全属性
affects: [phase-06-verification, detail-readability, trust-surface]

# Tech tracking
tech-stack:
  added: []
  patterns: [detail-grid--primary/detail-grid--rules 分组布局, rule-card + details 折叠模式]

key-files:
  created: []
  modified:
    - src/app/deals/[id]/page.tsx
    - src/styles/globals.css
    - tests/deal-detail.test.ts
    - tests/design-contract.test.ts

key-decisions:
  - "详情页断点策略固定为移动单列、1024+ 双列分组，禁止回退三列"
  - "票规长文本默认三行摘要，仅在用户展开时呈现完整内容"

patterns-established:
  - "Pattern: 详情页分组网格使用变体类，而非复用通用三列规则"
  - "Pattern: 安全关键外链属性通过源码测试防回退"

requirements-completed: [PREF-03]

# Metrics
duration: 2 min
completed: 2026-04-12
---

# Phase 6 Plan 3: 详情页布局修复与票规折叠 Summary

**详情页完成分组双列重排与票规短卡折叠，用户可在移动端单列和桌面端双列下快速读取来源时效、票规与价值解释。**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-12T02:20:56Z
- **Completed:** 2026-04-12T02:23:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- 修复详情页高窄卡片根因：去除详情场景三列生效路径，改为两组双列变体。
- 票规区落地短卡化与 `<details>` 折叠，默认展示摘要，按需展开完整规则。
- 回归测试补齐布局变体、折叠文案与外链安全属性断言，降低回退风险。

## Task Commits

Each task was committed atomically:

1. **Task 1: 重排详情页信息分组为单列/双列并修复高窄问题** - `6b4fb70` (fix)
2. **Task 2: 票规短卡化与折叠策略落地并补齐测试** - `819b2ea` (feat)

## Files Created/Modified
- `src/app/deals/[id]/page.tsx` - 引入 `detail-grid--primary`/`detail-grid--rules` 与规则折叠结构。
- `src/styles/globals.css` - 新增详情卡统一骨架、三行摘要类与双列断点规则。
- `tests/deal-detail.test.ts` - 增加折叠文案、details 结构、外链属性断言。
- `tests/design-contract.test.ts` - 增加详情页新布局变体类断言。

## Decisions Made
- 使用详情页专用 grid 变体类隔离布局规则，避免复用全局 `detail-grid` 造成三列回归。
- 对长票规采用“先摘要后展开”的信息优先级，确保关键决策信息先可见。

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] 补充外链安全属性防回退断言**
- **Found during:** Task 2 (票规短卡化与折叠策略落地并补齐测试)
- **Issue:** threat model 要求防止 `target="_blank"` + `rel="noreferrer"` 回退，但任务原始测试未覆盖。
- **Fix:** 在 `tests/deal-detail.test.ts` 新增对外链属性的源码断言。
- **Files modified:** `tests/deal-detail.test.ts`
- **Verification:** `npm test -- tests/deal-detail.test.ts tests/design-contract.test.ts` 通过。
- **Committed in:** `819b2ea`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** 偏差仅用于补齐安全缓解要求，无范围蔓延。

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 06-03 目标已达成，可进入本 phase 汇总验证。
- 当前变更仅触及详情页表现层与测试，不影响业务数据合约。

## Self-Check: PASSED

- FOUND: `.planning/phases/06-ui-ui-phase-front-design-ui-ux-skills-bug/06-ui-ui-phase-front-design-ui-ux-skills-bug-03-SUMMARY.md`
- FOUND: `6b4fb70`
- FOUND: `819b2ea`

---
*Phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug*
*Completed: 2026-04-12*
