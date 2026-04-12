---
status: resolved
trigger: "Investigate issue: detail-card-narrow-tall"
created: 2026-04-12T04:24:02Z
updated: 2026-04-12T04:30:34Z
---

## Current Focus

hypothesis: 用户已在真实流程确认修复生效，问题闭环完成。
test: 执行归档、提交代码与知识库更新。
expecting: 调试会话进入 resolved，输出可追溯提交信息。
next_action: 归档会话并完成提交

## Symptoms

expected: 点击首页任意 deal 卡片进入详情页后，详情卡片宽度正常、比例协调，阅读舒适。
actual: 详情卡片又窄又高，版式失衡，影响阅读。
errors: 无报错（仅样式异常）。
reproduction: 首页点击任意卡片进入详情页即可稳定复现。
started: 一直存在。

## Eliminated

## Evidence

- timestamp: 2026-04-12T04:24:30Z
  checked: .planning/debug/knowledge-base.md
  found: 仅有 admin 认证相关已解决案例，无与样式/布局异常相关条目
  implication: 无可直接复用的已知根因，按常规样式链路调查

- timestamp: 2026-04-12T04:24:30Z
  checked: references/common-bug-patterns.md + 症状映射
  found: 该问题属于“Wrong data displayed/布局异常”的前端渲染类别，更接近 State/样式约束而非运行时异常
  implication: 优先检查组件布局约束与样式类，不优先排查异步/数据契约

- timestamp: 2026-04-12T04:24:30Z
  checked: 文件定位(glob: deal/card)
  found: 已发现 tests/deal-detail.test.ts 与 deal-card 相关测试文件，说明存在独立详情页实现
  implication: 先追踪详情页组件与共用卡片组件之间样式差异

- timestamp: 2026-04-12T04:25:51Z
  checked: src/app/deals/[id]/page.tsx
  found: 详情页根容器使用 `<main className="public-shell">`，内部各区块均未单独声明横向尺寸
  implication: 详情页完全依赖 `.public-shell` 的栅格行为决定区块宽度

- timestamp: 2026-04-12T04:25:51Z
  checked: src/styles/globals.css (.public-shell 定义)
  found: `.public-shell` 默认 `display: grid` 且未定义 `grid-template-columns`（仅在 ≥1024px 才设置 12 列）
  implication: 在 <1024px 视口会使用隐式单列 auto 轨道，track 尺寸受子项 max-content 影响，可能导致整体内容列异常收窄

- timestamp: 2026-04-12T04:25:51Z
  checked: src/styles/globals.css (详情卡片定义)
  found: `.detail-card` 无固定宽度/最大宽度限制，且设置了 `overflow-wrap:anywhere` 与 `min-inline-size:0`
  implication: 卡片“窄”更可能来自父级布局轨道宽度问题，而非卡片自身宽度限制

- timestamp: 2026-04-12T04:25:51Z
  checked: 首页/详情布局对比
  found: 首页在同一 `.public-shell` 内包含 hero/carousel 等大块，视觉上不易暴露 auto 轨道收缩；详情页主要是文本卡片，更易触发窄列感
  implication: 根因集中在“详情页复用首页 shell 栅格语义不匹配”

## Resolution

root_cause: 详情页根容器使用 `.public-shell`（默认 `display:grid` 且在小屏未定义列轨道），导致隐式 auto 轨道按内容收缩，详情区块宽度变窄，形成“又窄又高”的卡片视觉。
fix: 在详情页根容器增加 `detail-shell` 类，并在全局样式中将 `.detail-shell` 设置为 `display:block`，使详情页面不受 `.public-shell` 隐式栅格轨道影响。
verification: `pnpm test -- deal-detail.test.ts` 通过（实际执行了全量 vitest，12/12 files, 46/46 tests passed）；代码层面确认详情页根容器新增 `detail-shell`，且样式定义生效。
files_changed: [src/app/deals/[id]/page.tsx, src/styles/globals.css]
