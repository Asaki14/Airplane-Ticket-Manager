'use client'

type DealLite = {
  id: string
  title: string
  headlinePrice: number
  referenceTotalPrice: number
  baggageInfo: string
  refundChangeSummary: string
  stopSummary: string
  travelWindowLabel: string
}

type ComparePanelProps = {
  deals: DealLite[]
}

export function ComparePanel({ deals }: ComparePanelProps) {
  if (deals.length === 0) {
    return (
      <section className="compare-panel" aria-label="机票比较">
        <h2 className="compare-panel__title">并排比较</h2>
        <p className="compare-panel__empty">在机票卡片上点击「+ 比较」，最多可选 3 张进行对比。</p>
      </section>
    )
  }

  return (
    <section className="compare-panel" aria-label="机票比较">
      <h2 className="compare-panel__title">并排比较</h2>

      <div className="compare-grid" aria-label="并排比较面板">
        {deals.map((deal, index) => (
          <div
            key={deal.id}
            className="compare-entrance"
            style={{ '--comp-index': index } as React.CSSProperties}
          >
            <article className="compare-column compare-card-shell">
              <header className="compare-card-shell__header">
                <h3>{deal.title}</h3>
              </header>

              <div className="compare-card-shell__body">
                <ul>
                  <li>价格：¥{deal.headlinePrice}</li>
                  <li>总成本：¥{deal.referenceTotalPrice}</li>
                  <li>行李：{deal.baggageInfo || '-'}</li>
                  <li>退改：{deal.refundChangeSummary || '-'}</li>
                  <li>经停：{deal.stopSummary || '-'}</li>
                </ul>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
