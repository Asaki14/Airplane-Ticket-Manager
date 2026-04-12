---
status: diagnosed
trigger: "<debug_context> Phase: 01-foundation-deal-cms ... 打开 /admin/deals 没有出现 basic auth 框，导致无法进入 deal 页面 ... Goal: find_root_cause_only"
created: 2026-04-11T16:31:18Z
updated: 2026-04-11T16:37:05Z
---

## Current Focus

hypothesis: 已确认 root cause：运行时未正确注入 ADMIN_GATE_*，middleware 走 503 配置错误分支而非 401 challenge
test: 归纳证据并形成诊断结论（goal: find_root_cause_only）
expecting: 输出结构化 ROOT CAUSE FOUND
next_action: 写入 Resolution 并返回诊断

## Symptoms

expected: 在正确认证后能访问 /admin/deals 列表页面
actual: 带着环境变量运行 npx next dev 后，打开 /admin/deals 没有出现 basic auth 框，导致无法进入 deal 页面
errors: 未出现 basic auth 弹窗
reproduction: 运行 npx next dev 后访问 /admin/deals
started: UAT gap test 3（01-foundation-deal-cms）

## Eliminated

## Evidence

- timestamp: 2026-04-11T16:31:40Z
  checked: git merge-base HEAD dd3a6db2355bca08ccae0b2d97fb1152af31b61c
  found: 返回值即 dd3a6db2355bca08ccae0b2d97fb1152af31b61c
  implication: 当前 HEAD 与指定基线一致，无需执行 git reset --soft

- timestamp: 2026-04-11T16:31:58Z
  checked: .planning/debug/knowledge-base.md
  found: 文件不存在
  implication: 无已知模式候选，需从代码与运行行为独立建模

- timestamp: 2026-04-11T16:33:02Z
  checked: 关键字检索（/admin/deals, Basic Auth, WWW-Authenticate）
  found: 认证核心在 src/middleware.ts；/admin/:path* 受保护
  implication: 需聚焦 middleware 中 401/503 分支与 env 变量命名是否匹配

- timestamp: 2026-04-11T16:34:10Z
  checked: src/middleware.ts + .env.local + tests/admin-gate.test.ts
  found: middleware 使用 ADMIN_GATE_USERNAME/ADMIN_GATE_PASSWORD；若任一缺失直接返回 503；仅 401 分支设置 WWW-Authenticate
  implication: 一旦 env 未被正确注入中间件运行时，浏览器不会触发 Basic Auth 弹窗

- timestamp: 2026-04-11T16:35:18Z
  checked: .opencode/get-shit-done/references/thinking-models-debug.md + common-bug-patterns.md
  found: 当前症状最匹配 Environment/Config（环境变量缺失/错误）模式
  implication: 优先验证运行时 env 读取与响应状态/响应头

- timestamp: 2026-04-11T16:37:05Z
  checked: next dev 双场景请求实验（默认 env vs 空 ADMIN_GATE_*）
  found: 默认 env 请求 /admin/deals 返回 401 且含 Www-Authenticate；空 ADMIN_GATE_* 返回 503 且无 Www-Authenticate，响应体为 Admin gate is not configured
  implication: 浏览器 auth 弹窗依赖 401+WWW-Authenticate；出现“无弹窗”即命中 env 缺失分支

## Resolution

root_cause: "运行时未读取到 ADMIN_GATE_USERNAME/ADMIN_GATE_PASSWORD（缺失或为空）时，src/middleware.ts 在 /admin 路径直接返回 503 'Admin gate is not configured'，且不带 WWW-Authenticate；浏览器因此不会弹 Basic Auth 框。"
fix: "（诊断模式未实施）确保 next dev 进程中注入非空 ADMIN_GATE_USERNAME 与 ADMIN_GATE_PASSWORD，并统一团队启动方式避免空值覆盖。"
verification: "已通过对照实验验证：正常 env=401+WWW-Authenticate；空 env=503 且无 challenge，完全复现“无弹窗”。"
files_changed: [".planning/debug/admin-deals-no-basic-auth.md"]
