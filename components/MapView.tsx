'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

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

interface MapViewProps {
  properties: Property[]
  visibleProperties: Property[]
  selectedProperty?: Property | null
  hoveredProperty?: Property | null
  onPropertySelect: (property: Property | null) => void
}

// Dynamically import the client-side map component with proper error handling
const MapViewClient = dynamic(
  () => import('./MapViewClient').then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
)

export default function MapView({ properties, visibleProperties, selectedProperty, hoveredProperty, onPropertySelect }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <MapViewClient 
      properties={properties}
      visibleProperties={visibleProperties}
      selectedProperty={selectedProperty}
      hoveredProperty={hoveredProperty}
      onPropertySelect={onPropertySelect}
    />
  )
}
