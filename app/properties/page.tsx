'use client'

import { useState, useEffect } from 'react'
import PropertyCard from '@/components/PropertyCard'
import TagFilter from '@/components/TagFilter'
import ToggleSwitch from '@/components/ToggleSwitch'
import DisplayToggle from '@/components/DisplayToggle'
import MapView from '@/components/MapView'

interface Property {
  id: string
  name: string
  description: string
  location: string
  lat: number
  lng: number
  airbnbUrl: string
  hostEmail: string
  images: string[]
  tags: string[]
  price: string
  guests: number
  bedrooms: number
  bathrooms: number
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [guestFilter, setGuestFilter] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [displayMode, setDisplayMode] = useState<'map' | 'table'>('map')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load properties from JSON file
    const loadProperties = async () => {
      try {
        const response = await fetch('/data/properties.json')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()

        // Validate data structure
        if (Array.isArray(data)) {
          setProperties(data)
          setFilteredProperties(data)

          // Extract all unique tags
          const tags = Array.from(new Set(data.flatMap((p: Property) => p.tags || [])))
          setAllTags(tags)
        } else {
          console.error('Invalid data format:', data)
          setProperties([])
          setFilteredProperties([])
        }
      } catch (error) {
        console.error('Error loading properties:', error)
        setProperties([])
        setFilteredProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [])

  useEffect(() => {
    let filtered = properties

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(property =>
        selectedTags.some(tag => property.tags.includes(tag))
      )
    }

    // Filter by guest count
    if (guestFilter !== null) {
      filtered = filtered.filter(property => property.guests >= guestFilter)
    }

    setFilteredProperties(filtered)
  }, [properties, selectedTags, guestFilter])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          {/* Mobile: Simple View Toggle */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {filteredProperties.length} treehouse{filteredProperties.length !== 1 ? 's' : ''}
              </span>
              <DisplayToggle displayMode={displayMode} onDisplayModeChange={setDisplayMode} />
            </div>
            
            {/* Mobile Filters - Compact */}
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-1">Guests:</h4>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setGuestFilter(null)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      guestFilter === null
                        ? 'bg-forest-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Any
                  </button>
                  {[2, 4, 6, 8].map((guests) => (
                    <button
                      key={guests}
                      onClick={() => setGuestFilter(guests)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        guestFilter === guests
                          ? 'bg-forest-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {guests}+
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-1">Features:</h4>
                <TagFilter 
                  tags={allTags.slice(0, 6)} 
                  selectedTags={selectedTags} 
                  onTagToggle={handleTagToggle} 
                />
              </div>
            </div>
          </div>

          {/* Desktop: Full Filters */}
          <div className="hidden lg:flex lg:items-center lg:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by features:</h4>
                <TagFilter 
                  tags={allTags} 
                  selectedTags={selectedTags} 
                  onTagToggle={handleTagToggle} 
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Guests:</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGuestFilter(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      guestFilter === null
                        ? 'bg-forest-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Any
                  </button>
                  {[1, 2, 4, 6, 8].map((guests) => (
                    <button
                      key={guests}
                      onClick={() => setGuestFilter(guests)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        guestFilter === guests
                          ? 'bg-forest-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {guests}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'} found
              </span>
              <DisplayToggle displayMode={displayMode} onDisplayModeChange={setDisplayMode} />
              {displayMode === 'table' && (
                <ToggleSwitch viewMode={viewMode} onViewModeChange={setViewMode} />
              )}
            </div>
          </div>
        </div>
      </div>

      {displayMode === 'map' ? (
        /* Airbnb-style Layout */
        <div className="relative">
          {/* Mobile: Full Screen Map OR List */}
          <div className="lg:hidden">
            <div className="h-[calc(100vh-200px)]">
              <MapView
                properties={properties}
                visibleProperties={filteredProperties}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          </div>

          {/* Desktop: Split View */}
          <div className="hidden lg:flex">
            {/* Left Side - Scrollable Property Grid */}
            <div className="w-[65%] bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {filteredProperties.length} treehouse{filteredProperties.length !== 1 ? 's' : ''} found
                  </h3>
                  <ToggleSwitch viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">Loading properties...</div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No properties found matching your criteria.</div>
                  <button
                    onClick={() => {
                      setSelectedTags([])
                      setGuestFilter(null)
                    }}
                    className="mt-4 text-forest-600 hover:text-forest-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                    : 'space-y-4'
                }`}>
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      className={`transition-all duration-200 ${
                        hoveredProperty?.id === property.id 
                          ? 'ring-2 ring-forest-500 ring-offset-2 rounded-lg' 
                          : ''
                      }`}
                      onMouseEnter={() => setHoveredProperty(property)}
                      onMouseLeave={() => setHoveredProperty(null)}
                    >
                      <PropertyCard property={property} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Right Side - Fixed Map */}
            <div className="fixed right-0 top-[120px] w-[35%] h-[calc(100vh-120px)] bg-gray-100 z-10 overflow-visible">
              <MapView
                properties={properties}
                visibleProperties={filteredProperties}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="p-4">
          {/* Mobile: No grid toggle, always show list */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading properties...</div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">No properties found matching your criteria.</div>
                <button
                  onClick={() => {
                    setSelectedTags([])
                    setGuestFilter(null)
                  }}
                  className="mt-4 text-forest-600 hover:text-forest-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} viewMode="list" />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Grid/List toggle */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {filteredProperties.length} treehouse{filteredProperties.length !== 1 ? 's' : ''} found
              </h3>
              <ToggleSwitch viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Loading properties...</div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No properties found matching your criteria.</div>
                <button
                  onClick={() => {
                    setSelectedTags([])
                    setGuestFilter(null)
                  }}
                  className="mt-4 text-forest-600 hover:text-forest-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}