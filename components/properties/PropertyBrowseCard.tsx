'use client'

import Link from 'next/link'
import { MapPin, Users, Bed, Bath, Heart } from 'lucide-react'
import type { BrowseProperty } from '@/lib/property-browse'
import { getEmotionalDescriptor, slugify } from '@/lib/property-browse'
import PropertyImageCarousel from './PropertyImageCarousel'

interface PropertyBrowseCardProps {
  property: BrowseProperty
  viewMode: 'grid' | 'list'
  isHighlighted?: boolean
  onHover?: () => void
  onLeave?: () => void
}

export default function PropertyBrowseCard({
  property,
  viewMode,
  isHighlighted,
  onHover,
  onLeave,
}: PropertyBrowseCardProps) {
  const descriptor = getEmotionalDescriptor(property)
  const isGrid = viewMode === 'grid'
  const href = `/properties/${property.slug || slugify(property.name) || property.id}`

  const carouselVariant = isGrid ? 'grid' : 'list'

  const imageBlock = (
    <div
      className={`relative max-md:w-full ${
        isGrid ? '' : 'sm:w-[42%] shrink-0'
      }`}
    >
      <div className="max-md:hidden">
        <PropertyImageCarousel images={property.images} alt={property.name} variant={carouselVariant} />
      </div>
      <div className="md:hidden">
        <PropertyImageCarousel images={property.images} alt={property.name} variant="mobile" />
      </div>

      <button
        type="button"
        aria-label="Save treehouse"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm active:scale-95 transition-transform md:bg-white/90 md:text-forest-800 md:shadow-md"
      >
        <Heart className="h-4 w-4" />
      </button>
      <span className="absolute top-3 right-3 z-10 rounded-full bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md md:bg-forest-900/85">
        {property.price}
      </span>
    </div>
  )

  return (
    <Link
      href={href}
      className={`group/card block overflow-hidden transition-all duration-300 active:scale-[0.99] max-md:rounded-3xl max-md:bg-[#fffcf7] max-md:shadow-[0_8px_30px_rgba(28,46,32,0.08)] max-md:border-0 md:rounded-2xl md:bg-white md:border md:border-stone-200/60 md:shadow-sm md:hover:shadow-xl md:hover:-translate-y-0.5 ${
        isHighlighted ? 'md:ring-2 md:ring-forest-500 md:ring-offset-2' : ''
      } ${isGrid ? '' : 'sm:flex'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`max-md:block ${isGrid ? '' : 'sm:flex sm:w-full'}`}>
        {imageBlock}

        <div
          className={`flex flex-col max-md:px-4 max-md:pb-4 max-md:pt-3 ${
            isGrid ? 'md:p-4' : 'md:p-5 md:flex-1 md:justify-center'
          }`}
        >
          <h3
            className={`font-serif text-forest-950 tracking-tight max-md:text-xl max-md:leading-snug ${
              isGrid ? 'md:text-lg md:line-clamp-1' : 'md:text-xl md:sm:text-2xl md:line-clamp-2'
            }`}
          >
            {property.name}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-sm text-stone-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600/80" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <p className="mt-2 text-sm text-forest-800/90 font-medium leading-snug">{descriptor}</p>

          {!isGrid && (
            <p className="mt-2 text-sm text-stone-600 line-clamp-2 max-md:hidden md:block">
              {property.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {property.tags.slice(0, isGrid ? 2 : 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100/90 px-2.5 py-0.5 text-xs text-stone-600 max-md:bg-stone-200/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {property.guests} guests
            </span>
            <span className="inline-flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {property.bedrooms} beds
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms} baths
            </span>
          </div>

          {/* Desktop-only CTA — mobile: tap card */}
          <span className="mt-4 hidden md:inline-flex items-center justify-center rounded-full bg-forest-800 text-white font-medium hover:bg-forest-900 transition-colors px-5 py-2.5 text-sm w-fit">
            Explore stay
          </span>
        </div>
      </div>
    </Link>
  )
}
