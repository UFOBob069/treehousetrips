import { Check, Globe, MessageCircle, Search, Shield, Sparkles, TreePine } from 'lucide-react'
import { HOST_PRICE } from '@/lib/host-content'

const VALUE_POINTS = [
  {
    icon: Search,
    title: 'Be where treehouse travelers are looking',
    description:
      'Your listing appears on our map, browse, and search — for guests who specifically want treehouses, not generic vacation rentals.',
  },
  {
    icon: Globe,
    title: 'Keep your existing booking channels',
    description:
      'Another channel alongside Airbnb, Vrbo, your site, and social. No exclusivity — link out however you already book.',
  },
  {
    icon: MessageCircle,
    title: 'Direct inquiries',
    description:
      'In-app messaging so interested travelers can reach you without hunting through posts or email threads.',
  },
  {
    icon: Shield,
    title: `Only ${HOST_PRICE}`,
    description:
      'Less than a tank of gas. No commissions, no booking fees, no contracts. One flat annual fee per property.',
  },
] as const

const INCLUDED = [
  `12 months live on Treehouse Trips — ${HOST_PRICE} per property`,
  'Map & category placement across the site',
  'Photo gallery with cover image support',
  'Host dashboard & listing edits anytime',
  'Annual renewal — cancel before renewal if you change plans',
] as const

export function HostSubscriptionPitch({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-6' : 'space-y-10'}>
      <div className="rounded-2xl border border-forest-200 bg-gradient-to-br from-forest-50 via-white to-amber-50/40 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest-800">
              <Sparkles className="h-3.5 w-3.5" />
              Host listing
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-stone-900 md:text-3xl">
              Less than a tank of gas — {HOST_PRICE}
            </h2>
            <p className="mt-2 max-w-2xl text-stone-600">
              Be everywhere travelers discover treehouses. We&apos;re another channel and another
              opportunity — not a replacement for Airbnb. No commission on bookings you close
              elsewhere.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-forest-200 bg-white px-5 py-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 text-forest-800">
              <TreePine className="h-5 w-5" />
              <span className="text-sm font-medium">Annual plan</span>
            </div>
            <p className="mt-2 text-4xl font-bold text-forest-900">$50</p>
            <p className="text-sm text-stone-500">per property / year</p>
            <p className="mt-2 text-xs font-medium text-forest-700">{HOST_PRICE} · billed once per year</p>
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="grid gap-6 md:grid-cols-2">
          {VALUE_POINTS.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h3 className="font-semibold text-stone-900">What&apos;s included</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {INCLUDED.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm text-stone-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
