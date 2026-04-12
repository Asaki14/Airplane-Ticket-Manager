import { cookies } from 'next/headers'
import { DealCard } from '@/components/deals/DealCard'
import { CompareAndSavePanel } from '@/components/deals/CompareAndSavePanel'
import { DiscoveryPreferences } from '@/components/deals/DiscoveryPreferences'
import { HeroDealCarousel } from '@/components/home/HeroDealCarousel'
import { filterPublicFeedDeals, mapPublicFeedResponse, sortPublicFeedDeals, type FeedFilters, type FeedSort } from '@/lib/deals/feed-query'
import { mockDeals } from '@/lib/deals/mock-data'

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

function parseSearchFilters(searchParams: SearchParams, preferredDepartureCity?: string): FeedFilters {
  const maxPriceRaw = firstValue(searchParams.maxPrice)
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined
  return {
    departureCity: firstValue(searchParams.departureCity) ?? preferredDepartureCity,
    region: firstValue(searchParams.region),
    travelWindowLabel: firstValue(searchParams.travelWindowLabel),
    airline: firstValue(searchParams.airline),
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    q: firstValue(searchParams.q)
  }
}

function parseSort(searchParams: SearchParams): FeedSort {
  const sort = firstValue(searchParams.sort)
  if (sort === 'priceAsc' || sort === 'valueDesc' || sort === 'publishedAtDesc') {
    return sort
  }
  return 'publishedAtDesc'
}

function buildOptions(values: (string | undefined)[]) {
  return [...new Set(values.filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

async function loadDeals(filters: FeedFilters, sort: FeedSort) {
  const params = new URLSearchParams()
  if (filters.departureCity) params.set('departureCity', filters.departureCity)
  if (filters.region) params.set('region', filters.region)
  if (filters.travelWindowLabel) params.set('travelWindowLabel', filters.travelWindowLabel)
  if (filters.airline) params.set('airline', filters.airline)
  if (typeof filters.maxPrice === 'number') params.set('maxPrice', String(filters.maxPrice))
  if (filters.q) params.set('q', filters.q)
  params.set('sort', sort)

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const response = await fetch(`${base}/api/deals/feed?${params.toString()}`, { cache: 'no-store' }).catch(() => null)

  if (!response || !response.ok) {
    const fallback = filterPublicFeedDeals(mockDeals, new Date(), filters)
    return mapPublicFeedResponse(sortPublicFeedDeals(fallback, sort))
  }

  const payload = (await response.json()) as { data?: ReturnType<typeof mapPublicFeedResponse> }
  return payload.data ?? []
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const cookieStore = await cookies()
  const preferredDepartureCity = cookieStore.get('preferredDepartureCity')?.value

  const filters = parseSearchFilters(params, preferredDepartureCity)
  const sort = parseSort(params)

  const deals = await loadDeals(filters, sort)

  const departureOptions = buildOptions(mockDeals.map((deal) => deal.departureCity))
  const regionOptions = buildOptions(mockDeals.map((deal) => deal.region))
  const travelWindowOptions = buildOptions(mockDeals.map((deal) => deal.travelWindowLabel))
  const airlineOptions = buildOptions(mockDeals.map((deal) => deal.airline))

  return (
    <main className="public-shell" style={{ backgroundColor: 'var(--color-dominant)' }}>
      <section className="public-hero" aria-label="travel-hero">
        <p className="eyebrow">特价机票发现平台</p>
        <h1>更快判断这张机票值不值得买</h1>
        <p>从分散票价中快速看到核心信息：价格、时效、规则和下一步，并通过「查看详情与票规」进入决策页。</p>
      </section>

      <HeroDealCarousel deals={deals.slice(0, 5)} />

      <section className="home-modes" aria-label="双模式浏览">
        <article className="mode-card">
          <h2>任务导向</h2>
          <p>先定约束：出发地、预算、时间窗口，快速收敛候选。</p>
        </article>
        <article className="mode-card">
          <h2>灵感导向</h2>
          <p>从周末捡漏、节假日前后、海岛和周边国际入口启发下一次出行。</p>
        </article>
      </section>

      <section className="quick-scenes" aria-label="高频探索入口">
        <a href="/?travelWindowLabel=周末捡漏">周末捡漏</a>
        <a href="/?travelWindowLabel=节假日前后">节假日前后</a>
        <a href="/?region=海岛/东南亚">海岛</a>
        <a href="/?region=周边国际">周边国际</a>
      </section>

      <nav className="public-nav" aria-label="主导航" style={{ borderColor: 'var(--color-secondary)' }}>
        <a href="/">公开首页</a>
        <a href="/admin">运营后台</a>
        <a href="/admin/deals">Deal 管理</a>
      </nav>

      <DiscoveryPreferences departureOptions={departureOptions} currentDepartureCity={filters.departureCity} />

      <form className="feed-filters" aria-label="发现筛选" action="/" method="get">
        <label>
          出发地
          <select name="departureCity" defaultValue={filters.departureCity ?? ''}>
            <option value="">全部</option>
            {departureOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          目的地区域
          <select name="region" defaultValue={filters.region ?? ''}>
            <option value="">全部</option>
            {regionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          日期窗口
          <select name="travelWindowLabel" defaultValue={filters.travelWindowLabel ?? ''}>
            <option value="">全部</option>
            {travelWindowOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          航司
          <select name="airline" defaultValue={filters.airline ?? ''}>
            <option value="">全部</option>
            {airlineOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          价格上限
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice ?? ''} placeholder="例如 2000" />
        </label>
        <label>
          关键词
          <input type="search" name="q" defaultValue={filters.q ?? ''} placeholder="城市 / 航司 / 目的地" />
        </label>
        <label>
          排序
          <select name="sort" defaultValue={sort}>
            <option value="publishedAtDesc">发布时间</option>
            <option value="priceAsc">价格</option>
            <option value="valueDesc">价值分</option>
          </select>
        </label>
        <button type="submit">应用筛选</button>
      </form>

      <section className="public-deal-feed" aria-label="公开 deal 列表">
        {deals.length === 0 ? <p className="feed-empty">当前筛选下暂无可用特价，试试放宽条件或切换出发地/日期窗口。</p> : null}
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            id={deal.id}
            title={deal.title}
            departureCity={deal.departureCity}
            destination={deal.destination}
            travelWindowLabel={deal.travelWindowLabel}
            airline={deal.airline}
            headlinePrice={deal.headlinePrice}
            referenceTotalPrice={deal.referenceTotalPrice}
            valueScore={deal.valueScore}
            publishedAt={deal.publishedAt}
            updatedAt={deal.updatedAt}
            expiresAt={deal.expiresAt}
          />
        ))}
      </section>

      <CompareAndSavePanel deals={deals} />
    </main>
  )
}
