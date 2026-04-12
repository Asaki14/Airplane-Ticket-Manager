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
    <main className="public-shell" style={{ backgroundColor: 'var(--color-dominant)' }}>
      <section className="detail-hero">
        <p className="eyebrow">Deal 详情</p>
        <h1>{deal.title}</h1>
        <p>
          {deal.departureCity} → {deal.destination} · {deal.airline}
        </p>
      </section>

      <section className="detail-grid detail-grid--primary" aria-label="来源与时效">
        <article className="detail-card">
          <h2>来源与时效</h2>
          <ul>
            <li>来源：{deal.sourceName || '-'}</li>
            <li>发布时间：{toDateLabel(deal.publishedAt)}</li>
            <li>更新时间：{toDateLabel(deal.updatedAt)}</li>
            <li>失效时间：{toDateLabel(deal.expiresAt)}</li>
          </ul>
        </article>

        <article className="detail-card">
          <h2>价格与舱位</h2>
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
          <h2>行李规则</h2>
          <p>{deal.baggageInfo || '-'}</p>
        </article>
        <article className="detail-card">
          <h2>退改规则</h2>
          <p>{deal.refundChangeSummary || '-'}</p>
        </article>
        <article className="detail-card">
          <h2>经停与限制</h2>
          <p>{deal.stopSummary || '-'}</p>
          <p>{deal.restrictions || '-'}</p>
        </article>
      </section>

      <section className="value-explain" aria-label="值得买解释">
        <h2>为什么值得买</h2>
        <p>价值分：{deal.valueScore}</p>
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
