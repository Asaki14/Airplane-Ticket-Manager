# Stack Research

**Domain:** 真实机票数据接入（单一官方/合作数据源）
**Researched:** 2026-04-30
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Amadeus Self‑Service APIs | N/A (SaaS) | 真实航班搜索/报价/航线与机场数据 | 官方/合作级别的航旅数据提供方之一，提供自助接入与测试环境，适合 v2.0 单一真实来源验证闭环（非出票） |
| Amadeus Node SDK (`amadeus`) | 11.1.0 | 统一封装 API 调用与 OAuth2 认证 | 官方 SDK，内置 token 管理与请求封装，减少自建 OAuth2 复杂度 | 
| OAuth2 Client Credentials | 标准 | 服务端鉴权与访问令牌管理 | Amadeus 自助 API 官方认证方式；适合后台服务调用 | 
| Redis（缓存层） | 7.x（建议） | 搜索结果/机场与航司基础数据缓存 | 机票价格时效短但可用短 TTL 降低成本，避免频繁命中外部 API |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `ioredis` | "+"（实现时锁定版本） | Redis 客户端 | 结果缓存、热词/热门路线缓存、令牌缓存（若不用 SDK） |
| `bullmq` | "+"（实现时锁定版本） | 任务队列/定时刷新 | 定期刷新热门路线、失效检测、后台补偿重试 |
| `bottleneck` | "+"（实现时锁定版本） | 速率限制/并发控制 | 遵守 API rate limit，避免流量尖峰导致封禁 |
| `p-retry` | "+"（实现时锁定版本） | 可控重试 | 处理 5xx/网络抖动，结合退避策略 |
| `opossum` | "+"（实现时锁定版本） | Circuit Breaker | 数据源波动时快速熔断，防止级联失败 |
| `pino` + `pino-http` | "+"（实现时锁定版本） | 结构化日志 | 追踪请求耗时、失败码、外部 API 错误率 |
| `@sentry/node` | "+"（实现时锁定版本） | 错误监控 | 追踪外部 API 失败、超时、解析错误 |
| `zod` | "+"（实现时锁定版本） | 响应结构校验/归一化 | 防止上游字段变化导致渲染/比较逻辑崩溃 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Amadeus Postman Collection | 调试与接口探索 | 官方提供，适合验证字段含义与示例响应 |
| Amadeus Mock Server | 本地/CI 模拟 | 用于前端/后端联调避免频繁耗费配额 |

## Installation

```bash
# Core
npm install amadeus

# Supporting
npm install ioredis bullmq bottleneck p-retry opossum pino pino-http @sentry/node zod
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Amadeus Self‑Service APIs | Sabre / Travelport / Duffel（商业合作） | 当需要更高覆盖率/出票能力且可接受商务合作成本时（需单独验证商业条款与可用性） |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| 在浏览器端直连机票 API | 暴露密钥且易被滥用/封禁 | 后端代理 + 受控缓存 + 限流 |
| 以网页抓取作为主数据源 | 易被封禁且不稳定、合规风险高 | 官方/合作 API 作为主源；抓取仅作为受控补充 |

## Stack Patterns by Variant

**如果仅做“发现 + 规则翻译 + 导流”：**
- 使用 Flight Offers Search + 基础参考数据（机场/航司）
- 因为无需出票，能最小化合规和复杂度

**如果需要“准实时对比 + 频繁刷新”：**
- 增加 Redis + 队列刷新 + 限流与熔断
- 因为外部 API 成本与稳定性需要可控

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `amadeus@11.1.0` | Node LTS | 官方 SDK 标注支持 LTS；生产建议跟随 LTS 版本策略 |

## Sources

- https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262 — OAuth2 Client Credentials 与 token 使用方式（HIGH）
- https://amadeus4dev.github.io/amadeus-node/ — SDK 版本与初始化方式（HIGH）
- https://github.com/amadeus4dev/amadeus-node — Node SDK 示例与版本信息（MEDIUM）

---
*Stack research for: 真实机票数据接入（单一官方/合作数据源）*
*Researched: 2026-04-30*
