/**
 * SearchResultCard.tsx — Boarding-pass style fare result card for real search results.
 *
 * Extends the existing DealCard visual system (deal-card-shell, watermark, barcode)
 * with real fare fields from SearchFareResultItem: exact departure/arrival times,
 * flight numbers, cabin, baggage, deep link, and freshness metadata.
 */

'use client'

import { useState } from 'react'
import type { SearchFareResultItem } from '@/lib/fares/search'

export type SearchResultCardProps = SearchFareResultItem & {
  /** Optional CSS class override */
  className?: string
  /** Compare mode: is this card selected for comparison */
  isCompareSelected?: boolean
  /** Called when user toggles compare selection */
  onCompareToggle?: () => void
}

/**
 * Format an ISO datetime string as a relative freshness label in Chinese.
 * Shows "X分钟前", "X小时前", or falls back to the datetime string.
 */
function freshnessLabel(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const diffMs = now - then
  if (diffMs < 0) return '刚刚'
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return new Date(iso).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * Format time from ISO string to "HH:mm" display.
 */
function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/** Cabin badge label mapping. */
const CABIN_LABELS: Record<string, string> = {
  ECONOMY: '经济舱',
  PREMIUM_ECONOMY: '超经',
  BUSINESS: '商务舱',
  FIRST: '头等舱',
}

export function SearchResultCard(props: SearchResultCardProps) {
  const {
    airline,
    flightNumbers,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    cabin,
    baggageFacts,
    priceAmount,
    currency,
    deepLink,
    collectedAt,
    expiresAt,
    stopCount,
    stopAirports,
    refundChangePolicy,
    bookingRestrictions,
    fareClass,
    returnDepartureTime,
    returnArrivalTime,
    ignavId,
    className = '',
    isCompareSelected = false,
    onCompareToggle,
  } = props

  const destCode = arrivalAirport.substring(0, 3).toUpperCase()
  const flightLabel = flightNumbers.length > 0
    ? `${airline} ${flightNumbers.join(' / ')}`
    : airline
  const cabinLabel = CABIN_LABELS[cabin] ?? cabin

  const [loadingLinks, setLoadingLinks] = useState(false)
  const [bookingWarning, setBookingWarning] = useState<string | null>(null)

  const handleBookingClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!ignavId || loadingLinks) return
    setLoadingLinks(true)
    try {
      const res = await fetch('/api/fares/booking-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ignav_id: ignavId,
          displayed_price: priceAmount,
          currency,
          cabin
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      const urls: string[] = data?.booking_options?.flatMap(
        (opt: { links: { url: string }[] }) => opt.links.map((l: { url: string }) => l.url)
      ) ?? []
      if (urls.length > 0) {
        window.open(urls[0], '_blank', 'noopener,noreferrer')
        setBookingWarning('价格可能已更新，请以预订页面显示为准')
      }
    } finally {
      setLoadingLinks(false)
    }
  }

  return (
    <article
      className={`deal-card-shell deal-card--boarding-pass search-result-card${isCompareSelected ? ' search-result-card--selected' : ''} ${className}`}
      role="article"
      aria-label={`${airline} ${departureAirport} → ${arrivalAirport} ¥${priceAmount} — ${cabinLabel}`}
    >
      <div className="watermark" aria-hidden="true">{destCode}</div>
      <div className="barcode" aria-hidden="true"></div>

      {/* Header: airline + flight number + cabin badge */}
      <header className="deal-card-shell__header">
        <div className="deal-card-header__top">
          <span className="deal-card-label mono-font">{flightLabel}</span>
          <span className="search-result-card__cabin-badge">{cabinLabel}</span>
        </div>
      </header>

      {/* Route section: times, airports, stopover */}
      <div className="deal-card-shell__route-section">
        <div className="search-result-card__route-row">
          <div className="search-result-card__time-block">
            <span className="search-result-card__time led-font">{formatTime(departureTime)}</span>
            <span className="search-result-card__airport mono-font">{departureAirport}</span>
          </div>
          <span className="route-arrow" aria-hidden="true">✈</span>
          <div className="search-result-card__time-block search-result-card__time-block--arrival">
            <span className="search-result-card__time led-font">{formatTime(arrivalTime)}</span>
            <span className="search-result-card__airport mono-font">{arrivalAirport}</span>
          </div>
        </div>

        {/* Stopover info */}
        {typeof stopCount === 'number' && (
          <p className="deal-card-meta mono-font">
            {stopCount === 0
              ? '直达'
              : `经停 ${stopCount} 次${stopAirports && stopAirports.length > 0 ? ` (${stopAirports.join(' / ')})` : ''}`}
          </p>
        )}

        {/* Return leg times for round trips */}
        {returnDepartureTime && returnArrivalTime && (
          <p className="deal-card-meta mono-font search-result-card__return-row">
            <span className="search-result-card__return-label">返程</span>
            <span>{formatTime(returnDepartureTime)} – {formatTime(returnArrivalTime)}</span>
          </p>
        )}
      </div>

      {/* Price section */}
      <footer className="deal-card-shell__footer">
        <div className="deal-price-wrapper">
          <p className="deal-price-main led-font accent-color">
            {currency === 'CNY' ? '¥' : currency}{priceAmount}
          </p>
          {fareClass && (
            <span className="search-result-card__fare-class mono-font">{fareClass}</span>
          )}
        </div>

        {/* Metadata: baggage + freshness */}
        <div className="search-result-card__meta-row mono-font">
          {baggageFacts && (
            <span className="search-result-card__baggage" title={baggageFacts}>
              {baggageFacts}
            </span>
          )}
          <span className="search-result-card__freshness" title={`采集时间: ${collectedAt}`}>
            {freshnessLabel(collectedAt)}
          </span>
        </div>

        {/* Optional refund / restriction summary */}
        {(refundChangePolicy || bookingRestrictions) && (
          <details className="search-result-card__details">
            <summary className="mono-font">票规</summary>
            {refundChangePolicy && <p className="search-result-card__detail-text">{refundChangePolicy}</p>}
            {bookingRestrictions && <p className="search-result-card__detail-text">{bookingRestrictions}</p>}
          </details>
        )}

        {/* Expiry timestamp */}
        <span className="search-result-card__expiry mono-font">
          EXP {new Date(expiresAt).toLocaleString('zh-CN', { hour12: false })}
        </span>

        {/* Booking link + Compare toggle */}
        <div className="search-result-card__actions">
        {/* Price change warning */}
        {bookingWarning && (
          <p className="search-result-card__price-warning mono-font">{bookingWarning}</p>
        )}

        {ignavId ? (
          <button
            type="button"
            className="search-result-card__buylink"
            onClick={handleBookingClick}
            disabled={loadingLinks}
          >
            {loadingLinks ? '获取中…' : '预订直链 →'}
          </button>
        ) : deepLink ? (
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="search-result-card__buylink"
            title="价格可能已更新，请以预订页面显示为准"
            onClick={(e) => e.stopPropagation()}
          >
            查看详情 →
          </a>
        ) : null}

          {/* Compare toggle */}
          {onCompareToggle && (
            <button
              type="button"
              className={`search-result-card__compare-btn ${isCompareSelected ? 'search-result-card__compare-btn--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onCompareToggle() }}
              aria-label={isCompareSelected ? '移出比较' : '加入比较'}
            >
              {isCompareSelected ? '✓ 已比较' : '+ 比较'}
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}
