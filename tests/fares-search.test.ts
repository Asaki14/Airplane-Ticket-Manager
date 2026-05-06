import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock the city-map module
vi.mock('../src/lib/fares/city-map', () => ({
  resolveCityToIata: vi.fn(),
  fuzzyResolveCity: vi.fn(),
  allCityNames: vi.fn(() => []),
  popularRoutes: vi.fn(() => [])
}))

// Mock pipeline
vi.mock('../src/integrations/pipeline', () => ({
  runCollectionPipeline: vi.fn()
}))

// Mock amadeus adapter
vi.mock('../src/integrations/providers/amadeus', () => ({
  createAmadeusOrMockAdapter: vi.fn()
}))

import { resolveCityToIata } from '../src/lib/fares/city-map'
import { runCollectionPipeline } from '../src/integrations/pipeline'
import { createAmadeusOrMockAdapter } from '../src/integrations/providers/amadeus'
import { searchFares } from '../src/lib/fares/search'
import type { SearchFareParams } from '../src/lib/fares/search'

describe('searchFares', () => {
  const mockPayload = {
    find: vi.fn(),
    create: vi.fn()
  }

  const mockAdapter = {
    name: 'amadeus-test',
    isConfigured: vi.fn(() => true),
    search: vi.fn(),
    healthCheck: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds ProviderSearchParams from city codes + date', async () => {
    vi.mocked(resolveCityToIata).mockImplementation((name: string) => {
      const map: Record<string, string> = { '上海': 'SHA', '北京': 'BJS' }
      return map[name]
    })

    // No cached results — will trigger pipeline
    mockPayload.find.mockResolvedValue({ docs: [] })
    vi.mocked(createAmadeusOrMockAdapter).mockReturnValue(mockAdapter as any)
    vi.mocked(runCollectionPipeline).mockResolvedValue({
      runId: 'run-1',
      sourceId: 'amadeus-test',
      totalRaw: 0,
      normalized: 0,
      validationPassed: 0,
      validationFailed: 0,
      duplicatesSkipped: 0,
      persisted: 0,
      errors: [],
      persistedFareIds: []
    })

    const params: SearchFareParams = {
      originCity: '上海',
      destinationCity: '北京',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    // The pipeline was called with proper ProviderSearchParams
    expect(createAmadeusOrMockAdapter).toHaveBeenCalled()
    expect(runCollectionPipeline).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'amadeus-test' }),
      expect.objectContaining({
        origin: 'SHA',
        destination: 'BJS',
        departureDate: '2026-07-01'
      }),
      expect.anything()
    )
  })

  it('returns cached results when canonicals exist and are fresh', async () => {
    vi.mocked(resolveCityToIata).mockImplementation((name: string) => {
      const map: Record<string, string> = { '上海': 'SHA', '北京': 'BJS' }
      return map[name]
    })

    const recentTime = new Date().toISOString()
    const cachedFares = {
      docs: [
        {
          id: 'fare-1',
          sourceId: 'amadeus',
          collectionRunId: 'run-1',
          airline: 'MU',
          flightNumbers: ['MU1234'],
          departureAirport: 'SHA',
          arrivalAirport: 'BJS',
          departureTime: '2026-07-01T08:00:00',
          arrivalTime: '2026-07-01T10:00:00',
          cabin: 'ECONOMY',
          baggageFacts: '23kg',
          priceAmount: 800,
          currency: 'CNY',
          deepLink: 'https://example.com/book',
          collectedAt: recentTime,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          rawPayloadRef: 'raw-1'
        }
      ]
    }

    mockPayload.find.mockResolvedValue(cachedFares)

    const params: SearchFareParams = {
      originCity: '上海',
      destinationCity: '北京',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    expect(result.source).toBe('cache')
    expect(result.results).toHaveLength(1)
    expect(result.results[0].id).toBe('fare-1')
    // Pipeline should NOT be called for cached results
    expect(createAmadeusOrMockAdapter).not.toHaveBeenCalled()
    expect(runCollectionPipeline).not.toHaveBeenCalled()
  })

  it('triggers pipeline when cache is empty', async () => {
    vi.mocked(resolveCityToIata).mockImplementation((name: string) => {
      const map: Record<string, string> = { '上海': '广州', '广州': 'CAN' }
      return map[name]
    })

    // Empty cache
    mockPayload.find.mockResolvedValue({ docs: [] })
    vi.mocked(createAmadeusOrMockAdapter).mockReturnValue(mockAdapter as any)
    vi.mocked(runCollectionPipeline).mockResolvedValue({
      runId: 'run-2',
      sourceId: 'amadeus-test',
      totalRaw: 2,
      normalized: 2,
      validationPassed: 2,
      validationFailed: 0,
      duplicatesSkipped: 0,
      persisted: 2,
      errors: [],
      persistedFareIds: ['fare-2', 'fare-3']
    })

    const params: SearchFareParams = {
      originCity: '上海',
      destinationCity: '广州',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    expect(result.source).toBe('live')
    expect(createAmadeusOrMockAdapter).toHaveBeenCalled()
    expect(runCollectionPipeline).toHaveBeenCalled()
  })

  it('triggers pipeline when latest cached result is stale (>2h)', async () => {
    vi.mocked(resolveCityToIata).mockImplementation((name: string) => {
      const map: Record<string, string> = { '上海': 'SHA', '北京': 'BJS' }
      return map[name]
    })

    // Stale cache (>2 hours old)
    const staleTime = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    const staleFares = {
      docs: [
        {
          id: 'fare-stale',
          sourceId: 'amadeus',
          collectionRunId: 'run-1',
          airline: 'MU',
          flightNumbers: ['MU5678'],
          departureAirport: 'SHA',
          arrivalAirport: 'BJS',
          departureTime: '2026-07-01T08:00:00',
          arrivalTime: '2026-07-01T10:00:00',
          cabin: 'ECONOMY',
          baggageFacts: '23kg',
          priceAmount: 800,
          currency: 'CNY',
          deepLink: 'https://example.com/book',
          collectedAt: staleTime,
          expiresAt: staleTime,
          rawPayloadRef: 'raw-stale'
        }
      ]
    }

    mockPayload.find.mockResolvedValue(staleFares)
    vi.mocked(createAmadeusOrMockAdapter).mockReturnValue(mockAdapter as any)
    vi.mocked(runCollectionPipeline).mockResolvedValue({
      runId: 'run-3',
      sourceId: 'amadeus-test',
      totalRaw: 1,
      normalized: 1,
      validationPassed: 1,
      validationFailed: 0,
      duplicatesSkipped: 0,
      persisted: 1,
      errors: [],
      persistedFareIds: ['fare-fresh']
    })

    const params: SearchFareParams = {
      originCity: '上海',
      destinationCity: '北京',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    // Should use live source when cache is stale
    expect(result.source).toBe('live')
    expect(createAmadeusOrMockAdapter).toHaveBeenCalled()
    expect(runCollectionPipeline).toHaveBeenCalled()
  })

  it('returns empty results when both cache and pipeline return nothing', async () => {
    vi.mocked(resolveCityToIata).mockImplementation((name: string) => {
      const map: Record<string, string> = { '上海': 'SHA', '纽约': 'NYC' }
      return map[name]
    })

    mockPayload.find.mockResolvedValue({ docs: [] })
    vi.mocked(createAmadeusOrMockAdapter).mockReturnValue(mockAdapter as any)
    vi.mocked(runCollectionPipeline).mockResolvedValue({
      runId: 'run-4',
      sourceId: 'amadeus-test',
      totalRaw: 0,
      normalized: 0,
      validationPassed: 0,
      validationFailed: 0,
      duplicatesSkipped: 0,
      persisted: 0,
      errors: [{ stage: 'normalize', message: 'No results from provider' }],
      persistedFareIds: []
    })

    const params: SearchFareParams = {
      originCity: '上海',
      destinationCity: '纽约',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    expect(result.results).toHaveLength(0)
    expect(result.total).toBe(0)
    expect(result.source).toBe('live')
    expect(result.message).toBeDefined()
  })

  it('returns unresolvable city error gracefully', async () => {
    vi.mocked(resolveCityToIata).mockReturnValue(undefined)

    const params: SearchFareParams = {
      originCity: '未知城市',
      destinationCity: '上海',
      departureDate: '2026-07-01'
    }

    const result = await searchFares(params, { payload: mockPayload as any })

    expect(result.results).toHaveLength(0)
    expect(result.total).toBe(0)
    expect(result.source).toBe('cache')
    expect(result.message).toBe('未知出发/到达城市')
    // Payload should NOT be queried for unresolvable cities
    expect(mockPayload.find).not.toHaveBeenCalled()
  })
})

describe('Search module exports', () => {
  it('exports searchFares function', async () => {
    const mod = await import('../src/lib/fares/search')
    expect(typeof mod.searchFares).toBe('function')
  })
})
