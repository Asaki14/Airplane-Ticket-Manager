type DealCardProps = {
  title: string
  departureCity: string
  destination: string
  headlinePrice: number
  referenceTotalPrice: number
  publishedAt: string | null
  updatedAt: string | null
  expiresAt: string
}

export function DealCard({
  title,
  departureCity,
  destination,
  headlinePrice,
  referenceTotalPrice,
  publishedAt,
  updatedAt,
  expiresAt
}: DealCardProps) {
  return (
    <article className="deal-card" style={{ backgroundColor: 'var(--color-secondary)' }}>
      <h2>{title}</h2>
      <p>
        {departureCity} → {destination}
      </p>

      <p className="deal-price-main">¥{headlinePrice}</p>
      <p className="deal-price-reference">参考总成本：¥{referenceTotalPrice}</p>

      <ul className="deal-freshness">
        <li>发布时间：{publishedAt ?? '-'}</li>
        <li>更新时间：{updatedAt ?? '-'}</li>
        <li>失效时间：{expiresAt}</li>
      </ul>
    </article>
  )
}
