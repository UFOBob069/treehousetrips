import { Link2, Bot, Compass } from 'lucide-react'
import { HOST_DISCOVERY_BENEFITS } from '@/lib/host-content'

const ICONS = [Link2, Bot, Compass] as const

export default function HostDiscoveryBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
          <p className="text-moss text-sm tracking-widest uppercase mb-2">Beyond another listing</p>
          <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
            Why hosts list here in 2026
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {HOST_DISCOVERY_BENEFITS.map((item, i) => {
            const Icon = ICONS[i]
            return (
              <article
                key={item.id}
                className="rounded-3xl border border-stone-200/80 bg-[#fffcf7] p-6 md:p-7 shadow-[0_8px_30px_rgba(26,43,26,0.05)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100 text-forest-800 mb-4">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-serif text-xl text-forest-950 leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm md:text-base text-stone-600 leading-relaxed">{item.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
