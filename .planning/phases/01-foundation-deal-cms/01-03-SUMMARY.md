---
phase: 01-foundation-deal-cms
plan: 03
subsystem: api
tags: [feed-api, expiry-filter, deal-card, pricing, freshness]
requires:
  - phase: 01-02
    provides: deals schema 与状态/时效字段
provides:
  - public feed API GET 入口
  - status+expiresAt 双条件过滤查询
  - 首页 DealCard 价格与 freshness 展示规则
affects: [phase-02, phase-03]
tech-stack:
  added: []
  patterns: [read-side-hard-filter, headline-primary-pricing, fixed-freshness-order]
key-files:
  created:
    - src/lib/deals/feed-query.ts
    - src/app/api/deals/feed/route.ts
    - src/components/deals/DealCard.tsx
  modified:
    - src/app/page.tsx
key-decisions:
  - "公开 feed 读取侧强制过滤 published 且 expiresAt > now"
  - "DealCard 主价格固定 headlinePrice，referenceTotalPrice 仅作辅助说明"
patterns-established:
  - "freshness 顺序固定为 发布时间→更新时间→失效时间"
requirements-completed: [OPS-02, PREF-03]
duration: 34min
completed: 2026-04-11
---

# Phase 1 Plan 03: Public Feed & Deal Card Rules Summary

**交付了公开 feed 的发布态与时效硬过滤，并在首页卡片落地主价格/参考总价与 freshness 固定顺序展示规则。**

## Performance

- **Duration:** 34 min
- **Started:** 2026-04-11T20:14:00Z
- **Completed:** 2026-04-11T20:28:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- 使用 TDD 完成 `status=published && expiresAt>now` 的 public feed 过滤逻辑。
- 新增 `/api/deals/feed` GET 接口并返回结构化 freshness 字段。
- 首页接入 feed 请求，DealCard 落地主价格/辅助价格与固定 freshness 顺序。

## Task Commits

1. **Task 1 RED: feed 过滤失败测试** - `4419b4b` (test)
2. **Task 1 GREEN: feed 查询与 API 实现** - `8e9b2ec` (feat)
3. **Task 2: DealCard 与首页渲染规则** - `7593c69` (feat)

## Files Created/Modified
- `src/lib/deals/feed-query.ts` - feed 过滤与响应映射。
- `src/app/api/deals/feed/route.ts` - public feed API。
- `src/components/deals/DealCard.tsx` - 价格与 freshness 展示组件。
- `src/app/page.tsx` - 首页调用 feed 并渲染 DealCard 列表。

## Decisions Made
- 公开侧只暴露展示必需字段，避免泄露内部运营字段。
- 读取侧过滤优先于后台状态更新任务，防止过期数据泄露。

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
- 无。

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2 可直接基于 feed API 叠加筛选/排序/搜索。
- 详情页与规则解码可复用 DealCard 中价格/时效语义。

## Known Stubs

- `src/app/api/deals/feed/route.ts`（sampleDeals 常量）: 当前 feed 使用样例数据，后续需接入真实 deals collection 查询。

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: network-endpoint | `src/app/api/deals/feed/route.ts` | 新增公开 GET API，需要后续结合真实数据源时继续审查字段最小暴露面 |

## Self-Check: PASSED
