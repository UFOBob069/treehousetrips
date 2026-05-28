'use client'

import Link from 'next/link'
import Image from 'next/image'
import { COLLECTIONS } from '@/lib/home-content'
import { ArrowRight } from 'lucide-react'

export default function CollectionCarousel() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight">
          Find your escape
        </h2>
        <p className="mt-2 text-stone-600 text-sm md:text-base max-w-lg">
          Browse curated collections — each one a doorway into the canopy.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 md:w-16 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 md:w-16 bg-gradient-to-l from-cream to-transparent" />

        <div className="flex gap-4 md:gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {COLLECTIONS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative shrink-0 w-[78vw] sm:w-[340px] md:w-[380px] aspect-[3/4] rounded-3xl overflow-hidden snap-start shadow-[0_20px_50px_rgba(26,43,26,0.12)]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover image-hover-zoom"
                sizes="(max-width: 640px) 78vw, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-amber-warm/90 text-xs tracking-widest uppercase mb-2">
                  {item.subtitle}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-white">{item.title}</h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:text-white transition-colors">
                  Explore
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
