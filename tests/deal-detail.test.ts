import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('deal-detail', () => {
  it('detail page contains source/freshness and rule decode sections', () => {
    const content = readFileSync(resolve('src/app/deals/[id]/page.tsx'), 'utf-8')

    expect(content).toContain('来源与时效')
    expect(content).toContain('票规翻译')
    expect(content).toContain('为什么值得买')
    expect(content).toContain('去来源页继续购买')
    expect(content).toContain('展开完整规则')
    expect(content).toContain('<details>')
    expect(content).toContain('target="_blank"')
    expect(content).toContain('rel="noreferrer"')
    expect(content).toContain('detail-grid detail-grid--primary')
    expect(content).toContain('detail-grid detail-grid--rules')
    expect(content).not.toContain('detail-grid--three-column')
    expect(content.match(/展开完整规则/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(content.match(/<details>/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
  })
})
