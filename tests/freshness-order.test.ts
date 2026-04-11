import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('freshness-order', () => {
  it('renders freshness in fixed order: publishedAt -> updatedAt -> expiresAt', () => {
    const content = readFileSync(resolve('src/components/deals/DealCard.tsx'), 'utf-8')

    const published = content.indexOf('发布时间')
    const updated = content.indexOf('更新时间')
    const expires = content.indexOf('失效时间')

    expect(published).toBeGreaterThan(-1)
    expect(updated).toBeGreaterThan(published)
    expect(expires).toBeGreaterThan(updated)
  })
})
