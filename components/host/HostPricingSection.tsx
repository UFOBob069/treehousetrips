import { HOST_PRICE } from '@/lib/host-content'

const NO_FEES = [
  'No commissions',
  'No booking fees',
  'No contracts',
] as const

export default function HostPricingSection() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark border-y border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-moss text-sm tracking-widest uppercase mb-3">Simple pricing</p>
        <h2 className="font-serif text-3xl md:text-5xl text-forest-950 tracking-tight">
          Less Than A Tank Of Gas
        </h2>

        <p className="mt-6 font-serif text-5xl md:text-6xl text-forest-800 tracking-tight">
          {HOST_PRICE}
        </p>
        <p className="mt-2 text-lg text-stone-600">That&apos;s it.</p>

        <ul className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8">
          {NO_FEES.map((line) => (
            <li
              key={line}
              className="flex items-center gap-2 text-base md:text-lg font-medium text-forest-900"
            >
              <span className="h-2 w-2 rounded-full bg-amber-warm" aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-stone-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          People instantly understand. Even one inquiry from a traveler already looking for a
          treehouse can make {HOST_PRICE} worth it.
        </p>
      </div>
    </section>
  )
}
