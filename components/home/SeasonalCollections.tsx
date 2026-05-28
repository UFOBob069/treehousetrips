import Link from 'next/link'
import Image from 'next/image'
import { SEASONAL } from '@/lib/home-content'

export default function SeasonalCollections() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">Seasonal discovery</p>
        <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
          When you go matters
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {SEASONAL.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover image-hover-zoom"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-transparent" />
            <h3 className="absolute inset-x-0 bottom-0 p-4 md:p-5 font-serif text-lg md:text-xl text-white">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
