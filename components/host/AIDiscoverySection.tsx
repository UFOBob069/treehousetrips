import type { ReactNode } from 'react'
import { Sparkles, Compass, Layers } from 'lucide-react'

export default function AIDiscoverySection() {
  return (
    <section className="py-16 md:py-28 bg-forest-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-amber-warm/80 text-sm tracking-widest uppercase mb-3">
              Forward-looking
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-snug">
              Designed for the future of travel discovery
            </h2>
            <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed max-w-lg">
              As travelers increasingly rely on curated recommendations and intelligent
              discovery, niche marketplaces help unique stays stand out in ways generic
              listing sites cannot.
            </p>
            <p className="mt-4 text-white/55 text-sm md:text-base leading-relaxed max-w-lg">
              Focused inventory — treehouses with clear stories, tags, and intent — is
              easier to surface when people ask for something specific, not just
              &ldquo;a place to stay.&rdquo;
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-5">
              <DiscoveryRow
                icon={<Compass className="h-5 w-5 text-amber-warm" />}
                title="Intent-rich discovery"
                copy="Travelers search for experiences — canopy retreats, off-grid escapes — not commodity rentals."
              />
              <DiscoveryRow
                icon={<Layers className="h-5 w-5 text-amber-warm" />}
                title="Structured niche inventory"
                copy="A dedicated treehouse marketplace gives recommendation systems clearer context about what you offer."
              />
              <DiscoveryRow
                icon={<Sparkles className="h-5 w-5 text-amber-warm" />}
                title="Story-first listings"
                copy="Emotional, visual storytelling travels further than feature lists — especially in curated environments."
              />
            </div>
            <div
              className="absolute -z-10 -right-8 -top-8 h-40 w-40 rounded-full bg-moss/30 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -z-10 -left-4 -bottom-6 h-32 w-32 rounded-full bg-amber-muted/20 blur-2xl"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function DiscoveryRow({
  icon,
  title,
  copy,
}: {
  icon: ReactNode
  title: string
  copy: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/60 leading-relaxed">{copy}</p>
      </div>
    </div>
  )
}
