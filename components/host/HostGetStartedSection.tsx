'use client'

import { HOST_PRICE } from '@/lib/host-content'
import GetStartedCard from './GetStartedCard'

interface HostGetStartedSectionProps {
  onCreateListing: () => void
  onSignIn: () => void
  authLoading: boolean
}

export default function HostGetStartedSection({
  onCreateListing,
  onSignIn,
  authLoading,
}: HostGetStartedSectionProps) {
  return (
    <section
      id="get-started"
      className="py-12 md:py-16 bg-cream border-b border-stone-200/50 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">Get started</p>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-forest-950 tracking-tight">
          Start your listing in minutes
        </h2>
        <p className="mt-3 text-stone-600 text-base md:text-lg max-w-lg mx-auto">
          Free to create · Publish for {HOST_PRICE} when you&apos;re ready · No commissions on
          bookings
        </p>

        <div className="mt-8 md:mt-10">
          <GetStartedCard
            onCreateListing={onCreateListing}
            onSignIn={onSignIn}
            authLoading={authLoading}
          />
        </div>
      </div>
    </section>
  )
}
