'use client'

import { useAuth } from '@/contexts/AuthContext'
import ListingMethodChooser, { ListingMode } from '@/components/ListingMethodChooser'

interface SignupCTASectionProps {
  onCreateListing: () => void
  onSignIn: () => void
  onSelectMode: (mode: ListingMode) => void
  authLoading: boolean
}

export default function SignupCTASection({
  onCreateListing,
  onSignIn,
  onSelectMode,
  authLoading,
}: SignupCTASectionProps) {
  const { user } = useAuth()

  return (
    <section
      id="get-started"
      className="py-20 md:py-28 bg-forest-950 relative overflow-hidden scroll-mt-20"
    >
      <div
        className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-moss/40 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {authLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : user ? (
          <div className="rounded-3xl bg-cream/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <p className="text-moss text-sm tracking-widest uppercase mb-2">Welcome back</p>
              <h2 className="font-serif text-2xl md:text-3xl text-forest-950">
                Ready to share your treehouse?
              </h2>
              <p className="mt-2 text-stone-600 text-sm md:text-base">
                Choose how you&apos;d like to build your listing.
              </p>
            </div>
            <ListingMethodChooser
              variant="prominent"
              onSelect={onSelectMode}
              title="Start from scratch or import from Airbnb?"
              subtitle="You can edit everything before publishing."
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-amber-warm/80 text-sm tracking-widest uppercase mb-3">
              Take the first step
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white tracking-tight">
              Ready to share your treehouse?
            </h2>
            <p className="mt-4 text-white/65 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Create your listing in minutes. Join a curated platform built for stays
              worth traveling for.
            </p>

            <div className="mt-10 rounded-3xl bg-cream/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl max-w-md mx-auto text-left">
              <button
                type="button"
                onClick={onCreateListing}
                className="w-full rounded-full bg-forest-800 py-3.5 text-base font-medium text-white hover:bg-forest-700 transition-colors shadow-md"
              >
                Create Listing
              </button>
              <p className="mt-5 text-center text-sm text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSignIn}
                  className="font-medium text-forest-800 hover:text-forest-950 underline-offset-2 hover:underline"
                >
                  Sign in
                </button>
              </p>
              <p className="mt-4 text-center text-xs text-stone-400 leading-relaxed">
                Free to apply · Premium presentation · Direct traveler connections
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
