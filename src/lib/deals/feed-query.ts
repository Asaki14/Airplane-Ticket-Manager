export type DealFeedRecord = {
  id: string
  title?: string
  departureCity?: string
  destination?: string
  headlinePrice?: number
  referenceTotalPrice?: number
  status: 'draft' | 'published' | 'expired'
  publishedAt?: string
  updatedAt?: string
  expiresAt: string
}

export function filterPublicFeedDeals(records: DealFeedRecord[], now: Date = new Date()) {
  return records.filter((record) => {
    const expiry = new Date(record.expiresAt)
    return record.status === 'published' && expiry.getTime() > now.getTime()
  })
}

export function mapPublicFeedResponse(records: DealFeedRecord[]) {
  return records.map((record) => ({
    id: record.id,
    title: record.title ?? '',
    departureCity: record.departureCity ?? '',
    destination: record.destination ?? '',
    headlinePrice: record.headlinePrice ?? 0,
    referenceTotalPrice: record.referenceTotalPrice ?? 0,
    publishedAt: record.publishedAt ?? null,
    updatedAt: record.updatedAt ?? null,
    expiresAt: record.expiresAt
  }))
}
