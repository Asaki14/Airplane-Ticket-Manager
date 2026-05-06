/**
 * EmptySearchState.tsx — Two distinct empty state variants for search results.
 *
 * Per D-12: clearly distinguishes "no inventory" (no fares for this date/route)
 * from "no coverage" (data source doesn't cover this route at all).
 *
 * - no-inventory: calendar icon, warm tone, suggests adjusting date
 * - no-coverage: compass icon, neutral tone, suggests popular routes as chips
 */

'use client'

import { popularRoutes } from '@/lib/fares/city-map'

export type EmptySearchStateVariant = 'no-inventory' | 'no-coverage'

export type EmptySearchStateProps = {
  variant: EmptySearchStateVariant
  originCity?: string
  destinationCity?: string
  date?: string
  onSuggestionClick?: (from: string, to: string) => void
}

function CalendarIcon() {
  return (
    <svg className="empty-search-state__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" width="48" height="48">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="18" x2="9" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg className="empty-search-state__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" width="48" height="48">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function EmptySearchState({
  variant,
  originCity,
  destinationCity,
  onSuggestionClick,
}: EmptySearchStateProps) {
  if (variant === 'no-inventory') {
    return (
      <div className="empty-search-state empty-search-state--no-inventory" role="status">
        <div className="empty-search-state__icon-wrapper">
          <CalendarIcon />
        </div>
        <h3 className="empty-search-state__title">该日期此航线暂无机票</h3>
        <p className="empty-search-state__body">
          {originCity && destinationCity
            ? `当前所选日期的 ${originCity} → ${destinationCity} 暂无可用票价。建议尝试调整日期或选择其他航线。`
            : '当前所选日期的航线暂无可用票价。建议尝试调整日期或选择其他航线。'}
        </p>
        <button
          type="button"
          className="empty-search-state__cta"
          onClick={() => {
            // Parent page.tsx can override this via a wrapping handler
          }}
        >
          调整日期试试
        </button>
        <p className="empty-search-state__nudge">
          特价机票通常提前 2-8 周放出，建议多关注几个日期。
        </p>
      </div>
    )
  }

  // no-coverage variant
  const routes = popularRoutes()

  return (
    <div className="empty-search-state empty-search-state--no-coverage" role="status">
      <div className="empty-search-state__icon-wrapper">
        <CompassIcon />
      </div>
      <h3 className="empty-search-state__title">当前数据源暂未覆盖该航线</h3>
      <p className="empty-search-state__body">
        {originCity && destinationCity
          ? `我们目前的数据源暂未覆盖 ${originCity} → ${destinationCity} 这条航线。这并不意味着没有特价，只是我们暂时还没收集到。`
          : '我们目前的数据源暂未覆盖该航线。这并不意味着没有特价，只是我们暂时还没收集到。'}
      </p>
      <p className="empty-search-state__subtitle">试试热门航线：</p>
      {routes.length > 0 && (
        <div className="empty-search-state__chips">
          {routes.map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              type="button"
              className="empty-search-state__chip"
              onClick={() => onSuggestionClick?.(route.from, route.to)}
            >
              {route.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
