'use client'

import { useState, useEffect, useMemo } from 'react'
import MapView from '@/components/MapView'
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
import { Map } from 'lucide-react'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<BrowseProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([])
  const [guestMin, setGuestMin] = useState<number | null>(null)
  const [petsOnly, setPetsOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [view, setView] = useState<BrowseView>('grid')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  const [selectedProperty, setSelectedProperty] = useState<BrowseProperty | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<BrowseProperty | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/properties.json')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setProperties(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setProperties([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
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

  const activeFilterCount =
    selectedCategories.length + selectedSecondary.length + (petsOnly ? 1 : 0)

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

  const emptyState = (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-xl text-forest-900 mb-2">No treehouses match your search</p>
      <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">
        Try clearing filters or searching a broader destination — Oregon, redwoods, romantic, or
        family-friendly.
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

  const resultsGrid = (
    <div
      className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'flex flex-col gap-5'
      }
    >
      {filtered.map((property) => (
        <div
          key={property.id}
          onMouseEnter={() => setHoveredProperty(property)}
          onMouseLeave={() => setHoveredProperty(null)}
        >
          <PropertyBrowseCard
            property={property}
            viewMode={view === 'list' ? 'list' : 'grid'}
            isHighlighted={hoveredProperty?.id === property.id}
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
        onViewChange={setView}
        onMoreFilters={() => setMoreFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <CategoryScroller selected={selectedCategories} onToggle={toggleCategory} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResultsHeader count={filtered.length} sort={sort} onSortChange={setSort} />

        {isLoading ? (
          <div className="py-20 text-center text-stone-500">Discovering treehouses…</div>
        ) : filtered.length === 0 ? (
          emptyState
        ) : view === 'map' ? (
          <div className="pb-8">
            <div className="relative h-[calc(100vh-260px)] min-h-[520px] rounded-2xl overflow-hidden border border-stone-200/80 shadow-lg">
              <MapView
                properties={properties}
                visibleProperties={filtered}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={setSelectedProperty}
              />

              {/* Bottom overlay cards */} 
              <div className="absolute inset-x-0 bottom-0 z-20">
                <div className="pointer-events-none h-16 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="pointer-events-auto bg-[#faf8f5]/90 backdrop-blur-md border-t border-stone-200/80">
                  <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseEnter={() => setHoveredProperty(p)}
                        onMouseLeave={() => setHoveredProperty(null)}
                        onClick={() => setSelectedProperty(p)}
                        className={`shrink-0 w-[260px] rounded-xl border bg-white text-left shadow-sm hover:shadow-md transition-all overflow-hidden ${
                          selectedProperty?.id === p.id
                            ? 'border-forest-600 ring-2 ring-forest-500/30'
                            : 'border-stone-200'
                        }`}
                      >
                        <div className="flex">
                          <div className="relative h-[86px] w-[110px] bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images?.[0]} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="p-3 flex-1">
                            <div className="text-xs font-semibold text-forest-700">{p.price}</div>
                            <div className="font-serif text-sm text-forest-950 line-clamp-1">{p.name}</div>
                            <div className="text-xs text-stone-600 line-clamp-1">{p.location}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-12">
            {resultsGrid}
            <div className="lg:hidden fixed bottom-6 right-4 z-30">
              <button
                type="button"
                onClick={() => setView('map')}
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
              >
                <Map className="h-4 w-4" />
                Map
              </button>
            </div>
          </div>
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
