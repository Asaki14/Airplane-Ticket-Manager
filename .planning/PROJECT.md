# 特价机票发现平台

## What This Is

一个面向中文用户的网页应用，用来集中发现 OTA 平台和航空公司的特价机票，并把分散、复杂、容易踩坑的票价信息整理成可快速判断的决策界面。它不是另一个订票站，而是一个“特价发现 + 规则翻译 + 购买决策辅助”平台，优先服务价格敏感、时间相对灵活、希望捡到高性价比机票的人。

## Core Value

用户能在几分钟内判断一张“看起来便宜”的机票到底值不值得买，并能立即采取下一步。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 用户可以按出发地、目的地、出行时间窗口快速发现高性价比特价票
- [ ] 用户可以用简单中文看懂复杂票规、附加成本与限制条件
- [ ] 用户可以比较多个候选特价并快速跳转到来源平台下单
- [ ] 用户可以通过收藏和偏好设置减少重复筛选成本

### Out of Scope

- 站内支付、出票、退改签处理 — v1 先验证“发现和决策”价值，不碰重交易链路
- 全量全球实时搜价引擎 — 数据依赖和成本过高，MVP 先做精选 deals 与结构化展示
- 复杂多城市、商务舱、里程票玩法 — 先聚焦大众更高频的低价机票决策场景
- 原生 iOS / Android App — 先做 mobile-first Web，缩短验证周期

## Context

### Problem Space

当前机票特价信息存在五个核心问题：

1. 信息分散。OTA、航司官网、社群、公众号都会发活动，但用户很难集中追踪。
2. 规则复杂。低价票通常伴随日期限制、舱位限制、行李额度、退改条件，用户需要花时间读细则。
3. 伪低价多。展示价格低，不代表总成本低；很多票价不含托运、时间差、经停长或退改损失大。
4. 判断门槛高。用户知道“便宜”，但不知道“值不值”，缺少可解释的对比标准。
5. 时效性强。特价票可能几个小时就失效，慢一步就错过，导致发现成本和行动成本都很高。

### Target Users

- 灵感型旅行者：时间较灵活，希望先看“从我这里飞，哪里便宜”
- 价格敏感型出行者：返乡、周末短途、节假日前后，对预算非常敏感
- 羊毛/优惠关注者：愿意为了价格研究路线，但讨厌手动比对复杂规则

### Core Scenarios

- 用户打开首页，先选出发城市，快速浏览最近值得关注的低价目的地
- 用户点进某个 deal 详情页，立即看懂是否含行李、能否退改、是否红眼/经停、为什么它值得买
- 用户把两个到三个候选特价放到一起比较，决定哪个更适合自己
- 用户先收藏，再回头看，或者直接跳转到来源平台完成下单

### Product Outline

产品雏形建议围绕 4 个核心界面展开：

1. 首页 / 发现页
   - 顶部双入口：`从哪里出发找便宜票` 和 `想去哪里玩`
   - 主体是特价卡片流，突出价格、日期窗口、航空公司、价值标签、剩余时效
   - 内嵌快速筛选：出发地、目的地区域、时间窗口、价格上限、航空公司
2. deal 详情页
   - 顶部展示票价快照、来源、最后更新时间、失效时间
   - 中段是“规则翻译卡片”，把原始票规拆成用户能读懂的中文摘要
   - 底部给出“为什么值得买”和“适合谁”，再接来源平台跳转按钮
3. 对比面板
   - 支持最多 3 个候选 deal 并排比较
   - 比较字段优先级：价格、时间、直飞/经停、行李、退改、时效、价值分
4. 收藏与偏好
   - v1 允许本地收藏或轻量化账号后置
   - 记录默认出发城市、偏好区域、旅行主题，减少二次打开的筛选摩擦

### Differentiation Direction

这个产品不应该只做“机票列表页”，而要重点强化三个差异点：

- 规则翻译：把用户最怕读的票规，转成可读、可比较的中文信息
- 值得买解释：明确告诉用户便宜在哪里、代价是什么、适合谁
- 发现效率：让用户在不确定目的地的情况下，也能快速获得旅行灵感

## Constraints

- **Data freshness**: 票价时效很短，所有 deal 都需要展示采集时间、最后更新时间、失效时间
- **Trust**: 任何“值得买”结论都要附解释，不能只给分数不给理由
- **Execution**: 这是 greenfield MVP，优先验证产品价值，避免一开始投入重型搜价/出票能力
- **Experience**: 必须 mobile-first，同时保证桌面端筛选和比较体验足够高效
- **Content operations**: v1 很可能先采用人工或半自动录入 deal 的方式，保证上线速度和内容质量

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| v1 聚焦“中国出发的经济舱特价票” | 缩小数据复杂度和规则复杂度，先验证核心价值 | — Pending |
| 产品定位为“发现 + 解释 + 导流”而不是“站内出票” | 降低交易、合规和系统复杂度 | — Pending |
| 首页采用“按出发地发现”与“旅行灵感”双入口 | 同时覆盖任务导向和灵感导向用户 | — Pending |
| deal 详情页必须包含规则翻译、价值解释、来源与时效 | 建立信任，降低用户误判 | — Pending |
| MVP 先允许本地收藏，账号体系后置 | 保持上线路径轻量，先验证收藏是否真有价值 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-11 after initialization*
