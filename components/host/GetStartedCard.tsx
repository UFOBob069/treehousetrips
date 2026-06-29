'use client'

import { HOST_PRICE } from '@/lib/host-content'

interface GetStartedCardProps {
  onCreateListing: () => void
  onSignIn: () => void
  authLoading?: boolean
}

export default function GetStartedCard({
  onCreateListing,
  onSignIn,
  authLoading = false,
}: GetStartedCardProps) {
  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-[#fffcf7] p-6 md:p-8 shadow-[0_16px_48px_rgba(26,43,26,0.08)] max-w-md mx-auto w-full">
      <div className="mb-6 text-center rounded-2xl border border-forest-200 bg-forest-50/80 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-moss">Annual listing</p>
        <p className="mt-1 font-serif text-4xl text-forest-900">{HOST_PRICE}</p>
        <p className="mt-1 text-sm text-stone-600">per treehouse · no booking fees</p>
        <p className="mt-2 text-xs text-stone-500">Use code TREEHOUSE40 for 40% off year one</p>
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
  )
}
