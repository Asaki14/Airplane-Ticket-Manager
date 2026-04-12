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
    <main className="public-shell spring-atmosphere" style={{ backgroundColor: 'var(--color-dominant)' }}>
      <section className="public-hero" aria-label="travel-hero">
        <div className="hero-main">
          <p className="eyebrow">航易</p>
          <h1 className="hero-title">更快判断这张机票值不值得买</h1>
          <p className="hero-description">从分散票价中快速看到核心信息：价格、时效、规则和下一步，并通过「查看详情与票规」进入决策页。</p>
        </div>
        <div className="hero-admin-info">
          <span className="admin-info-label">运营入口</span>
          <code>admin / 123456</code>
        </div>
      </section>

      <HeroDealCarousel deals={deals.slice(0, 5)} />

      <section className="home-modes" aria-label="双模式浏览">
        <header className="section-header">
          <p className="section-header__kicker">探索方式</p>
          <h2 className="section-header__title">先定约束，再找灵感</h2>
          <p className="section-header__description">借鉴旅行平台的信息分层逻辑，先让你判断策略，再进入具体筛选与场景入口。</p>
        </header>
        <article className="mode-card mode-card--goal">
          <div className="mode-card__top">
            <span className="mode-card__badge">效率优先</span>
            <span className="mode-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 3a9 9 0 1 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <p className="mode-card__signal">推荐指数：适合预算敏感型</p>
          <h3 className="mode-card__title">任务导向</h3>
          <p className="mode-card__description">先定约束：出发地、预算、时间窗口，快速收敛候选。</p>
          <p className="mode-card__trend">近 7 天中，低价票在工作日 10:00-15:00 更常出现。</p>
          <a className="mode-card__action" href="/?sort=priceAsc">
            先按预算找低价
            <span className="mode-card__action-arrow" aria-hidden="true">&gt;</span>
          </a>
        </article>
        <article className="mode-card mode-card--inspire">
          <div className="mode-card__top">
            <span className="mode-card__badge">灵感发现</span>
            <span className="mode-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 4 14.7 9.3 20.5 10.1 16.2 14.2 17.2 20 12 17.3 6.8 20 7.8 14.2 3.5 10.1 9.3 9.3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <p className="mode-card__signal">推荐指数：适合弹性出行型</p>
          <h3 className="mode-card__title">灵感导向</h3>
          <p className="mode-card__description">从周末捡漏、节假日前后、海岛和周边国际入口启发下一次出行。</p>
          <p className="mode-card__trend">近 7 天中，海岛与周边国际目的地的折扣波动更明显。</p>
          <a className="mode-card__action" href="/?travelWindowLabel=周末捡漏">
            看看本周末灵感
            <span className="mode-card__action-arrow" aria-hidden="true">&gt;</span>
          </a>
        </article>
      </section>

      <section className="quick-scenes" aria-label="高频探索入口">
        <header className="section-header section-header--compact">
          <p className="section-header__kicker">高频场景</p>
          <h2 className="section-header__title">一键进入常见捡漏路径</h2>
        </header>
        <div className="quick-scenes__chips">
          <a href="/?travelWindowLabel=周末捡漏">周末捡漏</a>
          <a href="/?travelWindowLabel=节假日前后">节假日前后</a>
          <a href="/?region=海岛/东南亚">海岛</a>
          <a href="/?region=周边国际">周边国际</a>
        </div>
      </section>

      <nav className="public-nav" aria-label="主导航" style={{ borderColor: 'var(--color-secondary)' }}>
        <a href="/">公开首页</a>
        <a href="/admin">运营后台</a>
        <a href="/admin/deals">Deal 管理</a>
      </nav>

      <DiscoveryPreferences departureOptions={departureOptions} currentDepartureCity={filters.departureCity} />

      <form className="feed-filters" aria-label="发现筛选" action="/" method="get">
        <header className="section-header section-header--compact feed-filters__intro">
          <p className="section-header__kicker">筛选面板</p>
          <h2 className="section-header__title">逐步缩小候选范围</h2>
          <p className="section-header__description">先选硬约束，再按关键词补充，最后按发布时间或价格排序。</p>
        </header>
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
        <header className="section-header section-header--compact public-deal-feed__intro">
          <p className="section-header__kicker">可用候选</p>
          <h2 className="section-header__title">当前筛选下的特价列表</h2>
        </header>
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
