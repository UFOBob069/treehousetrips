'use client'

import { useAuth } from '@/contexts/AuthContext'
import ListingMethodChooser, { ListingMode } from '@/components/ListingMethodChooser'
import { HOST_PRICE } from '@/lib/host-content'

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
                Publish for <span className="font-semibold text-forest-900">{HOST_PRICE}</span> per
                property — choose how you&apos;d like to build your listing.
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
              {HOST_PRICE} · No commissions
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white tracking-tight">
              Be where treehouse travelers are looking
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Join a curated marketplace built exclusively for treehouse stays. No complicated setup.
              Just <span className="font-semibold text-amber-warm">{HOST_PRICE}</span>.
            </p>

            <div className="mt-10 rounded-3xl bg-cream/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl max-w-md mx-auto text-left">
              <div className="mb-6 text-center rounded-2xl border border-forest-200 bg-forest-50/80 px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-moss">Annual listing</p>
                <p className="mt-1 font-serif text-4xl text-forest-900">{HOST_PRICE}</p>
                <p className="mt-1 text-sm text-stone-600">per treehouse · no booking fees</p>
              </div>

              <button
                type="button"
                onClick={onCreateListing}
                className="w-full rounded-full border-2 border-amber-warm/80 bg-amber-warm/95 py-3.5 text-base font-semibold text-forest-950 hover:bg-amber-warm transition-colors shadow-md"
              >
                Create listing — {HOST_PRICE}
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
              <p className="mt-4 text-center text-xs text-stone-500 leading-relaxed">
                Keep your Airbnb listing · Direct traveler inquiries · Cancel before renewal
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
