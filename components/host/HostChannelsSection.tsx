import { DISCOVERY_CHANNELS, HOST_PRICE } from '@/lib/host-content'

export default function HostChannelsSection() {
  return (
    <section className="py-16 md:py-28 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-moss text-sm tracking-widest uppercase mb-3">Another channel</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight leading-snug">
          Be everywhere travelers discover treehouses
        </h2>
        <p className="mt-5 text-stone-600 text-base md:text-lg leading-relaxed">
          We&apos;re not here to replace Airbnb or generate every booking for you. We&apos;re one
          more place travelers look when they want a treehouse — alongside the channels you already
          use.
        </p>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {DISCOVERY_CHANNELS.map((channel) => (
            <li
              key={channel}
              className="rounded-full border border-forest-200 bg-[#fffcf7] px-5 py-2.5 text-sm md:text-base font-medium text-forest-900 shadow-sm"
            >
              {channel}
            </li>
          ))}
        </ul>

        <p className="mt-10 font-serif text-xl md:text-2xl text-forest-950">
          Another channel. Another opportunity.
        </p>
        <p className="mt-2 text-2xl md:text-3xl font-semibold text-forest-800">Only {HOST_PRICE}</p>
      </div>
    </section>
  )
}
