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
})
