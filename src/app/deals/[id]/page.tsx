import { notFound } from 'next/navigation'
import { mapPublicFeedResponse } from '@/lib/deals/feed-query'
import { mockDeals } from '@/lib/deals/mock-data'

type DealDetailPageProps = {
  params: Promise<{ id: string }>
}

function toDateLabel(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('zh-CN', { hour12: false })
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params
  const deal = mapPublicFeedResponse(mockDeals).find((item) => item.id === id)

  if (!deal) {
    notFound()
  }

  return (
    <main className="public-shell detail-shell">
      <section className="detail-hero detail-hero--airport">
        <div className="detail-hero__content">
          <p className="eyebrow led-font accent-color">DEAL #{deal.id}</p>
          <h1 className="detail-title">{deal.title}</h1>
          <p className="detail-subtitle mono-font">
            {deal.departureCity} <span className="accent-color">✈</span> {deal.destination} · {deal.airline}
          </p>
        </div>
      </section>

      <section className="detail-grid detail-grid--primary" aria-label="来源与时效">
        <article className="detail-card">
          <h2 className="detail-card__title">来源与时效</h2>
          <ul>
            <li>来源：{deal.sourceName || '-'}</li>
            <li>发布时间：{toDateLabel(deal.publishedAt)}</li>
            <li>更新时间：{toDateLabel(deal.updatedAt)}</li>
            <li>失效时间：{toDateLabel(deal.expiresAt)}</li>
          </ul>
        </article>

        <article className="detail-card">
          <h2 className="detail-card__title">价格与舱位</h2>
          <ul>
            <li>主价格：¥{deal.headlinePrice}</li>
            <li>参考总成本：¥{deal.referenceTotalPrice}</li>
            <li>舱位：{deal.cabin || '-'}</li>
            <li>日期窗口：{deal.travelWindowLabel || '-'}</li>
          </ul>
        </article>
      </section>

      <section className="detail-grid detail-grid--rules" aria-label="票规翻译">
        <article className="detail-card">
          <h2 className="detail-card__title">行李规则</h2>
          <p>{deal.baggageInfo || '-'}</p>
        </article>
        <article className="detail-card">
          <h2 className="detail-card__title">退改规则</h2>
          <div className="rule-card">
            <p className="rule-card__summary text-clamp-3">{deal.refundChangeSummary || '-'}</p>
            <details>
              <summary>展开完整规则</summary>
              <p>{deal.refundChangeSummary || '-'}</p>
            </details>
          </div>
        </article>
        <article className="detail-card">
          <h2 className="detail-card__title">经停与限制</h2>
          <p>{deal.stopSummary || '-'}</p>
          <div className="rule-card">
            <p className="rule-card__summary text-clamp-3">{deal.restrictions || '-'}</p>
            <details>
              <summary>展开完整规则</summary>
              <p>{deal.restrictions || '-'}</p>
            </details>
          </div>
        </article>
      </section>

      <section className="value-explain" aria-label="值得买解释">
        <h2 className="value-explain__title">为什么值得买</h2>
        <p className="value-explain__score">价值分：{deal.valueScore}</p>
        <ul>
          {(deal.valueReasons ?? []).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <a className="buy-link" href={deal.sourceLink} target="_blank" rel="noreferrer">
        去来源页继续购买
      </a>
    </main>
  )
}
