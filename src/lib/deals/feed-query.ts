export type DealFeedRecord = {
  id: string
  title?: string
  departureCity?: string
  destination?: string
  region?: string
  travelWindowLabel?: string
  airline?: string
  headlinePrice?: number
  referenceTotalPrice?: number
  valueScore?: number
  status: 'draft' | 'published' | 'expired'
  publishedAt?: string
  updatedAt?: string
  expiresAt: string
  baggageInfo?: string
  refundChangeSummary?: string
  stopSummary?: string
  cabin?: string
  restrictions?: string
  sourceName?: string
  sourceLink?: string
  recommendationCopy?: string
  valueReasons?: string[]
}

export type FeedSort = 'publishedAtDesc' | 'priceAsc' | 'valueDesc'

export type FeedFilters = {
  departureCity?: string
  region?: string
  travelWindowLabel?: string
  airline?: string
  maxPrice?: number
  q?: string
}

function includesText(source: string | undefined, target: string) {
  return (source ?? '').toLowerCase().includes(target.toLowerCase())
}

export function filterPublicFeedDeals(records: DealFeedRecord[], now: Date = new Date(), filters?: FeedFilters) {
  const base = records.filter((record) => {
    const expiry = new Date(record.expiresAt)
    return record.status === 'published' && expiry.getTime() > now.getTime()
  })

  if (!filters) return base

  return base.filter((record) => {
    if (filters.departureCity && record.departureCity !== filters.departureCity) return false
    if (filters.region && record.region !== filters.region) return false
    if (filters.travelWindowLabel && record.travelWindowLabel !== filters.travelWindowLabel) return false
    if (filters.airline && record.airline !== filters.airline) return false
    if (typeof filters.maxPrice === 'number' && (record.headlinePrice ?? Number.MAX_SAFE_INTEGER) > filters.maxPrice) {
      return false
    }
    if (filters.q) {
      const q = filters.q.trim()
      if (!q) return true
      const matched =
        includesText(record.title, q) ||
        includesText(record.departureCity, q) ||
        includesText(record.destination, q) ||
        includesText(record.airline, q)
      if (!matched) return false
    }
    return true
  })
}

export function sortPublicFeedDeals(records: DealFeedRecord[], sort: FeedSort = 'publishedAtDesc') {
  const data = [...records]
  data.sort((a, b) => {
    if (sort === 'priceAsc') {
      return (a.headlinePrice ?? Number.MAX_SAFE_INTEGER) - (b.headlinePrice ?? Number.MAX_SAFE_INTEGER)
    }
    if (sort === 'valueDesc') {
      return (b.valueScore ?? 0) - (a.valueScore ?? 0)
    }
    return new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  })
  return data
}

export function mapPublicFeedResponse(records: DealFeedRecord[]) {
  return records.map((record) => ({
    id: record.id,
    title: record.title ?? '',
    departureCity: record.departureCity ?? '',
    destination: record.destination ?? '',
    region: record.region ?? '',
    travelWindowLabel: record.travelWindowLabel ?? '',
    airline: record.airline ?? '',
    headlinePrice: record.headlinePrice ?? 0,
    referenceTotalPrice: record.referenceTotalPrice ?? 0,
    valueScore: record.valueScore ?? 0,
    publishedAt: record.publishedAt ?? null,
    updatedAt: record.updatedAt ?? null,
    expiresAt: record.expiresAt,
    baggageInfo: record.baggageInfo ?? '',
    refundChangeSummary: record.refundChangeSummary ?? '',
    stopSummary: record.stopSummary ?? '',
    cabin: record.cabin ?? '',
    restrictions: record.restrictions ?? '',
    sourceName: record.sourceName ?? '',
    sourceLink: record.sourceLink ?? '',
    recommendationCopy: record.recommendationCopy ?? '',
    valueReasons: record.valueReasons ?? []
  }))
}
