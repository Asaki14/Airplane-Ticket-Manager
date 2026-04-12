---
phase: quick-260412-hj2-flight-card-advice-copy
plan: 01
type: summary
requirements:
  - COMP-03
  - COMP-04
  - PREF-03
completed_at: 2026-04-12T04:44:12Z
commits:
  - 0c7a660
  - 06c1675
  - 35a97b5
---

# Quick Task 260412-hj2 总结

为“比较、收藏与分享”卡片补齐了“特点 + 购买建议”中段：建议文案固定展示在航班标题下方、操作按钮上方，支持深圳→香港定制规则与通用兜底规则，让用户在点击按钮前先完成价值判断。

## 已完成任务

### Task 1：建议文案规则与测试（TDD）
- 新增 `src/lib/dealAdvice.ts`，导出 `buildDealAdvice(deal)`。
- 覆盖三类分支：
  - 深圳→香港低价高分：输出“性价比高 / 人少 / 适合短途出行”语义建议。
  - 其他航线：基于价格相对水平、经停信息、价值分输出“建议尽快下单 / 可再观察”。
  - 异常输入：返回安全兜底文案，不抛错。
- 新增 `tests/deal-advice.test.ts` 锁定上述行为，并约束文案长度 28-50 字。

**Commit:** `0c7a660`

### Task 2：比较/收藏卡片中段渲染与样式
- 在 `CompareAndSavePanel` 中每个 `compare-action-item` 插入 `compare-card-shell__advice`，位置位于标题后、按钮前。
- 文案统一由 `buildDealAdvice(deal)` 生成，组件内不再硬编码长段建议。
- `globals.css` 新增 `.compare-card-shell__advice` 样式：
  - 易读字号/行高
  - 与上下区块的层级与间距清晰
  - 三行截断避免撑爆卡片，保持按钮触达区与分享链接布局稳定

**Commit:** `06c1675`

### Task 3：源码合同测试防回退（TDD）
- 在 `tests/design-contract.test.ts` 新增 compare 合同断言：
  - 组件保留 `compare-card-shell__advice` 渲染钩子
  - 样式文件保留 `.compare-card-shell__advice` 定义
  - 关键交互文案（加入比较/收藏/分享链接）仍存在

**Commit:** `35a97b5`

## 验证结果
- `npm test -- tests/deal-advice.test.ts` ✅
- `npm test -- tests/design-contract.test.ts -t compare` ✅
- `npm run lint` ✅

## Deviations from Plan

None - plan executed exactly as written.

## Threat Model 对齐
- `T-quick-hj2-01`：建议生成仅基于可观测字段，异常输入统一走兜底文案，无绝对承诺语句。
- `T-quick-hj2-02`：建议区固定在标题与按钮之间，且“加入比较/收藏/分享”闭环完整保留。
- `T-quick-hj2-03`：建议区样式限制行高与行数，避免按钮区被挤压。

## Known Stubs
无。

## Self-Check: PASSED
- Summary 文件已创建：`.planning/quick/260412-hj2-flight-card-advice-copy/260412-hj2-SUMMARY.md`
- 任务提交存在：`0c7a660`, `06c1675`, `35a97b5`
