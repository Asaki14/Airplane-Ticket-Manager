import { describe, expect, it } from 'vitest'
import { normalizeIgnavFare } from '../src/integrations/normalize/ignav'
import type { ProviderFareResult } from '../src/integrations/provider'

function makeMockFare(overrides?: Record<string, unknown>): ProviderFareResult {
  return {
    providerId: 'ignav-mock-1',
    rawPayload: {
      price: { amount: 450, currency: 'CNY' },
      outbound: {
        carrier: '东方航空',
        duration_minutes: 130,
        segments: [
          {
            marketing_carrier_code: 'MU',
            flight_number: '5111',
            operating_carrier_name: '东方航空',
            departure_airport: 'SHA',
            departure_time_local: '2026-06-15T13:00:00',
            departure_timezone: 'Asia/Shanghai',
            departure_time_utc: '2026-06-15T05:00:00Z',
            arrival_airport: 'PEK',
            arrival_time_local: '2026-06-15T15:10:00',
            arrival_timezone: 'Asia/Shanghai',
            arrival_time_utc: '2026-06-15T07:10:00Z',
            duration_minutes: 130,
            aircraft: 'Airbus A330',
          },
        ],
      },
      cabin_class: 'economy',
      bags: { carry_on: 1, checked: 1 },
      requires_self_transfer: false,
      ignav_id: 'test-id-123',
      ...overrides,
    },
  }
}

const RUN_ID = 'run-abc-123'

describe('normalizeIgnavFare', () => {
  it('maps a minimal valid Ignav itinerary into CanonicalFare with all required fields populated', () => {
    const fare = makeMockFare()
    const result = normalizeIgnavFare(fare, RUN_ID)

    expect(result).toBeDefined()
    expect(result.sourceId).toBe('ignav')
    expect(result.collectionRunId).toBe(RUN_ID)
    expect(result.airline).toBe('MU')
    expect(result.flightNumbers).toEqual(['MU5111'])
    expect(result.departureAirport).toBe('SHA')
    expect(result.arrivalAirport).toBe('PEK')
    expect(result.departureTime).toBe('2026-06-15T05:00:00Z')
    expect(result.arrivalTime).toBe('2026-06-15T07:10:00Z')
    expect(result.cabin).toBe('ECONOMY')
    expect(result.priceAmount).toBe(450)
    expect(result.currency).toBe('CNY')
    expect(result.stopCount).toBe(0)
    expect(result.rawPayloadRef).toBe('ignav-mock-1')
  })

  it('extracts flight numbers and stop airports from multi-segment itineraries', () => {
    const fare = makeMockFare({
      outbound: {
        carrier: '东方航空',
        duration_minutes: 250,
        segments: [
          {
            marketing_carrier_code: 'MU',
            flight_number: '5111',
            operating_carrier_name: '东方航空',
            departure_airport: 'SHA',
            departure_time_local: '2026-06-15T13:00:00',
            departure_timezone: 'Asia/Shanghai',
            departure_time_utc: '2026-06-15T05:00:00Z',
            arrival_airport: 'HND',
            arrival_time_local: '2026-06-15T17:00:00',
            arrival_timezone: 'Asia/Tokyo',
            arrival_time_utc: '2026-06-15T08:00:00Z',
            duration_minutes: 120,
            aircraft: 'Airbus A330',
          },
          {
            marketing_carrier_code: 'NH',
            flight_number: '5678',
            operating_carrier_name: '全日空',
            departure_airport: 'HND',
            departure_time_local: '2026-06-15T18:00:00',
            departure_timezone: 'Asia/Tokyo',
            departure_time_utc: '2026-06-15T09:00:00Z',
            arrival_airport: 'NRT',
            arrival_time_local: '2026-06-15T18:30:00',
            arrival_timezone: 'Asia/Tokyo',
            arrival_time_utc: '2026-06-15T09:30:00Z',
            duration_minutes: 30,
            aircraft: 'Boeing 787',
          },
        ],
      },
    })

    const result = normalizeIgnavFare(fare, RUN_ID)

    expect(result.flightNumbers).toEqual(['MU5111', 'NH5678'])
    expect(result.stopCount).toBe(1)
    expect(result.stopAirports).toEqual(['HND'])
    expect(result.departureAirport).toBe('SHA')
    expect(result.arrivalAirport).toBe('NRT')
  })

  it('builds baggageFacts string from structured bags field', () => {
    const fareWithBags = makeMockFare({ bags: { carry_on: 1, checked: 2 } })
    const resultWith = normalizeIgnavFare(fareWithBags, RUN_ID)
    expect(resultWith.baggageFacts).toBe('手提1件+托运2件')

    const farePartial = makeMockFare({ bags: { checked: 1 } })
    const resultPartial = normalizeIgnavFare(farePartial, RUN_ID)
    expect(resultPartial.baggageFacts).toBe('托运1件')

    const fareNoBags = makeMockFare({ bags: undefined })
    const resultNo = normalizeIgnavFare(fareNoBags, RUN_ID)
    expect(resultNo.baggageFacts).toBe('未提供')
  })

  it('extracts return leg fields for round-trip itineraries', () => {
    const fare = makeMockFare({
      inbound: {
        carrier: '中国国航',
        duration_minutes: 150,
        segments: [
          {
            marketing_carrier_code: 'CA',
            flight_number: '1855',
            operating_carrier_name: '中国国航',
            departure_airport: 'PEK',
            departure_time_local: '2026-06-20T10:00:00',
            departure_timezone: 'Asia/Shanghai',
            departure_time_utc: '2026-06-20T02:00:00Z',
            arrival_airport: 'SHA',
            arrival_time_local: '2026-06-20T12:30:00',
            arrival_timezone: 'Asia/Shanghai',
            arrival_time_utc: '2026-06-20T04:30:00Z',
            duration_minutes: 150,
            aircraft: 'Boeing 787',
          },
        ],
      },
    })

    const result = normalizeIgnavFare(fare, RUN_ID)

    expect(result.returnDepartureAirport).toBe('PEK')
    expect(result.returnArrivalAirport).toBe('SHA')
    expect(result.returnDepartureTime).toBe('2026-06-20T02:00:00Z')
    expect(result.returnArrivalTime).toBe('2026-06-20T04:30:00Z')
  })

  it('uses local time as fallback when UTC time is null', () => {
    const fare = makeMockFare({
      outbound: {
        carrier: '东方航空',
        duration_minutes: 130,
        segments: [
          {
            marketing_carrier_code: 'MU',
            flight_number: '5111',
            operating_carrier_name: '东方航空',
            departure_airport: 'SHA',
            departure_time_local: '2026-06-15T13:00:00',
            departure_timezone: 'Asia/Shanghai',
            departure_time_utc: null,
            arrival_airport: 'PEK',
            arrival_time_local: '2026-06-15T15:10:00',
            arrival_timezone: 'Asia/Shanghai',
            arrival_time_utc: null,
            duration_minutes: 130,
            aircraft: 'Airbus A330',
          },
        ],
      },
    })

    const result = normalizeIgnavFare(fare, RUN_ID)

    expect(result.departureTime).toBe('2026-06-15T13:00:00')
    expect(result.arrivalTime).toBe('2026-06-15T15:10:00')
  })

  it('throws for missing required fields', () => {
    expect(() => normalizeIgnavFare(makeMockFare({ price: undefined }), RUN_ID)).toThrow()
    expect(() => normalizeIgnavFare(makeMockFare({ price: { amount: 'not-a-number', currency: 'CNY' } }), RUN_ID)).toThrow()
    expect(() => normalizeIgnavFare(makeMockFare({ outbound: { segments: [] } }), RUN_ID)).toThrow()
  })

  it('computes expiresAt as collectedAt + 2 hours', () => {
    const fare = makeMockFare()
    const result = normalizeIgnavFare(fare, RUN_ID)

    expect(result.expiresAt).toBeDefined()
    expect(result.collectedAt).toBeDefined()

    const collectedAt = new Date(result.collectedAt!).getTime()
    const expiresAt = new Date(result.expiresAt!).getTime()
    const diffMs = expiresAt - collectedAt

    expect(diffMs).toBeGreaterThanOrEqual(7_190_000)
    expect(diffMs).toBeLessThanOrEqual(7_210_000)
  })
})
