# Pitfalls Research

**Domain:** 真实机票数据接入（单一官方/合作数据源）
**Researched:** 2026-04-30
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: 字段不一致导致筛选/对比失效

**What goes wrong:** 列表、详情、对比字段不一致，导致筛选无效或对比错误。

**Why it happens:** 直接透传上游字段，未做统一字段定义与校验。

**How to avoid:** 建立统一字段模型与严格的 normalize + schema 校验。

**Warning signs:** 前端出现“字段缺失”占位、对比栏无法对齐。

**Phase to address:** Phase 1（数据接入与字段标准化）

---

### Pitfall 2: 缓存与时效提示脱节

**What goes wrong:** 用户看到价格，但点入后变价/无票，引发不信任。

**Why it happens:** 缓存策略与 UI 提示不一致，未明确展示采集时间与风险。

**How to avoid:** 统一 freshness 字段，列表/详情/对比都展示更新时间。

**Warning signs:** 用户反馈“价格不准”“点进去不一样”。

**Phase to address:** Phase 2（真实展示与信任提示）

---

### Pitfall 3: 外部 API 波动导致前台不可用

**What goes wrong:** 数据源失败时页面直接报错或空白。

**Why it happens:** 缺少熔断、回退与错误提示。

**How to avoid:** 熔断 + 缓存回退 + 失败状态设计。

**Warning signs:** 失败率上升时用户端无清晰提示。

**Phase to address:** Phase 2（可靠性与回退机制）

---

### Pitfall 4: 票规翻译不完整导致误导

**What goes wrong:** 规则翻译遗漏关键限制，用户决策被误导。

**Why it happens:** 票规字段缺失或翻译规则不完整。

**How to avoid:** 明确“可用字段清单 + 不确定性提示”。

**Warning signs:** 规则翻译字段频繁为空或不一致。

**Phase to address:** Phase 3（规则翻译与解释能力）

---

### Pitfall 5: 运营开关缺失导致全站受影响

**What goes wrong:** 单一来源故障时无法快速降级。

**Why it happens:** 未提供数据源开关与运维控制。

**How to avoid:** 提供来源开关、刷新策略与健康监控。

**Warning signs:** 需要紧急改代码才能恢复服务。

**Phase to address:** Phase 2（运营保障）

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 直接透传上游字段 | 开发快 | 前端字段混乱、难以对比 | MVP 原型阶段，必须在 Phase 1 结束前替换 |
| 无缓存直连 | 实时性高 | 配额耗尽、失败率高 | 仅用于内部调试 |
| 忽略失败状态 | 视觉更“干净” | 用户信任崩塌 | 从不接受 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| OAuth2 | 频繁换 token | 缓存 token，统一刷新 |
| Provider API | 未限流 | 限流 + 重试预算 |
| Redis cache | 无 TTL | TTL + stale 策略 |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 无缓存/无队列 | 搜索慢、失败率高 | 缓存 + 异步刷新 | 1k+ 日活 |
| 过多同步翻译 | API 响应变慢 | 预处理或懒加载 | 5k+ 日活 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| 前端暴露 API Key | 被滥用、封禁 | 后端代理 + 环境变量 |
| 未脱敏日志 | 泄露用户查询信息 | 日志脱敏 + 采样 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 不解释变价原因 | 用户不信任 | 明确提示时效与变动风险 |
| 规则翻译过长 | 用户看不懂 | 摘要 + 展开原文 |

## "Looks Done But Isn't" Checklist

- [ ] **真实搜索：** 没有展示采集时间 — 验证所有列表项包含 freshness。
- [ ] **筛选：** 仅前端过滤 — 验证与来源筛选能力一致。
- [ ] **详情页：** 退改/行李字段为空 — 验证规则翻译覆盖率。
- [ ] **跳转购买：** 无来源标识 — 验证跳转前声明来源责任。

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| 上游失效 | MEDIUM | 启用缓存回退 + 显示“数据延迟”提示 |
| 票规缺失 | LOW | 标记“未知”并提示风险 |
| 配额耗尽 | HIGH | 限流降级 + 延迟刷新 |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 字段不一致 | Phase 1 | 样本搜索结果字段一致性检查 |
| 缓存与时效脱节 | Phase 2 | UI 全面展示 freshness |
| 上游波动 | Phase 2 | 失败时仍可返回缓存 |
| 规则翻译不完整 | Phase 3 | 覆盖率统计与风险提示 |

## Sources

- https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262
- https://amadeus4dev.github.io/amadeus-node/

---
*Pitfalls research for: 真实机票数据接入（单一官方/合作数据源）*
*Researched: 2026-04-30*
