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
  const destCode = destination.substring(0, 3).toUpperCase()
  
  // Calculate ASCII progress bar based on value score
  const barBlocks = 10
  const filledBlocks = Math.round((valueScore / 100) * barBlocks)
  const asciiBar = '[' + '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, barBlocks - filledBlocks)) + ']'
  
  // Determine if we show a "must buy" stamp
  const isHotDeal = valueScore >= 85

  return (
    <article className="deal-card-shell deal-card--boarding-pass">
      <div className="watermark" aria-hidden="true">{destCode}</div>
      <div className="barcode" aria-hidden="true"></div>
      
      {isHotDeal && (
        <div className="stamp-wrapper">
          <span className="stamp">ALERT: LOW</span>
        </div>
      )}

      <header className="deal-card-shell__header">
        <div className="deal-card-header__top">
          <p className="deal-card-label">DEAL #{id}</p>
          <p className="deal-score"><span className="deal-score-label">VALUE</span> {valueScore}</p>
        </div>
        <h2 className="deal-card-shell__title text-clamp-2">
          <a href={`/deals/${id}`}>{title}</a>
        </h2>
      </header>

      <div className="deal-card-shell__route-section">
        <p className="deal-card-shell__route led-font">
          <span className="route-city">{departureCity}</span> 
          <span className="route-arrow">✈</span> 
          <span className="route-city">{destination}</span>
        </p>
        <p className="deal-card-meta">
          <span className="deal-card-shell__meta-item mono-font">{airline}</span>
          <span className="deal-card-shell__meta-item mono-font">| {travelWindowLabel}</span>
        </p>
      </div>

      <footer className="deal-card-shell__footer">
        <div className="deal-price-wrapper">
          <p className="deal-price-main led-font accent-color">¥{headlinePrice}</p>
          <p className="deal-price-reference mono-font">
            REF ¥{referenceTotalPrice}
          </p>
        </div>
        <ul className="deal-freshness mono-font">
          <li>PUB {toDateLabel(publishedAt)}</li>
          <li>UPD {toDateLabel(updatedAt)}</li>
          <li className="accent-color">
            <span className="ascii-bar">{asciiBar}</span>
            EXP {toDateLabel(expiresAt)}
          </li>
        </ul>
      </footer>
    </article>
  )
}

