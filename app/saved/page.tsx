'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSaves } from '@/contexts/SavesContext'
import PropertyBrowseCard from '@/components/properties/PropertyBrowseCard'
import AuthModal from '@/components/AuthModal'
import { ui } from '@/lib/app-ui'

export default function SavedPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { savedProperties, loading } = useSaves()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (searchParams.get('signin') === '1' && !user) {
      setShowAuthModal(true)
    }
  }, [searchParams, user])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <p className={ui.label}>Your list</p>
          <h1 className={`${ui.headingPage} mt-2 text-3xl md:text-4xl`}>Saved treehouses</h1>
          <p className="mt-2 max-w-xl text-stone-600">
            Stays you&apos;ve hearted appear here. Sign in to sync saves across devices.
          </p>
        </div>

        {!user ? (
          <div className={`${ui.card} ${ui.cardPad} max-w-lg text-center`}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-xl text-forest-950">Sign in to view saves</h2>
            <p className="mt-2 text-sm text-stone-600">
              Create a free account to save treehouses and come back to them anytime.
            </p>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className={`${ui.btnPrimary} mt-6`}
            >
              Sign in
            </button>
            <p className="mt-4 text-sm text-stone-500">
              Or{' '}
              <Link href="/properties" className="font-medium text-forest-800 hover:underline">
                browse stays
              </Link>{' '}
              first.
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-stone-600">
            <Loader2 className={`${ui.spinner}`} />
            Loading your saves…
          </div>
        ) : savedProperties.length === 0 ? (
          <div className={`${ui.card} ${ui.cardPad} max-w-lg`}>
            <h2 className="font-serif text-xl text-forest-950">No saves yet</h2>
            <p className="mt-2 text-sm text-stone-600">
              Tap the heart on any listing while you browse — your favorites will show up here.
            </p>
            <Link href="/properties" className={`${ui.btnPrimary} mt-6`}>
              Browse treehouses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((property, i) => (
              <PropertyBrowseCard
                key={property.id}
                property={property}
                viewMode="grid"
                imagePriority={i < 3}
              />
            ))}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        contextMessage="Sign in to save treehouses and view them on this page anytime."
      />
    </div>
  )
}
