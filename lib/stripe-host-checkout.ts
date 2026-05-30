/** Starts Stripe Checkout for a host listing subscription. */
export async function startHostListingCheckout(params: {
  userId: string
  propertyId: string
  propertyTitle: string
  customerEmail?: string | null
}): Promise<void> {
  const { userId, propertyId, propertyTitle, customerEmail } = params

  if (!propertyId?.trim()) {
    throw new Error('This listing is missing an ID. Save the property again from your dashboard.')
  }
  if (!propertyTitle?.trim()) {
    throw new Error('This listing is missing a title.')
  }

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      propertyId,
      propertyTitle,
      customerEmail: customerEmail || undefined,
    }),
  })

  const data = (await response.json()) as { url?: string; sessionId?: string; error?: string }

  if (!response.ok) {
    throw new Error(data.error || `Could not start checkout (${response.status})`)
  }

  if (data.url) {
    window.location.assign(data.url)
    return
  }

  if (data.sessionId) {
    const { loadStripe } = await import('@stripe/stripe-js')
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      throw new Error('Stripe is not configured (missing publishable key).')
    }
    const stripe = await loadStripe(publishableKey)
    if (!stripe) throw new Error('Failed to load Stripe')

    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
    if (error) throw new Error(error.message)
    return
  }

  throw new Error('Checkout session did not return a payment URL.')
}
