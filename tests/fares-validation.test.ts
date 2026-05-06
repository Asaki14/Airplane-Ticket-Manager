import { describe, expect, it } from 'vitest'
import { validateCanonicalFare } from '../src/lib/fares/validation'
import type { CanonicalFare } from '../src/types/canonical-fare'

function validFare(overrides?: Partial<CanonicalFare>): Partial<CanonicalFare> {
  return {
    sourceId: 'amadeus',
    collectionRunId: 'run-1',
    airline: 'MU',
    flightNumbers: ['MU1234'],
    departureAirport: 'PVG',
    arrivalAirport: 'NRT',
    departureTime: '2026-06-15T08:00:00',
    arrivalTime: '2026-06-15T12:00:00',
    cabin: 'ECONOMY',
    baggageFacts: '23 kg',
    priceAmount: 450.00,
    currency: 'CNY',
    deepLink: '',
    collectedAt: '2026-06-15T07:00:00Z',
    expiresAt: '2026-06-15T09:00:00Z',
    rawPayloadRef: 'mock-1',
    ...overrides
  }
}

describe('validateCanonicalFare', () => {
  it('returns ok=true for a fully valid CanonicalFare object', () => {
    const result = validateCanonicalFare(validFare())
    expect(result.ok).toBe(true)
    if (!result.ok) {
      // TypeScript narrowing — if it failed, show why
      expect(result.errors).toEqual([])
    }
  })

  it('returns errors for missing required fields', () => {
    const required = ['airline', 'departureAirport', 'arrivalAirport', 'priceAmount', 'currency', 'collectedAt', 'expiresAt'] as const
    for (const field of required) {
      const fare = validFare({ [field]: undefined })
      const result = validateCanonicalFare(fare)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.some(e => e.field === field)).toBe(true)
      }
    }
  })

  it('rejects negative or zero priceAmount', () => {
    const result1 = validateCanonicalFare(validFare({ priceAmount: -100 }))
    expect(result1.ok).toBe(false)
    if (!result1.ok) {
      expect(result1.errors.some(e => e.field === 'priceAmount')).toBe(true)
    }

    const result2 = validateCanonicalFare(validFare({ priceAmount: 0 }))
    expect(result2.ok).toBe(false)
    if (!result2.ok) {
      expect(result2.errors.some(e => e.field === 'priceAmount')).toBe(true)
    }
  })

  it('rejects priceAmount > 999999 (sane upper bound)', () => {
    const result = validateCanonicalFare(validFare({ priceAmount: 1_000_000 }))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.some(e => e.field === 'priceAmount')).toBe(true)
    }
  })

  it('rejects departureTime >= arrivalTime (sane date ordering)', () => {
    // Same time
    const result1 = validateCanonicalFare(validFare({
      departureTime: '2026-06-15T12:00:00',
      arrivalTime: '2026-06-15T12:00:00'
    }))
    expect(result1.ok).toBe(false)
    if (!result1.ok) {
      expect(result1.errors.some(e => e.field === 'departureTime' || e.field === 'arrivalTime')).toBe(true)
    }

    // Departure after arrival
    const result2 = validateCanonicalFare(validFare({
      departureTime: '2026-06-15T14:00:00',
      arrivalTime: '2026-06-15T12:00:00'
    }))
    expect(result2.ok).toBe(false)
    if (!result2.ok) {
      expect(result2.errors.some(e => e.field === 'departureTime' || e.field === 'arrivalTime')).toBe(true)
    }
  })

  it('rejects non-3-letter IATA airport codes', () => {
    // Too short
    const result1 = validateCanonicalFare(validFare({ departureAirport: 'PV' }))
    expect(result1.ok).toBe(false)
    if (!result1.ok) {
      expect(result1.errors.some(e => e.field === 'departureAirport')).toBe(true)
    }

    // Lowercase
    const result2 = validateCanonicalFare(validFare({ arrivalAirport: 'nrt' }))
    expect(result2.ok).toBe(false)
    if (!result2.ok) {
      expect(result2.errors.some(e => e.field === 'arrivalAirport')).toBe(true)
    }

    // Numbers
    const result3 = validateCanonicalFare(validFare({ arrivalAirport: '123' }))
    expect(result3.ok).toBe(false)
    if (!result3.ok) {
      expect(result3.errors.some(e => e.field === 'arrivalAirport')).toBe(true)
    }
  })

  it('rejects empty flightNumbers array', () => {
    const result = validateCanonicalFare(validFare({ flightNumbers: [] }))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.some(e => e.field === 'flightNumbers')).toBe(true)
    }
  })

  it('accepts a round-trip fare (with return leg fields) when all times are consistent', () => {
    const roundTrip = validFare({
      returnDepartureAirport: 'NRT',
      returnArrivalAirport: 'PVG',
      returnDepartureTime: '2026-06-20T15:00:00',
      returnArrivalTime: '2026-06-20T18:00:00'
    })
    const result = validateCanonicalFare(roundTrip)
    expect(result.ok).toBe(true)
  })
})
