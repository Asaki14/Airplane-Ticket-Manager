import { DealCard } from '@/components/deals/DealCard'

type PublicDeal = {
  id: string
  title: string
  departureCity: string
  destination: string
  headlinePrice: number
  referenceTotalPrice: number
  publishedAt: string | null
  updatedAt: string | null
  expiresAt: string
}

async function loadDeals(): Promise<PublicDeal[]> {
  const response = await fetch('http://localhost:3000/api/deals/feed', { cache: 'no-store' })
  if (!response.ok) return []
  const payload = (await response.json()) as { data?: PublicDeal[] }
  return payload.data ?? []
}

export default async function HomePage() {
  const deals = await loadDeals()

  return (
    <main className="public-shell" style={{ backgroundColor: 'var(--color-dominant)' }}>
      <section className="public-hero" aria-label="travel-hero">
        <p className="eyebrow">特价机票发现平台</p>
        <h1>更快判断这张机票值不值得买</h1>
        <p>从分散票价中快速看到核心信息：价格、时效、规则和下一步。</p>
      </section>

      <nav className="public-nav" aria-label="主导航" style={{ borderColor: 'var(--color-secondary)' }}>
        <a href="/">公开首页</a>
        <a href="/admin">运营后台</a>
        <a href="/admin/deals">Deal 管理</a>
      </nav>

      <section className="public-deal-feed" aria-label="公开 deal 列表">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            title={deal.title}
            departureCity={deal.departureCity}
            destination={deal.destination}
            headlinePrice={deal.headlinePrice}
            referenceTotalPrice={deal.referenceTotalPrice}
            publishedAt={deal.publishedAt}
            updatedAt={deal.updatedAt}
            expiresAt={deal.expiresAt}
          />
        ))}
      </section>
    </main>
  )
}
