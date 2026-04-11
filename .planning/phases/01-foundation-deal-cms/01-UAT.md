---
status: diagnosed
phase: 01-foundation-deal-cms
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
started: 2026-04-11T15:07:38Z
updated: 2026-04-12T01:02:30Z
---

## Admin 访问契约（Phase 1）

- Phase 1 的 `/admin` 访问采用 **Basic Auth gate**，不是应用内登录页（不引入 session/cookie 登录流程）。
- 未携带或携带错误凭证访问 `/admin/deals`、`/admin/deals/{id}` 时，必须返回 401 并带 `WWW-Authenticate: Basic realm="Admin Gate"` challenge。
- 当 `ADMIN_GATE_USERNAME` / `ADMIN_GATE_PASSWORD` 配置缺失或为空时，仍保持 401 challenge 契约，并通过可观测标记提示配置错误（`x-admin-gate-misconfigured: true`）。

## 执行前检查与复验步骤

1. 先确认环境变量已配置且非空：
   - `ADMIN_GATE_USERNAME=<your-user> ADMIN_GATE_PASSWORD=<your-pass> npm run check:admin-gate-env`
2. 启动本地服务（已串联预检）：
   - `ADMIN_GATE_USERNAME=<your-user> ADMIN_GATE_PASSWORD=<your-pass> npm run dev`
3. 复验后台入口：
   - 访问 `/admin/deals`：浏览器应触发 Basic challenge；输入正确凭证后进入 Deal 列表
   - 访问 `/admin/deals/{id}`：走同一 gate 契约；输入正确凭证后进入编辑页
4. 自动化回归命令：
   - `npm run test:quick -- admin-gate`
   - `npm run test:quick -- admin-gate-auth-success`

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
  root_cause: "admin gate 在 `src/middleware.ts` 仅通过 Basic Authorization 头放行；当 `ADMIN_GATE_USERNAME`/`ADMIN_GATE_PASSWORD` 缺失或为空时直接返回 503 且无 WWW-Authenticate，浏览器不会弹出认证框。"
  artifacts:
    - path: "src/middleware.ts"
      issue: "环境变量缺失分支返回 503，不触发 Basic challenge"
    - path: "tests/admin-gate.test.ts"
      issue: "仅验证中间件静态行为，未覆盖 dev 启动态配置缺失与提示路径"
  missing:
    - "在启动与验收流程中强制校验 ADMIN_GATE_USERNAME/ADMIN_GATE_PASSWORD 已注入且非空"
    - "优化缺失配置时的行为与可观测性，避免用户误判为认证失效"
  debug_session: .planning/debug/admin-deals-no-basic-auth.md
- truth: "打开任意 `/admin/deals/{id}` 页面时应看到标题、价格、出行时间、规则摘要、来源与失效时间等字段，以及“保存 / 发布 / 归档”三个单条操作按钮。"
  status: failed
  reason: "User reported: 跟前面的test同样的问题，无法通过auth进入admin页面，后续verify test先不填写了，直接进入debug阶段"
  severity: major
  test: 4
  root_cause: "当前 Phase 1 的 `/admin` 访问契约是 Basic Auth gate，不是应用内登录态；当 gate 配置未正确注入时，`/admin/deals/{id}` 与 `/admin/deals` 同步被阻断。"
  artifacts:
    - path: "src/middleware.ts"
      issue: "`/admin/:path*` 统一受 Basic gate 控制，未提供 session/cookie 放行分支"
    - path: ".planning/debug/admin-deals-auth-blocked.md"
      issue: "诊断确认该问题与 test 3 为同一根因链"
  missing:
    - "明确并文档化 admin 访问契约（Basic gate 或应用内 auth 二选一）"
    - "若继续用 Basic gate，补充本地启动与UAT操作指引，确保认证可复现"
  debug_session: .planning/debug/admin-deals-auth-blocked.md
