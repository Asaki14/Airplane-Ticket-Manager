import { describe, expect, it } from 'vitest'
import { dedupKey, isDuplicate } from '../src/lib/fares/dedup'
import type { CanonicalFare } from '../src/types/canonical-fare'

function makeFare(overrides?: Partial<CanonicalFare>): Partial<CanonicalFare> {
  return {
    airline: 'MU',
    flightNumbers: ['MU1234'],
    departureTime: '2026-06-15T08:00:00',
    priceAmount: 450.00,
    cabin: 'ECONOMY',
    ...overrides
  }
}

describe('dedup', () => {
  describe('isDuplicate', () => {
    it('returns true for two fares with same dedup key (airline + flightNumbers + departureTime + priceAmount)', () => {
      const existing = new Set<string>()
      const fare1 = makeFare()
      const key = dedupKey(fare1)
      existing.add(key)

      const fare2 = makeFare()  // Same fields — should be duplicate
      expect(isDuplicate(fare2, existing)).toBe(true)
    })

    it('returns false for same route but different price', () => {
      const existing = new Set<string>()
      const fare1 = makeFare()
      existing.add(dedupKey(fare1))

      const fare2 = makeFare({ priceAmount: 520.00 })
      expect(isDuplicate(fare2, existing)).toBe(false)
    })

    it('returns false for same price but different airline', () => {
      const existing = new Set<string>()
      const fare1 = makeFare()
      existing.add(dedupKey(fare1))

      const fare2 = makeFare({ airline: 'CA' })
      expect(isDuplicate(fare2, existing)).toBe(false)
    })
  })

  describe('dedupKey', () => {
    it('produces identical string for semantically identical itineraries', () => {
      const fare1 = makeFare({ flightNumbers: ['MU1234', 'MU5678'] })
      const fare2 = makeFare({ flightNumbers: ['MU5678', 'MU1234'] })  // Different order

      expect(dedupKey(fare1)).toBe(dedupKey(fare2))
    })

    it('differs when departureTime differs', () => {
      const fare1 = makeFare()
      const fare2 = makeFare({ departureTime: '2026-06-15T10:00:00' })

      expect(dedupKey(fare1)).not.toBe(dedupKey(fare2))
    })
  })
})
