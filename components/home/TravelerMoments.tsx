import Image from 'next/image'
import { TRAVELER_MOMENTS } from '@/lib/home-content'

function MomentCard({
  image,
  caption,
  author,
  placement,
  mobileAspect,
  priority,
}: (typeof TRAVELER_MOMENTS)[number] & { priority?: boolean }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-forest-950/5 shadow-[0_20px_50px_rgba(26,43,26,0.14)] ${mobileAspect} min-h-[280px] sm:min-h-[320px] md:min-h-0 md:h-full md:aspect-auto ${placement}`}
    >
      <Image
        src={image}
        alt={caption}
        fill
        priority={priority}
        className="object-cover image-hover-zoom"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 40vw, 28vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/15 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6 lg:p-8">
        <p className="font-serif text-lg md:text-xl lg:text-2xl text-white leading-snug tracking-tight">
          {caption}
        </p>
        <p className="mt-2 text-sm md:text-base text-white/65">{author}</p>
      </figcaption>
    </figure>
  )
}

export default function TravelerMoments() {
  return (
    <section className="py-20 md:py-32 bg-cream overflow-hidden">
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

      {/* Mobile: 2-column Pinterest-style masonry */}
      <div className="md:hidden px-4 sm:px-6 columns-2 gap-x-5 [column-fill:balance]">
        {TRAVELER_MOMENTS.map((moment, i) => (
          <div key={moment.image} className="break-inside-avoid mb-5 sm:mb-6">
            <MomentCard {...moment} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Desktop: two-row bento grid — tall anchor + varied tiles */}
      <div
        className="hidden md:grid max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 grid-cols-12 gap-5 lg:gap-6 min-h-[min(88vh,920px)]"
        style={{
          gridTemplateRows: 'minmax(280px, 1fr) minmax(260px, 1fr)',
        }}
      >
        {TRAVELER_MOMENTS.map((moment, i) => (
          <MomentCard key={moment.image} {...moment} priority={i === 0} />
        ))}
      </div>
    </section>
  )
}
