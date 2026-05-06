/**
 * SearchFilters.tsx — Search-specific filter panel for real fare search results.
 *
 * Rebuilt from scratch for search context (not extending FeedFilters per D-14).
 * All filter values flow through URL query string via form action="/" method="get".
 * Multi-value params (airline checkboxes) serialize as ?airline=MU&airline=CZ.
 * Default/any values are included in submission — server ignores them.
 *
 * Filter groups: price, airline (multi-select), stops, departure time window, cabin, baggage.
 */

'use client'

/** Current filter state — maps 1:1 to URL search params. */
export type SearchFilterState = {
  maxPrice?: number
  airlines?: string[] // multi-select
  stops?: 'direct' | 'oneOrLess' | 'any'
  departureTimeWindow?: 'morning' | 'afternoon' | 'evening' | 'any'
  cabin?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' | 'any'
  baggageIncluded?: boolean | 'any'
}

export type SearchFiltersProps = {
  currentFilters: SearchFilterState
  airlineOptions: string[]
  minPrice?: number
  maxPrice?: number
  /** Search params to preserve as hidden inputs across filter submissions */
  currentFrom?: string
  currentTo?: string
  currentDate?: string
  currentReturnDate?: string
  currentTripType?: 'one-way' | 'round-trip'
  currentSort?: string
}

const STOPS_OPTIONS: { value: SearchFilterState['stops']; label: string }[] = [
  { value: 'any', label: '不限' },
  { value: 'direct', label: '直达' },
  { value: 'oneOrLess', label: '经停1次以内' },
]

const TIME_WINDOW_OPTIONS: { value: SearchFilterState['departureTimeWindow']; label: string }[] = [
  { value: 'any', label: '不限' },
  { value: 'morning', label: '早班 06:00-12:00' },
  { value: 'afternoon', label: '午班 12:00-18:00' },
  { value: 'evening', label: '晚班 18:00-24:00' },
]

const CABIN_OPTIONS: { value: NonNullable<SearchFilterState['cabin']>; label: string }[] = [
  { value: 'any', label: '不限' },
  { value: 'ECONOMY', label: '经济舱' },
  { value: 'PREMIUM_ECONOMY', label: '超级经济舱' },
  { value: 'BUSINESS', label: '商务舱' },
  { value: 'FIRST', label: '头等舱' },
]

export function SearchFilters({
  currentFilters,
  airlineOptions,
  currentFrom,
  currentTo,
  currentDate,
  currentReturnDate,
  currentTripType,
  currentSort,
}: SearchFiltersProps) {
  const checkedAirlines = new Set(currentFilters.airlines ?? [])

  return (
    <form
      className="search-filters"
      action="/"
      method="get"
      aria-label="搜索筛选"
    >
      {/* Hidden inputs to preserve search + sort params when filters submit */}
      {currentFrom && <input type="hidden" name="from" value={currentFrom} />}
      {currentTo && <input type="hidden" name="to" value={currentTo} />}
      {currentDate && <input type="hidden" name="date" value={currentDate} />}
      {currentReturnDate && <input type="hidden" name="returnDate" value={currentReturnDate} />}
      {currentTripType && <input type="hidden" name="tripType" value={currentTripType} />}
      {currentSort && <input type="hidden" name="sort" value={currentSort} />}

      {/* Price range */}
      <fieldset className="search-filters__group">
        <legend className="search-filters__legend">最高价格</legend>
        <div className="search-filters__input-row">
          <input
            className="search-filters__input"
            type="number"
            name="maxPrice"
            min={0}
            defaultValue={currentFilters.maxPrice ?? ''}
            placeholder="例如 2000"
          />
        </div>
      </fieldset>

      {/* Airline multi-select */}
      {airlineOptions.length > 0 && (
        <fieldset className="search-filters__group">
          <legend className="search-filters__legend">航司</legend>
          <div className="search-filters__checkbox-group">
            {airlineOptions.map((airline) => (
              <label key={airline} className="search-filters__checkbox-label">
                <input
                  type="checkbox"
                  name="airline"
                  value={airline}
                  defaultChecked={checkedAirlines.has(airline)}
                />
                <span>{airline}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Stops */}
      <fieldset className="search-filters__group">
        <legend className="search-filters__legend">经停</legend>
        <div className="search-filters__radio-group">
          {STOPS_OPTIONS.map((opt) => (
            <label key={opt.value} className="search-filters__radio-label">
              <input
                type="radio"
                name="stops"
                value={opt.value}
                defaultChecked={(currentFilters.stops ?? 'any') === opt.value}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Departure time window */}
      <fieldset className="search-filters__group">
        <legend className="search-filters__legend">出发时段</legend>
        <div className="search-filters__radio-group">
          {TIME_WINDOW_OPTIONS.map((opt) => (
            <label key={opt.value} className="search-filters__radio-label">
              <input
                type="radio"
                name="departureTimeWindow"
                value={opt.value}
                defaultChecked={(currentFilters.departureTimeWindow ?? 'any') === opt.value}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cabin */}
      <fieldset className="search-filters__group">
        <legend className="search-filters__legend">舱位</legend>
        <select
          className="search-filters__select"
          name="cabin"
          defaultValue={currentFilters.cabin ?? 'any'}
        >
          {CABIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Baggage included */}
      <fieldset className="search-filters__group">
        <legend className="search-filters__legend">行李</legend>
        <label className="search-filters__checkbox-label">
          <input
            type="checkbox"
            name="baggageIncluded"
            value="true"
            defaultChecked={currentFilters.baggageIncluded === true}
          />
          <span>含行李</span>
        </label>
      </fieldset>

      {/* Submit */}
      <button type="submit" className="search-filters__submit">
        应用筛选
      </button>
    </form>
  )
}
