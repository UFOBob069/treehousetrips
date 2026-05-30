'use client'

import { X } from 'lucide-react'

interface MoreFiltersPanelProps {
  isOpen: boolean
  onClose: () => void
  secondaryTags: string[]
  allSecondaryTags: string[]
  selectedSecondary: string[]
  onToggleSecondary: (tag: string) => void
  onClearAll: () => void
}

export default function MoreFiltersPanel({
  isOpen,
  onClose,
  secondaryTags,
  allSecondaryTags,
  selectedSecondary,
  onToggleSecondary,
  onClearAll,
}: MoreFiltersPanelProps) {
  if (!isOpen) return null

  const tags = allSecondaryTags.length > 0 ? allSecondaryTags : secondaryTags

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#faf8f5] shadow-2xl h-full overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-right">
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200/60 bg-[#faf8f5] px-5 py-4">
          <h3 className="font-serif text-lg text-forest-950">Filters</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-stone-200/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-stone-800 mb-3">Amenities & tags</p>
            {tags.length === 0 ? (
              <p className="text-sm text-stone-500">No extra filters for current listings.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = selectedSecondary.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onToggleSecondary(tag)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? 'bg-forest-800 text-white'
                          : 'bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClearAll()
              onClose()
            }}
            className="w-full rounded-2xl bg-stone-200/70 py-3.5 text-sm font-medium text-stone-700 active:bg-stone-300/70 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  )
}
