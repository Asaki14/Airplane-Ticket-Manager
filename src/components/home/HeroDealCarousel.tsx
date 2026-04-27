'use client'

import { useEffect, useMemo, useState } from 'react'

type HeroDealItem = {
  id: string
  title: string
  departureCity: string
  destination: string
  airline: string
  travelWindowLabel: string
  headlinePrice: number
  valueScore: number
  updatedAt: string | null
  expiresAt: string
}

type HeroDealCarouselProps = {
  deals: HeroDealItem[]
}

const AUTOPLAY_INTERVAL_MS = 4500

function formatTime(value: string | null) {
  if (!value) return '待更新'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '待更新'
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function HeroDealCarousel({ deals }: HeroDealCarouselProps) {
  const items = useMemo(() => deals.slice(0, 5), [deals])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const reduced = media.matches
      setPrefersReducedMotion(reduced)
      if (reduced) {
        setIsPaused(true)
      }
    }

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (items.length < 2 || isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, AUTOPLAY_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [items.length, isPaused])

  useEffect(() => {
    if (activeIndex < items.length) return
    setActiveIndex(0)
  }, [activeIndex, items.length])

  if (items.length === 0) {
    return null
  }

  const current = items[activeIndex]

  return (
    <section className="hero-carousel" aria-label="首页特价轮换">
      <div className="hero-carousel__track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {items.map((deal, index) => (
          <article className="hero-carousel__slide" key={deal.id} aria-current={index === activeIndex ? 'true' : undefined}>
            <p className="hero-carousel__eyebrow mono-font">{deal.departureCity} · {deal.travelWindowLabel}</p>
            <h2 className="hero-carousel__title">{deal.title}</h2>
            <p className="hero-carousel__route led-font">
              <span className="route-city">{deal.departureCity}</span> 
              <span className="route-arrow">✈</span> 
              <span className="route-city">{deal.destination}</span>
              <span className="mono-font" style={{marginLeft: '12px', fontSize: '0.6em', color: 'var(--color-text-secondary)'}}>{deal.airline}</span>
            </p>
            <p className="hero-carousel__price accent-color led-font">¥{deal.headlinePrice.toLocaleString('zh-CN')}</p>
            <p className="hero-carousel__meta text-clamp-2 mono-font">
              VALUE {deal.valueScore} 
              <span className="ascii-bar" style={{ marginLeft: '8px', color: 'var(--color-accent)'}}>
                [{'█'.repeat(Math.round((deal.valueScore/100)*10)) + '░'.repeat(Math.max(0, 10 - Math.round((deal.valueScore/100)*10)))}]
              </span> | UPD {formatTime(deal.updatedAt)} | EXP {formatTime(deal.expiresAt)}
            </p>
            <a className="hero-carousel__cta mono-font" href={`/deals/${deal.id}`}>查看详情与票规</a>
          </article>
        ))}
      </div>

      <div className="hero-carousel__controls mono-font" aria-label="轮换控制">
        <button type="button" onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)} aria-label="上一张">
          PREV
        </button>
        <button type="button" onClick={() => setIsPaused((prev) => !prev)} aria-label={isPaused ? '继续轮播' : '暂停轮播'}>
          {isPaused ? 'PLAY' : 'PAUSE'}
        </button>
        <button type="button" onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)} aria-label="下一张">
          NEXT
        </button>
      </div>

      <p className="hero-carousel__status mono-font" aria-live="polite">
        PAGE {activeIndex + 1} / {items.length}
        {prefersReducedMotion ? ' (AUTO-PAUSED)' : ''}
      </p>

      <ol className="hero-carousel__indicators" aria-label="轮换页码">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className="hero-carousel__indicator"
              onClick={() => setActiveIndex(index)}
              aria-label={`切换到第 ${index + 1} 张`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          </li>
        ))}
      </ol>

      <article className="hero-carousel__highlight" aria-label="当前特价概览">
        <h3 className="hero-carousel__highlight-title mono-font blinking-cursor">NOW DEPARTING</h3>
        <p className="hero-carousel__highlight-route led-font">{current.departureCity} <span className="route-arrow accent-color">✈</span> {current.destination}</p>
        <p className="hero-carousel__highlight-price accent-color led-font">¥{current.headlinePrice.toLocaleString('zh-CN')}</p>
      </article>
    </section>
  )
}
