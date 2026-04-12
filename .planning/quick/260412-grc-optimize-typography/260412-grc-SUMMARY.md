---
phase: quick-260412-grc-optimize-typography
plan: 01
type: summary
requirements:
  - PREF-03
completed_at: 2026-04-12T12:16:00Z
commits:
  - 3529662
  - 1032438
  - 36369b6
  - 0519184
---

# Quick Task 260412-grc 总结

统一了首页、Deal 卡片、详情页、比较区的排版层级：价格与 CTA 保持最高视觉优先级，标题/正文/辅助信息节奏更稳定，并通过 typography 合同测试防止回退。

## 已完成任务

### Task 1：建立统一排版 token 与全局文字层级基线
- 新增并规范字号阶梯、行高、字重 token（含按钮与价格场景）
- 将 body / heading / p / li / small / form / button 映射到 token，减少散落 magic number
- 维持 mobile-first，并在 768/1024 仅做有限放大

**Commit:** `3529662`

### Task 2：首页/卡片/详情/比较区落地语义化文字层级
- 首页 Hero、模式卡片文本增加稳定语义类名（`hero-title`、`hero-description` 等）
- Deal 卡片强化“价格 > 标题 > 元信息”优先级，保留 clamp 与换行约束
- 详情页与比较区补充标题/描述/链接语义类名，统一阅读节奏

**Commit:** `1032438`

### Task 3（TDD）：增加排版合同测试
**RED**
- 先添加 typography 合同断言（关键选择器、token 阶梯、类名命中点）

**Commit:** `36369b6`

**GREEN**
- 补齐兼容 token `--font-size-heading` 使新断言通过
- 完整运行 design-contract 测试，确认通过

**Commit:** `0519184`

## 验证结果
- `npm run lint` ✅
- `npm test -- tests/design-contract.test.ts` ✅
- `npm test -- tests/design-contract.test.ts -t typography` ✅

## Deviations from Plan

### Auto-fixed Issues
1. **[Rule 3 - Blocking] 现有设计合同测试包含额外氛围层约束**
   - 现象：执行 Task 2 验证时，`design-contract` 失败，要求 `DealCard` 保留 `deal-card--atmosphere` / `deal-card__atmosphere-layer` 与对应 CSS 命中。
   - 处理：补回卡片氛围层类名与节点，避免与既有合同冲突。
   - 影响文件：`src/components/deals/DealCard.tsx`

2. **[Rule 3 - Blocking] Hero 轮播过渡时长合同值不一致**
   - 现象：测试要求 `transition: transform 180ms ease`，临时调整为 280ms 后导致失败。
   - 处理：恢复为 180ms，保持与现有合同一致。
   - 影响文件：`src/styles/globals.css`

## Threat Model 对齐
- `T-quick-01`：通过 clamp、行高、最大字符宽度与换行策略，降低全局字号调整导致溢出风险。 
- `T-quick-02`：卡片中价格与 CTA 保持更高字号/字重与清晰层级，防止决策信息弱化。  
- `T-quick-03`：新增 typography 合同断言覆盖 token、选择器、类名命中点。

## Known Stubs
无。

## Self-Check: PASSED
- Summary 文件已创建：`.planning/quick/260412-grc-optimize-typography/260412-grc-SUMMARY.md`
- 执行任务提交存在：`3529662`, `1032438`, `36369b6`, `0519184`
