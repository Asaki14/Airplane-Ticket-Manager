import { describe, expect, it } from 'vitest'
import { filterPublicFeedDeals } from '../src/lib/deals/feed-query'

describe('feed-expiry', () => {
  const now = new Date('2026-04-11T12:00:00.000Z')

  it('excludes draft deals from public feed', () => {
    const result = filterPublicFeedDeals(
      [
        {
          id: '1',
          status: 'draft',
          expiresAt: '2026-04-12T00:00:00.000Z'
        }
      ],
      now
    )

    expect(result).toHaveLength(0)
  })

  it('excludes published deals with expiresAt <= now', () => {
    const result = filterPublicFeedDeals(
      [
        {
          id: '2',
          status: 'published',
          expiresAt: '2026-04-11T12:00:00.000Z'
        }
      ],
      now
    )

    expect(result).toHaveLength(0)
  })

  it('includes published deals with expiresAt > now', () => {
    const result = filterPublicFeedDeals(
      [
        {
          id: '3',
          status: 'published',
          expiresAt: '2026-04-11T12:00:01.000Z'
        }
      ],
      now
    )

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('3')
  })
})
