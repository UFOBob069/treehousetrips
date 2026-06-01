'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { scrollPageToTop } from '@/lib/scroll-page'
import HostOnboardingForm from '@/components/HostOnboardingForm'
import HostLandingPage from '@/components/host/HostLandingPage'
import ListingMethodChooser, { ListingMode } from '@/components/ListingMethodChooser'
import PaymentModal from '@/components/PaymentModal'

function CreateListingContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [listingMode, setListingMode] = useState<ListingMode | null>(null)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [submittedPropertyTitle, setSubmittedPropertyTitle] = useState('')
  const [submittedPropertyId, setSubmittedPropertyId] = useState('')

  useEffect(() => {
    scrollPageToTop()
  }, [])

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (user && (mode === 'scratch' || mode === 'import')) {
      setListingMode(mode)
      scrollPageToTop()
    }
  }, [searchParams, user])

  const handleSelectMode = (mode: ListingMode) => {
    setListingMode(mode)
    router.push(`/create?mode=${mode}`)
    scrollPageToTop()
  }

  const handleBackToChooser = () => {
    setListingMode(null)
    router.push('/create')
    scrollPageToTop()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
      </div>
    )
  }

  // Guests see full host marketing + signup at bottom — not a sign-in wall
  if (!user) {
    return <HostLandingPage />
  }

  if (onboardingComplete) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 bg-[#fffcf7] rounded-3xl shadow-[0_20px_50px_rgba(26,43,26,0.1)]">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-forest-950 mb-3">Listing submitted</h1>
          <p className="text-stone-600 mb-6 text-sm">
            Your treehouse is on its way. Head to your dashboard to manage it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setOnboardingComplete(false)
                setListingMode(null)
                router.push('/create')
                scrollPageToTop()
              }}
              className="rounded-full bg-stone-200/80 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-300/80 transition-colors"
            >
              Create another listing
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-full bg-forest-800 px-6 py-3 text-sm font-medium text-white hover:bg-forest-700 transition-colors"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!listingMode) {
    return (
      <div className="min-h-screen bg-cream py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-moss text-sm tracking-widest uppercase mb-2">Host onboarding</p>
            <h1 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
              How would you like to build your listing?
            </h1>
          </div>
          <ListingMethodChooser
            variant="prominent"
            onSelect={handleSelectMode}
            title="Start from scratch or import from Airbnb?"
            subtitle="Pick one path below. You can edit everything before publishing."
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <HostOnboardingForm
        mode={listingMode}
        onBack={handleBackToChooser}
        onSuccess={(propertyTitle, propertyId) => {
          setSubmittedPropertyTitle(propertyTitle)
          setSubmittedPropertyId(propertyId)
          setOnboardingComplete(true)
          setShowPaymentModal(true)
        }}
      />

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

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
        </div>
      }
    >
      <CreateListingContent />
    </Suspense>
  )
}
