---
status: resolved
trigger: "Investigate issue: homepage-carousel-clipping\n\nSummary: 主页轮播区域的按钮和卡片显示不完全（桌面端右侧被裁切）"
created: 2026-04-12T06:11:12Z
updated: 2026-04-12T06:41:13Z
---

## Current Focus

hypothesis: 用户已确认修复生效，进入归档收尾
test: 更新会话状态为 resolved 并归档至 resolved 目录
expecting: 会话可追溯，根因/修复/验证信息完整
next_action: 移动 debug 文件到 .planning/debug/resolved/

## Symptoms

expected: 轮播中的按钮和卡片应完整可见且可点击
actual: 桌面端主页轮播区域右侧被裁切，导致按钮/卡片显示不完整
errors: 无报错
reproduction: 桌面端打开首页即可复现
started: 最近改动后出现，之前正常

## Eliminated

- hypothesis: 仅缺少 `.hero-carousel { min-inline-size:0 }` 就能修复裁切
  evidence: 用户在真实桌面环境反馈修复后仍被裁切
  timestamp: 2026-04-12T06:31:32Z

## Evidence

- timestamp: 2026-04-12T06:11:12Z
  checked: .planning/debug/knowledge-base.md 关键词匹配（"主页" "轮播" "裁切" "右侧"）
  found: 无 2+ 关键词重叠的已知案例；现有案例涉及 admin auth 与详情页 grid 收缩
  implication: 没有可直接复用的已知修复，需要独立调查

- timestamp: 2026-04-12T06:11:12Z
  checked: 轮播相关代码定位（grep/glob）
  found: 主页轮播实现位于 src/components/home/HeroDealCarousel.tsx，样式位于 src/styles/globals.css，首页入口位于 src/app/page.tsx
  implication: 下一步应完整阅读这三处文件，优先排查布局与 overflow 约束

- timestamp: 2026-04-12T06:12:49Z
  checked: src/app/page.tsx + src/components/home/HeroDealCarousel.tsx + src/styles/globals.css 全量阅读
  found: 1024+ 时 .public-shell 使用 12 列 grid，.hero-carousel 仅占 9/12 的 4 列；.spring-atmosphere 在同一容器上设置 overflow:hidden；轮播内部按钮区为 3 列最小内容布局
  implication: 桌面端出现右侧裁切与“grid item 不能收缩 + 父级隐藏溢出”路径高度一致

- timestamp: 2026-04-12T06:12:49Z
  checked: git log 轮播相关文件
  found: 最近多次改动集中在首页视觉与轮播布局（含 c94cec8、c2bb9dc、19fd012、b07d37f）
  implication: 需从这些提交差异中定位精确回归点并确认根因

- timestamp: 2026-04-12T06:13:36Z
  checked: 提交差异对比（b07d37f, 581436a, c2bb9dc, c94cec8）
  found: b07d37f 已引入桌面 12 列 + .hero-carousel 4 列布局；当时容器基线 padding 更小。c94cec8 将通用卡片 padding 提高到 var(--space-lg) var(--space-md)（影响 .hero-carousel），增加了窄列中的可用内容压力
  implication: 回归更可能由最近 spacing 变更触发，而非轮播组件逻辑本身

- timestamp: 2026-04-12T06:15:57Z
  checked: src/styles/globals.css 最小修复
  found: 在 .hero-carousel 添加 min-inline-size: 0
  implication: 允许 carousel 作为 grid item 在 4 列轨道内收缩，降低右侧裁切风险

- timestamp: 2026-04-12T06:15:57Z
  checked: npm run test && npm run build
  found: 59/59 测试通过，Next build 成功（仅存在既有 autoprefixer/Next 提示警告）
  implication: 修复未引入可见回归，构建链路稳定

- timestamp: 2026-04-12T06:16:45Z
  checked: npm run dev 冒烟启动
  found: 开发服务正常启动（端口 3002），无新增运行时报错
  implication: 修复在本地运行链路可加载，进入人工可视验收阶段

- timestamp: 2026-04-12T06:31:32Z
  checked: human-verify 用户反馈
  found: 真实桌面环境中轮播右侧仍然被裁切
  implication: 原根因判断不充分，需要回到 investigation loop 重新建模

- timestamp: 2026-04-12T06:33:55Z
  checked: Playwright 桌面 1440 实测（首页轮播元素矩形）
  found: `.hero-carousel` 宽约 363px，但 `.hero-carousel__track` 与 `.hero-carousel__controls` 均约 570px；第三个控制按钮 right=1520 明显超过容器 right=1296，且 controls 为普通文档流 grid（非 absolute）
  implication: 排除“按钮绝对定位到容器外”；确认核心是轨道/控制区自身计算宽度过大，属于 grid 轨道 sizing 问题

- timestamp: 2026-04-12T06:35:43Z
  checked: 反事实修复后 Playwright 1440 复测
  found: `.hero-carousel` clientWidth=361；`.hero-carousel__controls` width=329 且 right=1279（<= carousel right 1296）；`overflowBeyondCarousel=0`
  implication: 已直接消除“右侧被裁切”的机制，根因得到强证据支持

- timestamp: 2026-04-12T06:39:12Z
  checked: Playwright 多桌面宽度复测（1024/1100/1200/1366/1440，暂停自动轮播并重置到第1张）
  found: 各宽度下 controlsRight/slideRight/ctaRight 均未超过 carouselRight（最大仍保留容器内边距 -17px）
  implication: 排除“特定桌面分辨率 media query 冲突”导致的持续右切，修复具备跨桌面宽度稳定性

- timestamp: 2026-04-12T06:39:12Z
  checked: npm run test
  found: 59/59 测试通过
  implication: 修复未引入回归

## Resolution

root_cause: `.hero-carousel` 是 grid 容器但未定义列轨道时，默认 auto 轨道按子项 max-content 尺寸计算；在桌面窄右栏（4/12 列）下，`__track/__controls` 被算成约 570px，超过 carousel 实际可视宽（约 361px），再被 `overflow: hidden` 裁掉右侧内容。
fix: 在 `src/styles/globals.css` 为 `.hero-carousel` 增加 `grid-template-columns: minmax(0, 1fr)`（保留 `min-inline-size:0`），把内部轨道宽度强制约束到容器可用宽度。
verification: 用户真实桌面环境已确认修复生效；并已在 Playwright 桌面宽度 1024/1100/1200/1366/1440 下验证无越界裁切，`npm run test` 59/59 通过。
files_changed: ["src/styles/globals.css"]
