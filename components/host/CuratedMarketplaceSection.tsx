import Image from 'next/image'
import { SITE_IMAGES } from '@/lib/site-images'

export default function CuratedMarketplaceSection() {
  return (
    <section className="py-16 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(26,43,26,0.12)] order-2 lg:order-1">
            <Image
              src={SITE_IMAGES.hostMarketplace}
              alt="Luxury treehouse interior with warm light"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-moss text-sm tracking-widest uppercase mb-2">Curated by design</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight leading-snug">
              Not just another listing site
            </h2>
            <p className="mt-5 text-stone-600 text-base md:text-lg leading-relaxed">
              Treehouse Trips is selective, visual-first, and storytelling-focused. Quality
              and uniqueness matter — because travelers trust curated environments where
              every stay feels worth the journey.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Every property is reviewed for character and guest experience',
                'Cinematic presentation — not cramped grid thumbnails',
                'A traveler audience that values wonder over discounts',
                'Trust that grows when the marketplace feels intentional',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-stone-700 text-sm md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
