import Amadeus from 'amadeus'
import type { ProviderAdapter, ProviderFareResult, ProviderSearchParams, ProviderSearchResult } from '../provider'

/**
 * AmadeusAdapter — real connector using the official Amadeus Self-Service API SDK.
 *
 * Uses OAuth2 Client Credentials flow (managed internally by the SDK).
 * Defaults to the test environment; switch to 'production' for live data.
 */
export class AmadeusAdapter implements ProviderAdapter {
  readonly name = 'amadeus'
  private client: Amadeus | null = null

  constructor() {
    const clientId = process.env.AMADEUS_CLIENT_ID
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET
    if (clientId && clientSecret) {
      this.client = new Amadeus({
        clientId,
        clientSecret,
        hostname: 'test'  // Use test environment for development; switch to 'production' for prod
      })
    }
  }

  isConfigured(): boolean {
    return this.client !== null
  }

  async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
    if (!this.client) {
      throw new Error('AmadeusAdapter: not configured. Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET.')
    }

    const collectedAt = new Date().toISOString()
    const runId = crypto.randomUUID()

    try {
      // Flight Offers Search API
      const response = await this.client.shopping.flightOffersSearch.get({
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults ?? 1,
        currencyCode: params.currency ?? 'CNY',
        max: 50  // reasonable limit for MVP
      })

      const rawData = response.data ?? []
      const fares = Array.isArray(rawData)
        ? rawData.map((offer: Record<string, unknown>, idx: number) => ({
            providerId: String((offer as any)?.id ?? idx),
            rawPayload: offer as Record<string, unknown>
          }))
        : []

      return {
        providerName: this.name,
        fares,
        searchParams: params,
        collectedAt,
        runId
      }
    } catch (error) {
      // Wrap SDK errors with context
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Amadeus search failed: ${message}`)
    }
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    if (!this.client) {
      return { ok: false, message: 'Amadeus not configured' }
    }
    try {
      // Use a lightweight API call — airport/city search with a known code
      await this.client.referenceData.locations.get({
        keyword: 'NRT',
        subType: Amadeus.location.airport
      })
      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

/** Factory function — returns configured adapter */
export function createAmadeusAdapter(): ProviderAdapter {
  return new AmadeusAdapter()
}

/**
 * MockAmadeusAdapter — returns realistic sample data for development.
 *
 * Always configured (no credentials needed). Returns mock fare results
 * that mimic the structure of real Amadeus responses, enabling the full
 * pipeline to be developed and tested without an external API.
 */
export class MockAmadeusAdapter implements ProviderAdapter {
  readonly name = 'amadeus-mock'

  isConfigured(): boolean { return true }  // Always configured

  async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
    const collectedAt = new Date().toISOString()
    const runId = crypto.randomUUID()

    // Generate sample fare results based on the search parameters
    const fares: ProviderFareResult[] = [
      {
        providerId: 'mock-1',
        rawPayload: {
          id: 'mock-1',
          type: 'flight-offer',
          source: 'MOCK',
          itineraries: [{
            segments: [{
              departure: { iataCode: params.origin, at: `${params.departureDate}T08:00:00` },
              arrival: { iataCode: params.destination, at: `${params.departureDate}T12:00:00` },
              carrierCode: 'MU',
              flightNumber: '1234',
              number: 'MU1234'
            }]
          }],
          price: { total: '450.00', currency: params.currency ?? 'CNY' },
          travelerPricings: [{
            fareDetailsBySegment: [{ cabin: 'ECONOMY' }]
          }]
        }
      },
      {
        providerId: 'mock-2',
        rawPayload: {
          id: 'mock-2',
          type: 'flight-offer',
          source: 'MOCK',
          itineraries: [{
            segments: [{
              departure: { iataCode: params.origin, at: `${params.departureDate}T08:00:00` },
              arrival: { iataCode: params.destination, at: `${params.departureDate}T14:30:00` },
              carrierCode: 'CA',
              flightNumber: '5678',
              number: 'CA5678',
              numberOfStops: 1
            }]
          }],
          price: { total: '380.00', currency: params.currency ?? 'CNY' },
          travelerPricings: [{
            fareDetailsBySegment: [{ cabin: 'ECONOMY' }]
          }]
        }
      }
    ]

    return {
      providerName: this.name,
      fares,
      searchParams: params,
      collectedAt,
      runId
    }
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    return { ok: true }
  }
}

/** Creates Amadeus adapter if configured, otherwise returns mock */
export function createAmadeusOrMockAdapter(): ProviderAdapter {
  const real = new AmadeusAdapter()
  if (real.isConfigured()) {
    return real
  }
  return new MockAmadeusAdapter()
}
