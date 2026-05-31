import Image from 'next/image'
import { TRAVELER_MOMENTS } from '@/lib/home-content'

type Moment = (typeof TRAVELER_MOMENTS)[number]

function MomentCaption({ caption, author, size = 'md' }: { caption: string; author: string; size?: 'md' | 'lg' }) {
  const titleClass =
    size === 'lg'
      ? 'font-serif text-xl lg:text-2xl text-white leading-snug tracking-tight'
      : 'font-serif text-base sm:text-lg text-white leading-snug tracking-tight'

  return (
    <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-8">
      <p className={titleClass}>{caption}</p>
      <p className="mt-1.5 text-xs sm:text-sm text-white/65">{author}</p>
    </figcaption>
  )
}

function MobileMomentCard({ moment, priority }: { moment: Moment; priority?: boolean }) {
  return (
    <figure
      className={`relative w-full overflow-hidden rounded-2xl bg-forest-950/5 shadow-[0_16px_40px_rgba(26,43,26,0.12)] ${moment.mobileLayout}`}
    >
      <Image
        src={moment.image}
        alt={moment.caption}
        fill
        priority={priority}
        className="object-cover image-hover-zoom"
        sizes="(max-width: 1024px) 50vw, 28vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
      <MomentCaption caption={moment.caption} author={moment.author} />
    </figure>
  )
}

function DesktopMomentCard({ moment, priority }: { moment: Moment; priority?: boolean }) {
  return (
    <figure
      className={`group relative h-full min-h-[280px] overflow-hidden rounded-3xl bg-forest-950/5 shadow-[0_20px_50px_rgba(26,43,26,0.14)] ${moment.placement}`}
    >
      <Image
        src={moment.image}
        alt={moment.caption}
        fill
        priority={priority}
        className="object-cover image-hover-zoom"
        sizes="(max-width: 1280px) 40vw, 28vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/15 to-transparent" />
      <MomentCaption caption={moment.caption} author={moment.author} size="lg" />
    </figure>
  )
}

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

      {/* Mobile & tablet: 2-column masonry grid (CSS columns collapse width with fill images) */}
      <div className="lg:hidden max-w-[90rem] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {TRAVELER_MOMENTS.map((moment, i) => (
            <MobileMomentCard key={moment.image} moment={moment} priority={i === 0} />
          ))}
        </div>
      </div>

      {/* Desktop: two-row bento */}
      <div
        className="hidden lg:grid max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 grid-cols-12 gap-5 lg:gap-6 min-h-[min(88vh,920px)]"
        style={{
          gridTemplateRows: 'minmax(280px, 1fr) minmax(260px, 1fr)',
        }}
      >
        {TRAVELER_MOMENTS.map((moment, i) => (
          <DesktopMomentCard key={moment.image} moment={moment} priority={i === 0} />
        ))}
      </div>
    </section>
  )
}
