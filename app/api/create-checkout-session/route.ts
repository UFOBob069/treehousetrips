import { NextRequest, NextResponse } from 'next/server'
import { getAppBaseUrl, getStripe } from '@/lib/stripe-server'
import { buildHostListingCheckoutSession } from '@/lib/stripe-host-checkout-session'

export async function POST(request: NextRequest) {
  try {
    const { userId, propertyTitle, propertyId, customerEmail } = await request.json()

    if (!userId || !propertyTitle || !propertyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payments are not configured on the server (STRIPE_SECRET_KEY missing).' },
        { status: 503 }
      )
    }

    const stripe = getStripe()
    const baseUrl = getAppBaseUrl(request)

    const session = await stripe.checkout.sessions.create(
      buildHostListingCheckoutSession({
        baseUrl,
        userId,
        propertyId,
        propertyTitle,
        customerEmail,
      })
    )

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
