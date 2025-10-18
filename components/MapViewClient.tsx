'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'
import Link from 'next/link'
import { TreePine, Star, Heart, Zap } from 'lucide-react'

// Component to fit map bounds
function FitBounds({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [bounds, map])
  
  return null
}

// Fix for default markers in React Leaflet - only run on client side
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Create custom colored markers
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 3px 14px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">🏠</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })
}

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

interface MapViewClientProps {
  properties: Property[]
  visibleProperties: Property[]
  selectedProperty?: Property | null
  hoveredProperty?: Property | null
  onPropertySelect: (property: Property | null) => void
}

export default function MapViewClient({ properties, visibleProperties, selectedProperty, hoveredProperty, onPropertySelect }: MapViewClientProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [popupImages, setPopupImages] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleImageChange = (propertyId: string, direction: 'prev' | 'next') => {
    const property = properties.find(p => p.id === propertyId)
    if (!property) return

    const currentIndex = popupImages[propertyId] || 0
    let newIndex = currentIndex

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % property.images.length
    } else {
      newIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1
    }

    setPopupImages(prev => ({
      ...prev,
      [propertyId]: newIndex
    }))
  }

  // Calculate bounds and center from visible properties
  const validProperties = visibleProperties.filter(p => 
    typeof p.lat === 'number' && 
    typeof p.lng === 'number' && 
    !isNaN(p.lat) && 
    !isNaN(p.lng)
  )
  
  // Calculate bounds to fit all properties
  const calculateBounds = (properties: typeof validProperties) => {
    if (properties.length === 0) {
      return {
        center: [45.5152, -122.6784], // Default to Portland, Oregon
        bounds: null
      }
    }
    
    if (properties.length === 1) {
      return {
        center: [properties[0].lat, properties[0].lng],
        bounds: null
      }
    }
    
    const lats = properties.map(p => p.lat)
    const lngs = properties.map(p => p.lng)
    
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    // Add padding to bounds
    const latPadding = (maxLat - minLat) * 0.1
    const lngPadding = (maxLng - minLng) * 0.1
    
    return {
      center: [
        (minLat + maxLat) / 2,
        (minLng + maxLng) / 2
      ],
      bounds: [
        [minLat - latPadding, minLng - lngPadding],
        [maxLat + latPadding, maxLng + lngPadding]
      ]
    }
  }
  
  const { center, bounds } = calculateBounds(validProperties)

  if (!isMounted) {
    return (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  if (validProperties.length === 0) {
    return (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No properties to display</div>
          <div className="text-sm text-gray-400">Check back later for new listings</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full rounded-lg overflow-visible relative">
      <MapContainer
        center={center}
        zoom={bounds ? 6 : 6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        dragging={true}
        touchZoom={true}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds bounds={bounds} />
        {validProperties.map((property) => {
          const isSelected = selectedProperty?.id === property.id
          const isHovered = hoveredProperty?.id === property.id
          
          // Choose marker color based on state
          let markerColor = '#059669' // Default forest green
          if (isHovered) {
            markerColor = '#DC2626' // Red for hovered
          } else if (isSelected) {
            markerColor = '#7C3AED' // Purple for selected
          }
          
          return (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createCustomIcon(markerColor)}
              eventHandlers={{
                click: () => onPropertySelect(property),
              }}
            >
              <Popup maxWidth={280} className="custom-popup">
                <div className="p-0">
                  {/* Property Image with Scrolling */}
                  <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                    <Image
                      src={property.images[popupImages[property.id] || 0]}
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
                            handleImageChange(property.id, 'prev')
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
                        >
                          <span className="text-gray-800 text-sm font-bold">‹</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageChange(property.id, 'next')
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
                        >
                          <span className="text-gray-800 text-sm font-bold">›</span>
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {property.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                index === (popupImages[property.id] || 0) ? 'bg-white' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                      <span className="text-xs font-bold text-gray-900">{property.price}/night</span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-3">
                    {/* Property Name */}
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-1">{property.name}</h3>

                    {/* Property Stats */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                      <span>{property.guests} guest{property.guests !== 1 ? 's' : ''}</span>
                      <span className="text-gray-400">•</span>
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      <span className="text-gray-400">•</span>
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Action Button */}
                    <div>
                      <Link
                        href={`/properties/${property.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-primary-600 hover:bg-primary-700 text-white hover:text-white visited:text-white text-center py-2 px-3 rounded text-sm font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
          </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
