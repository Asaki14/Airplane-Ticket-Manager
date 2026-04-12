---
status: awaiting_human_verify
trigger: "Investigate issue: vercel-build-module-not-found\n\nSummary: 从 GitHub repo 部署到 Vercel 时，Next.js 构建失败并报多个 Module not found。"
created: 2026-04-12T04:56:14Z
updated: 2026-04-12T05:06:27Z
---

## Current Focus

hypothesis: 修复已就位，待真实部署环境最终确认
test: 用户在 Vercel 重新触发部署，验证同一构建步骤不再报 `Module not found`
expecting: `next build` 成功通过，不再出现三条缺模块错误
next_action: 等待用户确认云端部署结果

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

## Resolution

root_cause: "触发 Vercel 部署的提交（示例 `e269fd8`）中，`src/app/page.tsx` 与 `src/app/deals/[id]/page.tsx` 已导入 `@/lib/deals/mock-data` 与 `@/components/deals/DiscoveryPreferences`，但这两个文件并未被提交进该 commit，导致云端构建上下文缺文件并触发 `Module not found`。"
fix: "将缺失文件 `src/lib/deals/mock-data.ts` 与 `src/components/deals/DiscoveryPreferences.tsx` 一并提交到部署分支，使导入依赖在同一提交中完整可解析。"
verification: "已在本地完成对照验证：1) 在 `e269fd8` 的独立 worktree 中稳定复现 Vercel 同款 `Module not found`；2) 在当前分支纳入两缺失文件后 `npm run build` 成功通过。"
files_changed:
  - src/lib/deals/mock-data.ts
  - src/components/deals/DiscoveryPreferences.tsx
