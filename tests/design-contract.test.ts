import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('design-contract', () => {
  it('globals define mandatory 2px focus ring with 2px offset', () => {
    const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')
    expect(css).toContain('0 0 0 2px var(--color-accent)')
    expect(css).toContain('outline-offset: 2px')
  })

  it('public and admin pages consume same token prefix', () => {
    const publicPage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    const adminPage = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')

    expect(publicPage).toContain('var(--color-')
    expect(adminPage).toContain('var(--color-')
  })

  it('home empty state copy stays aligned with ui spec contract', () => {
    const publicPage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    expect(publicPage).toContain('当前筛选下暂无可用特价，试试放宽条件或切换出发地/日期窗口。')
  })

  it('public and detail hero class contracts are present', () => {
    const publicPage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    const detailPage = readFileSync(resolve('src/app/deals/[id]/page.tsx'), 'utf-8')
    expect(publicPage).toContain('public-hero')
    expect(detailPage).toContain('detail-hero')
  })

  it('admin page excludes public hero decorative block', () => {
    const adminPage = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')
    expect(adminPage).not.toContain('public-hero')
  })

  it('deal detail page uses grouped detail grid variants', () => {
    const detailPage = readFileSync(resolve('src/app/deals/[id]/page.tsx'), 'utf-8')
    expect(detailPage).toContain('detail-grid--primary')
    expect(detailPage).toContain('detail-grid--rules')
  })

  it('primary cta copy contracts remain stable', () => {
    const publicPage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    const detailPage = readFileSync(resolve('src/app/deals/[id]/page.tsx'), 'utf-8')
    expect(publicPage).toContain('查看详情与票规')
    expect(detailPage).toContain('去来源页继续购买')
  })

  it('admin deals layout contract classes exist in globals', () => {
    const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')
    expect(css).toContain('.mobile-card-list')
    expect(css).toContain('.deal-card-mobile')
    expect(css).toContain('.desktop-table')
    expect(css).toContain('.deal-form')
  })

  it('home hero carousel visual and motion contracts exist in globals', () => {
    const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')
    expect(css).toContain('.hero-carousel')
    expect(css).toContain('.hero-carousel__slide')
    expect(css).toContain('.hero-carousel__controls')
    expect(css).toContain('.spring-atmosphere')
    expect(css).toContain('.hero-carousel--atmosphere')
    expect(css).toContain('pointer-events: none')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('transition: transform 180ms ease')
  })

  it('deal card atmosphere classes and reduced-motion guard remain in place', () => {
    const card = readFileSync(resolve('src/components/deals/DealCard.tsx'), 'utf-8')
    const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')
    expect(card).toContain('deal-card--atmosphere')
    expect(card).toContain('deal-card--scenic')
    expect(card).toContain('deal-card__atmosphere-layer')
    expect(card).toContain('deal-card__scene-layer')
    expect(card).toContain('deal-card__scene-overlay')
    expect(card).toContain('aria-hidden="true" role="presentation"')
    expect(card).toContain('loading="lazy"')
    expect(card).toContain('decoding="async"')
    expect(card).toContain('/images/atmosphere/sakura-blur.avif')
    expect(card).toContain('/images/atmosphere/temple-blur.avif')
    expect(css).toContain('.deal-card--atmosphere .deal-card__atmosphere-layer')
    expect(css).toContain('.deal-card--scenic .deal-card__scene-layer')
    expect(css).toContain('.deal-card--scenic .deal-card__scene-overlay')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('pointer-events: none')
    expect(css).toContain('transition: opacity 180ms ease')
  })

  describe('typography', () => {
    it('globals keep key typography selectors and token-based font-size mapping', () => {
      const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')

      expect(css).toContain('.hero-title')
      expect(css).toContain('.deal-card-shell__title')
      expect(css).toContain('.detail-card__title')
      expect(css).toContain('.compare-save__title')
      expect(css).toContain('var(--font-size-')
    })

    it('tokens provide typography scale plus line-height/weight contracts', () => {
      const tokens = readFileSync(resolve('src/styles/tokens.css'), 'utf-8')

      expect(tokens).toContain('--font-size-xs')
      expect(tokens).toContain('--font-size-sm')
      expect(tokens).toContain('--font-size-label')
      expect(tokens).toContain('--font-size-body')
      expect(tokens).toContain('--font-size-heading')
      expect(tokens).toContain('--font-size-display')
      expect(tokens).toContain('--font-size-price')
      expect(tokens).toContain('--line-height-tight')
      expect(tokens).toContain('--line-height-normal')
      expect(tokens).toContain('--font-weight-semibold')
      expect(tokens).toContain('--font-weight-bold')
    })

    it('key page modules retain typography target class hooks', () => {
      const homePage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
      const detailPage = readFileSync(resolve('src/app/deals/[id]/page.tsx'), 'utf-8')
      const dealCard = readFileSync(resolve('src/components/deals/DealCard.tsx'), 'utf-8')
      const comparePanel = readFileSync(resolve('src/components/deals/CompareAndSavePanel.tsx'), 'utf-8')

      expect(homePage).toContain('hero-title')
      expect(dealCard).toContain('deal-card-shell__title')
      expect(detailPage).toContain('detail-card__title')
      expect(comparePanel).toContain('compare-save__title')
    })
  })

  describe('compare advice contracts', () => {
    it('compare panel keeps advice block render hook and operation copy', () => {
      const comparePanel = readFileSync(resolve('src/components/deals/CompareAndSavePanel.tsx'), 'utf-8')

      expect(comparePanel).toContain('compare-card-shell__advice')
      expect(comparePanel).toContain('加入比较')
      expect(comparePanel).toContain('收藏')
      expect(comparePanel).toContain('分享链接')
    })

    it('globals define compare advice style hook', () => {
      const css = readFileSync(resolve('src/styles/globals.css'), 'utf-8')

      expect(css).toContain('.compare-card-shell__advice')
      expect(css).toContain('-webkit-line-clamp: 3')
    })
  })
})
