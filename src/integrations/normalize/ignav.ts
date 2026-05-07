import type { CanonicalFare } from '../../types/canonical-fare'
import type { ProviderFareResult } from '../provider'

interface IgnavSegment {
  marketing_carrier_code: string | null
  flight_number: string | null
  operating_carrier_name: string | null
  departure_airport: string
  departure_time_local: string
  departure_timezone: string | null
  departure_time_utc: string | null
  arrival_airport: string
  arrival_time_local: string
  arrival_timezone: string | null
  arrival_time_utc: string | null
  duration_minutes: number
  aircraft: string | null
}

interface IgnavLeg {
  carrier?: string
  duration_minutes?: number
  segments: IgnavSegment[]
}

interface IgnavRawPayload {
  price: { amount: number; currency: string }
  outbound: IgnavLeg
  inbound?: IgnavLeg
  cabin_class: string
  bags?: { carry_on?: number; checked?: number }
  requires_self_transfer?: boolean
  ignav_id?: string
}

function buildBaggageFacts(bags?: { carry_on?: number; checked?: number }): string {
  if (!bags) return ''
  const parts: string[] = []
  if (bags.carry_on) parts.push(`手提${bags.carry_on}件`)
  if (bags.checked) parts.push(`托运${bags.checked}件`)
  return parts.join('+')
}

export function normalizeIgnavFare(
  fareResult: ProviderFareResult,
  runId: string
): Partial<CanonicalFare> {
  const raw = fareResult.rawPayload as unknown as IgnavRawPayload

  if (!raw.price || typeof raw.price.amount !== 'number') {
    throw new Error('normalizeIgnavFare: missing or invalid price')
  }
  if (!raw.outbound?.segments || !Array.isArray(raw.outbound.segments) || raw.outbound.segments.length === 0) {
    throw new Error('normalizeIgnavFare: missing outbound segments')
  }

  const segments = raw.outbound.segments
  const firstSeg = segments[0]
  const lastSeg = segments[segments.length - 1]

  const flightNumbers = segments
    .map((s) => {
      const code = s.marketing_carrier_code ?? ''
      const num = s.flight_number ?? ''
      return code && num ? `${code}${num}` : code || num
    })
    .filter(Boolean)

  const stopAirports = segments.slice(0, -1)
    .map((s) => s.arrival_airport)
    .filter(Boolean)

  const collectedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

  const result: Partial<CanonicalFare> = {
    sourceId: 'ignav',
    collectionRunId: runId,
    rawPayloadRef: fareResult.providerId,
    airline: firstSeg.marketing_carrier_code ?? raw.outbound.carrier ?? '',
    flightNumbers,
    departureAirport: firstSeg.departure_airport,
    arrivalAirport: lastSeg.arrival_airport,
    departureTime: firstSeg.departure_time_utc ?? firstSeg.departure_time_local,
    arrivalTime: lastSeg.arrival_time_utc ?? lastSeg.arrival_time_local,
    cabin: raw.cabin_class.toUpperCase(),
    baggageFacts: buildBaggageFacts(raw.bags) || '未提供',
    priceAmount: raw.price.amount,
    currency: raw.price.currency,
    deepLink: '',
    stopCount: segments.length - 1,
    stopAirports: stopAirports.length > 0 ? stopAirports : undefined,
    collectedAt,
    expiresAt,
  }

  if (raw.inbound?.segments && raw.inbound.segments.length > 0) {
    const inSegments = raw.inbound.segments
    const inFirst = inSegments[0]
    const inLast = inSegments[inSegments.length - 1]
    result.returnDepartureAirport = inFirst.departure_airport
    result.returnArrivalAirport = inLast.arrival_airport
    result.returnDepartureTime = inFirst.departure_time_utc ?? inFirst.departure_time_local
    result.returnArrivalTime = inLast.arrival_time_utc ?? inLast.arrival_time_local
  }

  return result
}
