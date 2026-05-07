/**
 * search.ts — Search orchestration module.
 *
 * Cache-first search strategy:
 * 1. Resolve Chinese city names to IATA codes via city-map
 * 2. Query CanonicalFares Payload collection for matching routes
 * 3. If fresh cached results exist (< 2h), return with source: 'cache'
 * 4. If empty or stale, trigger live Amadeus pipeline, return with source: 'live'
 */

import type { CanonicalFare } from '@/types/canonical-fare'
import { resolveCityToIata } from '@/lib/fares/city-map'
import { runCollectionPipeline } from '@/integrations/pipeline'
import { createIgnavOrMockAdapter } from '@/integrations/providers/ignav'

/** Input parameters for a fare search (Chinese city names). */
export type SearchFareParams = {
  originCity: string
  destinationCity: string
  departureDate: string     // YYYY-MM-DD
  returnDate?: string       // YYYY-MM-DD, for round trips
}

/** A single search result item returned to the API client. */
export type SearchFareResultItem = {
  id: string
  airline: string
  flightNumbers: string[]
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  cabin: string
  baggageFacts: string
  priceAmount: number
  currency: string
  deepLink: string
  collectedAt: string
  expiresAt: string
  stopCount?: number
  stopAirports?: string[]
  refundChangePolicy?: string
  bookingRestrictions?: string
  fareClass?: string
  returnDepartureTime?: string
  returnArrivalTime?: string
  /** ignav_id for fetching booking links (live results only) */
  ignavId?: string
}

/** Standard API response envelope. */
export type SearchFareResponse = {
  results: SearchFareResultItem[]
  total: number
  source: 'cache' | 'live'
  collectedAt: string
  message?: string
}

/** Freshness window in milliseconds (2 hours). */
const CACHE_FRESHNESS_MS = 2 * 60 * 60 * 1000

/**
 * Search fares by Chinese city names and date.
 *
 * @param params - Search parameters with Chinese city names
 * @param context - Object containing a Payload instance
 * @returns SearchFareResponse with results and source metadata
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayloadOps = any

export async function searchFares(
  params: SearchFareParams,
  context: { payload: PayloadOps }
): Promise<SearchFareResponse> {
  const now = new Date().toISOString()

  // Step 1: Resolve city names
  const originCode = resolveCityToIata(params.originCity)
  const destCode = resolveCityToIata(params.destinationCity)

  if (!originCode || !destCode) {
    return {
      results: [],
      total: 0,
      source: 'cache',
      collectedAt: now,
      message: '未知出发/到达城市'
    }
  }

  try {
    // Step 2: Query cached results from Payload
    const payload = context.payload
    const cacheQuery: Record<string, unknown> = {
      collection: 'canonical-fares',
      where: {
        and: [
          {
            departureAirport: {
              equals: originCode
            }
          },
          {
            arrivalAirport: {
              equals: destCode
            }
          },
          {
            departureTime: {
              like: `${params.departureDate}%`
            }
          }
        ]
      },
      sort: '-collectedAt',
      limit: 100
    }

    const cachedDocs = await payload.find(cacheQuery)
    const fares = cachedDocs.docs as unknown as CanonicalFare[]

    // Step 3: Check freshness of most recent result
    if (fares.length > 0) {
      const latestCollectedAt = new Date(fares[0].collectedAt).getTime()
      const age = Date.now() - latestCollectedAt

      if (age < CACHE_FRESHNESS_MS) {
        return {
          results: fares.map(mapToResultItem),
          total: fares.length,
          source: 'cache',
          collectedAt: fares[0].collectedAt
        }
      }
    }

    // Step 4: Cache empty or stale — trigger live pipeline
    const adapter = createIgnavOrMockAdapter()

    if (!adapter.isConfigured()) {
      return {
        results: [],
        total: 0,
        source: 'live',
        collectedAt: now,
        message: 'IGNAV API 未配置，暂时无法查询实时票价'
      }
    }

    const pipelineResult = await runCollectionPipeline(
      adapter,
      {
        origin: originCode,
        destination: destCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate
      },
      {
        create: async (collection: string, data: Record<string, unknown>) => {
          return payload.create
            ? await payload.create({ collection, data })
            : { id: '' }
        }
      }
    )

    if (pipelineResult.errors.length > 0 && pipelineResult.persisted === 0) {
      return {
        results: [],
        total: 0,
        source: 'live',
        collectedAt: now,
        message: pipelineResult.errors.map(e => e.message).join('; ')
      }
    }

    // Fetch freshly persisted fares
    const freshDocs = await payload.find({
      collection: 'canonical-fares',
      where: {
        and: [
          { departureAirport: { equals: originCode } },
          { arrivalAirport: { equals: destCode } },
          { departureTime: { like: `${params.departureDate}%` } }
        ]
      },
      sort: '-collectedAt',
      limit: 100
    })

    const freshFares = freshDocs.docs as unknown as CanonicalFare[]

    return {
      results: freshFares.map(mapToResultItem),
      total: freshFares.length,
      source: 'live',
      collectedAt: freshFares.length > 0 ? freshFares[0].collectedAt : now,
      message: pipelineResult.errors.length > 0 && pipelineResult.persisted > 0
        ? `部分数据获取失败: ${pipelineResult.errors.map(e => e.message).join('; ')}`
        : undefined
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      results: [],
      total: 0,
      source: 'live',
      collectedAt: now,
      message: `搜索失败: ${message}`
    }
  }
}

/**
 * Map a CanonicalFare to the public API result shape.
 */
function normalizeFlightNumbers(
  fn: string[] | Array<{ flightNumber: string }> | undefined
): string[] {
  if (!fn) return []
  if (typeof fn[0] === 'string') return fn as string[]
  return (fn as Array<{ flightNumber: string }>).map((f) => f.flightNumber)
}

function normalizeStopAirports(
  sa: string[] | Array<{ airport: string }> | undefined
): string[] | undefined {
  if (!sa) return undefined
  if (typeof sa[0] === 'string') return sa as string[]
  return (sa as Array<{ airport: string }>).map((s) => s.airport)
}

function mapToResultItem(fare: CanonicalFare): SearchFareResultItem {
  return {
    id: fare.id,
    airline: fare.airline,
    flightNumbers: normalizeFlightNumbers(fare.flightNumbers),
    departureAirport: fare.departureAirport,
    arrivalAirport: fare.arrivalAirport,
    departureTime: fare.departureTime,
    arrivalTime: fare.arrivalTime,
    cabin: fare.cabin,
    baggageFacts: fare.baggageFacts,
    priceAmount: fare.priceAmount,
    currency: fare.currency,
    deepLink: fare.deepLink,
    collectedAt: fare.collectedAt,
    expiresAt: fare.expiresAt,
    stopCount: fare.stopCount,
    stopAirports: normalizeStopAirports(fare.stopAirports),
    refundChangePolicy: fare.refundChangePolicy,
    bookingRestrictions: fare.bookingRestrictions,
    fareClass: fare.fareClass,
    returnDepartureTime: fare.returnDepartureTime,
    returnArrivalTime: fare.returnArrivalTime,
    ignavId: fare.rawPayloadRef
  }
}
