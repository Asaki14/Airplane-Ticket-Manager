---
status: investigating
trigger: "打开任意 /admin/deals/{id} 页面时无法通过 auth 进入 admin 页面（Gap test 4）"
created: 2026-04-11T16:31:41Z
updated: 2026-04-11T16:34:24Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: root cause 可确认为“admin 访问契约与 UAT 预期不一致”；系统仅支持 Basic Auth，且在 env 缺失时直接 503
test: 结合同批 gap test 3 会话证据，确认该问题会同时表现为“无法 auth 进入 admin”
expecting: 若 /admin 没有应用层 auth 且 basic gate 在 env 缺失时不触发弹窗，则 test 4 症状是同源问题
next_action: 将证据整理为 root cause 诊断结论并返回

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: 在正确认证后能访问 /admin/deals/{id} 并看到编辑表单
actual: 与前面 test 同样问题，无法通过 auth 进入 admin 页面
errors: 未提供明确报错，现象为认证后仍无法进入 admin
reproduction: 打开任意 /admin/deals/{id} 页面，尝试完成认证后进入 admin
started: 来自 UAT Gap test 4，时间未明确

## Eliminated
<!-- APPEND only - prevents re-investigating -->

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-04-11T16:32:10Z
  checked: 执行 `git merge-base HEAD dd3a6db2355bca08ccae0b2d97fb1152af31b61c`
  found: 返回值即 `dd3a6db2355bca08ccae0b2d97fb1152af31b61c`
  implication: 与用户指定基线一致，不应执行 `git reset --soft`

- timestamp: 2026-04-11T16:32:37Z
  checked: phase 0 知识库与调试参考
  found: `.planning/debug/knowledge-base.md` 不存在；已读取 thinking-models-debug 与 common-bug-patterns
  implication: 无历史模式可复用，按常见模式优先检查 Environment/Config 与 Data Shape/API Contract

- timestamp: 2026-04-11T16:33:17Z
  checked: 代码定位（glob/grep）
  found: 与 admin 相关核心文件集中在 `src/middleware.ts`、`src/app/admin/...` 和 `tests/admin-gate.test.ts`
  implication: 问题高概率在路由守卫或测试实现的认证契约差异，而非分散业务逻辑

- timestamp: 2026-04-11T16:33:47Z
  checked: 完整阅读 middleware、admin 页面与 admin-gate 测试
  found: `src/middleware.ts` 对 `/admin/:path*` 仅接受 `Authorization: Basic` + `ADMIN_GATE_USERNAME/PASSWORD`；未见 session/cookie 登录态分支
  implication: 用户若走应用内“auth 登录”而非浏览器 Basic Auth challenge，将始终被拒绝访问 admin

- timestamp: 2026-04-11T16:34:24Z
  checked: 全仓库 auth/login/session/cookie 检索 + 相关调试会话 `.planning/debug/admin-deals-no-basic-auth.md`
  found: `src` 内无登录页/API/session 实现；已有会话证据显示缺失 `ADMIN_GATE_*` 时 middleware 返回 503（无 `WWW-Authenticate`），用户看不到 Basic Auth 弹窗
  implication: test 4 的“无法通过 auth 进入 admin 页面”与 test 3 同源：认证方案与环境配置共同导致 admin 入口不可达

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "Admin 访问控制实现为 HTTP Basic Auth（Authorization 头 + ADMIN_GATE_USERNAME/PASSWORD），与 UAT 所期待的应用内认证入口不一致；且当 ADMIN_GATE_* 未正确注入时 middleware 走 503 分支，不返回 WWW-Authenticate，导致浏览器既不弹 Basic Auth 也无法进入 /admin/deals/{id}。"
fix: ""
verification: ""
files_changed: []
