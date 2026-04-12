# Phase 06 Research — UI 全面优化与显示修复

**Date:** 2026-04-12  
**Scope:** 发现页/详情页/比较模块视觉统一、布局修复、春日氛围增强（不新增业务能力）

## Research Summary

- 当前项目已具备可扩展的 token + global CSS 架构（`src/styles/tokens.css`, `src/styles/globals.css`），可在不引入新依赖的前提下完成本 phase。  
- 详情页“高窄卡片”根因是 `@media (min-width: 1024px)` 下 `.detail-grid` 被固定为 `repeat(3, minmax(0, 1fr))`，与信息密度不匹配。  
- 卡片高度不一致主要来自：不同文本长度、无统一最小高度、缺少三段式容器与底部 CTA 锚定。

## Standard Stack (adopt)

- 保持 `Next.js + React + TypeScript + CSS variables` 现有栈。
- 不新增 UI 组件库（与 `06-UI-SPEC.md` 一致：component library = none）。
- 动效使用原生 CSS transition/transform/opacity（满足 D-08 的中高强度且可控）。

## Architecture Patterns (for planning)

1. **Token-first**：先补齐/锁定春日 token 与交互语义色，再由组件消费。  
2. **Shell consistency**：列表卡、比较卡、详情信息卡采用统一 `header/body/footer` 骨架类。  
3. **Breakpoint discipline**：移动端单列优先，桌面端在 `1024px` 进入双列分组，不回到三列。  
4. **Content control**：长文采用摘要/折叠（`line-clamp` 或 `<details>`）避免单卡无限拉伸。

## Don't Hand-Roll / Reuse First

- 复用现有：`DealCard.tsx`、`CompareAndSavePanel.tsx`、`src/app/deals/[id]/page.tsx`、`globals.css`。
- 不新建平行版本组件（避免“新旧两套 UI”并存）。
- 不改动数据层、API 合约与业务逻辑，仅做表现层/信息编排优化。

## Common Pitfalls

1. 只调颜色不调信息骨架，导致“看起来更花但决策效率更差”。
2. 用固定高度强压卡片，造成小屏内容裁断不可读。
3. 详情页仅改容器宽度，不重排信息组，问题会在长票规上复现。
4. 动效过重（长时长/大位移）造成可读性与性能下降。

## Verification Strategy Inputs

- 自动化命令沿用：`npm run lint`、`npm test`。
- 本 phase 重点断言：
  - 关键 class 与文案存在（防止回退到旧布局）
  - 详情页不再使用桌面三列 detail-grid
  - CTA/空状态/错误态文案与 UI-SPEC 合同一致

## Validation Architecture

### Trust Boundaries

- **用户输入 → UI 渲染层**：筛选/查询参数仍为不可信输入，UI 重构不得绕过既有过滤与展示规则。
- **外链跳转 → 第三方 OTA/航司页面**：保持 `target="_blank" + rel="noreferrer"`，避免 opener 风险。

### STRIDE Threats (UI-phase relevant)

- **T-06-01 (S/I)**：视觉重构误导“值得买”解释或时效信息层级，造成信任受损。  
  **Mitigation:** 固定 freshness 信息顺序与可见性；价值解释区保持明确标题与列表。  
- **T-06-02 (T)**：样式重构误删关键 CTA 或链接属性，影响购买路径安全与可达性。  
  **Mitigation:** 对 `查看详情与票规`、`去来源页继续购买` 文案与链接属性做自动化断言。  
- **T-06-03 (D)**：过重动画导致低端设备交互卡顿。  
  **Mitigation:** 限制动画时长与位移，避免重视差与长动画。

### Test Sampling Plan

- 每个任务后跑 `npm run lint`（快速反馈）
- 每个 plan 后跑 `npm test`（回归保障）
- 交付前执行一次 `npm run lint && npm test`
