'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Share2, Eye, ArrowRight, Home } from 'lucide-react'

interface PublishedListing {
  title: string
  description: string
  location: string
  price: string
  contactEmail: string
  images: string[]
  isPublished: boolean
  publishedAt: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const [publishedListing, setPublishedListing] = useState<PublishedListing | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('publishedListing')
    if (data) {
      setPublishedListing(JSON.parse(data))
    } else {
      router.push('/create')
    }
  }, [router])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: publishedListing?.title,
          text: `Check out my treehouse listing: ${publishedListing?.title}`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin)
      alert('Link copied to clipboard!')
    }
  }

  if (!publishedListing) {
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
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
          <p className="text-green-100 text-lg">
            Your treehouse listing is now live and ready to receive bookings.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Listing Preview */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative aspect-video bg-gray-200">
              {publishedListing.images.length > 0 ? (
                <Image
                  src={publishedListing.images[0]}
                  alt={publishedListing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏠</div>
                    <div>No photos</div>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-sm font-bold text-gray-900">${publishedListing.price}/night</span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{publishedListing.title}</h2>
              <p className="text-gray-600 mb-4">{publishedListing.location}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{publishedListing.description}</p>
              <div className="text-sm text-gray-600">
                <p>Contact: {publishedListing.contactEmail}</p>
                <p>Published: {new Date(publishedListing.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            {/* What's Next */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share Your Listing</h4>
                    <p className="text-sm text-gray-600">Share your treehouse with friends and on social media to get your first bookings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Respond to Inquiries</h4>
                    <p className="text-sm text-gray-600">Travelers will contact you directly at {publishedListing.contactEmail}.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Manage Bookings</h4>
                    <p className="text-sm text-gray-600">Coordinate directly with guests for the best experience.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share Your Listing
                </button>
                
                <Link
                  href="/properties"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View All Listings
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our team is here to help you succeed. Contact us if you have any questions.
              </p>
              <div className="text-sm text-blue-600">
                <p>Email: support@treehousetrips.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Home size={16} />
                Back to Homepage
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Listing is Live!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">$50</div>
                <div className="text-sm text-gray-600">Annual Fee Paid</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">0%</div>
                <div className="text-sm text-gray-600">Booking Commission</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">∞</div>
                <div className="text-sm text-gray-600">Direct Inquiries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

