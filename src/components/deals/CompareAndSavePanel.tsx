'use client'

import { useEffect, useMemo, useState } from 'react'

import { buildDealAdvice } from '@/lib/dealAdvice'

type DealLite = {
  id: string
  title: string
  departureCity: string
  destination: string
  headlinePrice: number
  referenceTotalPrice: number
  valueScore: number
  baggageInfo: string
  refundChangeSummary: string
  stopSummary: string
  travelWindowLabel: string
}

type CompareAndSavePanelProps = {
  deals: DealLite[]
}

const FAV_KEY = 'flight-deals:favorites'

export function CompareAndSavePanel({ deals }: CompareAndSavePanelProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(FAV_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as string[]
      setFavorites(parsed)
    } catch {
      setFavorites([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])

  const selectedDeals = useMemo(
    () => deals.filter((deal) => selected.includes(deal.id)).slice(0, 3),
    [deals, selected]
  )

  function toggleCompare(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section className="compare-save max-w-7xl mx-auto px-4 py-16 bg-slate-50 mt-12 rounded-2xl" aria-label="比较收藏分享">
      <h2 className="compare-save__title">比较、收藏与分享</h2>
      <p className="compare-save__description">
        犹豫不决？把候选加入比较，并排看价格、时效、规则和购买建议，决策更清晰。
        收藏后可稍后再看，链接可复制分享给他人参考。
      </p>

      <div className="compare-actions flex flex-wrap gap-4 mt-8">
        {deals.map((deal, idx) => {
          const inCompare = selected.includes(deal.id)
          const inFavorites = favorites.includes(deal.id)
          const advice = buildDealAdvice(deal)
          const compareActionLabel = inCompare
            ? '移出比较：该候选将从当前比较面板移除。'
            : `加入比较：将 ${deal.title} 加入当前比较面板。`
          const favoriteActionLabel = inFavorites
            ? '取消收藏：确认后将从本地收藏中移除，可稍后再次收藏。'
            : `收藏：将 ${deal.title} 加入本地收藏。`

          const priceTag = deal.headlinePrice <= 500 ? '低价票' : deal.headlinePrice <= 1000 ? '常规价' : '高端票'
          const dateTag = deal.travelWindowLabel ?? '近期出发'
          const hasStop = deal.stopSummary?.includes('经停') ?? deal.stopSummary?.includes('中转')
          const routeTag = hasStop ? '需中转' : '直飞'

          const cardElements = [
            `💰 价格 ¥${deal.headlinePrice}`,
            `📅 ${dateTag}`,
            `✈️ ${routeTag}`,
            `⭐ 价值分 ${deal.valueScore}`
          ]
          const showElements = cardElements.slice(idx % 2, (idx % 2) + 2)

          return (
            <article key={deal.id} className="compare-action-item compare-card-shell flex-1 min-w-[300px] bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <header className="compare-card-shell__header">
                <p className="compare-card-shell__deal-title text-clamp-2">{deal.title}</p>
                <div className="compare-card-shell__tags">
                  <span className="compare-card-shell__tag">{priceTag}</span>
                  <span className="compare-card-shell__tag">{routeTag}</span>
                </div>
              </header>

              <p className="compare-card-shell__advice" aria-label="航班特点与购买建议">
                {advice}
              </p>

              <div className="compare-card-shell__body">
                <ul className="compare-card-shell__meta">
                  {showElements.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
                <div className="compare-card-shell__actions">
                  <button
                    type="button"
                    aria-label={compareActionLabel}
                    onClick={() => toggleCompare(deal.id)}
                  >
                    {inCompare ? '移出比较' : '加入比较'}
                  </button>
                  <button
                    type="button"
                    aria-label={favoriteActionLabel}
                    onClick={() => toggleFavorite(deal.id)}
                  >
                    {inFavorites ? '取消收藏' : '收藏'}
                  </button>
                </div>
              </div>

              <footer className="compare-card-shell__footer">
                <a className="compare-card-shell__share-link" href={`/deals/${deal.id}`}>分享链接</a>
                <p>{inCompare ? '已加入比较' : '待比较'}</p>
              </footer>
            </article>
          )
        })}
      </div>

      <div className="compare-grid flex gap-6 overflow-x-auto pb-8 pt-8 mt-12" aria-label="并排比较面板">
        {selectedDeals.length === 0 ? <p>尚未选择比较项。</p> : null}
        {selectedDeals.map((deal) => (
          <article key={deal.id} className="compare-column compare-card-shell flex-1 min-w-[300px] bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                <li>价值分：{deal.valueScore}</li>
              </ul>
            </div>

            <footer className="compare-card-shell__footer">
              <a className="compare-card-shell__detail-link" href={`/deals/${deal.id}`}>查看详情与票规</a>
              <p>字段顺序已按决策优先展示</p>
            </footer>
          </article>
        ))}
      </div>

      <p className="favorites-summary compare-save__favorites-summary">已收藏 {favorites.length} 条，可在后续版本加入专门回看页。</p>
    </section>
  )
}
