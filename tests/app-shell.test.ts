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

  it('admin shell page exists with admin marker', () => {
    const content = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')
    expect(content).toContain('admin')
    expect(content).toContain('运营入口')
  })
})
