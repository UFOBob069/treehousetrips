'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TreePine } from 'lucide-react'
import { HOST_HERO_IMAGE, HOST_PRICE } from '@/lib/host-content'

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
        <div className="absolute inset-0 bg-hero-gradient-mobile md:bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/12 via-transparent to-transparent md:from-forest-950/30 md:via-forest-950/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 pt-28 md:pt-32">
        <div className="max-w-3xl">
          <p className="text-amber-warm/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Be where treehouse travelers are looking
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
            List Your Treehouse Where Travelers Are Searching Specifically For Treehouses
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/85 max-w-2xl leading-relaxed">
            Join a curated marketplace built exclusively for treehouse stays. No commissions. No
            complicated setup. Just{' '}
            <span className="font-semibold text-amber-warm">{HOST_PRICE}</span>.
          </p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-warm/50 bg-amber-warm/20 px-4 py-2 text-sm font-semibold text-amber-warm backdrop-blur-sm">
            <span className="text-lg leading-none">{HOST_PRICE}</span>
            <span className="text-white/80 font-normal">· per treehouse · no commission</span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              type="button"
              onClick={onListClick}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-amber-warm/80 bg-amber-warm/95 px-7 py-3.5 text-sm md:text-base font-semibold text-forest-950 shadow-lg shadow-forest-950/25 hover:bg-amber-warm transition-all active:scale-[0.98]"
            >
              <TreePine className="h-4 w-4 shrink-0" aria-hidden />
              List your treehouse — {HOST_PRICE}
            </button>
            <Link
              href="/properties"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm md:text-base font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              See example listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
