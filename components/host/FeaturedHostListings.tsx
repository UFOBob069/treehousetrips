'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EXAMPLE_LISTINGS, HOST_STORIES } from '@/lib/host-content'

export default function FeaturedHostListings() {
  return (
    <section className="py-16 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">See the standard</p>
        <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
          Listings travelers actually dream about
        </h2>
        <Link
          href="/properties"
          className="inline-block mt-3 text-sm font-medium text-forest-800 hover:text-forest-950 transition-colors"
        >
          Browse live examples →
        </Link>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-cream to-transparent md:w-12" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent md:w-12" />

        <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {EXAMPLE_LISTINGS.map((listing) => (
            <div
              key={listing.name}
              className="relative shrink-0 w-[72vw] sm:w-[280px] aspect-[3/4] rounded-3xl overflow-hidden snap-start shadow-[0_16px_40px_rgba(26,43,26,0.1)]"
            >
              <Image
                src={listing.image}
                alt={listing.name}
                fill
                className="object-cover"
                sizes="280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-amber-warm/90 text-xs uppercase tracking-wider mb-1">
                  {listing.location}
                </p>
                <h3 className="font-serif text-xl text-white">{listing.name}</h3>
                <p className="mt-1 text-sm text-white/70">{listing.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <p className="text-moss text-sm tracking-widest uppercase mb-6 text-center">
          Host stories
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {HOST_STORIES.map((story) => (
            <blockquote
              key={story.name}
              className="rounded-3xl bg-[#fffcf7] p-6 md:p-8 shadow-[0_8px_30px_rgba(26,43,26,0.06)]"
            >
              <p className="font-serif text-lg md:text-xl text-forest-950 leading-snug italic">
                &ldquo;{story.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-stone-500">
                <span className="font-medium text-stone-700">{story.name}</span>
                <span className="mx-2">·</span>
                {story.detail}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
