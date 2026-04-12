import { describe, expect, it } from 'vitest'
import { filterPublicFeedDeals, sortPublicFeedDeals } from '../src/lib/deals/feed-query'
import { mockDeals } from '../src/lib/deals/mock-data'

describe('discovery-filters', () => {
  const now = new Date('2026-04-11T12:00:00.000Z')

  it('supports departureCity, region and maxPrice filters', () => {
    const result = filterPublicFeedDeals(mockDeals, now, {
      departureCity: '上海',
      region: '周边国际',
      maxPrice: 1500
    })

    expect(result.length).toBe(1)
    expect(result[0].id).toBe('deal-seoul-weekend')
  })

  it('supports keyword search over title/route/airline fields', () => {
    const result = filterPublicFeedDeals(mockDeals, now, {
      q: '大阪'
    })
    expect(result.some((item) => item.id === 'deal-osaka-sakura')).toBe(true)
  })

  it('sorts by value score descending', () => {
    const visible = filterPublicFeedDeals(mockDeals, now)
    const sorted = sortPublicFeedDeals(visible, 'valueDesc')
    expect((sorted[0].valueScore ?? 0) >= (sorted[1].valueScore ?? 0)).toBe(true)
  })
})
