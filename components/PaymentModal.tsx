'use client'

import { useState } from 'react'
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  propertyTitle: string
  propertyId: string
}

export default function PaymentModal({ isOpen, onClose, onSuccess, propertyTitle, propertyId }: PaymentModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    if (!user) {
      setError('You must be logged in to make a payment')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          propertyTitle: propertyTitle,
          propertyId: propertyId,
        }),
      })

      const { sessionId, error: sessionError } = await response.json()

      if (sessionError) {
        throw new Error(sessionError)
      }

      // Redirect to Stripe Checkout
      const stripe = (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )

      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Complete Your Subscription</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your subscription is now active. Your listing will be published shortly.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  To publish your listing <strong>"{propertyTitle}"</strong>, you need an active subscription.
                </p>
                
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-900 mb-2">Annual Listing Fee - $50</h3>
                  <ul className="text-sm text-primary-800 space-y-1">
                    <li>• Active listing for 12 months</li>
                    <li>• Premium placement in search results</li>
                    <li>• Direct guest contact information</li>
                    <li>• Priority customer support</li>
                    <li>• Analytics and insights</li>
                  </ul>
                  <p className="text-xs text-primary-700 mt-2">
                    Each listing requires its own annual fee
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Processing...' : 'Pay $50'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
