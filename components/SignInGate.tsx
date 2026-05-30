'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Compass,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
  TreePine,
  LayoutDashboard,
  CreditCard,
} from 'lucide-react'
import AuthModal from '@/components/AuthModal'
import { ui } from '@/lib/app-ui'

const TRAVELER_BENEFITS = [
  { icon: Heart, text: 'Save treehouses you love and revisit them anytime' },
  { icon: Search, text: 'Browse curated stays and message hosts directly' },
  { icon: MessageCircle, text: 'Keep conversations in one place' },
] as const

const HOST_BENEFITS = [
  { icon: TreePine, text: 'Publish and edit your listing from one dashboard' },
  { icon: LayoutDashboard, text: 'Track subscriptions and listing status' },
  { icon: CreditCard, text: 'Activate listings with simple annual billing' },
] as const

type SignInGateProps = {
  /** Short line under the main headline (page-specific). */
  contextLine?: string
  /** Shown in the auth modal. */
  authMessage?: string
}

export default function SignInGate({
  contextLine = 'Sign in to unlock your dashboard, saved stays, and host tools.',
  authMessage = 'Create a free account or sign in to continue. Works for travelers exploring stays and hosts listing treehouses.',
}: SignInGateProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <section className="relative min-h-[72vh] overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-50/90 via-cream to-cream"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-forest-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-warm/15 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className={`${ui.label} mb-3`}>
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
            Treehouse Trips
          </p>
          <h1 className="font-serif text-3xl tracking-tight text-forest-950 sm:text-4xl md:text-5xl">
            Step into the canopy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            {contextLine}
          </p>

          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            <div className={`${ui.card} ${ui.cardPad}`}>
              <div className="mb-4 flex items-center gap-2">
                <span className={ui.iconBox}>
                  <Compass className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-lg text-forest-950">For travelers</h2>
              </div>
              <ul className="space-y-3">
                {TRAVELER_BENEFITS.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm text-stone-600">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/properties"
                className="mt-5 inline-flex text-sm font-medium text-forest-800 hover:text-forest-950 hover:underline"
              >
                Browse treehouses without signing in →
              </Link>
            </div>

            <div className={`${ui.card} ${ui.cardPad}`}>
              <div className="mb-4 flex items-center gap-2">
                <span className={ui.iconBox}>
                  <TreePine className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-lg text-forest-950">For hosts</h2>
              </div>
              <ul className="space-y-3">
                {HOST_BENEFITS.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm text-stone-600">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="mt-5 inline-flex text-sm font-medium text-forest-800 hover:text-forest-950 hover:underline"
              >
                Learn about listing your treehouse →
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => setShowAuthModal(true)} className={ui.btnPrimary}>
              Sign in or create account
            </button>
            <Link href="/properties" className={ui.btnSecondary}>
              Explore stays first
            </Link>
          </div>

          <p className="mt-6 text-xs text-stone-500">
            Free to join · Secure sign-in with email or Google
          </p>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        contextMessage={authMessage}
      />
    </>
  )
}
