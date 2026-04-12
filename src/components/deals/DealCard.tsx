type DealCardProps = {
  id: string
  title: string
  departureCity: string
  destination: string
  travelWindowLabel: string
  airline: string
  headlinePrice: number
  referenceTotalPrice: number
  valueScore: number
  publishedAt: string | null
  updatedAt: string | null
  expiresAt: string
}

function toDateLabel(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('zh-CN', { hour12: false })
}

export function DealCard({
  id,
  title,
  departureCity,
  destination,
  travelWindowLabel,
  airline,
  headlinePrice,
  referenceTotalPrice,
  valueScore,
  publishedAt,
  updatedAt,
  expiresAt
}: DealCardProps) {
  return (
    <article className="deal-card deal-card-shell">
      <header className="deal-card-shell__header">
        <p className="deal-card-label">特价 #{id}</p>
        <h2 className="deal-card-shell__title text-clamp-2">
          <a href={`/deals/${id}`}>{title}</a>
        </h2>
        <p className="deal-card-shell__route text-clamp-2">
          {departureCity} → {destination}
        </p>
      </header>

      <div className="deal-card-shell__body">
        <p className="deal-card-meta">
          <span className="text-clamp-2">{travelWindowLabel}</span>
          <span className="text-clamp-2">{airline}</span>
        </p>

        <p className="deal-price-main">¥{headlinePrice}</p>
        <p className="deal-price-reference">参考总成本：¥{referenceTotalPrice}</p>
        <p className="deal-score">价值分：{valueScore}</p>

        <ul className="deal-freshness">
          <li>发布时间：{toDateLabel(publishedAt)}</li>
          <li>更新时间：{toDateLabel(updatedAt)}</li>
          <li>失效时间：{toDateLabel(expiresAt)}</li>
        </ul>
      </div>

      <footer className="deal-card-shell__footer">
        <a className="deal-detail-link" href={`/deals/${id}`}>
          查看详情与票规
        </a>
      </footer>
    </article>
  )
}
