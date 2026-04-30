# Architecture Research

**Domain:** 真实机票数据接入（单一官方/合作数据源）
**Researched:** 2026-04-30
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
+-------------------------------------------------------------------+
|                         Presentation Layer                         |
|  Web UI (search, filters, list, detail, compare)                   |
+---------------------------+----------------+-----------------------+
                            |                |
+---------------------------+----------------+-----------------------+
|                          API Layer                                 |
|  Search API  |  Detail API  |  Compare API  |  Admin Ops API        |
+---------------------------+----------------+-----------------------+
                            |                |
+---------------------------+----------------+-----------------------+
|                         Integration Layer                          |
|  Provider Adapter  |  Normalizer  |  Rule Translator  |  Cache     |
+---------------------------+----------------+-----------------------+
                            |                |
+---------------------------+----------------+-----------------------+
|                         Data & Ops Layer                            |
|  Provider API  |  Redis Cache  |  Jobs/Queue  |  Logs/Monitoring     |
+---------------------------+----------------+-----------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Provider Adapter | 调用官方/合作 API，处理鉴权与请求拼装 | SDK client + rate limiter |
| Normalizer | 将不同字段映射到统一结构 | Zod schema + transform |
| Rule Translator | 票规/行李/退改翻译与风险提示 | Mapping rules + template |
| Cache | 缓存搜索结果与参考数据 | Redis + TTL strategy |
| Jobs/Queue | 刷新、回填、失败重试 | BullMQ + retries |
| Ops Controls | 来源开关、刷新策略、失败回退 | Admin endpoints + config |

## Recommended Project Structure

```
src/
├── api/                  # HTTP endpoints
│   ├── search.ts         # flight search endpoints
│   ├── detail.ts         # flight detail endpoints
│   └── admin/            # ops controls
├── integrations/
│   ├── providers/        # provider adapters
│   │   └── amadeus/       # provider-specific impl
│   ├── normalize/        # normalization layer
│   └── rules/            # rule translation
├── services/
│   ├── search/            # search orchestration
│   ├── compare/           # compare orchestration
│   └── pricing/           # price & freshness logic
├── cache/
│   └── redis.ts
├── jobs/
│   └── refresh.ts
├── observability/
│   ├── logger.ts
│   └── metrics.ts
└── types/
    └── flight.ts
```

### Structure Rationale

- **integrations/providers:** isolate vendor-specific logic to allow future swap.
- **normalize/rules:** keep mapping and translation separate from API controllers.

## Architectural Patterns

### Pattern 1: Provider Adapter + Normalizer

**What:** 上游返回与前端展示解耦，统一中间层字段。
**When to use:** 任何外部数据源接入。
**Trade-offs:** 多一层 transform 成本，但换来稳定字段与可扩展性。

**Example:**
```typescript
// provider -> normalized offer
const offer = normalizeAmadeusOffer(rawOffer)
```

### Pattern 2: Stale-While-Revalidate Cache

**What:** 先返回可接受的缓存结果，同时后台刷新。
**When to use:** 搜索成本高、配额有限、用户可接受轻微延迟。
**Trade-offs:** 需要明确 freshness 提示，避免用户误解。

### Pattern 3: Circuit Breaker + Retry Budget

**What:** 外部 API 异常时快速熔断，避免级联故障。
**When to use:** 上游波动明显或配额紧张。
**Trade-offs:** 可能降低实时性，但提高可用性。

## Data Flow

### Request Flow

```
User Action
    -> Search API
        -> Provider Adapter
            -> External API
        -> Normalizer
        -> Cache
    -> Response (with freshness metadata)
```

### Key Data Flows

1. **Search flow:** search request -> provider -> normalized offers -> cache -> response.
2. **Detail flow:** offer id -> provider detail -> normalized detail -> rule translation.
3. **Ops refresh flow:** job -> provider -> cache refresh -> health status update.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | 单体服务 + Redis 缓存足够 |
| 1k-100k users | 增加队列与限流，分离 search 与 ops job |
| 100k+ users | 分离 provider adapters 与 search service，扩展缓存层 |

### Scaling Priorities

1. **First bottleneck:** 外部 API 配额/限流 -> 加强缓存与队列刷新。
2. **Second bottleneck:** 结果归一化与翻译耗时 -> 预处理与并发控制。

## Anti-Patterns

### Anti-Pattern 1: UI 直接调用外部 API

**What people do:** 前端直接请求第三方 API。
**Why it's wrong:** 暴露密钥，无法做限流与缓存。
**Do this instead:** 后端代理 + 缓存 + 监控。

### Anti-Pattern 2: 不标注时效

**What people do:** 展示价格但不标明采集时间。
**Why it's wrong:** 价格波动导致信任崩塌。
**Do this instead:** 列表/详情统一标注 freshness。

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Amadeus API | Server-to-server OAuth2 + SDK | 需缓存 token，注意配额 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| API -> integrations | direct service call | 保持接口稳定，便于换源 |
| services -> cache | direct | TTL 与 stale 策略统一 |

## Sources

- https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262
- https://amadeus4dev.github.io/amadeus-node/

---
*Architecture research for: 真实机票数据接入（单一官方/合作数据源）*
*Researched: 2026-04-30*
