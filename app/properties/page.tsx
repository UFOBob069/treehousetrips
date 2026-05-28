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
          <>
            <div className="lg:hidden relative">
              <div className="h-[calc(100vh-220px)] min-h-[400px] rounded-2xl overflow-hidden border border-stone-200/80 shadow-lg mb-6">
                <MapView
                  properties={properties}
                  visibleProperties={filtered}
                  selectedProperty={selectedProperty}
                  hoveredProperty={hoveredProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
              <div className="space-y-4 pb-8">{resultsGrid}</div>
            </div>

            <div className="hidden lg:flex gap-6 pb-12">
              <div className="w-[58%] max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-5 scrollbar-thin">
                {resultsGrid}
              </div>
              <div className="w-[42%] sticky top-[148px] h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-stone-200/80 shadow-lg">
                <MapView
                  properties={properties}
                  visibleProperties={filtered}
                  selectedProperty={selectedProperty}
                  hoveredProperty={hoveredProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
            </div>
          </>
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
