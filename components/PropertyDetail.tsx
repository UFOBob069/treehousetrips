'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Bed, Bath, ExternalLink, MessageCircle, ArrowLeft, Heart, Share, Star, Shield, Wifi, Car, Coffee, Mountain, Waves } from 'lucide-react'
import TreehouseFeatures from './TreehouseFeatures'
import TreehouseStats from './TreehouseStats'
import TreehouseExperience from './TreehouseExperience'
import TreehouseHero from './TreehouseHero'
import ContactHostModal from './ContactHostModal'

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
  ownerId: string
  title: string
  contactEmail: string
  exactAddress?: string
  isPublished: boolean
}

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // Ensure selectedImage is always within bounds
  const safeSelectedImage = Math.min(selectedImage, property.images.length - 1)

  const amenities = [
    { icon: <Wifi className="w-5 h-5" />, name: 'WiFi' },
    { icon: <Car className="w-5 h-5" />, name: 'Free parking' },
    { icon: <Coffee className="w-5 h-5" />, name: 'Kitchen' },
    { icon: <Shield className="w-5 h-5" />, name: 'Security cameras' },
    { icon: <Mountain className="w-5 h-5" />, name: 'Mountain views' },
    { icon: <Waves className="w-5 h-5" />, name: 'Nature sounds' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart 
                size={20} 
                className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery - Moved to Top */}
            <div className="mb-8">
              {/* Main Image */}
              <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden mb-4">
                <Image
                  src={property.images[safeSelectedImage]}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {safeSelectedImage + 1} / {property.images.length}
                </div>
              </div>
              
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === index 
                        ? 'ring-2 ring-forest-500 ring-offset-2' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${property.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-forest-500/20 flex items-center justify-center">
                        <div className="w-4 h-4 bg-forest-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={18} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">4.9</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600 underline cursor-pointer">28 reviews</span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-6 py-6 border-y border-gray-200">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-gray-600" />
                  <span className="text-sm">{property.guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-gray-600" />
                  <span className="text-sm">{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} className="text-gray-600" />
                  <span className="text-sm">{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Treehouse Features */}
            <div className="mb-8">
              <TreehouseFeatures property={property} />
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {amenity.icon}
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Where you'll be</h2>
              <div className="h-64 rounded-xl overflow-hidden bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Interactive map will be here
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-semibold">{property.price}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600 underline cursor-pointer">28 reviews</span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Guests</span>
                      <span className="font-medium">{property.guests} max</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Link
                    href={property.airbnbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-forest-600 text-white py-3 rounded-lg font-semibold hover:bg-forest-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    Book on Airbnb
                  </Link>
                  
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Message Host
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Host Modal */}
      <ContactHostModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        property={{
          id: property.id,
          title: property.title || property.name,
          description: property.description,
          location: property.location,
          exactAddress: property.exactAddress,
          price: typeof property.price === 'string' ? parseInt(property.price.replace(/[^0-9]/g, '')) : property.price,
          contactEmail: property.contactEmail || property.hostEmail,
          airbnbUrl: property.airbnbUrl,
          images: property.images,
          tags: property.tags,
          guests: property.guests,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          lat: property.lat,
          lng: property.lng,
          isPublished: property.isPublished || true,
          ownerId: property.ownerId || 'unknown',
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        }}
        onSuccess={() => {
          setShowContactModal(false)
        }}
      />
    </div>
  )
}
