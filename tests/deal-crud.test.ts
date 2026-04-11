import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('deal-crud', () => {
  it('admin list includes mobile card and desktop table branches', () => {
    const content = readFileSync(resolve('src/app/admin/deals/page.tsx'), 'utf-8')
    expect(content).toContain('mobile-card-list')
    expect(content).toContain('desktop-table')
  })

  it('admin edit page includes single publish and archive actions', () => {
    const content = readFileSync(resolve('src/app/admin/deals/[id]/page.tsx'), 'utf-8')
    expect(content).toContain('发布')
    expect(content).toContain('归档')
    expect(content).not.toContain('publishAll')
    expect(content).not.toContain('bulkPublish')
  })
})
