# 项目总结 — 特价机票发现平台 (flight-deals-mvp)

> 生成日期: 2026-05-06
> 从 GSD 工作流切换到 Superpowers 工作流时的项目状态快照。

---

## 项目定位

面向中文用户的 **特价机票发现平台**。不是订票站，而是"特价发现 + 规则翻译 + 购买决策辅助"平台。

**Core Value:** 用户能在几分钟内判断一张"看起来便宜"的机票到底值不值得买，并能立即采取下一步。

---

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 15.5 (App Router) |
| 语言 | TypeScript 5.8 |
| CMS / ORM | Payload CMS 3.82.1 + SQLite |
| 数据源 | Amadeus Self-Service API |
| 测试 | Vitest 3.1 |

---

## 里程碑进度

### ✅ v1.0 (2026-04-11 已发布)

5 个阶段：Foundation & Deal CMS → Discovery Feed → Deal Detail → Preference-Led Discovery → Compare & Save

### 🔄 v2.0 (进行中)

| Phase | 状态 | 内容 |
|-------|------|------|
| **6** — Source Connectors & Canonical Fares | ✅ 完成 | 规范化票价模型、Amadeus 适配器、采集流水线、去重验证 |
| **7** — Real Search Results | ✅ 完成 | 搜索编排、API 路由、SearchBar/SearchFilters/SearchResultCard、主页改造 |
| **8** — Freshness & Failure Trust | 🆕 待开发 | UI-SPEC 已起草，待实现 |
| **9-10** | 📅 待定 | 决策面、运营控制台 |

---

## 技术决策

- **Amadeus Self-Service API** — 优先数据源（免费层可用）
- **不接支付** — v2 专注发现，非交易平台
- **SQLite** — MVP 快速迭代
- **多源聚合推迟** — 先跑通一条完整链路

---

## 架构

```
src/
├── app/                    # Next.js 页面 + API 路由
│   ├── page.tsx            # 首页 (搜索页面)
│   ├── api/fares/search/   # 票价搜索
│   └── ...
├── collections/            # Payload CMS: Deals, CanonicalFares, CollectionRuns, PendingRawPayloads
├── components/             # search/ + deals/ + home/
├── integrations/           # pipeline + providers + normalize
├── lib/                    # fares/ + deals/
└── types/                  # canonical-fare.ts, amadeus.d.ts
```
