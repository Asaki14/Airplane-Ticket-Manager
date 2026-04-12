# Phase 6: UI 全面优化与显示修复 - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

在不新增产品能力的前提下，全面优化现有网页 UI 表现：统一卡片尺寸与视觉体系、修复详情页高窄显示问题、提升整体布局美观与一致性，并建立春天旅行氛围的视觉语言。该阶段仅优化现有发现页/详情页/比较模块体验，不扩展新功能范围。

</domain>

<decisions>
## Implementation Decisions

### 卡片统一体系
- **D-01:** 首页发现流卡片采用「统一最小高度 + 摘要截断」策略，避免不同内容长度导致卡片高度不一致。
- **D-02:** 列表卡、对比卡、详情信息卡统一采用「头部-主体-底部」三段式骨架，保证跨页面结构一致。

### 详情页布局修复
- **D-03:** 详情页主布局采用「移动端单列、桌面端双列 + 内容分组重排」，替代现状 3 列布局以修复卡片高窄问题。
- **D-04:** 票规翻译采用「多个短卡 + 决策关键信息优先」展示，长文本使用摘要/折叠策略，避免单卡过高。

### 春日视觉语言
- **D-05:** 视觉强度锁定为「轻春日（清新克制）」：低饱和春色、柔和背景层次，优先保证信息可读性。
- **D-06:** 春日元素覆盖范围包括：页面背景与 Hero 区、卡片边框与标签、按钮与交互态、轻量装饰图形。

### 信息密度与交互节奏
- **D-07:** 列表卡采用「决策优先」信息密度：默认展示价格/时效/航司/时间窗口/价值分，次要信息折叠到详情或展开态。
- **D-08:** 动效策略采用「中高强度」：包含页面入场、分区渐入、卡片与按钮反馈等丰富动效，但不使用重视差或长时动画。

### the agent's Discretion
- 统一卡片体系下的具体 token 数值（圆角、阴影层级、描边透明度、间距刻度）。
- 各断点的精确网格参数与内容重排细节（在满足双列/单列决策前提下）。
- 动效实现技术方案与降级策略细节（在中高强度边界内确保性能与可访问性）。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and product constraints
- `.planning/ROADMAP.md` — Phase 6 描述与依赖边界（仅 UI 优化与显示 bug 修复）。
- `.planning/PROJECT.md` — Core Value、mobile-first、Trust/Data freshness 等产品约束。
- `.planning/REQUIREMENTS.md` — 已完成的 v1 功能边界（本阶段不新增能力，仅优化呈现）。

### Existing architecture and UI patterns
- `.planning/codebase/ARCHITECTURE.md` — 页面/组件/样式层与集成路径。
- `.planning/codebase/STRUCTURE.md` — UI 相关目录与关键文件落点。
- `.planning/codebase/CONVENTIONS.md` — 样式与组件命名、布局与实现约定。

### Current risk and bug context
- `.planning/codebase/CONCERNS.md` — 已记录的展示与可用性风险，作为本阶段修复参考。

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/tokens.css`: 已有全局颜色、间距、字体 token，可扩展春日主题与卡片统一参数。
- `src/styles/globals.css`: 已集中管理 `public-shell`、`deal-card`、`detail-grid`、`compare-grid` 等核心布局与组件样式。
- `src/components/deals/DealCard.tsx`: 发现流卡片主组件，是尺寸统一和信息密度策略落地入口。
- `src/components/deals/CompareAndSavePanel.tsx`: 对比卡与交互按钮聚合区，可并入统一卡片骨架规范。
- `src/app/deals/[id]/page.tsx`: 详情页信息分区与票规展示入口，是高窄问题的核心修复点。

### Established Patterns
- 采用 mobile-first 响应式策略，断点集中在 `768px` 和 `1024px`。
- 样式采用 CSS 变量驱动，页面级 class 组合而非 CSS-in-JS。
- 公共页面大量使用「分区卡片 + 网格」结构，适合统一骨架体系。

### Integration Points
- 调整发现流卡片统一性：`src/components/deals/DealCard.tsx` + `src/styles/globals.css`。
- 调整详情页布局与票规短卡化：`src/app/deals/[id]/page.tsx` + `src/styles/globals.css`。
- 调整比较面板卡片一致性：`src/components/deals/CompareAndSavePanel.tsx` + `src/styles/globals.css`。
- 扩展春日视觉 token：`src/styles/tokens.css`，并在 hero/按钮/卡片状态中统一消费。

</code_context>

<specifics>
## Specific Ideas

- 目标气质是「春天旅行氛围，整体布局和谐优美」，但不牺牲信息决策效率。
- 用户明确痛点：当前卡片大小不一致；进入详情页后出现卡片高度很高、长度很窄。
- 强调本阶段是全面 UI 统一与美化，不是新增业务功能阶段。

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-ui-ui-phase-front-design-ui-ux-skills-bug*
*Context gathered: 2026-04-12*
