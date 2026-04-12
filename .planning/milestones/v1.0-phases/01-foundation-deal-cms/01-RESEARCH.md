---
phase: 01
slug: foundation-deal-cms
status: complete
created: 2026-04-11
source: gsd-phase-researcher-simulated
---

# Phase 01 — Technical Research

## Scope

围绕 Phase 1（Foundation & Deal CMS）回答：如何以最低 MVP 成本交付单应用（public + /admin）、可维护 Deal CMS、过期自动下线、并满足移动端/桌面端可用性。

## Inputs Reviewed

- `.planning/phases/01-foundation-deal-cms/01-CONTEXT.md`
- `.planning/REQUIREMENTS.md`（OPS-01, OPS-02, PREF-03）
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/phases/01-foundation-deal-cms/01-UI-SPEC.md`

## Locked Decision Implications

- D-01/D-02：必须单应用 + `/admin` 入口，不做分离式双应用。
- D-03：Phase 1 不引入完整管理员认证系统，只做轻量受限入口。
- D-04~D-07：Deal 是“运营策划后的成品记录”，且价格与时窗都要支持结构化 + 展示友好字段。
- D-08~D-10：生命周期固定 `draft -> published -> expired`，且发布为单条手动动作。
- D-11~D-13：同一设计系统下 public 与 admin 语气分层（public 更 travel，admin 更 operational）。
- D-14/D-15：卡片主价格用 headline lowest，参考总价作为辅助上下文。

## Recommended Stack (MVP-safe)

1. **Next.js App Router (`/vercel/next.js`)**
   - 原因：可在一个代码库内同时承载 public route 与 admin route；后续 Phase 2/3 延展成本低。
2. **Payload CMS v3 (`/payloadcms/payload`)**
   - 原因：code-first collection schema + 内置 admin + local API（减少手写 CRUD 和后台框架搭建）。
   - 路由策略：将 Payload Admin 挂载为 `/admin`，满足 D-02。
3. **Tailwind CSS (`/tailwindlabs/tailwindcss.com`)**
   - 原因：快速落地 UI-SPEC 的 spacing/token 约束，移动端优先开发效率高。

> 结论：该组合最贴合“greenfield MVP + 内容运营优先 + 单应用双表面”的约束。

## Data Modeling Guidance

建议建立 `deals` 集合（Collection）并显式编码以下字段族（对应 D-05）：

- 基础：`title`, `departureCity`, `destination`, `airline`, `tripType`
- 价格：`headlinePrice`, `currency`, `referenceTotalPrice`
- 时间：`travelStartDate`, `travelEndDate`, `travelWindowLabel`
- 规则摘要：`isDirect`, `baggageInfo`, `refundChangeSummary`
- 来源/时效：`sourceLink`, `publishedAt`, `updatedAt`, `expiresAt`
- 内容与标签：`recommendationCopy`, `valueTags`
- 生命周期：`status`（枚举：draft/published/expired）

## Expiry Strategy (OPS-02)

推荐“双保险”实现：

1. **读取侧强约束（必须）**：public feed 查询仅返回 `status=published` 且 `expiresAt > now()`。
2. **后台状态一致性（推荐）**：定时任务将已过期已发布记录标记为 `expired`，便于运营后台查看。

这样即便定时任务短暂失败，也不会让过期数据继续出现在公开列表。

## Lightweight Admin Gate (D-03)

不做完整 RBAC/用户体系；建议：

- 使用环境变量守门（例如 Basic Auth 风格中间件）保护 `/admin`。
- 仅在 `/admin` 与 CMS API 写操作生效。
- 在 README 中明确“仅 MVP 内部使用”。

## UI/UX Contract Alignment

按 `01-UI-SPEC.md` 必须落实：

- Breakpoint：`0-767 / 768-1023 / 1024+`
- Public 首页语气：travel-first 氛围 + 工具化结构
- Admin：移动端卡片，桌面端表格；表单移动端单列，桌面端分组双列
- 生命周期 chip：draft（中性）/ published（accent）/ expired（弱化）

## Common Pitfalls to Avoid

1. 只做 UI 下线不过滤数据（会导致过期数据仍可被 API 返回）
2. 将 reference 总价误用为主价格（违背 D-14）
3. 在 Phase 1 引入完整权限系统（违背 D-03，增加成本）
4. 仅桌面优化，忽略移动端 CMS 可操作性（违背 PREF-03）

## Validation Architecture

### What must be verifiable in Phase 1

1. 运营可 create/edit/publish/archive 一条 deal（OPS-01）
2. 过期 deal 不出现在 public feed（OPS-02）
3. public 与 admin 在 mobile/desktop 核心路径可用（PREF-03）

### Minimal automated verification set

- 单测：生命周期与过期过滤函数
- 集成：public feed API 仅返回有效 published deal
- 组件/页面：关键页面渲染 smoke test（home, admin list, admin form）

### Schema push requirement

本阶段涉及 Payload collection schema 变更（`src/collections/**/*.ts`）。
验证前必须执行迁移命令，防止“类型通过但数据库结构未同步”的假阳性。

- ORM: Payload CMS
- Required command: `CI=true PAYLOAD_MIGRATING=true npx payload migrate`

## Final Recommendation

Phase 1 采用 **Next.js + Payload + Tailwind**，先完成：

1. 单应用壳子与 `/admin` 入口
2. Deal collection + admin CRUD + 生命周期动作
3. Public feed 读取与过期自动隐藏

该路径最小可行、可验证、且对后续 Phase 2/3 复用度最高。
