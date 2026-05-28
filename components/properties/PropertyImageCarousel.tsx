'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PropertyImageCarouselProps {
  images: string[]
  alt: string
  variant?: 'grid' | 'list' | 'mobile'
}

export default function PropertyImageCarousel({
  images,
  alt,
  variant = 'grid',
}: PropertyImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const hasMultiple = images.length > 1
  const safeImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800']
  const isMobile = variant === 'mobile'
  const swipeOnly = isMobile

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = prev + dir
      if (next < 0) return safeImages.length - 1
      if (next >= safeImages.length) return 0
      return next
    })
  }

  const aspect = isMobile
    ? 'aspect-[4/5]'
    : variant === 'grid'
      ? 'aspect-[4/3]'
      : 'aspect-[4/3] sm:aspect-auto sm:min-h-[220px] sm:h-full'

  return (
    <div
      className={`relative ${aspect} overflow-hidden bg-forest-900/10 group/carousel`}
      onTouchStart={(e) => {
        if (!swipeOnly || !hasMultiple) return
        ;(e.currentTarget as HTMLElement & { _touchX?: number })._touchX =
          e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (!swipeOnly || !hasMultiple) return
        const el = e.currentTarget as HTMLElement & { _touchX?: number }
        const start = el._touchX
        if (start == null) return
        const diff = e.changedTouches[0].clientX - start
        if (Math.abs(diff) > 40) go(diff > 0 ? -1 : 1)
        el._touchX = undefined
      }}
    >
      <Image
        src={safeImages[index]}
        alt={`${alt} — photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 md:group-hover/card:scale-[1.02]"
        sizes={
          isMobile
            ? '100vw'
            : variant === 'grid'
              ? '(max-width:768px) 100vw, 33vw'
              : '(max-width:768px) 100vw, 40vw'
        }
        priority={index === 0}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15 pointer-events-none" />

      {hasMultiple && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 pointer-events-none">
          {safeImages.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all ${
                i === index ? 'h-1.5 w-5 bg-white' : 'h-1.5 w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Desktop arrows + counter */}
      {hasMultiple && !swipeOnly && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(-1)
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(1)
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            ›
          </button>
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {index + 1} / {safeImages.length}
          </span>
        </>
      )}
    </div>
  )
}
