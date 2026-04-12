---
status: resolved
trigger: "Investigate issue: default-departure-card-tall-narrow\n\n**Summary:** 点击首页“先按预算找低价”后，页面滚动到“我的默认出发地”区域时，卡片变得又高又窄。"
created: 2026-04-12T07:59:18Z
updated: 2026-04-12T08:03:26Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: 人工验证已确认修复生效
test: 按归档流程提交并沉淀知识库
expecting: 会话归档完成，形成可复用 debug 经验
next_action: 归档调试会话并提交相关文档

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: 只滚动到“我的默认出发地”卡片顶部，不改变卡片原有样式与比例。
actual: 点击后卡片显示为又高又窄（布局异常）。
errors: 无控制台/终端报错。
reproduction: 首页点击“先按预算找低价”按钮即可稳定复现。
started: 刚改完按钮跳转行为后出现。

## Eliminated
<!-- APPEND only - prevents re-investigating -->

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-04-12T07:59:39Z
  checked: .planning/debug/knowledge-base.md 模式匹配
  found: 与现象“卡片又高又窄”存在 2+ 关键词重叠（窄高、样式异常、卡片），命中条目 detail-card-narrow-tall
  implication: 历史上同类症状根因为 grid 容器约束；可作为优先假设但需在首页场景独立验证

- timestamp: 2026-04-12T08:00:29Z
  checked: src/app/page.tsx 按钮与锚点结构
  found: “先按预算找低价”链接为 href="#default-departure-panel"，目标 id 位于 `<div id="default-departure-panel">`，而实际卡片组件是其内部 `<section class="preference-panel">`
  implication: 锚点命中的是 wrapper div，不是被 CSS 明确布局的卡片元素

- timestamp: 2026-04-12T08:00:29Z
  checked: src/styles/globals.css 的 grid 规则
  found: `.public-shell` 在 >=1024px 是 12 列 grid；`.preference-panel` 被显式指定 `grid-column: 1 / span 12`，但 `#default-departure-panel` 无对应规则
  implication: wrapper div 作为 grid item 会落入隐式 auto 列，导致宽度收缩；内部 `.preference-panel` 继承窄容器后呈现“又高又窄”

- timestamp: 2026-04-12T08:01:15Z
  checked: 修复实现（src/app/page.tsx + src/components/deals/DiscoveryPreferences.tsx）
  found: 删除了外层 `<div id="default-departure-panel">`，改为给 `<section class="preference-panel">` 直接设置同名 id
  implication: 锚点目标元素本身带有 `.preference-panel` 的 grid-column 规则，消除隐式窄列容器

- timestamp: 2026-04-12T08:01:38Z
  checked: 本地静态回归检查
  found: `pnpm lint` 通过，无新增 lint 错误
  implication: 改动未引入明显语法/静态规则回归，可进入人工交互验证

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: 首页锚点 id 放在未定义 grid-column 的 wrapper div 上；在 12 列 `.public-shell` 中该 wrapper 进入隐式 auto 列，导致内部“我的默认出发地”卡片容器宽度被压缩，表现为又高又窄。
fix: 将 `default-departure-panel` 锚点从外层 wrapper div 挪到 `DiscoveryPreferences` 根 section（`.preference-panel`）上，并移除多余 wrapper，使锚点目标与既有 grid-column 规则一致。
verification: 主公反馈 human-verify 为 "confirmed fixed"；点击“先按预算找低价”后仅滚动定位，卡片比例恢复正常。
files_changed:
  - src/app/page.tsx
  - src/components/deals/DiscoveryPreferences.tsx
