'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PropertyImageCarouselProps {
  images: string[]
  alt: string
  variant?: 'grid' | 'list'
  priority?: boolean
}

export default function PropertyImageCarousel({
  images,
  alt,
  variant = 'grid',
  priority = false,
}: PropertyImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const hasMultiple = images.length > 1
  const safeImages = images.length > 0 ? images : ['/collection-rainforest-hideaways-900.png']

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = prev + dir
      if (next < 0) return safeImages.length - 1
      if (next >= safeImages.length) return 0
      return next
    })
  }

  const aspect =
    variant === 'grid'
      ? 'aspect-[4/5] md:aspect-[4/3]'
      : 'aspect-[4/5] sm:aspect-auto sm:min-h-[220px] sm:h-full'

  return (
    <div
      className={`relative ${aspect} overflow-hidden bg-forest-900/10 group/carousel`}
      onTouchStart={(e) => {
        if (!hasMultiple) return
        ;(e.currentTarget as HTMLElement & { _touchX?: number })._touchX =
          e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (!hasMultiple) return
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
          variant === 'grid'
            ? '(max-width: 768px) 100vw, 33vw'
            : '(max-width: 768px) 100vw, 40vw'
        }
        priority={priority && index === 0}
        loading={priority && index === 0 ? undefined : 'lazy'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15 pointer-events-none" />

      {hasMultiple && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 pointer-events-none md:hidden">
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
            className="absolute left-2 top-1/2 z-10 hidden md:flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
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
            className="absolute right-2 top-1/2 z-10 hidden md:flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            ›
          </button>
          <span className="absolute bottom-3 left-3 z-10 hidden md:inline rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {index + 1} / {safeImages.length}
          </span>
        </>
      )}
    </div>
  )
}
