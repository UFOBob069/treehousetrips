'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import HostOnboardingForm from '@/components/HostOnboardingForm'
import AuthModal from '@/components/AuthModal'
import PaymentModal from '@/components/PaymentModal'

export default function CreateListingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [submittedPropertyTitle, setSubmittedPropertyTitle] = useState('')
  const [submittedPropertyId, setSubmittedPropertyId] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to create a listing.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode="login"
          />
        </div>
      </div>
    )
  }

  if (onboardingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Created Successfully!</h1>
          <p className="text-gray-600 mb-6">Your treehouse listing has been submitted. Redirecting to your dashboard...</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setOnboardingComplete(false)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Create Another Listing
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <HostOnboardingForm onSuccess={(propertyTitle, propertyId) => {
        setSubmittedPropertyTitle(propertyTitle)
        setSubmittedPropertyId(propertyId)
        setOnboardingComplete(true)
        // Show payment modal immediately
        setShowPaymentModal(true)
      }} />
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false)
          router.push('/dashboard')
        }}
        propertyTitle={submittedPropertyTitle}
        propertyId={submittedPropertyId}
      />
    </>
  )
}

