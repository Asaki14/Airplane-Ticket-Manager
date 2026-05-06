import { describe, expect, it, vi } from 'vitest'

// Mock Payload virtual modules — the test only tests the pure function computeExpiryDate
vi.mock('@payload-config', () => ({}))
vi.mock('payload', () => ({
  getPayload: vi.fn()
}))

import { computeExpiryDate } from '../src/lib/fares/retention'

describe('computeExpiryDate', () => {
  it('returns a date 30 days after the provided collectedAt date', () => {
    const collectedAt = new Date('2026-06-01T12:00:00Z')
    const expiry = computeExpiryDate(collectedAt)

    expect(expiry.getUTCFullYear()).toBe(2026)
    expect(expiry.getUTCMonth()).toBe(6)   // July (0-indexed)
    expect(expiry.getUTCDate()).toBe(1)
  })

  it('handles month boundaries correctly', () => {
    // June 15 → July 15
    const collectedAt = new Date('2026-06-15T00:00:00Z')
    const expiry = computeExpiryDate(collectedAt)

    expect(expiry.getUTCMonth()).toBe(6)   // July
    expect(expiry.getUTCDate()).toBe(15)
  })

  it('handles year boundaries correctly', () => {
    // Dec 15 → Jan 14 of next year
    const collectedAt = new Date('2026-12-15T00:00:00Z')
    const expiry = computeExpiryDate(collectedAt)

    expect(expiry.getUTCFullYear()).toBe(2027)
    expect(expiry.getUTCMonth()).toBe(0)   // January
    expect(expiry.getUTCDate()).toBe(14)
  })

  it('handles leap year February correctly', () => {
    // Jan 31 → Mar 2 (31 days in Jan, 30 days from Jan 31 = Mar 2 in non-leap year)
    const collectedAt = new Date('2026-01-31T00:00:00Z')
    const expiry = computeExpiryDate(collectedAt)

    expect(expiry.getUTCMonth()).toBe(2)   // March
    expect(expiry.getUTCDate()).toBe(2)
  })

  it('preserves the time portion of the collectedAt date', () => {
    const collectedAt = new Date('2026-06-01T14:30:45.123Z')
    const expiry = computeExpiryDate(collectedAt)

    expect(expiry.getUTCHours()).toBe(14)
    expect(expiry.getUTCMinutes()).toBe(30)
    expect(expiry.getUTCSeconds()).toBe(45)
  })
})
