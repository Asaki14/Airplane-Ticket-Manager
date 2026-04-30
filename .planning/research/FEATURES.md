# Feature Research

**Domain:** 单一官方/合作数据源的真实机票搜索与比价体验（v2.0 里程碑）
**Researched:** 2026-04-30
**Confidence:** LOW（未进行外部资料检索，仅基于常识与项目约束推断）

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 基本搜索条件（出发地/目的地/日期/人数） | 这是“能搜到真实航班”的最低门槛 | MEDIUM | 单一来源也需参数校验、日期范围与城市码映射 | 
| 结果列表展示（价格、时长、航司、起降时间、是否经停） | 用户需要快速判断是否可用 | MEDIUM | 明确展示来源与价格币种/税费范围 | 
| 基础筛选（直飞/经停、航司、起降时间段、行程时长、价格区间） | 过滤噪声是标准体验 | MEDIUM | 与来源筛选能力对齐；必要时在本地再过滤 | 
| 排序（价格/时长/起飞时间） | 用户默认有排序入口 | LOW | 需标注“按来源规则/本地规则” | 
| 详情页行程拆解（航段/中转、舱位、行李、退改规则、税费提示） | 购买前必须看明白 | HIGH | 与“规则翻译”联动；标记数据更新时间 | 
| 比较视图（2–3 条结果并排） | 这是产品既有核心价值延伸 | MEDIUM | 字段一致性：价格、时刻、经停、行李、退改 | 
| 跳转购买（到来源下单） | 项目定位为“发现+导流” | LOW | 必须标明来源与跳转时间 | 
| 价格时效/缓存提示 | 用户担心“点进去变价” | MEDIUM | 在列表/详情标注采集时间、失效风险 | 
| 无结果/失败状态 | 真实源经常失败或无票 | MEDIUM | 需有明确原因与建议条件（改日期/改时段） |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 规则翻译强化（退改/行李/票规摘要 + 风险提示） | 降低“看不懂票规”的决策门槛 | HIGH | 把来源字段转成可读中文并标明不确定性 | 
| “值不值”解释卡片（便宜在哪、代价是什么、适合谁） | 与产品核心价值强绑定 | MEDIUM | 基于时长/经停/行李/退改生成可解释结论 | 
| 价格可信度/稳定性标记（最近刷新/变价频率） | 建立信任，减少被“假低价”反噬 | HIGH | 需要记录多次采集或历史变化 | 
| “相似更优替代”推荐 | 帮助用户快速切换到更适合的票 | MEDIUM | 依赖结果池与排序/打分逻辑 | 
| 一键复制行程要点（给家人/同伴） | 提升分享与决策效率 | LOW | 文本模板 + 关键字段聚合 |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 站内下单/支付 | “一步到位”看起来体验更好 | 交易/合规/客服/退款链路重，偏离当前里程碑 | 坚持导流购买 + 明确来源责任 | 
| 实时全网秒级搜价 | 用户想“最准确价格” | 单一来源与成本/配额不匹配，且波动大 | 采用“刷新按钮 + 时效提示 + 缓存策略” | 
| 多来源同时比价 | “覆盖越全越好” | 复杂度与数据一致性急剧上升 | 先把单来源体验做到完整闭环 | 
| 复杂行程（多城市/里程票/商务舱） | 少数高级用户需求 | 规则与数据字段复杂，分散团队资源 | 聚焦中国出发经济舱单程/往返 |

## Feature Dependencies

```
真实搜索请求
    └──requires──> 来源参数映射（城市/机场/日期/乘客）
                     └──requires──> 来源字段标准化（票价/舱位/行李/退改）

筛选/排序/比较
    └──requires──> 结果字段规范化 + 数据时效标记

规则翻译
    └──requires──> 票规/退改/行李字段完整性

“值不值”解释
    └──requires──> 规则翻译 + 可对比字段一致性
```

### Dependency Notes

- **真实搜索请求 requires 来源参数映射：** 不同来源的城市/机场/日期格式不同，必须先标准化。
- **筛选/排序/比较 requires 字段规范化：** 没有统一字段就无法对齐对比与筛选。
- **规则翻译 requires 票规字段完整性：** 字段缺失会导致“解释不可信”。

## MVP Definition

### Launch With (v2.0)

Minimum viable product — what's needed to validate the concept.

- [ ] 单一来源真实搜索（出发地/目的地/日期）— 证明真实数据闭环
- [ ] 结果列表 + 基础筛选/排序 — 支撑快速决策
- [ ] 详情页行程拆解 + 规则翻译摘要 — 兑现“看得懂”价值
- [ ] 2–3 条对比视图 — 延续核心差异化
- [ ] 跳转来源购买 + 时效/更新提示 — 满足导流与信任

### Add After Validation (v2.0.x)

Features to add once core is working.

- [ ] 价格稳定性/变价历史提示 — 有足够采样后再做
- [ ] 相似更优替代推荐 — 有足够结果池后再做

### Future Consideration (v2.1+)

Features to defer until product-market fit is established.

- [ ] 多来源聚合比价 — 复杂度高且需合规授权
- [ ] 复杂行程玩法（多城市/里程票/商务舱）— 用户面更窄

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 真实搜索（单来源） | HIGH | MEDIUM | P1 |
| 结果列表 + 基础筛选/排序 | HIGH | MEDIUM | P1 |
| 详情页行程拆解 + 规则翻译摘要 | HIGH | HIGH | P1 |
| 对比视图（2–3） | MEDIUM | MEDIUM | P1 |
| 跳转购买 + 时效提示 | HIGH | LOW | P1 |
| 价格稳定性/变价历史 | MEDIUM | HIGH | P2 |
| 相似更优替代推荐 | MEDIUM | MEDIUM | P2 |
| 多来源聚合 | HIGH | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| 基本搜索/筛选 | OTA 标配（含大量筛选） | 航司官网（筛选较少） | 先做关键筛选，保证移动端效率 |
| 票规/行李展示 | 多为原文/复杂条款 | 简化但信息较少 | 规则翻译 + 风险提示（差异化） |
| 比较 | 多数需要多开页面 | 少量比较能力 | 2–3 条并排对比（核心价值） |

## Sources

- 未进行外部资料检索（需在后续补充官方/行业参考）

---
*Feature research for: 单一数据源真实机票搜索体验*
*Researched: 2026-04-30*
