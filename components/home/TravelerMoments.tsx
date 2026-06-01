import Image from 'next/image'
import { TRAVELER_MOMENTS } from '@/lib/home-content'

/** Equal tiles: 2×3 on mobile, 3×2 on md+ — six moments align without awkward spans */
const MOMENT_TILE =
  'aspect-[4/5] min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[360px]'

export default function TravelerMoments() {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <p className="text-moss text-sm tracking-widest uppercase mb-3">From the canopy</p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-forest-950 tracking-tight max-w-3xl">
          Traveler moments
        </h2>
        <p className="mt-4 md:mt-6 text-stone-600 text-base md:text-lg max-w-xl leading-relaxed">
          Real escapes, shared slowly — the kind of memories that start with a photo and end with a
          booking.
        </p>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {TRAVELER_MOMENTS.map((moment, i) => (
          <figure
            key={moment.image}
            className={`relative w-full min-w-0 overflow-hidden rounded-2xl md:rounded-3xl bg-forest-950/5 shadow-[0_16px_40px_rgba(26,43,26,0.12)] ${MOMENT_TILE}`}
          >
            <Image
              src={moment.image}
              alt={moment.caption}
              fill
              priority={i < 2}
              className="object-cover image-hover-zoom"
              sizes="(max-width: 768px) 50vw, 33vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-forest-950/5" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-8">
              <p className="font-serif text-base sm:text-lg lg:text-xl text-white leading-snug tracking-tight">
                {moment.caption}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-white/70">{moment.author}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
