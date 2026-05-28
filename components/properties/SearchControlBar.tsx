'use client'

import { Search, SlidersHorizontal, Users, PawPrint, Map, LayoutGrid, List } from 'lucide-react'
import type { BrowseView } from '@/lib/property-browse'

interface SearchControlBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  guestMin: number | null
  onGuestChange: (g: number | null) => void
  petsOnly: boolean
  onPetsChange: (v: boolean) => void
  view: BrowseView
  onViewChange: (v: BrowseView) => void
  onMoreFilters: () => void
  activeFilterCount: number
}

const GUEST_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Any guests', value: null },
  { label: '1+ guests', value: 1 },
  { label: '2+ guests', value: 2 },
  { label: '4+ guests', value: 4 },
  { label: '6+ guests', value: 6 },
  { label: '8+ guests', value: 8 },
]

export default function SearchControlBar({
  searchQuery,
  onSearchChange,
  guestMin,
  onGuestChange,
  petsOnly,
  onPetsChange,
  view,
  onViewChange,
  onMoreFilters,
  activeFilterCount,
}: SearchControlBarProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search destination, vibe, or treehouse name…"
                className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-500"
                aria-label="Search treehouses"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <select
                  value={guestMin ?? ''}
                  onChange={(e) =>
                    onGuestChange(e.target.value === '' ? null : Number(e.target.value))
                  }
                  className="appearance-none rounded-full border border-stone-200 bg-white py-2.5 pl-9 pr-8 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600/30 min-w-[130px]"
                  aria-label="Minimum guests"
                >
                  {GUEST_OPTIONS.map((opt) => (
                    <option key={String(opt.value)} value={opt.value ?? ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => onPetsChange(!petsOnly)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                  petsOnly
                    ? 'border-forest-700 bg-forest-800 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-forest-300 hover:bg-forest-50'
                }`}
                aria-pressed={petsOnly}
              >
                <PawPrint className="h-4 w-4" />
                Pet-friendly
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 lg:justify-end shrink-0">
            <button
              type="button"
              onClick={onMoreFilters}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:border-forest-400 hover:text-forest-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-forest-700 px-1.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div
              className="inline-flex rounded-full border border-stone-200 bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="Results view"
            >
              {(
                [
                  { id: 'map' as const, icon: Map, label: 'Map' },
                  { id: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
                  { id: 'list' as const, icon: List, label: 'List' },
                ] as const
              ).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => onViewChange(id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === id
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'text-stone-600 hover:text-forest-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-stone-500 lg:hidden">
          Search filters apply to listings below — switch Map, Grid, or List to explore.
        </p>
      </div>
    </div>
  )
}
