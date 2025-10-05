import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Bed, Bath } from 'lucide-react'
import TreehouseBadge from './TreehouseBadge'

interface Property {
  id: string
  name: string
  description: string
  location: string
  lat: number
  lng: number
  airbnbUrl: string
  hostEmail: string
  images: string[]
  tags: string[]
  price: string
  guests: number
  bedrooms: number
  bathrooms: number
}

interface PropertyCardProps {
  property: Property
  viewMode: 'grid' | 'list'
}

export default function PropertyCard({ property, viewMode }: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const isGrid = viewMode === 'grid'
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length)
  }
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }
  
  if (isGrid) {
    // Compact grid view
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
        <div className="relative aspect-video group">
          <Image
            src={property.images[currentImage]}
            alt={property.name}
            fill
            className="object-cover"
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-gray-800 text-xs">‹</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-gray-800 text-xs">›</span>
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute top-2 right-2">
            <span className="bg-forest-600 text-white px-2 py-1 rounded text-xs font-medium">
              {property.price}
            </span>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
            {property.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={12} className="mr-1" />
            <span className="text-xs">{property.location}</span>
          </div>

          <p className="text-gray-600 mb-2 line-clamp-2 text-xs">
            {property.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center">
              <Users size={12} className="mr-1" />
              {property.guests}
            </div>
            <div className="flex items-center">
              <Bed size={12} className="mr-1" />
              {property.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath size={12} className="mr-1" />
              {property.bathrooms}
            </div>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="w-full bg-primary-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            View Details
          </Link>
        </div>
      </div>
    )
  }
  
  // List view (existing)
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex">
      <div className="relative w-1/3 min-h-[200px] group">
        <Image
          src={property.images[currentImage]}
          alt={property.name}
          fill
          className="object-cover"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-gray-800 text-xs">‹</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-gray-800 text-xs">›</span>
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-3 right-3">
          <span className="bg-forest-600 text-white px-2 py-1 rounded text-sm font-medium">
            {property.price}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {property.name}
          </h3>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
          {property.description}
        </p>

        {/* Treehouse-specific indicators */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          <TreehouseBadge type="treehouse" size="sm" />
          <TreehouseBadge type="unique" size="sm" />
          <TreehouseBadge type="romantic" size="sm" />
          <TreehouseBadge type="eco" size="sm" />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {property.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-forest-100 text-forest-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            {property.guests} guests
          </div>
          <div className="flex items-center">
            <Bed size={14} className="mr-1" />
            {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Bath size={14} className="mr-1" />
            {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
          </div>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="w-full bg-primary-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
