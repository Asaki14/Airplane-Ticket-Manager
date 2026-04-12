import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('app-shell', () => {
  it('public home contains hero and navigation', () => {
    const content = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    expect(content).toContain('public-hero')
    expect(content).toContain('主导航')
    expect(content).toContain('当前筛选下暂无可用特价，试试放宽条件或切换出发地/日期窗口。')
  })

  it('home imports hero carousel and keeps carousel a11y copy contract', () => {
    const homePage = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    const carousel = readFileSync(resolve('src/components/home/HeroDealCarousel.tsx'), 'utf-8')

    expect(homePage).toContain('HeroDealCarousel')
    expect(carousel).toContain('aria-label="首页特价轮换"')
    expect(carousel).toContain('暂停轮播')
    expect(carousel).toContain('继续轮播')
    expect(carousel).toContain('4500')
  })

  it('admin shell page exists with admin marker', () => {
    const content = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')
    expect(content).toContain('admin')
    expect(content).toContain('运营入口')
  })

  it('admin deals list binds mobile and desktop layout classes with edit entry', () => {
    const dealsPage = readFileSync(resolve('src/app/admin/deals/page.tsx'), 'utf-8')
    expect(dealsPage).toContain('mobile-card-list')
    expect(dealsPage).toContain('deal-card-mobile')
    expect(dealsPage).toContain('desktop-table')
    expect(dealsPage).toContain('编辑')
  })

  it('admin deal edit page uses deal-form grouped sections', () => {
    const dealEditPage = readFileSync(resolve('src/app/admin/deals/[id]/page.tsx'), 'utf-8')
    expect(dealEditPage).toContain('className="deal-form"')
    expect(dealEditPage).toContain('deal-form__section')
    expect(dealEditPage).toContain('deal-form__section--full')
  })
})
