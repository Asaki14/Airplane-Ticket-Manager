# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## admin-deals-unauthorized-no-auth-popup — admin 入口无认证弹框且无法进入后台
- **Date:** 2026-04-12
- **Error patterns:** Unauthorized, 无认证弹框, 运营后台, Deal管理, admin, Basic Auth
- **Root cause:** `scripts/check-admin-gate-env.mjs` 仅检查 `process.env`，没有像 Next 运行时那样加载 `.env.local`，导致 `pnpm dev` 在预检查阶段误报缺失 `ADMIN_GATE_*` 并提前退出。
- **Fix:** 更新 `scripts/check-admin-gate-env.mjs`：在变量校验前加载 Next env 文件（`.env*`），并使用兼容 ESM 的 CJS default import 解构方式。
- **Files changed:** scripts/check-admin-gate-env.mjs
---

## detail-card-narrow-tall — 详情页 deal 卡片窄高失衡
- **Date:** 2026-04-12
- **Error patterns:** 详情卡片, 又窄又高, 样式异常, 版式失衡, 详情页
- **Root cause:** 详情页根容器复用 `.public-shell`（默认 `display:grid` 且小屏未定义列轨道）触发隐式 auto 轨道收缩，导致详情区块宽度被压窄。
- **Fix:** 在详情页 `<main>` 增加 `detail-shell` 类，并在全局样式将 `.detail-shell` 设为 `display:block`，解除隐式栅格轨道约束。
- **Files changed:** src/app/deals/[id]/page.tsx, src/styles/globals.css
---

## default-departure-card-tall-narrow — 首页默认出发地卡片在锚点跳转后窄高异常
- **Date:** 2026-04-12
- **Error patterns:** 首页, 我的默认出发地, 卡片又高又窄, 布局异常, 锚点跳转, 先按预算找低价
- **Root cause:** 锚点 id 放在未定义 `grid-column` 的 wrapper div 上；在 12 列 `.public-shell` 中该 wrapper 落入隐式 auto 列，导致内部 `.preference-panel` 宽度被压缩。
- **Fix:** 将 `default-departure-panel` 锚点从外层 wrapper div 挪到 `DiscoveryPreferences` 根 section（`.preference-panel`）并移除 wrapper，使目标元素直接复用既有 `grid-column: 1 / span 12` 规则。
- **Files changed:** src/app/page.tsx, src/components/deals/DiscoveryPreferences.tsx
---

## ui-blank-page-after-filter — Resolve blank page after filter
- **Date:** 2026-04-14T00:00:00.000Z
- **Error patterns:** 正常显示筛选页及后续卡片列表，无多余空白, 从筛选页开始显示不全，接着出现非常长的空白页面，直到显示“比较、收藏与分享”卡片
- **Root cause:** DealCard component was missing the `deal-card-shell` CSS Grid structure and `min-height` constraints, while `.spring-atmosphere` was applying `overflow: hidden`. The combination caused the public feed to collapse vertically or clip, rendering as a massive blank space between the filter and compare sections.
- **Fix:** 1. Removed `overflow: hidden` from `.spring-atmosphere` in `globals.css`. 2. Rewrote `DealCard.tsx` to adhere to `.deal-card-shell`, restoring standard layout rules. 3. Fixed tests confirming layout integrity.
- **Files changed:** src/styles/globals.css, src/components/deals/DealCard.tsx, src/lib/dealAdvice.ts, src/app/page.tsx
---
