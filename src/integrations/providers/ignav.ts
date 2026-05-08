import type { ProviderAdapter, ProviderFareResult, ProviderSearchParams, ProviderSearchResult } from '../provider'

const IGNAV_BASE = 'https://ignav.com/api'

function getApiKey(): string | undefined {
  return process.env.IGNAV_API_KEY
}

const IGNAV_TIMEOUT_MS = 10_000

async function ignavPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('IgnavAdapter: IGNAV_API_KEY not configured')
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), IGNAV_TIMEOUT_MS)
  try {
    const res = await fetch(`${IGNAV_BASE}${path}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const msg = errBody?.error?.message ?? `HTTP ${res.status}`
      throw new Error(`Ignav API error: ${msg}`)
    }
    return res.json() as Promise<T>
  } finally {
    clearTimeout(timeout)
  }
}

type IgnavSegment = {
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

type IgnavLeg = {
  carrier?: string
  duration_minutes?: number
  segments: IgnavSegment[]
}

type IgnavItinerary = {
  price: { amount: number; currency: string }
  outbound: IgnavLeg
  inbound?: IgnavLeg
  cabin_class: string
  bags?: { carry_on?: number; checked?: number }
  requires_self_transfer: boolean
  ignav_id: string
}

type IgnavOneWayResponse = {
  origin: string
  destination: string
  departure_date: string
  itineraries: IgnavItinerary[]
}

type IgnavRoundTripResponse = IgnavOneWayResponse & {
  return_date: string
}

function currencyToMarket(currency?: string): string {
  if (!currency || currency === 'CNY') return 'CN'
  const map: Record<string, string> = {
    USD: 'US', EUR: 'DE', GBP: 'GB', JPY: 'JP', HKD: 'HK',
    KRW: 'KR', TWD: 'TW', SGD: 'SG', AUD: 'AU', CAD: 'CA',
    THB: 'TH', MYR: 'MY', VND: 'VN', INR: 'IN',
  }
  return map[currency] ?? 'CN'
}

export class IgnavAdapter implements ProviderAdapter {
  readonly name = 'ignav'

  isConfigured(): boolean {
    return !!getApiKey()
  }

  async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
    const collectedAt = new Date().toISOString()
    const runId = crypto.randomUUID()
    const market = currencyToMarket(params.currency)

    const body: Record<string, unknown> = {
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
      adults: params.adults ?? 1,
      market,
    }

    let ignavItineraries: IgnavItinerary[]

    if (params.returnDate) {
      body.return_date = params.returnDate
      const resp = await ignavPost<IgnavRoundTripResponse>('/fares/round-trip', body)
      ignavItineraries = resp.itineraries
    } else {
      const resp = await ignavPost<IgnavOneWayResponse>('/fares/one-way', body)
      ignavItineraries = resp.itineraries
    }

    const fares: ProviderFareResult[] = ignavItineraries
      .filter((it) => it.price?.amount > 0)
      .map((it, idx) => ({
        providerId: it.ignav_id || `ignav-${idx}`,
        rawPayload: it as unknown as Record<string, unknown>,
      }))

    return {
      providerName: this.name,
      fares,
      searchParams: params,
      collectedAt,
      runId,
    }
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    const apiKey = getApiKey()
    if (!apiKey) {
      return { ok: false, message: 'Ignav not configured: IGNAV_API_KEY missing' }
    }
    try {
      const res = await fetch(`${IGNAV_BASE}/airports?q=beijing&limit=1`, {
        headers: { 'X-Api-Key': apiKey },
      })
      if (!res.ok) {
        return { ok: false, message: `Ignav health check failed: HTTP ${res.status}` }
      }
      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      }
    }
  }
}

export function createIgnavAdapter(): ProviderAdapter {
  return new IgnavAdapter()
}

export class MockIgnavAdapter implements ProviderAdapter {
  readonly name = 'ignav-mock'

  isConfigured(): boolean {
    return true
  }

  async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
    const collectedAt = new Date().toISOString()
    const runId = crypto.randomUUID()

    const fares: ProviderFareResult[] = [
      {
        providerId: 'ignav-mock-1',
        rawPayload: {
          price: { amount: 450, currency: params.currency ?? 'CNY' },
          outbound: {
            carrier: '东方航空',
            duration_minutes: 130,
            segments: [{
              marketing_carrier_code: 'MU',
              flight_number: '5111',
              operating_carrier_name: '东方航空',
              departure_airport: params.origin,
              departure_time_local: `${params.departureDate}T13:00:00`,
              departure_timezone: 'Asia/Shanghai',
              departure_time_utc: `${params.departureDate}T05:00:00Z`,
              arrival_airport: params.destination,
              arrival_time_local: `${params.departureDate}T15:10:00`,
              arrival_timezone: 'Asia/Shanghai',
              arrival_time_utc: `${params.departureDate}T07:10:00Z`,
              duration_minutes: 130,
              aircraft: 'Airbus A330',
            }],
          },
          cabin_class: 'economy',
          bags: { carry_on: 1, checked: 1 },
          requires_self_transfer: false,
          ignav_id: 'mock-id-1',
        },
      },
      {
        providerId: 'ignav-mock-2',
        rawPayload: {
          price: { amount: 380, currency: params.currency ?? 'CNY' },
          outbound: {
            carrier: '中国国航',
            duration_minutes: 150,
            segments: [{
              marketing_carrier_code: 'CA',
              flight_number: '1855',
              operating_carrier_name: '中国国航',
              departure_airport: params.origin,
              departure_time_local: `${params.departureDate}T09:00:00`,
              departure_timezone: 'Asia/Shanghai',
              departure_time_utc: `${params.departureDate}T01:00:00Z`,
              arrival_airport: params.destination,
              arrival_time_local: `${params.departureDate}T11:30:00`,
              arrival_timezone: 'Asia/Shanghai',
              arrival_time_utc: `${params.departureDate}T03:30:00Z`,
              duration_minutes: 150,
              aircraft: 'Boeing 787',
            }],
          },
          cabin_class: 'economy',
          bags: { carry_on: 1, checked: 0 },
          requires_self_transfer: false,
          ignav_id: 'mock-id-2',
        },
      },
    ]

    return {
      providerName: this.name,
      fares,
      searchParams: params,
      collectedAt,
      runId,
    }
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    return { ok: true, message: 'Mock adapter — no real health check' }
  }
}

export function createIgnavOrMockAdapter(): ProviderAdapter {
  const real = new IgnavAdapter()
  if (real.isConfigured()) {
    return real
  }
  return new MockIgnavAdapter()
}
