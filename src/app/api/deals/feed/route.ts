import { filterPublicFeedDeals, mapPublicFeedResponse, sortPublicFeedDeals, type FeedFilters, type FeedSort } from '@/lib/deals/feed-query'
import { mockDeals } from '@/lib/deals/mock-data'

const ALLOWED_SORTS: FeedSort[] = ['publishedAtDesc', 'priceAsc', 'valueDesc']

function parseFilters(searchParams: URLSearchParams): FeedFilters {
  const maxPriceRaw = searchParams.get('maxPrice')
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined

  return {
    departureCity: searchParams.get('departureCity') ?? undefined,
    region: searchParams.get('region') ?? undefined,
    travelWindowLabel: searchParams.get('travelWindowLabel') ?? undefined,
    airline: searchParams.get('airline') ?? undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    q: searchParams.get('q') ?? undefined
  }
}

function parseSort(searchParams: URLSearchParams): FeedSort {
  const raw = searchParams.get('sort')
  if (raw && ALLOWED_SORTS.includes(raw as FeedSort)) {
    return raw as FeedSort
  }
  return 'publishedAtDesc'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = parseFilters(url.searchParams)
  const sort = parseSort(url.searchParams)

  const visibleDeals = filterPublicFeedDeals(mockDeals, new Date(), filters)
  const sortedDeals = sortPublicFeedDeals(visibleDeals, sort)
  const data = mapPublicFeedResponse(sortedDeals)

  const filterMeta = {
    departureCity: filters.departureCity ?? null,
    region: filters.region ?? null,
    travelWindowLabel: filters.travelWindowLabel ?? null,
    airline: filters.airline ?? null,
    maxPrice: filters.maxPrice ?? null,
    q: filters.q ?? null,
    sort
  }

  return Response.json({
    data,
    meta: {
      total: data.length,
      filters: filterMeta
    }
  })
}
