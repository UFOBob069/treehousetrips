import Image from 'next/image'
import { HOST_BENEFITS } from '@/lib/host-content'

export default function BenefitCards() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-14">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">What you gain</p>
        <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
          More than a listing — a stage for your stay
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {HOST_BENEFITS.map((benefit) => (
          <article
            key={benefit.id}
            className="group relative overflow-hidden rounded-3xl bg-[#fffcf7] shadow-[0_12px_40px_rgba(26,43,26,0.06)]"
          >
            <div className="relative h-48 md:h-52 overflow-hidden">
              <Image
                src={benefit.image}
                alt=""
                fill
                className="object-cover image-hover-zoom"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />
            </div>
            <div className="p-6 md:p-7">
              <h3 className="font-serif text-xl md:text-2xl text-forest-950">{benefit.title}</h3>
              <p className="mt-2 text-sm md:text-base text-stone-600 leading-relaxed">
                {benefit.copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
