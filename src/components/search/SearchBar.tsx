/**
 * SearchBar.tsx — Flight search form with city text inputs, date pickers,
 * round-trip toggle, and responsive layout.
 *
 * Submits via form GET to preserve search state in URL query string (per D-02).
 * Client component handles trip type toggle for conditional return date display.
 */

'use client'

import { useState } from 'react'
import type { SearchFilterState } from '@/components/search/SearchFilters'

export type SearchBarProps = {
  defaultFrom?: string
  defaultTo?: string
  defaultDate?: string
  defaultReturnDate?: string
  defaultTripType?: 'one-way' | 'round-trip'
  /** Current sort value to preserve across submissions */
  defaultSort?: string
  /** Current filter values to preserve as hidden inputs */
  currentFilters?: SearchFilterState
}

export function SearchBar({
  defaultFrom = '',
  defaultTo = '',
  defaultDate = '',
  defaultReturnDate = '',
  defaultTripType = 'one-way',
  defaultSort,
  currentFilters,
}: SearchBarProps) {
  const [tripType, setTripType] = useState(defaultTripType)
  const isRoundTrip = tripType === 'round-trip'

  return (
    <form
      className="search-bar"
      action="/"
      method="get"
      aria-label="搜索航班"
    >
      {/* Hidden inputs to preserve filter and sort state when search form submits */}
      {currentFilters?.maxPrice !== undefined && (
        <input type="hidden" name="maxPrice" value={currentFilters.maxPrice} />
      )}
      {currentFilters?.airlines?.map((al) => (
        <input key={al} type="hidden" name="airline" value={al} />
      ))}
      {currentFilters?.stops && currentFilters.stops !== 'any' && (
        <input type="hidden" name="stops" value={currentFilters.stops} />
      )}
      {currentFilters?.departureTimeWindow && currentFilters.departureTimeWindow !== 'any' && (
        <input type="hidden" name="departureTimeWindow" value={currentFilters.departureTimeWindow} />
      )}
      {currentFilters?.cabin && currentFilters.cabin !== 'any' && (
        <input type="hidden" name="cabin" value={currentFilters.cabin} />
      )}
      {currentFilters?.baggageIncluded === true && (
        <input type="hidden" name="baggageIncluded" value="true" />
      )}
      {defaultSort && (
        <input type="hidden" name="sort" value={defaultSort} />
      )}

      <div className="search-bar__row">
        <div className="search-bar__field-group">
          <label className="search-bar__label">
            从
            <input
              type="text"
              name="from"
              placeholder="从 (城市名)"
              defaultValue={defaultFrom}
              className="search-bar__input"
            />
          </label>
          <span className="search-bar__hint">输入中文城市名，如'上海'、'北京'</span>
        </div>

        <div className="search-bar__field-group">
          <label className="search-bar__label">
            到
            <input
              type="text"
              name="to"
              placeholder="到 (城市名)"
              defaultValue={defaultTo}
              className="search-bar__input"
            />
          </label>
          <span className="search-bar__hint">输入中文城市名，如'广州'、'东京'</span>
        </div>
      </div>

      <div className="search-bar__row">
        <div className="search-bar__field-group">
          <label className="search-bar__label">
            出发日期
            <input
              type="date"
              name="date"
              defaultValue={defaultDate}
              className="search-bar__input"
            />
          </label>
        </div>

        {isRoundTrip && (
          <div className="search-bar__field-group">
            <label className="search-bar__label">
              返程日期
              <input
                type="date"
                name="returnDate"
                defaultValue={defaultReturnDate}
                className="search-bar__input"
              />
            </label>
          </div>
        )}
      </div>

      <div className="search-bar__row search-bar__row--actions">
        <div className="search-bar__toggle" role="radiogroup" aria-label="行程类型">
          <label className="search-bar__radio-label">
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={() => setTripType('one-way')}
            />
            <span>单程</span>
          </label>
          <label className="search-bar__radio-label">
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={() => setTripType('round-trip')}
            />
            <span>往返</span>
          </label>
        </div>

        <button type="submit" className="search-bar__submit">
          搜索航班
        </button>
      </div>
    </form>
  )
}
