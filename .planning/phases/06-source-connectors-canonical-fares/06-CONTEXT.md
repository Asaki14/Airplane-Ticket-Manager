# Phase 6: Source Connectors & Canonical Fares - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable the system to ingest and normalize real fares from at least one usable source, with validation and provenance so each stored fare can be traced to its source and collection run.

</domain>

<decisions>
## Implementation Decisions

### 数据源接入形态
- **D-01:** 首发优先官方免费 API/开放接口作为真实数据源接入形态。
- **D-02:** v2.0 仍保持“单一真实来源先跑通”的策略，多来源聚合留待后续阶段。

### 规范化字段与兼容策略
- **D-03:** 新增 CanonicalFare 规范化快照层，作为真实票价的权威来源。
- **D-04:** CanonicalFare 必填字段锁定为：来源与溯源、行程标识、价格与币种、舱位与行李。

### 校验与去重规则
- **D-05:** 采用严格阻断校验 + 硬规则去重，优先信任与可解释。
- **D-06:** 硬规则至少包含：字段完整性、价格合理区间、时间先后、行程重复判定。

### 溯源与原始数据留存
- **D-07:** raw payload 采用 SQLite 内联存储（JSON/Text 列）作为起步期留存方式。
- **D-08:** raw payload 保留周期为 30 天。

### the agent's Discretion
- CanonicalFare 与现有 Deals 的同步/映射细节（单向或双向）
- 去重键的具体字段组合与可调阈值
- raw payload 的压缩/清理实现方式

</decisions>

<specifics>
## Specific Ideas

- 以“免费官方/开放接口”作为 Phase 6 首发真实数据源形态

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 6 planning context
- `.planning/PROJECT.md` — v2.0 真实世界接入目标与约束
- `.planning/REQUIREMENTS.md` — DATA-01..DATA-04
- `.planning/ROADMAP.md` — Phase 6 goal and success criteria
- `.planning/STATE.md` — current phase focus and blockers

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/collections/Deals.ts` — Payload collection schema and validation hook pattern
- `src/lib/deals/validation.ts` — validation helper to extend with new hard rules
- `src/lib/deals/feed-query.ts` — current canonical feed record shape to align mapping

### Established Patterns
- Domain validation occurs in `validateDealInput` and is enforced via Payload `beforeValidate` hook
- Domain models live under `src/lib/deals/` and are reused by API + UI

### Integration Points
- Payload CMS config (`src/payload.config.ts`, `src/collections/Deals.ts`) for new CanonicalFare collection
- API route handlers (`src/app/api/**/route.ts`) for ingestion/validation pipeline endpoints

</code_context>

<deferred>
## Deferred Ideas

- 多来源聚合与合并策略 — later phase

</deferred>

---

*Phase: 06-source-connectors-canonical-fares*
*Context gathered: 2026-04-30*
