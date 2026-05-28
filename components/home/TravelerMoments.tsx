import Image from 'next/image'
import { TRAVELER_MOMENTS } from '@/lib/home-content'

export default function TravelerMoments() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">From the canopy</p>
        <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
          Traveler moments
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {TRAVELER_MOMENTS.map((moment) => (
          <figure
            key={moment.author}
            className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden"
          >
            <Image
              src={moment.image}
              alt={moment.caption}
              fill
              className="object-cover image-hover-zoom"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="text-white text-sm font-medium">{moment.caption}</p>
              <p className="text-white/60 text-xs mt-1">{moment.author}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
