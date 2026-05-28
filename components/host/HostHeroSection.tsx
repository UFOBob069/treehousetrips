'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HOST_HERO_IMAGE } from '@/lib/host-content'

interface HostHeroSectionProps {
  onListClick: () => void
}

export default function HostHeroSection({ onListClick }: HostHeroSectionProps) {
  return (
    <section className="relative min-h-[92dvh] md:min-h-[88vh] flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HOST_HERO_IMAGE}
          alt="A treehouse nestled in a misty forest canopy"
          fill
          priority
          className="object-cover home-ken-burns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/50 via-forest-950/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 pt-28 md:pt-32">
        <div className="max-w-2xl">
          <p className="text-amber-warm/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-4">
            For treehouse hosts
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] tracking-tight">
            Turn Your Treehouse
            <span className="block italic text-amber-warm/95">Into a Destination</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/80 max-w-lg leading-relaxed">
            Join a curated marketplace built specifically for extraordinary treehouse
            stays — and the travelers who seek them.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onListClick}
              className="inline-flex items-center justify-center rounded-full bg-forest-700 px-7 py-3.5 text-sm md:text-base font-medium text-white hover:bg-forest-600 shadow-lg shadow-forest-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              List Your Treehouse
            </button>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm md:text-base font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              See Example Listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
