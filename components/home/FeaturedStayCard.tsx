'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin } from 'lucide-react'
import type { BrowseProperty } from '@/lib/property-browse'
import { getEmotionalDescriptor, slugify } from '@/lib/property-browse'

interface FeaturedStayCardProps {
  property: BrowseProperty
  priority?: boolean
}

export default function FeaturedStayCard({ property, priority }: FeaturedStayCardProps) {
  const descriptor = getEmotionalDescriptor(property)
  const href = `/properties/${property.slug || slugify(property.name) || property.id}`
  const image = property.images[0]

  return (
    <Link
      href={href}
      className="group block rounded-3xl overflow-hidden bg-[#fffcf7] shadow-[0_12px_40px_rgba(26,43,26,0.08)] hover:shadow-[0_20px_50px_rgba(26,43,26,0.14)] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={property.name}
          fill
          priority={priority}
          className="object-cover image-hover-zoom"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
        <button
          type="button"
          aria-label="Save"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 transition-colors"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute top-4 right-4 z-10 rounded-full bg-black/40 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
          {property.price}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="font-serif text-xl md:text-2xl text-forest-950 tracking-tight line-clamp-1">
          {property.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-stone-500">
          <MapPin className="h-3.5 w-3.5 text-moss shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <p className="mt-2 text-sm text-forest-800/90 font-medium">{descriptor}</p>
        <p className="mt-2 text-xs text-stone-500">
          {property.guests} guests · {property.bedrooms} beds
        </p>
      </div>
    </Link>
  )
}
