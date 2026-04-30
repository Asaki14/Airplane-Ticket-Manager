# Project Research Summary

**Project:** 特价机票发现平台
**Domain:** 真实机票数据接入（单一官方/合作数据源）
**Researched:** 2026-04-30
**Confidence:** MEDIUM

## Executive Summary

该里程碑的核心是在既有“发现+规则翻译+导流”的定位上，接入一个真实且可用的官方/合作数据源，以最小闭环验证真实搜索到购买跳转的体验。研究结果建议以单一来源为主，先完成字段标准化、时效提示、规则翻译与失败回退，避免过早追求覆盖面导致复杂度失控。

关键风险集中在：上游字段不一致导致筛选/对比失效、缓存与时效提示脱节引发信任问题、上游波动导致可用性下降。建议以“适度缓存 + 时效提示 + 运维开关”为核心策略，并以清晰的 UI 提示建立用户信任。

## Key Findings

### Recommended Stack

使用官方/合作数据源（如 Amadeus Self‑Service APIs）配合 Node SDK 与 OAuth2 Client Credentials 进行服务端接入，外加 Redis 缓存与限流/熔断/重试机制保障稳定性。建议在接入层加入字段标准化与 schema 校验，以保证筛选、对比、规则翻译一致可用。

**Core technologies:**
- Amadeus Self‑Service APIs: 真实航班搜索与报价的官方合作来源
- Amadeus Node SDK (`amadeus`): 官方 SDK，内置鉴权与请求封装
- Redis: 搜索结果与基础数据缓存，降低配额压力

### Expected Features

必须具备真实搜索、列表展示、基础筛选/排序、详情页行程与规则翻译、2–3 条对比与跳转购买，并在所有关键位置标注采集时间与失效风险。差异化可集中在“规则翻译 + 值得买解释”，但需以字段完备与一致性为前置条件。

**Must have (table stakes):**
- 真实搜索条件 + 列表展示
- 基础筛选/排序 + 详情页行程拆解
- 比较视图 + 跳转购买 + 时效提示

**Should have (competitive):**
- 规则翻译强化 + 风险提示
- “值不值”解释卡片

**Defer (v2+):**
- 多来源聚合与复杂行程玩法

### Architecture Approach

建议采用“Provider Adapter + Normalizer + Rule Translator + Cache”的分层结构，API 层与接入层解耦，形成可替换的数据源接入模块，并保留运维控制与失败回退能力。

**Major components:**
1. Provider Adapter — 外部 API 调用与鉴权
2. Normalizer — 字段标准化与 schema 校验
3. Rule Translator — 票规/行李/退改翻译与风险提示

### Critical Pitfalls

1. **字段不一致导致筛选/对比失效** — 通过统一字段模型与校验避免。
2. **缓存与时效提示脱节** — 所有页面统一标注 freshness。
3. **上游波动导致前台不可用** — 熔断 + 缓存回退 + 失败状态设计。

## Implications for Roadmap

### Phase 1: 数据接入与字段标准化
**Rationale:** 所有筛选、对比与规则翻译都依赖统一字段模型。
**Delivers:** 单一来源接入 + 统一字段模型 + 基础搜索 API。
**Addresses:** 真实搜索、字段标准化（FEATURES 表格化能力）。
**Avoids:** 字段不一致导致筛选/对比失效。

### Phase 2: 真实展示与可靠性保障
**Rationale:** 用户信任来自时效提示、失败回退与稳定体验。
**Delivers:** 列表/详情/对比展示 + freshness 标注 + 缓存回退 + 运维开关。
**Uses:** Redis、限流、熔断。
**Implements:** Cache + Ops Controls。

### Phase 3: 规则翻译与决策解释
**Rationale:** 兑现“看得懂、值不值”的核心价值。
**Delivers:** 规则翻译摘要 + 风险提示 + 值得买解释卡片。

### Phase Ordering Rationale

- 先接入与标准化，确保后续展示与对比有一致字段基础。
- 再补强可靠性与时效提示，避免信任问题。
- 最后深化规则翻译与价值解释，巩固差异化。

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** 真实数据源字段与配额限制需要进一步确认。
- **Phase 3:** 票规翻译与风险提示规则需结合来源字段实际情况。

Phases with standard patterns (skip research-phase):
- **Phase 2:** 缓存/熔断/回退属于标准可靠性模式。

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | 有官方来源参考，但尚未绑定具体供应商协议 |
| Features | LOW | 未外部检索，需结合真实来源字段再验证 |
| Architecture | MEDIUM | 典型集成架构，需结合现有代码调整 |
| Pitfalls | MEDIUM | 主要基于通用经验与约束推断 |

**Overall confidence:** MEDIUM

### Gaps to Address

- 真实来源字段覆盖度与价格/税费/行李/退改的可得性。
- 配额、缓存 TTL、刷新策略的实际限制。

## Sources

### Primary (HIGH confidence)
- https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262 — OAuth2 与 token 使用
- https://amadeus4dev.github.io/amadeus-node/ — SDK 使用说明

### Tertiary (LOW confidence)
- 当前为推断性研究，需结合具体数据源进一步验证

---
*Research completed: 2026-04-30*
*Ready for roadmap: yes*
