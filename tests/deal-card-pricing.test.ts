import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('deal-card-pricing', () => {
  it('deal card uses headlinePrice as primary display and keeps referenceTotalPrice as helper', () => {
    const content = readFileSync(resolve('src/components/deals/DealCard.tsx'), 'utf-8')

    expect(content).toContain('headlinePrice')
    expect(content).toContain('参考总成本')
    expect(content).toContain('referenceTotalPrice')
  })

  it('home page fetches public feed API and renders DealCard list', () => {
    const content = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    expect(content).toContain('fetch(')
    expect(content).toContain('/api/deals/feed')
    expect(content).toContain('<DealCard')
  })
})
