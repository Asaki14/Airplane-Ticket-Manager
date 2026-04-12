---
status: awaiting_human_verify
trigger: "Investigate issue: vercel-build-module-not-found\n\nSummary: 从 GitHub repo 部署到 Vercel 时，Next.js 构建失败并报多个 Module not found。"
created: 2026-04-12T04:56:14Z
updated: 2026-04-12T05:27:54Z
---

## Current Focus

hypothesis: 依赖安全阻塞已在代码层修复，待云端策略验证
test: 推送 Next 升级提交并在 Vercel 触发新部署
expecting: 不再出现 `Vulnerable version of Next.js detected`，部署可完成
next_action: 等待用户在 Vercel 重新部署并反馈结果

## Symptoms

expected: Vercel 能成功执行 `npm run build` 并完成部署。
actual: 构建在 `next build` 阶段失败，webpack 报错退出。
errors: `./src/app/deals/[id]/page.tsx` 无法解析 `@/lib/deals/mock-data`；`./src/app/page.tsx` 无法解析 `@/components/deals/DiscoveryPreferences` 和 `@/lib/deals/mock-data`；最终 `Build failed because of webpack errors`。
reproduction: 在 Vercel 上从仓库 `Asaki14/Airplane-Ticket-Manager` 的 `main` 分支（示例 commit `e269fd8`）触发构建，执行 `npm run build` 后稳定复现。
started: 问题出现在最近一次云端部署过程中；本地是否曾成功构建未知。

## Eliminated

<!-- APPEND only - prevents re-investigating -->

## Evidence

<!-- APPEND only - facts discovered -->

- timestamp: 2026-04-12T04:56:42Z
  checked: `.planning/debug/knowledge-base.md` 关键词匹配
  found: 知识库仅有 admin auth 与详情页布局问题，和 `Module not found` / `@/lib/deals/mock-data` / `DiscoveryPreferences` 无 2+ 关键词重叠
  implication: 无可直接复用已知根因，需按导入路径与构建配置进行一手排查

- timestamp: 2026-04-12T04:57:13Z
  checked: `tsconfig.json`, `src/app/page.tsx`, `src/app/deals/[id]/page.tsx` 与目标路径文件存在性
  found: `@/* -> src/*` 别名已配置；`src/lib/deals/mock-data.ts` 与 `src/components/deals/DiscoveryPreferences.tsx` 在工作区真实存在且命名一致
  implication: 报错并非明显拼写错误或路径不存在，需验证“构建输入集”是否和本地工作区不一致

- timestamp: 2026-04-12T04:59:05Z
  checked: 本地 `npm run build`、`git ls-files`、`git status --short`、`git check-ignore`
  found: 本地 `next build` 成功；报错目标文件未出现在 `git ls-files` 结果里；`git status` 显示二者为 `??`（未追踪）；`git check-ignore` 无命中（未被 ignore）
  implication: 高概率是部署提交不含这些文件（而非路径别名配置错误），导致 Vercel 构建时真实缺文件触发 Module not found

- timestamp: 2026-04-12T05:00:05Z
  checked: `.gitignore`、`.vercelignore`、`git ls-tree -r --name-only e269fd8`
  found: `.gitignore` 未排除 `src/**`；仓库无 `.vercelignore`；`e269fd8` 仅含 `src/app/page.tsx` 与 `src/app/deals/[id]/page.tsx`，不含 `src/lib/deals/mock-data.ts` 与 `src/components/deals/DiscoveryPreferences.tsx`
  implication: 与 Vercel 错误完全一致，根因收敛为“触发部署的提交缺文件（部分提交）”

- hypothesis: 部署提交缺失模块文件
  evidence: 在 detached worktree（本地 `e269fd8`）执行 `npm run build` 成功，未出现 `Module not found`
  timestamp: 2026-04-12T05:02:11Z

- timestamp: 2026-04-12T05:02:11Z
  checked: 反事实测试（`git worktree add` 到 `e269fd8` 并构建）
  found: 本地 `e269fd8` 可成功完成 Next 构建，和用户提供的 Vercel 错误相矛盾
  implication: 需要转向“远端提交内容与本地认知不一致”或“Vercel 特有构建上下文差异”方向

- timestamp: 2026-04-12T05:03:03Z
  checked: 复盘上一轮实验执行路径
  found: 构建命令在仓库主目录执行（非 `/private/tmp/atm-debug-3EBlHm`），因此并未验证 `e269fd8` 工作树
  implication: 上一条“假设被证伪”证据无效，需在正确目录重测

- timestamp: 2026-04-12T05:04:44Z
  checked: 在 `/private/tmp/atm-debug-3EBlHm`（detached HEAD: `e269fd8`）执行 `npm run build`
  found: 构建稳定复现三条 `Module not found`（`@/lib/deals/mock-data`、`@/components/deals/DiscoveryPreferences`）并以 webpack errors 失败
  implication: 与 Vercel 症状完全一致，根因被直接验证：部署提交缺少被导入文件

- timestamp: 2026-04-12T05:13:20Z
  checked: 用户 checkpoint 反馈 + 新证据（Vercel inspect）
  found: Vercel 最新失败构建明确来自 `main` 分支 commit `fdc5a13`，且错误与之前完全一致
  implication: 需验证 `fdc5a13` 是否实际包含修复文件；若不包含则说明修复未随部署提交生效

- timestamp: 2026-04-12T05:15:12Z
  checked: `git ls-tree -r --name-only fdc5a13`、`git status --short`、detached worktree 构建路径复盘
  found: `fdc5a13` tree 不含两目标文件，但刚才“fdc5a13 构建成功”结果为无效实验（命令仍在主仓库目录执行）；当前工作区这两文件为 staged 未提交
  implication: 需要在 detached worktree 实际目录重跑，避免再次出现路径混淆

- hypothesis: fdc5a13 不含两文件即可解释云端失败
  evidence: 现有构建成功证据无效（错误执行目录），暂不能据此否定
  timestamp: 2026-04-12T05:15:12Z

- timestamp: 2026-04-12T05:16:08Z
  checked: 在 `/private/tmp/atm-fdc5-BnSBnd`（detached HEAD: `fdc5a13`）执行 `npm run build`
  found: 稳定复现同样三条 `Module not found` 并构建失败
  implication: 与 Vercel 完全一致，确认问题在 `fdc5a13` commit 内容缺失而非 Vercel 特殊环境

- timestamp: 2026-04-12T05:22:11Z
  checked: 用户新 checkpoint 反馈（commit `d953fd5`）
  found: `Module not found` 已消失，编译/类型检查/静态页生成均通过；最终被 Vercel 以 `Vulnerable version of Next.js detected`（检测到 15.3.3，CVE-2025-66478）拒绝发布
  implication: 原问题已修复，当前失败根因切换为依赖安全策略，需要升级 Next.js

- timestamp: 2026-04-12T05:23:26Z
  checked: `package.json`、`package-lock.json`、`npm view next@15 version`
  found: 当前锁定为 `next: 15.3.3`；15.x 已发布更高补丁版本（最高可见 15.5.15）
  implication: 可通过升级到 15.x 安全补丁版本实现最小风险修复，无需跨到 Next 16

- timestamp: 2026-04-12T05:25:59Z
  checked: `npm install next@15.5.15`
  found: 命令超时终止（120s），未形成可用结论
  implication: 需延长超时重试，当前假设未被否定

- timestamp: 2026-04-12T05:27:54Z
  checked: `npm install next@15.5.15`（300s）、`npm ls next`、`npm run build`
  found: Next 已升级为 `15.5.15`；本地生产构建通过（仅剩样式/autoprefixer 与 ESLint 插件警告，无阻断错误）
  implication: 已满足安全升级修复条件，下一步是云端重新部署确认 Vercel 门禁放行

## Resolution

root_cause: "Vercel 在 commit `d953fd5` 检测到 `next@15.3.3` 命中 CVE-2025-66478 安全门禁，尽管编译成功仍拒绝发布。"
fix: "将依赖从 `next@15.3.3` 升级到安全补丁版本 `next@15.5.15`，并同步更新 lockfile。"
verification: "本地 `npm ls next` 显示 15.5.15；`npm run build` 全流程通过。"
files_changed:
  - src/lib/deals/mock-data.ts
  - src/components/deals/DiscoveryPreferences.tsx
  - package.json
  - package-lock.json
