import { filterPublicFeedDeals, mapPublicFeedResponse, type DealFeedRecord } from '@/lib/deals/feed-query'

const sampleDeals: DealFeedRecord[] = [
  {
    id: 'published-valid',
    title: '上海-首尔周末往返',
    departureCity: '上海',
    destination: '首尔',
    headlinePrice: 1399,
    referenceTotalPrice: 1680,
    status: 'published',
    publishedAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-11T06:00:00.000Z',
    expiresAt: '2026-04-30T23:59:59.000Z'
  }
]

export async function GET() {
  const visibleDeals = filterPublicFeedDeals(sampleDeals)
  const data = mapPublicFeedResponse(visibleDeals)

  return Response.json({
    data
  })
}
