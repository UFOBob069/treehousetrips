'use client'

import { Search, SlidersHorizontal, Users, Map, LayoutGrid, List } from 'lucide-react'
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

const MOBILE_GUEST_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Guests', value: null },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '4+', value: 4 },
  { label: '6+', value: 6 },
  { label: '8+', value: 8 },
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
  const mobileView = view === 'map' ? 'map' : 'list'

  return (
    <div className="sticky top-16 z-40 border-b border-stone-200/50 bg-[#faf8f5]/95 backdrop-blur-md">
      {/* —— Mobile: compact 2-row bar —— */}
      <div className="md:hidden px-4 py-2.5 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Where to next?"
            className="w-full rounded-2xl bg-stone-100/90 py-2.5 pl-9 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-600/25"
            aria-label="Search treehouses"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Users className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <select
              value={guestMin ?? ''}
              onChange={(e) =>
                onGuestChange(e.target.value === '' ? null : Number(e.target.value))
              }
              className="w-full appearance-none rounded-2xl bg-stone-100/90 py-2.5 pl-8 pr-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600/25"
              aria-label="Minimum guests"
            >
              {MOBILE_GUEST_OPTIONS.map((opt) => (
                <option key={String(opt.value)} value={opt.value ?? ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onMoreFilters}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-100/90 text-stone-700 active:scale-95 transition-transform"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-forest-700 px-1 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div
            className="flex shrink-0 rounded-2xl bg-stone-100/90 p-0.5"
            role="tablist"
            aria-label="Browse view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'list'}
              onClick={() => onViewChange('list')}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                mobileView === 'list'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-stone-500'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'map'}
              onClick={() => onViewChange('map')}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                mobileView === 'map'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-stone-500'
              }`}
              aria-label="Map view"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* —— Desktop / tablet —— */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search destination, vibe, or treehouse name…"
                className="w-full rounded-full border border-stone-200/80 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-500"
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
                  className="appearance-none rounded-full border border-stone-200/80 bg-white py-2.5 pl-9 pr-8 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600/30 min-w-[130px]"
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
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  petsOnly
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200/80'
                }`}
                aria-pressed={petsOnly}
              >
                Pet-friendly
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 lg:justify-end shrink-0">
            <button
              type="button"
              onClick={onMoreFilters}
              className="inline-flex items-center gap-2 rounded-full bg-stone-100/90 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-200/80 transition-colors"
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
              className="inline-flex rounded-full bg-stone-100/90 p-1"
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
                      ? 'bg-white text-forest-800 shadow-sm'
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
      </div>
    </div>
  )
}
