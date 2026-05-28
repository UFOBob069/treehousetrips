'use client'

import Link from 'next/link'
import { MapPin, Users, Bed, Bath, Heart } from 'lucide-react'
import type { BrowseProperty } from '@/lib/property-browse'
import { getEmotionalDescriptor } from '@/lib/property-browse'
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

  const imageBlock = (
    <div className={`relative ${isGrid ? '' : 'sm:w-[42%] shrink-0'}`}>
      <PropertyImageCarousel
        images={property.images}
        alt={property.name}
        variant={viewMode}
      />
      <button
        type="button"
        aria-label="Save treehouse"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="absolute top-12 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-800 shadow-md hover:scale-105 transition-transform"
      >
        <Heart className="h-4 w-4" />
      </button>
      <span className="absolute top-3 right-3 z-10 rounded-full bg-forest-900/85 px-3 py-1 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
        {property.price}
      </span>
    </div>
  )

  const cardInner = (
    <>
      {imageBlock}

      <div className={`flex flex-col ${isGrid ? 'p-4' : 'p-5 flex-1 justify-center'}`}>
        <h3
          className={`font-serif text-forest-950 tracking-tight ${
            isGrid ? 'text-lg line-clamp-1' : 'text-xl sm:text-2xl line-clamp-2'
          }`}
        >
          {property.name}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-sm text-stone-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <p className="mt-2 text-sm font-medium text-forest-700">{descriptor}</p>

        {!isGrid && (
          <p className="mt-2 text-sm text-stone-600 line-clamp-2">{property.description}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {property.tags.slice(0, isGrid ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 border border-stone-200/80 px-2.5 py-0.5 text-xs text-stone-700"
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

        <span
          className={`mt-4 inline-flex items-center justify-center rounded-full bg-forest-800 text-white font-medium hover:bg-forest-900 transition-colors ${
            isGrid ? 'px-4 py-2 text-sm w-full' : 'px-5 py-2.5 text-sm w-fit'
          }`}
        >
          Explore stay
        </span>
      </div>
    </>
  )

  return (
    <Link
      href={`/properties/${property.id}`}
      className={`group/card block overflow-hidden rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-forest-500 ring-offset-2' : ''
      } ${isGrid ? '' : 'sm:flex'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`relative ${isGrid ? '' : 'sm:flex sm:w-full'}`}>{cardInner}</div>
    </Link>
  )
}
