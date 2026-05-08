'use client'

import { useState } from 'react'
import { SearchResultCard } from './SearchResultCard'
import { ComparePanel } from '@/components/deals/ComparePanel'
import type { SearchFareResultItem } from '@/lib/fares/search'

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

type SearchResultsWithCompareProps = {
  results: SearchFareResultItem[]
  deals: DealLite[]
}

export function SearchResultsWithCompare({ results, deals }: SearchResultsWithCompareProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleCompare = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 3)
    )
  }

  const selectedDeals = deals.filter((d) => selectedIds.includes(d.id))

  return (
    <>
      <div className="search-results-grid">
        {results.map((fare, index) => (
          <div
            key={fare.id}
            className="card-entrance"
            style={{ '--card-index': index } as React.CSSProperties}
          >
            <SearchResultCard
              {...fare}
              isCompareSelected={selectedIds.includes(fare.id)}
              onCompareToggle={() => toggleCompare(fare.id)}
            />
          </div>
        ))}
      </div>

      <ComparePanel deals={selectedDeals} />
    </>
  )
}
