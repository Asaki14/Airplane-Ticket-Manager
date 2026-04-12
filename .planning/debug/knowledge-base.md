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
