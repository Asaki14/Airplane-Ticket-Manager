# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**航易** — 特价机票发现平台。面向中文用户，集中发现 OTA 平台和航空公司的特价机票，将分散复杂的票价信息整理成可快速判断的决策界面。MVP 阶段，优先验证产品价值。

## Commands

- `npm run dev` — 启动开发服务器（自动检查 ADMIN_GATE_USERNAME/PASSWORD）
- `npm run build` — 构建生产版本
- `npm run lint` — ESLint 检查 `src/**/*.{ts,tsx}` 和 `tests/**/*.ts`
- `npm test` / `npm run test:quick` — 运行所有测试
- 运行单个测试文件：`npx vitest run tests/xxx.test.ts`
- 启动 dev server 后访问 `/admin` 需要 Basic Auth（由 `.env.local` 中的 `ADMIN_GATE_USERNAME`/`ADMIN_GATE_PASSWORD` 控制）

## Tech Stack

- **Next.js 15** (App Router) — 页面 + API 路由
- **Payload CMS 3.82** + SQLite — 内容管理后台
- **Ignav API** — 实时票价数据源（通过 `IGNAV_API_KEY` 配置，留空则使用 Mock 适配器）
- **TypeScript** — strict mode, ES2022 target
- **Vitest** — 单一测试框架，所有测试在 `tests/` 目录下
- **CSS** — 设计令牌 (`styles/tokens.css`) + 全局样式 (`styles/globals.css`)

## Architecture

### 票价采集管道 (Fare Collection Pipeline)

```
ProviderAdapter (interface)
  └─ IgnavAdapter / MockIgnavAdapter
       └─ runCollectionPipeline()
            ├─ 1. Fetch raw fares (provider.search)
            ├─ 2. Normalize each fare → CanonicalFare (normalizeIgnavFare)
            ├─ 3. Validate (validateCanonicalFare)
            ├─ 4. Dedup (dedupKey / isDuplicate)
            └─ 5. Persist to Payload 'canonical-fares' collection
```

### 搜索流程 (Search Flow)

```
Public API: GET /api/fares/search?from=上海&to=北京&date=YYYY-MM-DD
  ├─ 1. 中文城市名 → IATA 代码 (city-map)
  ├─ 2. 查询 Payload 缓存 (canonical-fares, same route + date)
  ├─ 3. 缓存命中且 < 2h → 直接返回 cache 结果
  ├─ 4. 缓存过期或为空 → 触发 Ignav 实时采集管道
  └─ 5. 返回 live 结果
```

### 数据模型 (Payload Collections)

| Collection | 用途 |
|---|---|
| `deals` | 运营编辑的特价 deal (人工录入) |
| `canonical-fares` | 标准化票价快照 (管道采集产出) |
| `collection-runs` | 每次采集运行的元数据 (状态/计数/错误) |
| `pending-raw-payloads` | 原始 JSON 载荷 (数据溯源) |

### 核心类型

- `CanonicalFare` (`src/types/canonical-fare.ts`) — 标准化票价类型，包含来源、行程、价格、舱位、行李、时间戳
- `ProviderAdapter` (`src/integrations/provider.ts`) — 外部数据源适配器接口 (search, healthCheck, isConfigured)
- `SearchFareResponse` (`src/lib/fares/search.ts`) — 搜索 API 响应格式

### 关键设计决策

- **Admin Gate**: 所有 `/admin/*` 路由通过 Basic Auth 保护，由 middleware.ts 处理
- **缓存优先**: 搜索结果缓存 2h，过期后自动触发实时采集
- **Mock 模式**: 未配置 `IGNAV_API_KEY` 时，系统自动回退到 MockIgnavAdapter，无需真实 API 即可开发
- **数据溯源**: 每条 CanonicalFare 通过 `rawPayloadRef` + `collectionRunId` 追踪到原始请求
- **城市映射**: 支持中文城市名、机场名、IATA 代码混合输入 (`src/lib/fares/city-map.ts`)
- **Admin pages 使用 `dynamic = 'force-dynamic'`** 避免 SQLite 预渲染错误

### 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 首页 (搜索 UI + 结果展示)
│   ├── layout.tsx          # 根布局
│   ├── admin/              # 运营后台页面
│   └── api/
│       ├── fares/search/   # 公开搜索 API
│       ├── fares/booking-links/  # 预订链接 API
│       ├── admin/fares/collect/  # 手动触发采集 API
│       └── admin/deals/    # Deal CRUD API
├── collections/            # Payload CMS 集合定义
├── components/             # React 组件
│   ├── search/             # 搜索栏、筛选、结果卡片、空状态
│   └── deals/              # 对比面板、发现偏好
├── integrations/           # 外部数据源集成
│   ├── provider.ts         # ProviderAdapter 接口
│   ├── providers/ignav.ts  # Ignav API 适配器 + Mock
│   ├── normalize/ignav.ts  # Ignav 数据 → CanonicalFare 标准化
│   └── pipeline.ts         # 完整采集管道编排
├── lib/                    # 业务逻辑
│   ├── fares/              # 搜索、城市映射、去重、验证、留存
│   └── deals/              # Deal 相关逻辑
├── types/                  # TypeScript 类型
└── styles/                 # CSS 设计令牌 + 全局样式
```

## Testing Patterns

- 使用 `vi.mock()` 在模块级别模拟外部依赖 (city-map, pipeline, provider)
- 测试文件直接导入源文件 (`../src/xxx`) 而非通过构建产物
- Payload CMS 的数据库操作通过 mock `payload.find` / `payload.create` 来模拟
- 测试覆盖: 标准化、验重、去重、搜索缓存策略、deal 架构验证、前端组件
- `vitest.config.ts` 配置了 `@/` => `src/` 和 `@payload-config` 的路径别名

## Workflow

该项目使用 Superpowers (obra/superpowers) 工作流。通过 `skill` 工具加载技能。
关键技能: brainstorming, writing-plans, using-git-worktrees, test-driven-development。
详见 `AGENTS.md`。
