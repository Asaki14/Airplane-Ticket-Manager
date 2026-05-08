import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { EmptySearchState } from '@/components/search/EmptySearchState'
import { SearchResultsWithCompare } from '@/components/search/SearchResultsWithCompare'
import type { SearchFilterState } from '@/components/search/SearchFilters'
import type { EmptySearchStateVariant } from '@/components/search/EmptySearchState'
import type { SearchFareResultItem, SearchFareResponse } from '@/lib/fares/search'
import { popularRoutes } from '@/lib/fares/city-map'

type SearchParams = Record<string, string | string[] | undefined>

type SearchSort = 'priceAsc' | 'departureTime' | 'freshness'

function firstValue(value: string | string[] | undefined) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

function toDateLabel(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('zh-CN', { hour12: false })
}

/** Parse search-specific URL params (search criteria + filters + sort). */
function parseSearchParams(searchParams: SearchParams): {
  from?: string
  to?: string
  date?: string
  returnDate?: string
  tripType: 'one-way' | 'round-trip'
  sort: SearchSort
  filters: SearchFilterState
} {
  const from = firstValue(searchParams.from)
  const to = firstValue(searchParams.to)
  const date = firstValue(searchParams.date)
  const returnDate = firstValue(searchParams.returnDate)
  const tripTypeRaw = firstValue(searchParams.tripType)
  const tripType = tripTypeRaw === 'round-trip' ? 'round-trip' : 'one-way'

  const sortRaw = firstValue(searchParams.sort)
  let sort: SearchSort = 'priceAsc'
  if (sortRaw === 'priceAsc' || sortRaw === 'departureTime' || sortRaw === 'freshness') {
    sort = sortRaw
  }

  const maxPriceRaw = firstValue(searchParams.maxPrice)
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined

  // Airlines can be multi-valued via repeated ?airline= param
  const airlinesRaw = searchParams.airline
  const airlines = airlinesRaw
    ? Array.isArray(airlinesRaw)
      ? airlinesRaw
      : [airlinesRaw]
    : undefined

  const stopsRaw = firstValue(searchParams.stops)
  let stops: SearchFilterState['stops']
  if (stopsRaw === 'direct' || stopsRaw === 'oneOrLess' || stopsRaw === 'any') {
    stops = stopsRaw
  }

  const depTimeRaw = firstValue(searchParams.departureTimeWindow)
  let departureTimeWindow: SearchFilterState['departureTimeWindow']
  if (depTimeRaw === 'morning' || depTimeRaw === 'afternoon' || depTimeRaw === 'evening' || depTimeRaw === 'any') {
    departureTimeWindow = depTimeRaw
  }

  const cabinRaw = firstValue(searchParams.cabin)
  let cabin: SearchFilterState['cabin']
  if (cabinRaw === 'ECONOMY' || cabinRaw === 'PREMIUM_ECONOMY' || cabinRaw === 'BUSINESS' || cabinRaw === 'FIRST' || cabinRaw === 'any') {
    cabin = cabinRaw
  }

  const baggageRaw = firstValue(searchParams.baggageIncluded)
  const baggageIncluded = baggageRaw === 'true' ? true : undefined

  return {
    from,
    to,
    date,
    returnDate,
    tripType,
    sort,
    filters: {
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      airlines,
      stops,
      departureTimeWindow,
      cabin,
      baggageIncluded,
    },
  }
}

/** Fetch search results from the search API. */
const SEARCH_TIMEOUT_MS = 15_000

async function loadSearchResults(
  from: string,
  to: string,
  date: string,
  returnDate?: string,
): Promise<SearchFareResponse | null> {
  const params = new URLSearchParams({ from, to, date })
  if (returnDate) params.set('returnDate', returnDate)

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS)
  try {
    const response = await fetch(`${base}/api/fares/search?${params.toString()}`, {
      cache: 'no-store',
      signal: controller.signal,
    }).catch(() => null)

    if (!response || !response.ok) return null
    return response.json() as Promise<SearchFareResponse>
  } finally {
    clearTimeout(timeout)
  }
}

/** Client-side filtering on top of API results. */
function applyClientFilters(
  results: SearchFareResultItem[],
  filters: SearchFilterState,
): SearchFareResultItem[] {
  return results.filter((fare) => {
    if (filters.maxPrice !== undefined && fare.priceAmount > filters.maxPrice) return false
    if (filters.airlines && filters.airlines.length > 0 && !filters.airlines.includes(fare.airline))
      return false
    if (filters.stops === 'direct' && fare.stopCount !== undefined && fare.stopCount > 0)
      return false
    if (filters.stops === 'oneOrLess' && fare.stopCount !== undefined && fare.stopCount > 1)
      return false
    if (filters.departureTimeWindow && filters.departureTimeWindow !== 'any') {
      const hour = new Date(fare.departureTime).getHours()
      if (filters.departureTimeWindow === 'morning' && (hour < 6 || hour >= 12))
        return false
      if (filters.departureTimeWindow === 'afternoon' && (hour < 12 || hour >= 18))
        return false
      if (filters.departureTimeWindow === 'evening' && (hour < 18 || hour >= 24))
        return false
    }
    if (filters.cabin && filters.cabin !== 'any' && fare.cabin !== filters.cabin) return false
    if (filters.baggageIncluded === true && !fare.baggageFacts) return false
    return true
  })
}

/** Client-side sort. */
function applyClientSort(results: SearchFareResultItem[], sort: SearchSort): SearchFareResultItem[] {
  const sorted = [...results]
  switch (sort) {
    case 'priceAsc':
      sorted.sort((a, b) => a.priceAmount - b.priceAmount)
      break
    case 'departureTime':
      sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
      break
    case 'freshness':
      sorted.sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())
      break
  }
  return sorted
}

/** Determine which empty-state variant to show based on response metadata. */
function determineEmptyVariant(searchResponse: SearchFareResponse | null): EmptySearchStateVariant {
  if (!searchResponse) return 'no-inventory'
  if (searchResponse.message?.includes('未覆盖') || searchResponse.message?.includes('未知')) {
    return 'no-coverage'
  }
  if (searchResponse.source === 'cache' && searchResponse.results.length === 0) return 'no-coverage'
  return 'no-inventory'
}

/**
 * Adapt SearchFareResultItem[] to the DealLite shape for comparison.
 * Value score defaults to 0 for real fares (no ML scoring in v2.0).
 */
function adaptResultsToDealLite(fares: SearchFareResultItem[]) {
  return fares.map((fare) => ({
    id: fare.id,
    title: `${fare.airline} ${fare.departureAirport} → ${fare.arrivalAirport}`,
    departureCity: fare.departureAirport,
    destination: fare.arrivalAirport,
    headlinePrice: fare.priceAmount,
    referenceTotalPrice: fare.priceAmount,
    valueScore: 0,
    baggageInfo: fare.baggageFacts,
    refundChangeSummary: fare.refundChangePolicy ?? '',
    stopSummary:
      fare.stopCount !== undefined
        ? fare.stopCount === 0
          ? '直达'
          : `经停 ${fare.stopCount} 次`
        : '',
    travelWindowLabel: fare.departureTime
      ? new Date(fare.departureTime).toLocaleDateString('zh-CN')
      : '',
  }))
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams

  const { from, to, date, returnDate, tripType, sort, filters } =
    parseSearchParams(params)

  // Determine if a real search should be triggered
  const hasSearchParams = !!(from && to && date)

  // Fetch and process search results
  let searchResponse: SearchFareResponse | null = null
  let results: SearchFareResultItem[] = []
  let airlineOptions: string[] = []

  if (hasSearchParams) {
    searchResponse = await loadSearchResults(from!, to!, date!, returnDate)

    if (searchResponse && searchResponse.results.length > 0) {
      const filtered = applyClientFilters(searchResponse.results, filters)
      results = applyClientSort(filtered, sort)
      airlineOptions = [...new Set(searchResponse.results.map((f) => f.airline))].sort()
    }
  }

  // Pre-compute popular routes for default state
  const routes = popularRoutes()
  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <main
      className="public-shell"
      style={{ backgroundColor: 'var(--color-bg-base, #f4f4f4)' }}
    >
      {/* Hero section — preserved brand per D-01 and Specifics */}
      <section className="public-hero" aria-label="travel-hero">
        <div className="hero-main">
          <p className="eyebrow">航易-找航班，更容易</p>
          <h1 className="hero-title">更快判断这张机票值不值得买</h1>
        </div>
      </section>

      {/* Search bar section */}
      <section className="search-hero" aria-label="航班搜索">
        <SearchBar
          defaultFrom={from}
          defaultTo={to}
          defaultDate={date}
          defaultReturnDate={returnDate}
          defaultTripType={tripType}
          defaultSort={sort}
          currentFilters={filters}
        />
      </section>

      {/* Results layout or default landing state */}
      {hasSearchParams ? (
        <section className="search-results-layout" aria-label="搜索结果">
          {/* Filters sidebar */}
          <aside className="search-filters-sidebar">
            <SearchFilters
              currentFilters={filters}
              airlineOptions={airlineOptions}
              currentFrom={from}
              currentTo={to}
              currentDate={date}
              currentReturnDate={returnDate}
              currentTripType={tripType}
              currentSort={sort}
            />
          </aside>

          {/* Results main area */}
          <div className="search-results-main">
            {/* Sort controls per D-15 */}
            <form className="search-sort-controls" action="/" method="get">
              <span className="search-sort-controls__count">
                找到 {results.length} 个结果
              </span>
              <label>排序：</label>
              <select name="sort" defaultValue={sort}>
                <option value="priceAsc">价格（低到高）</option>
                <option value="departureTime">出发时间</option>
                <option value="freshness">采集时间/新鲜度</option>
              </select>
              {/* Hidden inputs to preserve all other params */}
              {from && <input type="hidden" name="from" value={from} />}
              {to && <input type="hidden" name="to" value={to} />}
              {date && <input type="hidden" name="date" value={date} />}
              {returnDate && <input type="hidden" name="returnDate" value={returnDate} />}
              <input type="hidden" name="tripType" value={tripType} />
              {filters.maxPrice !== undefined && (
                <input type="hidden" name="maxPrice" value={filters.maxPrice} />
              )}
              {filters.stops && filters.stops !== 'any' && (
                <input type="hidden" name="stops" value={filters.stops} />
              )}
              {filters.departureTimeWindow && filters.departureTimeWindow !== 'any' && (
                <input type="hidden" name="departureTimeWindow" value={filters.departureTimeWindow} />
              )}
              {filters.cabin && filters.cabin !== 'any' && (
                <input type="hidden" name="cabin" value={filters.cabin} />
              )}
              {filters.baggageIncluded === true && (
                <input type="hidden" name="baggageIncluded" value="true" />
              )}
              <button type="submit">应用</button>
            </form>

            {/* Results grid + compare */}
            {results.length > 0 ? (
              <SearchResultsWithCompare
                results={results}
                deals={adaptResultsToDealLite(results)}
              />
            ) : (
              <EmptySearchState
                variant={determineEmptyVariant(searchResponse)}
                originCity={from}
                destinationCity={to}
                date={date}
              />
            )}

            {/* Freshness indicator per success criteria 3 */}
            {searchResponse && (
              <p className="search-freshness-note">
                数据来源: {searchResponse.source === 'live' ? '实时查询' : '缓存'}
                {' | '}
                采集时间: {toDateLabel(searchResponse.collectedAt)}
                {searchResponse.message && ` | ${searchResponse.message}`}
              </p>
            )}
          </div>
        </section>
      ) : (
        /* Default landing state — engaging prompt + popular destinations */
        <section className="search-default-state" aria-label="搜索引导">
          <p>输入出发地和目的地，搜索真实航班票价</p>
          {routes.length > 0 && (
            <div className="search-default-state__popular">
              {routes.map((route, chipIndex) => {
                const [cityFrom, cityTo] = route.label.split(' → ')
                return (
                  <a
                    key={`${route.from}-${route.to}`}
                    className="search-default-state__chip chip-entrance"
                    style={{ '--chip-index': chipIndex } as React.CSSProperties}
                    href={`/?from=${encodeURIComponent(cityFrom)}&to=${encodeURIComponent(cityTo)}&date=${todayStr}`}
                  >
                    {route.label}
                  </a>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Nav footer — preserved */}
      <nav className="public-nav" aria-label="主导航">
        <a href="/">公开首页</a>
        <a href="/admin">运营后台</a>
        <a href="/admin/deals">Deal 管理</a>
      </nav>
    </main>
  )
}
