import type { CanonicalFare } from '../../types/canonical-fare'
import type { ProviderFareResult } from '../provider'

/**
 * Amadeus raw payload segment shape (partial — only fields we map).
 */
interface RawSegment {
  departure?: { iataCode?: string; at?: string }
  arrival?: { iataCode?: string; at?: string }
  carrierCode?: string
  flightNumber?: string
  number?: string
}

interface RawItinerary {
  segments?: RawSegment[]
}

interface RawPrice {
  total?: string
  currency?: string
}

interface RawIncludedCheckedBags {
  weight?: number
  weightUnit?: string
}

interface RawFareDetailsBySegment {
  cabin?: string
  includedCheckedBags?: RawIncludedCheckedBags
}

interface RawTravelerPricing {
  fareDetailsBySegment?: RawFareDetailsBySegment[]
}

/**
 * Normalize an Amadeus flight offer (ProviderFareResult) into CanonicalFare shape.
 *
 * Extracts itinerary, pricing, cabin, and baggage from the raw Amadeus response
 * structure. Throws if critical fields (itineraries, price, segments) are missing.
 */
export function normalizeAmadeusFare(
  fareResult: ProviderFareResult,
  runId: string
): Partial<CanonicalFare> {
  const raw = fareResult.rawPayload as Record<string, unknown>

  // Validate required top-level structures
  const itineraries = raw.itineraries as RawItinerary[] | undefined
  if (!itineraries || !Array.isArray(itineraries) || itineraries.length === 0) {
    throw new Error('normalizeAmadeusFare: missing itineraries')
  }

  const price = raw.price as RawPrice | undefined
  if (!price || !price.total) {
    throw new Error('normalizeAmadeusFare: missing price')
  }

  const segments = itineraries[0]?.segments
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    throw new Error('normalizeAmadeusFare: missing segments in first itinerary')
  }

  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]
  const travelerPricings = raw.travelerPricings as RawTravelerPricing[] | undefined
  const firstFareDetail = travelerPricings?.[0]?.fareDetailsBySegment?.[0]

  // Build flight numbers from all segments
  const flightNumbers = segments.map(
    (seg) => `${seg.carrierCode ?? ''}${seg.flightNumber ?? ''}`
  ).filter(Boolean)

  // Build stop airports (arrival airports of intermediate segments)
  const stopAirports = segments.slice(0, -1).map(
    (seg) => seg.arrival?.iataCode ?? ''
  ).filter(Boolean)

  // Extract baggage info if available
  let baggageFacts = ''
  const checkedBags = firstFareDetail?.includedCheckedBags
  if (checkedBags?.weight != null && checkedBags.weightUnit) {
    baggageFacts = `${checkedBags.weight} ${checkedBags.weightUnit}`
  }

  const collectedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

  return {
    sourceId: 'amadeus',
    collectionRunId: runId,
    rawPayloadRef: fareResult.providerId,
    airline: firstSegment.carrierCode ?? '',
    flightNumbers,
    departureAirport: firstSegment.departure?.iataCode ?? '',
    arrivalAirport: lastSegment.arrival?.iataCode ?? '',
    departureTime: firstSegment.departure?.at ?? '',
    arrivalTime: lastSegment.arrival?.at ?? '',
    cabin: firstFareDetail?.cabin ?? '',
    baggageFacts,
    priceAmount: parseFloat(price.total),
    currency: price.currency ?? '',
    deepLink: '',
    stopCount: segments.length - 1,
    stopAirports: stopAirports.length > 0 ? stopAirports : undefined,
    collectedAt,
    expiresAt
  }
}
