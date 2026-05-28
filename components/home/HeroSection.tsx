'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { HERO_IMAGE } from '@/lib/home-content'
import FloatingSearchBar from './FloatingSearchBar'

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Fog rolling through an ancient forest canopy"
          fill
          priority
          className="object-cover home-ken-burns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-16 pt-28 md:pt-32">
        <div className="max-w-3xl animate-fade-up">
          <p className="text-amber-warm/90 text-sm md:text-base tracking-[0.2em] uppercase font-medium mb-4">
            Curated canopy escapes
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight">
            Escape Into
            <span className="block italic text-amber-warm/95">The Canopy</span>
          </h1>
          <p className="mt-5 md:mt-6 text-base md:text-xl text-white/80 max-w-xl leading-relaxed font-light">
            Curated treehouse stays for romantic weekends, family adventures, and
            unforgettable escapes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-full bg-forest-700 px-7 py-3.5 text-sm md:text-base font-medium text-white hover:bg-forest-600 shadow-lg shadow-forest-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Stays
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm md:text-base font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              View Retreats
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-14 animate-fade-in opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
          <FloatingSearchBar />
        </div>
      </div>
    </section>
  )
}
