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
        <Link
          href="/properties"
          className="mt-8 inline-flex rounded-full bg-amber-muted px-8 py-3.5 text-sm md:text-base font-medium text-forest-950 hover:bg-amber-warm transition-colors shadow-lg"
        >
          Explore all stays
        </Link>
      </div>
    </section>
  )
}
