---
status: complete
phase: 01-foundation-deal-cms
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
started: 2026-04-11T15:07:38Z
updated: 2026-04-11T16:27:07Z
---

## Current Test

[testing complete]

## Tests

### 1. 公开首页壳子与主导航
expected: 访问 `/` 时页面应展示“特价机票发现平台”主标题区域，并看到主导航包含“公开首页 / 运营后台 / Deal 管理”三个入口。
result: pass

### 2. /admin 轻量守门生效
expected: 访问 `/admin` 时应被 Basic 风格守门限制；未提供或提供错误凭证时无法进入后台，提供正确凭证后可进入 Admin 运营首页。
result: pass

### 3. Deal 管理列表双端结构
expected: 进入 `/admin/deals` 后应看到 Deal 列表，包含移动端卡片列表和桌面端表格结构，每条记录可点击"编辑"进入详情。
result: issue
reported: "带着环境变量运行npx next dev后，打开admin/deals没有出现basic auth框，导致无法进入deal页面"
severity: major

### 4. Deal 编辑页关键字段与单条动作
expected: 打开任意 `/admin/deals/{id}` 页面时应看到标题、价格、出行时间、规则摘要、来源与失效时间等字段，以及“保存 / 发布 / 归档”三个单条操作按钮。
result: issue
reported: "跟前面的test同样的问题，无法通过auth进入admin页面，后续verify test先不填写了，直接进入debug阶段"
severity: major

### 5. 公开 Feed API 只返回可展示 deal
expected: 访问 `/api/deals/feed` 时返回 JSON `data` 列表，并且列表中的 deal 应满足发布态且未过期（不应出现 draft 或已过期数据）。
result: skipped
reason: 用户要求先进入 debug 阶段

### 6. 首页 DealCard 价格与 freshness 展示
expected: 首页 deal 卡片应以 `headlinePrice` 作为主价格，`referenceTotalPrice` 作为辅助说明，并按“发布时间 → 更新时间 → 失效时间”的固定顺序展示 freshness 信息。
result: skipped
reason: 用户要求先进入 debug 阶段

## Summary

total: 6
passed: 2
issues: 2
pending: 0
skipped: 2
blocked: 0

## Gaps

- truth: "进入 `/admin/deals` 后应看到 Deal 列表，包含移动端卡片列表和桌面端表格结构，每条记录可点击"编辑"进入详情。"
  status: failed
  reason: "User reported: 带着环境变量运行npx next dev后，打开admin/deals没有出现basic auth框，导致无法进入deal页面"
  severity: major
  test: 3
  artifacts: []
  missing: []
- truth: "打开任意 `/admin/deals/{id}` 页面时应看到标题、价格、出行时间、规则摘要、来源与失效时间等字段，以及“保存 / 发布 / 归档”三个单条操作按钮。"
  status: failed
  reason: "User reported: 跟前面的test同样的问题，无法通过auth进入admin页面，后续verify test先不填写了，直接进入debug阶段"
  severity: major
  test: 4
  artifacts: []
  missing: []
