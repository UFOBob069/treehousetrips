'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { startHostListingCheckout } from '@/lib/stripe-host-checkout'

type SubscribePropertyButtonProps = {
  propertyId: string
  propertyTitle: string
  label?: string
  variant?: 'primary' | 'secondary' | 'renew'
  className?: string
  disabled?: boolean
}

export function SubscribePropertyButton({
  propertyId,
  propertyTitle,
  label = 'Activate for $50/year',
  variant = 'primary',
  className = '',
  disabled = false,
}: SubscribePropertyButtonProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const missingId = !propertyId?.trim()

  async function handleSubscribe() {
    if (!user) {
      setError('Please sign in first.')
      return
    }
    if (missingId) {
      setError('Listing ID missing — refresh the page or contact support.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await startHostListingCheckout({
        userId: user.uid,
        propertyId,
        propertyTitle,
        customerEmail: user.email,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Try again.')
      setLoading(false)
    }
  }

  const variantClass =
    variant === 'renew'
      ? 'bg-amber-muted hover:bg-amber-warm text-forest-950'
      : variant === 'secondary'
        ? 'border border-stone-200/80 bg-white text-forest-800 hover:bg-stone-100/80'
        : 'bg-forest-800 hover:bg-forest-700 text-white'

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading || disabled || missingId}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClass}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {loading ? 'Opening checkout…' : label}
      </button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      {missingId && !error ? (
        <p className="mt-1 text-xs text-red-600">Cannot start checkout without a listing ID.</p>
      ) : null}
    </div>
  )
}

function getPropertySubscriptionState(property: {
  isPaid?: boolean
  subscriptionStatus?: string
}) {
  if (property.isPaid && property.subscriptionStatus === 'active') return 'active' as const
  if (property.subscriptionStatus === 'expired') return 'expired' as const
  if (property.subscriptionStatus === 'canceled') return 'canceled' as const
  return 'needs_payment' as const
}

export { getPropertySubscriptionState }
