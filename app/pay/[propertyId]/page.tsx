'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getProperty } from '@/lib/firestore'
import { HostSubscriptionPitch } from '@/components/host/HostSubscriptionPitch'
import { SubscribePropertyButton } from '@/components/host/SubscribePropertyButton'

export default function PayPropertyPage() {
  const params = useParams()
  const propertyId = params.propertyId as string
  const { user } = useAuth()
  const [title, setTitle] = useState<string | null>(null)
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!propertyId) {
        setLoadError('Invalid listing link.')
        setLoading(false)
        return
      }
      const { data, error } = await getProperty(propertyId)
      if (cancelled) return
      if (error || !data) {
        setLoadError(error || 'Listing not found.')
      } else {
        setTitle(data.title)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [propertyId])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-stone-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading listing…
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p>{loadError}</p>
            <Link href="/dashboard/subscriptions" className="mt-4 inline-block text-sm font-medium underline">
              Go to subscriptions
            </Link>
          </div>
        ) : (
          <>
            <header className="mb-8">
              <h1 className="font-serif text-2xl font-bold text-stone-900">Activate your listing</h1>
              <p className="mt-2 text-stone-600">
                Subscribe <strong>{title}</strong> for $50/year to publish on Treehouse Trips.
              </p>
            </header>

            <HostSubscriptionPitch compact />

            <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 text-center">
              {!user ? (
                <p className="text-stone-600">
                  <Link href="/create" className="font-medium text-forest-800 underline">
                    Sign in
                  </Link>{' '}
                  to continue to secure checkout.
                </p>
              ) : (
                <SubscribePropertyButton
                  propertyId={propertyId}
                  propertyTitle={title || 'Treehouse listing'}
                  label="Continue to Stripe checkout — $50/year"
                  className="flex flex-col items-center"
                />
              )}
              <p className="mt-4 text-xs text-stone-500">
                One $50 charge today, then $50 once per year when your listing renews — not monthly.
                You&apos;ll complete payment on Stripe. Manage all listings from{' '}
                <Link href="/dashboard/subscriptions" className="text-forest-700 underline">
                  subscriptions
                </Link>
                .
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
