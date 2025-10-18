'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

interface MobileFilterDropdownProps {
  allTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  guestFilter: number | null
  onGuestFilterChange: (guests: number | null) => void
  filteredCount: number
}

export default function MobileFilterDropdown({
  allTags,
  selectedTags,
  onTagToggle,
  guestFilter,
  onGuestFilterChange,
  filteredCount
}: MobileFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const clearAllFilters = () => {
    selectedTags.forEach(tag => onTagToggle(tag))
    onGuestFilterChange(null)
  }

  const hasActiveFilters = selectedTags.length > 0 || guestFilter !== null

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          {filteredCount} treehouse{filteredCount !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasActiveFilters
              ? 'bg-forest-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-forest-600 rounded-full px-2 py-0.5 text-xs font-bold">
              {selectedTags.length + (guestFilter ? 1 : 0)}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-forest-600 hover:text-forest-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Guest Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Guests</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onGuestFilterChange(null)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
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
                  onClick={() => onGuestFilterChange(guests)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
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

          {/* Features Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-forest-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-forest-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-forest-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
