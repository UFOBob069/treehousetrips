'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, DollarSign, Mail, ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface ListingData {
  title: string
  description: string
  location: string
  price: string
  contactEmail: string
  images: string[]
}

export default function PreviewPage() {
  const router = useRouter()
  const [listingData, setListingData] = useState<ListingData | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const data = localStorage.getItem('listingData')
    if (data) {
      setListingData(JSON.parse(data))
    } else {
      router.push('/create')
    }
  }, [router])

  const nextImage = () => {
    if (listingData) {
      setCurrentImage((prev) => (prev + 1) % listingData.images.length)
    }
  }

  const prevImage = () => {
    if (listingData) {
      setCurrentImage((prev) => (prev === 0 ? listingData.images.length - 1 : prev - 1))
    }
  }

  const handlePublish = () => {
    router.push('/payment')
  }

  if (!listingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} />
                Back to Edit
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Preview Your Listing</h1>
                <p className="text-gray-600 mt-1">This is how your treehouse will appear to travelers</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step 2 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Image Gallery */}
              <div className="relative aspect-video bg-gray-200">
                {listingData.images.length > 0 ? (
                  <>
                    <Image
                      src={listingData.images[currentImage]}
                      alt={listingData.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {listingData.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {listingData.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentImage ? 'bg-white' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-sm font-bold text-gray-900">${listingData.price}/night</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <div>No photos uploaded</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{listingData.title}</h2>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{listingData.location}</span>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{listingData.description}</p>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>Contact: {listingData.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Info */}
          <div className="space-y-6">
            {/* Publish Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check size={16} />
                </div>
                <h3 className="text-lg font-semibold">Ready to Publish?</h3>
              </div>
              <p className="text-primary-100 mb-4">
                Publish your listing for <span className="font-bold">$50/year</span> to make it live and start receiving bookings.
              </p>
              <div className="text-sm text-primary-200">
                <div className="flex items-center gap-2 mb-1">
                  <Check size={14} />
                  <span>Listed on TreehouseTrips.com</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Check size={14} />
                  <span>Direct traveler contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} />
                  <span>No booking fees</span>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual listing fee</span>
                  <span className="font-semibold">$50.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$50.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePublish}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign size={16} />
                Pay $50 to Publish
              </button>
              
              <button
                onClick={() => router.push('/create')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Edit Listing
              </button>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500 text-center">
              By publishing, you agree to our Terms of Service and Privacy Policy.
              <br />
              You can cancel your listing anytime.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

