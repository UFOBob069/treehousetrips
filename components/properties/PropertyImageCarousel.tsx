'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'

interface PropertyImageCarouselProps {
  images: string[]
  alt: string
  variant?: 'grid' | 'list'
}

export default function PropertyImageCarousel({
  images,
  alt,
  variant = 'grid',
}: PropertyImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const hasMultiple = images.length > 1
  const safeImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800']

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = prev + dir
      if (next < 0) return safeImages.length - 1
      if (next >= safeImages.length) return 0
      return next
    })
  }

  const aspect = variant === 'grid' ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-auto sm:min-h-[220px] sm:h-full'

  return (
    <div className={`relative ${aspect} overflow-hidden bg-forest-900/10 group/carousel`}>
      <Image
        src={safeImages[index]}
        alt={`${alt} — photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        sizes={variant === 'grid' ? '(max-width:768px) 100vw, 33vw' : '(max-width:768px) 100vw, 40vw'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {index === 0 && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest-800 shadow-sm">
          <ImageIcon className="h-3 w-3" />
          Cover photo
        </span>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(-1)
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-80 hover:opacity-100 hover:bg-white transition-opacity sm:opacity-0 sm:group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(1)
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-80 hover:opacity-100 hover:bg-white transition-opacity sm:opacity-0 sm:group-hover/carousel:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
            <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {index + 1} / {safeImages.length}
            </span>
            <div className="flex gap-1">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? 'w-5 bg-white'
                      : i === 0
                        ? 'w-2 bg-white/90 ring-1 ring-white/50'
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
