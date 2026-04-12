---
phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug
plan: 01
subsystem: ui
tags: [css-variables, responsive-layout, ui-contract, vitest]
requires:
  - phase: 05-compare-save-share
    provides: compare/save 基础交互与公共页面结构
provides:
  - 春日主题下的全局卡片骨架与统一交互动效基线
  - 首页空状态文案与 UI-SPEC 对齐并具备自动化防回退断言
affects: [06-02, 06-03, homepage, design-system]
tech-stack:
  added: []
  patterns: [deal-card-shell 三段式骨架, 180ms 统一过渡节奏]
key-files:
  created: []
  modified:
    - src/styles/globals.css
    - src/app/page.tsx
    - tests/design-contract.test.ts
    - tests/app-shell.test.ts
key-decisions:
  - "新增 .deal-card-shell 作为 header/body/footer 的统一容器契约，锁定 320px 最小高度。"
  - "交互反馈统一为 180ms transform/box-shadow/background-color 过渡，避免长时动画。"
patterns-established:
  - "Pattern 1: 首页文案合同必须由测试断言覆盖，防止视觉重构时回退。"
  - "Pattern 2: 卡片与关键交互控件共享同一过渡节奏，保证跨页面一致性。"
requirements-completed: [PREF-03]
duration: 2 min
completed: 2026-04-12
---

# Phase 6 Plan 01: 固化春日 token、全局骨架与首页文案合同 Summary

**全局样式新增三段式卡片骨架与统一交互动效，并将首页空状态文案升级为 UI-SPEC 合同文本且加入测试防回退。**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-12T02:10:19Z
- **Completed:** 2026-04-12T02:12:02Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- 在 `globals.css` 建立 `.deal-card-shell` 统一骨架（header/body/footer）并锁定 `grid-template-rows: auto 1fr auto` 与 `min-height: 320px`。
- 统一卡片、按钮、导航项的 hover/focus 过渡为 `180ms` 节奏，满足“中高强度但非长动画”的动效约束。
- 首页空态文案切换到 UI-SPEC 指定文本，并在 `design-contract` 与 `app-shell` 测试加入断言。

## Task Commits

Each task was committed atomically:

1. **Task 1: 固化春日 token 与全局骨架样式基线** - `9e27265` (feat)
2. **Task 2: 同步首页春日表达与空态文案合同** - `300e362` (feat)

## Files Created/Modified
- `src/styles/globals.css` - 新增 `.deal-card-shell` 三段式骨架与统一交互动效规则。
- `src/app/page.tsx` - 空状态正文文案更新为 UI-SPEC 合同文本。
- `tests/design-contract.test.ts` - 增加首页空态文案合同断言。
- `tests/app-shell.test.ts` - 增加公共首页关键壳子与空态文案存在断言。

## Decisions Made
- 使用全局 CSS 类契约（`.deal-card-shell*`）而非页面内联样式，确保后续 06-02/06-03 可复用。
- 将空态合同文案放入测试层做静态断言，优先保证“Trust”约束下的信息稳定性。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
已具备统一的壳子/动效/文案合同，06-02 可直接在该基线上推进发现流与比较区卡片统一。

## Self-Check: PASSED
- Summary file exists at target output path.
- Task commits `9e27265` and `300e362` exist in git history.

---
*Phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug*
*Completed: 2026-04-12*
