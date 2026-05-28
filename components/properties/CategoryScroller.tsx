'use client'

import { BROWSE_CATEGORIES, PRIMARY_BROWSE_CATEGORY_IDS } from '@/lib/property-browse'

const PRIMARY_CATEGORIES = BROWSE_CATEGORIES.filter((c) =>
  (PRIMARY_BROWSE_CATEGORY_IDS as readonly string[]).includes(c.id)
)

interface CategoryScrollerProps {
  selected: string[]
  onToggle: (id: string) => void
}

export default function CategoryScroller({ selected, onToggle }: CategoryScrollerProps) {
  return (
    <div className="bg-[#faf8f5] md:border-b md:border-stone-200/50">
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 md:py-3">
        <div className="relative">
          {/* Edge fades — stronger on mobile */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#faf8f5] to-transparent md:w-8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#faf8f5] to-transparent md:w-8"
            aria-hidden
          />

          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 md:px-1 md:py-0 scrollbar-hide scroll-smooth">
            {PRIMARY_CATEGORIES.map((cat) => {
              const isActive = selected.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onToggle(cat.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-stone-200/70 text-stone-700 md:bg-stone-100/80'
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
