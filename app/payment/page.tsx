'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react'

interface ListingData {
  title: string
  description: string
  location: string
  price: string
  contactEmail: string
  images: string[]
}

export default function PaymentPage() {
  const router = useRouter()
  const [listingData, setListingData] = useState<ListingData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('listingData')
    if (data) {
      setListingData(JSON.parse(data))
    } else {
      router.push('/create')
    }
  }, [router])

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // In a real implementation, you would:
      // 1. Create a Stripe checkout session
      // 2. Redirect to Stripe checkout
      // 3. Handle the webhook to mark listing as published
      
      // For demo purposes, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save to localStorage as "published"
      const publishedData = {
        ...listingData,
        isPublished: true,
        publishedAt: new Date().toISOString()
      }
      localStorage.setItem('publishedListing', JSON.stringify(publishedData))
      
      // Clear the draft data
      localStorage.removeItem('listingData')
      
      // Redirect to confirmation
      router.push('/confirmation')
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
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
                Back to Preview
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
                <p className="text-gray-600 mt-1">Secure payment to publish your treehouse listing</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step 3 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {/* Stripe Elements would go here in production */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={listingData.contactEmail}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Shield size={16} />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your payment is processed securely by Stripe. We never store your card details.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Listing Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Listing</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{listingData.title}</h4>
                  <p className="text-sm text-gray-600">{listingData.location}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Contact: {listingData.contactEmail}</p>
                  <p>Photos: {listingData.images.length} uploaded</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual listing fee</span>
                  <span className="font-medium">$50.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$50.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What You Get</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">Your listing goes live immediately</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">Direct contact with travelers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">No booking fees or commissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay $50.00 to Publish
                </>
              )}
            </button>

            {/* Terms */}
            <div className="text-xs text-gray-500 text-center">
              By completing payment, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

