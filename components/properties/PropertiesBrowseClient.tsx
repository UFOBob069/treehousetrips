'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import SearchControlBar from '@/components/properties/SearchControlBar'
import CategoryScroller from '@/components/properties/CategoryScroller'
import ResultsHeader from '@/components/properties/ResultsHeader'
import MoreFiltersPanel from '@/components/properties/MoreFiltersPanel'
import PropertyBrowseCard from '@/components/properties/PropertyBrowseCard'
import {
  type BrowseProperty,
  type BrowseView,
  type SortOption,
  filterBrowseProperties,
  sortBrowseProperties,
  getAllTags,
} from '@/lib/property-browse'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-stone-200/80">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
    </div>
  ),
})

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return isMobile
}

interface PropertiesBrowseClientProps {
  initialProperties: BrowseProperty[]
}

export default function PropertiesBrowseClient({
  initialProperties,
}: PropertiesBrowseClientProps) {
  const [properties] = useState<BrowseProperty[]>(initialProperties)
  const isMobile = useIsMobile()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([])
  const [guestMin, setGuestMin] = useState<number | null>(null)
  const [petsOnly, setPetsOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [view, setView] = useState<BrowseView>('list')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  const [selectedProperty, setSelectedProperty] = useState<BrowseProperty | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<BrowseProperty | null>(null)

  const handleViewChange = useCallback(
    (next: BrowseView) => {
      if (isMobile && next === 'grid') {
        setView('list')
        return
      }
      setView(next)
    },
    [isMobile]
  )

  useEffect(() => {
    if (isMobile && view === 'grid') {
      setView('list')
    }
  }, [isMobile, view])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const collection = params.get('collection')
    const search = params.get('search')
    if (collection) setSelectedCategories([collection])
    if (search) setSearchQuery(search)
  }, [])

  const allSecondaryTags = useMemo(() => getAllTags(properties), [properties])

  const filtered = useMemo(() => {
    const list = filterBrowseProperties(properties, {
      searchQuery,
      selectedCategories,
      guestMin,
      petsOnly,
      secondaryTags: selectedSecondary,
    })
    return sortBrowseProperties(list, sort)
  }, [properties, searchQuery, selectedCategories, selectedSecondary, guestMin, petsOnly, sort])

  const activeFilterCount = selectedCategories.length + selectedSecondary.length

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleSecondary = (tag: string) => {
    setSelectedSecondary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedSecondary([])
    setGuestMin(null)
    setPetsOnly(false)
  }

  const effectiveView = isMobile ? (view === 'map' ? 'map' : 'list') : view
  const cardViewMode = effectiveView === 'list' && !isMobile ? 'list' : 'grid'

  const emptyState = (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-xl text-forest-900 mb-2">No treehouses match your search</p>
      <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">
        Try clearing filters or searching a broader destination.
      </p>
      <button
        type="button"
        onClick={clearAllFilters}
        className="rounded-full bg-forest-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-900"
      >
        Clear all filters
      </button>
    </div>
  )

  const resultsList = (
    <div
      className={
        effectiveView === 'grid' && !isMobile
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'flex flex-col gap-6 md:gap-5 max-md:px-1'
      }
    >
      {filtered.map((property, index) => (
        <div
          key={property.id}
          onMouseEnter={() => setHoveredProperty(property)}
          onMouseLeave={() => setHoveredProperty(null)}
        >
          <PropertyBrowseCard
            property={property}
            viewMode={cardViewMode}
            isHighlighted={hoveredProperty?.id === property.id}
            imagePriority={index === 0}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <SearchControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        guestMin={guestMin}
        onGuestChange={setGuestMin}
        petsOnly={petsOnly}
        onPetsChange={setPetsOnly}
        view={view}
        onViewChange={handleViewChange}
        onMoreFilters={() => setMoreFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {!(isMobile && effectiveView === 'map') && (
        <CategoryScroller selected={selectedCategories} onToggle={toggleCategory} />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {!(isMobile && effectiveView === 'map') && (
          <ResultsHeader count={filtered.length} sort={sort} onSortChange={setSort} />
        )}

        {filtered.length === 0 ? (
          emptyState
        ) : effectiveView === 'map' ? (
          <div className={`pb-8 ${isMobile ? '-mx-3 px-0' : ''}`}>
            <div
              className={`relative overflow-hidden shadow-lg ${
                isMobile
                  ? 'h-[calc(100dvh-120px)] min-h-[480px] rounded-none border-0'
                  : 'h-[calc(100vh-260px)] min-h-[520px] rounded-2xl border border-stone-200/80'
              }`}
            >
              <MapView
                properties={properties}
                visibleProperties={filtered}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={setSelectedProperty}
              />

              <div className="absolute inset-x-0 bottom-0 z-20">
                <div className="pointer-events-none h-12 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="pointer-events-auto bg-[#faf8f5]/92 backdrop-blur-md border-t border-stone-200/50">
                  {isMobile && (
                    <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
                      <span className="text-sm font-medium text-stone-700">
                        {filtered.length} stays
                      </span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="text-sm font-medium text-stone-600 bg-transparent focus:outline-none"
                        aria-label="Sort"
                      >
                        <option value="recommended">Recommended</option>
                        <option value="price-asc">Best value</option>
                        <option value="price-desc">Premium</option>
                        <option value="guests-desc">Spacious</option>
                      </select>
                    </div>
                  )}
                  <div className="flex gap-2.5 overflow-x-auto px-4 py-3 scrollbar-hide">
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseEnter={() => setHoveredProperty(p)}
                        onMouseLeave={() => setHoveredProperty(null)}
                        onClick={() => setSelectedProperty(p)}
                        className={`shrink-0 w-[200px] rounded-2xl text-left overflow-hidden transition-all active:scale-[0.98] ${
                          selectedProperty?.id === p.id
                            ? 'ring-2 ring-forest-600 shadow-md'
                            : 'shadow-sm'
                        }`}
                      >
                        <div className="relative h-24 w-full bg-stone-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images?.[0]}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                            {p.price}
                          </span>
                        </div>
                        <div className="p-2.5 bg-[#fffcf7]">
                          <div className="font-serif text-sm text-forest-950 line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-xs text-stone-500 line-clamp-1">{p.location}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-16 md:pb-12">{resultsList}</div>
        )}
      </div>

      <MoreFiltersPanel
        isOpen={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        secondaryTags={allSecondaryTags}
        allSecondaryTags={allSecondaryTags}
        selectedSecondary={selectedSecondary}
        onToggleSecondary={toggleSecondary}
        onClearAll={clearAllFilters}
      />
    </div>
  )
}
