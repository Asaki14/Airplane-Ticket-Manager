---
phase: quick-260412-grc-optimize-typography
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/tokens.css
  - src/styles/globals.css
  - src/app/page.tsx
  - src/components/deals/DealCard.tsx
  - src/app/deals/[id]/page.tsx
  - src/components/deals/CompareAndSavePanel.tsx
  - tests/design-contract.test.ts
autonomous: true
requirements:
  - PREF-03
must_haves:
  truths:
    - "用户在首页、详情页、比较区阅读时，标题层级清晰且不再出现标题偏小/正文偏大的反直觉比例"
    - "移动端与桌面端的字号、行高、间距节奏一致，长文案不会挤压核心价格与CTA"
    - "字体与字号规范有自动化合同测试，后续改样式不易回退到混乱状态"
  artifacts:
    - path: "src/styles/tokens.css"
      provides: "统一字体族、字号阶梯、行高与字重 token"
      contains: "--font-size-*"
    - path: "src/styles/globals.css"
      provides: "全局排版基线与关键模块文字层级规则"
      contains: "h1, h2, h3"
    - path: "tests/design-contract.test.ts"
      provides: "排版合同断言"
      contains: "typography"
  key_links:
    - from: "src/styles/tokens.css"
      to: "src/styles/globals.css"
      via: "CSS 变量引用"
      pattern: "var\\(--font-size-"
    - from: "src/styles/globals.css"
      to: "src/app/page.tsx"
      via: "公共页面类名选择器"
      pattern: "public-hero|deal-card|detail-card"
---

<objective>
在不改业务流程的前提下，统一站点核心页面（首页、Deal 卡片、详情页、比较区）的字体、字号、行高和字重层级，解决“标题小/内容大、阅读节奏混乱”的问题。

Purpose: 提升信息可读性与视觉一致性，让用户更快判断价格、规则、时效和下一步动作。
Output: 一套可复用的排版 token + 全局排版规则 + 自动化防回退断言。
</objective>

<context>
@.planning/STATE.md
@AGENTS.md
@src/styles/tokens.css
@src/styles/globals.css
@src/app/page.tsx
@src/components/deals/DealCard.tsx
@src/app/deals/[id]/page.tsx
@src/components/deals/CompareAndSavePanel.tsx
@tests/design-contract.test.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: 建立统一排版 token 与全局文字层级基线</name>
  <files>src/styles/tokens.css, src/styles/globals.css</files>
  <action>在 `tokens.css` 中补齐并规范排版变量：正文、辅助文本、小标题、大标题、展示标题、价格数字、按钮文本的字号/行高/字重（保留现有春日视觉 token，不引入新字体库）。在 `globals.css` 增加全局排版基线：`body`、`h1/h2/h3`、`p/li`、`small`、按钮与输入控件文字统一映射到 token；明确移动端优先并在 `@media (min-width: 768px/1024px)` 下只做有限放大，避免桌面端正文过大。禁止直接写散落的 magic number 字号（如单独 13px/17px 随机分布），统一走变量。</action>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>核心文字元素均由统一 token 驱动，页面默认阅读节奏稳定，标题与正文层级明确。</done>
</task>

<task type="auto">
  <name>Task 2: 对首页/卡片/详情/比较区落地语义化文字层级</name>
  <files>src/styles/globals.css, src/app/page.tsx, src/components/deals/DealCard.tsx, src/app/deals/[id]/page.tsx, src/components/deals/CompareAndSavePanel.tsx</files>
  <action>在不改变文案和业务逻辑的前提下，给关键模块补充稳定的语义类名或使用已有类名，精确控制：Hero 标题与副文案、Deal 卡片标题/价格/元信息、详情页分区标题与规则正文、比较区标题与字段列表。确保“价格与CTA > 标题 > 元信息/辅助描述”的视觉优先级，并修复当前出现的“卡片正文视觉抢过标题”问题；长文本保持 clamp 与换行策略，不让字号调整导致卡片撑破。仅做排版与可读性优化，不新增交互功能。</action>
  <verify>
    <automated>npm test -- tests/design-contract.test.ts</automated>
  </verify>
  <done>四个核心区域的文字层级统一，移动端与桌面端均无明显字号失衡或阅读跳跃。</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: 增加排版合同测试防止字号层级回退</name>
  <files>tests/design-contract.test.ts, src/styles/globals.css, src/styles/tokens.css</files>
  <behavior>
    - Test 1: `globals.css` 持有关键排版选择器（hero/deal-card/detail-card/compare）并使用 `var(--font-size-*)`
    - Test 2: `tokens.css` 提供完整字号阶梯与对应 line-height/weight token
    - Test 3: 关键页面源码仍包含排版目标区域类名（保证规则可命中）
  </behavior>
  <action>在 `tests/design-contract.test.ts` 增加 typography 合同断言：检查排版 token 存在、关键选择器存在、关键模块映射到字体变量；补充必要的最小样式声明以通过测试。保持测试为源码合同测试，不引入慢速 e2e。</action>
  <verify>
    <automated>npm test -- tests/design-contract.test.ts -t typography</automated>
  </verify>
  <done>新增的 typography 断言可稳定通过，并能在未来样式回退时快速失败提示。</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| 样式规则→核心决策信息 | 排版调整可能误伤价格、时效、CTA 的可见性与优先级 |
| 全局排版→局部模块 | 全局字号变更可能造成卡片溢出、布局错位 |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-01 | D | src/styles/globals.css | mitigate | 为关键文本定义 clamp/换行/行高上限，避免字体变更导致布局压垮 |
| T-quick-02 | I | src/components/deals/DealCard.tsx | mitigate | 固化价格与CTA层级规则，保证关键购买判断信息不被弱化 |
| T-quick-03 | T | tests/design-contract.test.ts | mitigate | 用源码合同测试锁定排版 token 与选择器，防止后续无意改坏 |
</threat_model>

<verification>
- `npm run lint`
- `npm test -- tests/design-contract.test.ts`
</verification>

<success_criteria>
- 首页、详情页、比较区与 Deal 卡片的标题/正文/辅助信息层级一致，用户可直观看懂主次
- 移动端（含窄屏）无明显字号失衡或文本撑破卡片
- typography 合同测试通过，且能覆盖关键排版规则
</success_criteria>

<output>
After completion, create `.planning/quick/260412-grc-optimize-typography/260412-grc-SUMMARY.md`
</output>
