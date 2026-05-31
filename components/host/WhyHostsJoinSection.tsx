import Image from 'next/image'
import { WHY_HOSTS_JOIN } from '@/lib/host-content'

export default function WhyHostsJoinSection() {
  return (
    <section className="py-16 md:py-28 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-14 text-center md:text-left">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">Why hosts join</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight max-w-2xl mx-auto md:mx-0">
          Built for treehouse hosts, not generic rentals
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        {WHY_HOSTS_JOIN.map((item) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-3xl bg-[#fffcf7] shadow-[0_12px_40px_rgba(26,43,26,0.06)]"
          >
            <div className="relative h-44 md:h-48 overflow-hidden">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover image-hover-zoom"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 to-transparent" />
            </div>
            <div className="p-6 md:p-7">
              <h3 className="font-serif text-xl md:text-2xl text-forest-950 leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-stone-600 leading-relaxed">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
