'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Home,
  MapPin,
  XCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getPropertiesByOwner, Property } from '@/lib/firestore'
import { HostSubscriptionPitch } from '@/components/host/HostSubscriptionPitch'
import {
  getPropertySubscriptionState,
  SubscribePropertyButton,
} from '@/components/host/SubscribePropertyButton'

function formatFirestoreDate(value?: { seconds: number }) {
  if (!value?.seconds) return null
  return new Date(value.seconds * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function statusBadge(property: Property) {
  const state = getPropertySubscriptionState(property)
  if (state === 'active') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Live on Treehouse Trips
      </span>
    )
  }
  if (state === 'expired') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
        <XCircle className="h-3.5 w-3.5" />
        Expired — renew to go live again
      </span>
    )
  }
  if (state === 'canceled') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
        Canceled — renews through period end
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
      <AlertCircle className="h-3.5 w-3.5" />
      Needs subscription — $50/year
    </span>
  )
}

export default function DashboardSubscriptionsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('property')
  const paymentSuccess = searchParams.get('payment') === 'success'
  const paymentCancelled = searchParams.get('payment') === 'cancelled'

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const highlightRef = useRef<HTMLLIElement | null>(null)

  const loadProperties = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      setError('')
      const list = await getPropertiesByOwner(user.uid)
      setProperties(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) loadProperties()
  }, [user, loadProperties])

  useEffect(() => {
    if (!loading && highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loading, highlightId])

  const activeCount = properties.filter(
    (p) => getPropertySubscriptionState(p) === 'active'
  ).length
  const needsPaymentCount = properties.length - activeCount

  async function handleCancel(property: Property) {
    if (!property.id || !property.stripeSubscriptionId) return
    if (
      !confirm(
        'Cancel auto-renewal? Your listing stays live until the end of the current billing period.'
      )
    ) {
      return
    }

    setCancelingId(property.id)
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          subscriptionId: property.stripeSubscriptionId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Cancel failed')
      await loadProperties()
      alert(`Subscription will end on ${data.cancelAt}.`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not cancel subscription')
    } finally {
      setCancelingId(null)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-600">Please sign in to manage listing subscriptions.</p>
          <Link href="/create" className="mt-4 inline-block text-forest-700 underline">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {paymentSuccess ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            <strong>Payment received.</strong> Your listing subscription is activating — refresh in a
            moment if status has not updated yet.
          </div>
        ) : null}
        {paymentCancelled ? (
          <div className="mb-6 rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-800">
            Checkout was canceled. You can activate any listing below when you&apos;re ready.
          </div>
        ) : null}

        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900">Listing subscriptions</h1>
          <p className="mt-2 text-stone-600">
            Each treehouse needs its own $50/year subscription to appear on Treehouse Trips. Manage
            activation and renewal per property below.
          </p>
          {properties.length > 0 ? (
            <p className="mt-3 text-sm font-medium text-forest-800">
              {activeCount} of {properties.length} listing{properties.length === 1 ? '' : 's'}{' '}
              {activeCount === 1 ? 'is' : 'are'} active
              {needsPaymentCount > 0
                ? ` · ${needsPaymentCount} still need${needsPaymentCount === 1 ? 's' : ''} a subscription`
                : ''}
            </p>
          ) : null}
        </header>

        <HostSubscriptionPitch />

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-stone-900">Your listings</h2>
          <p className="mt-1 text-sm text-stone-600">
            Activate or renew each property individually. Checkout is secure via Stripe.
          </p>

          {loading ? (
            <div className="mt-8 text-center text-stone-500">Loading properties…</div>
          ) : error ? (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          ) : properties.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
              <Home className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-medium text-stone-900">No listings yet</p>
              <p className="mt-1 text-sm text-stone-600">
                Create a property first, then return here to activate it.
              </p>
              <Link
                href="/create"
                className="mt-4 inline-block rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
              >
                List a treehouse
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {properties.map((property) => {
                const state = getPropertySubscriptionState(property)
                const isHighlighted = property.id === highlightId
                const endLabel = formatFirestoreDate(property.subscriptionEndDate)

                return (
                  <li
                    key={property.id}
                    ref={isHighlighted ? highlightRef : undefined}
                    className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow ${
                      isHighlighted ? 'border-forest-400 ring-2 ring-forest-200' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0]}
                            alt=""
                            className="h-20 w-28 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                            <Home className="h-8 w-8 text-stone-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-stone-900">{property.title}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{property.location}</span>
                          </p>
                          <div className="mt-2">{statusBadge(property)}</div>
                          {endLabel && state === 'active' ? (
                            <p className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                              <Calendar className="h-3.5 w-3.5" />
                              Renews / expires {endLabel}
                            </p>
                          ) : null}
                          {!property.isPublished && state === 'active' ? (
                            <p className="mt-2 text-xs text-stone-500">
                              Subscription active — listing may still be pending editorial review before
                              it appears publicly.
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                        {state === 'active' ? (
                          <>
                            {property.stripeSubscriptionId ? (
                              <button
                                type="button"
                                onClick={() => handleCancel(property)}
                                disabled={cancelingId === property.id}
                                className="text-sm text-stone-500 underline hover:text-stone-800 disabled:opacity-50"
                              >
                                {cancelingId === property.id ? 'Canceling…' : 'Cancel auto-renewal'}
                              </button>
                            ) : null}
                            <Link
                              href={`/dashboard/properties/${property.id}`}
                              className="text-center text-sm font-medium text-forest-700 hover:underline"
                            >
                              View listing preview
                            </Link>
                          </>
                        ) : property.id ? (
                          <SubscribePropertyButton
                            propertyId={property.id}
                            propertyTitle={property.title}
                            label={
                              state === 'expired' || state === 'canceled'
                                ? 'Renew for $50/year'
                                : 'Activate for $50/year'
                            }
                            variant={state === 'expired' ? 'renew' : 'primary'}
                          />
                        ) : (
                          <p className="text-xs text-red-600">Missing listing ID</p>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-stone-500">
          Questions about billing? Email support from your profile — include the property name for
          faster help.
        </p>
      </div>
    </div>
  )
}
