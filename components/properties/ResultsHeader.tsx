'use client'

import type { SortOption } from '@/lib/property-browse'

interface ResultsHeaderProps {
  count: number
  sort: SortOption
  onSortChange: (s: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Best value' },
  { value: 'price-desc', label: 'Premium first' },
  { value: 'guests-desc', label: 'Most spacious' },
]

export default function ResultsHeader({ count, sort, onSortChange }: ResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-4">
      <h2 className="font-serif text-xl text-forest-950 tracking-tight">
        {count} treehouse{count !== 1 ? 's' : ''} found
      </h2>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-results" className="text-sm text-stone-500 whitespace-nowrap">
          Sort by
        </label>
        <select
          id="sort-results"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
