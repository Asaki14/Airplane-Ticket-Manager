# Roadmap: 特价机票发现平台

## Overview

这条路线从“先让运营能稳定发布 deal”开始，逐步搭建用户端的发现、理解、筛选和决策体验。MVP 的完成标准不是覆盖最多机票，而是让用户在真实特价票场景里更快做出更有把握的选择，并让运营可以持续维护一个可信、可更新的特价池。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Deal CMS** - 建立项目骨架、响应式界面基础和运营录入能力
- [ ] **Phase 2: Discovery Feed & Filters** - 搭建特价发现页、筛选和搜索路径
- [ ] **Phase 3: Deal Detail & Rule Decode** - 完成详情页、规则翻译和价值解释
- [ ] **Phase 4: Preference-Led Discovery** - 加入偏好设置和场景化入口，降低重复筛选成本
- [ ] **Phase 5: Compare, Save & Share** - 补齐比较、收藏和分享，形成完整决策闭环

## Phase Details

### Phase 1: Foundation & Deal CMS
**Goal**: 建立可持续维护的特价 deal 数据结构、运营后台入口和基础响应式 Web 壳子
**Depends on**: Nothing (first phase)
**Requirements**: [OPS-01, OPS-02, PREF-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 运营可以创建、编辑、发布、归档一条特价机票 deal
  2. 过期 deal 会自动或按规则从公开列表中消失
  3. 网站在移动端和桌面端都能正常完成核心导航和阅读
**Plans**: 3 plans

Plans:
- [ ] 01-01: 初始化应用框架、路由、设计变量和响应式页面壳子
- [ ] 01-02: 设计 deal 数据模型、后台表单和基本 CRUD 流程
- [ ] 01-03: 接通公开 feed 数据读取、时效处理和示例内容

### Phase 2: Discovery Feed & Filters
**Goal**: 让用户可以高效浏览、搜索和筛选当前可用的特价票
**Depends on**: Phase 1
**Requirements**: [DISC-01, DISC-02, DISC-03, DISC-04]
**Success Criteria** (what must be TRUE):
  1. 用户能看到包含出发地、目的地、日期窗口、航司和价格的特价卡片流
  2. 用户能按出发地、目的地区域、日期窗口、航司和价格上限筛选结果
  3. 用户能通过关键词搜索并按发布时间、价格、价值分排序
**Plans**: 3 plans

Plans:
- [ ] 02-01: 实现发现页卡片流、列表布局和空状态
- [ ] 02-02: 实现筛选器、排序器和查询参数同步
- [ ] 02-03: 实现关键词搜索和高频探索入口

### Phase 3: Deal Detail & Rule Decode
**Goal**: 把复杂票规翻译成用户能快速判断的详情体验
**Depends on**: Phase 2
**Requirements**: [RULE-01, RULE-02, RULE-03, RULE-04]
**Success Criteria** (what must be TRUE):
  1. 用户打开详情页后，能看到来源、发布时间、更新时间和失效时间
  2. 用户能直接读懂行李、退改、经停、舱位和限制条件的中文摘要
  3. 用户能理解平台为何判定该票“值得买”，并可跳转到来源页继续购买
**Plans**: 3 plans

Plans:
- [ ] 03-01: 搭建详情页信息架构和来源/时效模块
- [ ] 03-02: 实现票规结构化展示和中文规则翻译卡片
- [ ] 03-03: 实现价值解释模块和来源平台跳转

### Phase 4: Preference-Led Discovery
**Goal**: 让用户基于个人出发地和旅行偏好更快进入适合自己的特价集合
**Depends on**: Phase 3
**Requirements**: [PREF-01, PREF-02]
**Success Criteria** (what must be TRUE):
  1. 用户可以设置默认出发城市并在后续访问中自动应用
  2. 用户可以从周末捡漏、节假日前后、海岛、周边国际等专题入口进入发现页
  3. 产品首页能够同时承载任务导向和灵感导向两种浏览模式
**Plans**: 2 plans

Plans:
- [ ] 04-01: 实现默认出发城市和偏好持久化
- [ ] 04-02: 实现场景化专题入口和首页双入口结构

### Phase 5: Compare, Save & Share
**Goal**: 让用户完成候选方案比较、稍后决策和外部分享
**Depends on**: Phase 4
**Requirements**: [COMP-01, COMP-02, COMP-03, COMP-04]
**Success Criteria** (what must be TRUE):
  1. 用户可以把最多 3 个候选特价加入比较面板
  2. 用户可以并排比较价格、时间、行李、退改、经停和价值分
  3. 用户可以收藏 deal 并分享详情链接给自己或他人
**Plans**: 3 plans

Plans:
- [ ] 05-01: 实现比较面板状态管理和加入/移除交互
- [ ] 05-02: 实现并排比较视图和关键字段高亮
- [ ] 05-03: 实现本地收藏、回看入口和分享能力

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 2.1 → 2.2 → 3 → 3.1 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Deal CMS | 0/3 | Not started | - |
| 2. Discovery Feed & Filters | 0/3 | Not started | - |
| 3. Deal Detail & Rule Decode | 0/3 | Not started | - |
| 4. Preference-Led Discovery | 0/2 | Not started | - |
| 5. Compare, Save & Share | 0/3 | Not started | - |
