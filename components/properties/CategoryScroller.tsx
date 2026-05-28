'use client'

import { BROWSE_CATEGORIES } from '@/lib/property-browse'

interface CategoryScrollerProps {
  selected: string[]
  onToggle: (id: string) => void
}

export default function CategoryScroller({ selected, onToggle }: CategoryScrollerProps) {
  return (
    <div className="border-b border-stone-200/60 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {BROWSE_CATEGORIES.map((cat) => {
            const isActive = selected.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onToggle(cat.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-forest-700 bg-forest-800 text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-forest-300 hover:bg-forest-50'
                }`}
              >
                <span className="text-base" aria-hidden>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
