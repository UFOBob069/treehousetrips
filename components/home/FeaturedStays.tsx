import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BrowseProperty } from '@/lib/property-browse'
import FeaturedStayCard from './FeaturedStayCard'

interface FeaturedStaysProps {
  properties: BrowseProperty[]
}

export default function FeaturedStays({ properties }: FeaturedStaysProps) {
  return (
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-moss text-sm tracking-widest uppercase mb-2">Hand-picked</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight">
              Featured stays
            </h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:text-forest-950 transition-colors"
          >
            View all retreats
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((p, i) => (
            <FeaturedStayCard key={p.id} property={p} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
