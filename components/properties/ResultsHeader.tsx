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
  const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Recommended'

  return (
    <div className="flex items-center justify-between gap-3 py-3 md:py-4">
      <h2 className="font-serif text-base text-forest-950 tracking-tight md:text-xl">
        {count} treehouse{count !== 1 ? 's' : ''} found
      </h2>
      <div className="relative shrink-0">
        <label htmlFor="sort-results" className="sr-only">
          Sort results
        </label>
        <select
          id="sort-results"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none rounded-xl bg-stone-100/90 py-2 pl-3 pr-8 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-600/25 md:rounded-full md:border md:border-stone-200/80 md:bg-white md:px-4 md:font-normal"
          aria-label={`Sort by ${currentLabel}`}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs md:right-3"
          aria-hidden
        >
          ▼
        </span>
      </div>
    </div>
  )
}
