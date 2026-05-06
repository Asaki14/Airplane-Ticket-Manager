import { describe, expect, it } from 'vitest'
import { normalizeAmadeusFare } from '../src/integrations/normalize/amadeus'
import type { ProviderFareResult } from '../src/integrations/provider'

function makeMockFare(overrides?: Record<string, unknown>): ProviderFareResult {
  return {
    providerId: 'mock-1',
    rawPayload: {
      id: 'mock-1',
      type: 'flight-offer',
      source: 'MOCK',
      itineraries: [{
        segments: [{
          departure: { iataCode: 'PVG', at: '2026-06-15T08:00:00' },
          arrival: { iataCode: 'NRT', at: '2026-06-15T12:00:00' },
          carrierCode: 'MU',
          flightNumber: '1234',
          number: 'MU1234'
        }]
      }],
      price: { total: '450.00', currency: 'CNY' },
      travelerPricings: [{
        fareDetailsBySegment: [{ cabin: 'ECONOMY' }]
      }],
      ...overrides
    }
  }
}

const RUN_ID = 'run-abc-123'

describe('normalizeAmadeusFare', () => {
  it('maps a minimal valid Amadeus flight offer into CanonicalFare with all required fields populated', () => {
    const fare = makeMockFare()
    const result = normalizeAmadeusFare(fare, RUN_ID)

    expect(result).toBeDefined()
    expect(result.sourceId).toBe('amadeus')
    expect(result.collectionRunId).toBe(RUN_ID)
    expect(result.airline).toBe('MU')
    expect(result.flightNumbers).toEqual(['MU1234'])
    expect(result.departureAirport).toBe('PVG')
    expect(result.arrivalAirport).toBe('NRT')
    expect(result.departureTime).toBe('2026-06-15T08:00:00')
    expect(result.arrivalTime).toBe('2026-06-15T12:00:00')
    expect(result.cabin).toBe('ECONOMY')
    expect(result.priceAmount).toBe(450.00)
    expect(result.currency).toBe('CNY')
    expect(result.stopCount).toBe(0)
    expect(result.rawPayloadRef).toBe('mock-1')
  })

  it('extracts flight numbers from segments correctly', () => {
    const fare = makeMockFare({
      itineraries: [{
        segments: [
          {
            departure: { iataCode: 'PVG', at: '2026-06-15T08:00:00' },
            arrival: { iataCode: 'HND', at: '2026-06-15T11:00:00' },
            carrierCode: 'MU',
            flightNumber: '1234',
            number: 'MU1234'
          },
          {
            departure: { iataCode: 'HND', at: '2026-06-15T12:00:00' },
            arrival: { iataCode: 'NRT', at: '2026-06-15T12:30:00' },
            carrierCode: 'NH',
            flightNumber: '5678',
            number: 'NH5678'
          }
        ]
      }]
    })
    const result = normalizeAmadeusFare(fare, RUN_ID)

    expect(result.flightNumbers).toEqual(['MU1234', 'NH5678'])
    expect(result.stopCount).toBe(1)
    expect(result.stopAirports).toEqual(['HND'])
    expect(result.departureAirport).toBe('PVG')
    expect(result.arrivalAirport).toBe('NRT')
    expect(result.departureTime).toBe('2026-06-15T08:00:00')
    expect(result.arrivalTime).toBe('2026-06-15T12:30:00')
  })

  it('extracts baggage info from travelerPricings if present, falls back to empty string', () => {
    // With baggage info present
    const fareWithBaggage = makeMockFare({
      travelerPricings: [{
        fareDetailsBySegment: [{
          cabin: 'ECONOMY',
          includedCheckedBags: { weight: 23, weightUnit: 'kg' }
        }]
      }]
    })
    const resultWith = normalizeAmadeusFare(fareWithBaggage, RUN_ID)
    expect(resultWith.baggageFacts).toBe('23 kg')

    // Without baggage info — fallback to empty string
    const fareWithoutBaggage = makeMockFare()
    const resultWithout = normalizeAmadeusFare(fareWithoutBaggage, RUN_ID)
    expect(resultWithout.baggageFacts).toBe('')
  })

  it('throws an error for missing required fields in raw payload', () => {
    // Missing itineraries
    expect(() => normalizeAmadeusFare(makeMockFare({ itineraries: undefined }), RUN_ID)).toThrow()

    // Missing price
    expect(() => normalizeAmadeusFare(makeMockFare({ price: undefined }), RUN_ID)).toThrow()

    // Empty segments array
    expect(() => normalizeAmadeusFare(makeMockFare({ itineraries: [{ segments: [] }] }), RUN_ID)).toThrow()
  })

  it('computes expiresAt as collectedAt + 2 hours (default TTL)', () => {
    const fare = makeMockFare()
    const result = normalizeAmadeusFare(fare, RUN_ID)

    expect(result.expiresAt).toBeDefined()
    expect(result.collectedAt).toBeDefined()

    const collectedAt = new Date(result.collectedAt!).getTime()
    const expiresAt = new Date(result.expiresAt!).getTime()
    const diffMs = expiresAt - collectedAt

    // Should be 2 hours (7200000 ms) within a small tolerance for execution delay
    expect(diffMs).toBeGreaterThanOrEqual(7_190_000)
    expect(diffMs).toBeLessThanOrEqual(7_210_000)
  })
})
