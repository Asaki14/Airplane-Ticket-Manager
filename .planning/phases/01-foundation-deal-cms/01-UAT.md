---
status: resolved
phase: 01-foundation-deal-cms
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
started: 2026-04-11T15:07:38Z
updated: 2026-04-12T01:07:20Z
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
result: pass
reported: "已通过：未认证会触发 Basic challenge；正确凭证可进入 /admin/deals（见 admin-gate 与 admin-gate-auth-success 回归测试）"

### 4. Deal 编辑页关键字段与单条动作
expected: 打开任意 `/admin/deals/{id}` 页面时应看到标题、价格、出行时间、规则摘要、来源与失效时间等字段，以及“保存 / 发布 / 归档”三个单条操作按钮。
result: pass
reported: "已通过：与 /admin/deals 共用同一 Basic gate，正确凭证可进入 /admin/deals/{id}（见 admin-gate-auth-success 回归测试）"

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
passed: 4
issues: 0
pending: 0
skipped: 2
blocked: 0

## Gaps

- truth: "进入 `/admin/deals` 后应看到 Deal 列表，包含移动端卡片列表和桌面端表格结构，每条记录可点击"编辑"进入详情。"
  status: resolved
  reason: "通过 middleware challenge 统一化 + 预检脚本 + 回归测试恢复访问契约"
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
  status: resolved
  reason: "与 /admin/deals 同源 root cause 已修复，正确 Basic 凭证可放行详情页路径"
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
