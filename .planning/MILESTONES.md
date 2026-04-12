# Milestones

## v1.0 milestone (Shipped: 2026-04-11)

**Phases completed:** 5 phases, 15 plans, 11 tasks

**Key accomplishments:**

- 交付了可运行的 public/admin 双表面壳子，并用轻量 `/admin` 守门和统一 token 奠定后续 CMS 与 feed 的结构基础。
- 完成了 Deal CMS 的数据模型、后台 CRUD 壳子与迁移链路，使运营可按单条手动流管理 deal 生命周期。
- 交付了公开 feed 的发布态与时效硬过滤，并在首页卡片落地主价格/参考总价与 freshness 固定顺序展示规则。
- Admin Basic gate contract was restored for `/admin/deals` and `/admin/deals/{id}` by unifying 401 challenge behavior, adding startup env precheck, and codifying UAT replay steps.

---
