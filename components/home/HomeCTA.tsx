import Link from 'next/link'

export default function HomeCTA() {
  return (
    <section className="py-20 md:py-28 bg-forest-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-moss via-transparent to-transparent" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">
          Your next escape is waiting in the trees
        </h2>
        <p className="mt-4 text-white/70 text-base md:text-lg">
          Hand-curated stays. No ordinary weekends.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex w-full sm:w-auto justify-center rounded-full bg-amber-muted px-8 py-3.5 text-sm md:text-base font-medium text-forest-950 hover:bg-amber-warm transition-colors shadow-lg"
          >
            Explore all stays
          </Link>
          <Link
            href="/create"
            className="inline-flex w-full sm:w-auto justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm md:text-base font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            List your treehouse
          </Link>
        </div>
      </div>
    </section>
  )
}
