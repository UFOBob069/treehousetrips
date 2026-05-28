'use client'

import Link from 'next/link'
import { Search, MapPin, Users } from 'lucide-react'

export default function FloatingSearchBar() {
  return (
    <Link
      href="/properties"
      className="group flex w-full max-w-2xl mx-auto items-center gap-3 rounded-2xl md:rounded-full bg-white/12 backdrop-blur-xl border border-white/20 px-4 py-3.5 md:px-6 md:py-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] hover:bg-white/18 transition-all duration-300"
    >
      <Search className="h-5 w-5 shrink-0 text-white/70 group-hover:text-white transition-colors" />
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0 text-left">
        <span className="text-sm md:text-base text-white/90 font-medium truncate">
          Where to next?
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/60">
          <MapPin className="h-3.5 w-3.5" />
          Anywhere
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/60">
          <Users className="h-3.5 w-3.5" />
          Guests
        </span>
      </div>
      <span className="shrink-0 rounded-full bg-forest-700 px-4 py-2 text-sm font-medium text-white group-hover:bg-forest-600 transition-colors">
        Search
      </span>
    </Link>
  )
}
