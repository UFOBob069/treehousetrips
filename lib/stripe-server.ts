import { NextRequest } from 'next/server'
import Stripe from 'stripe'

let stripeSingleton: Stripe | null = null

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(secret, {
      apiVersion: '2025-09-30.clover',
      maxNetworkRetries: 1,
    })
  }
  return stripeSingleton
}

export function getAppBaseUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  if (host) return `${proto}://${host}`

  return 'http://localhost:3000'
}

const LISTING_BENEFITS_BLURB =
  'One $50 charge today, then once per year — not monthly. Includes map & search placement, your listing page, and guest messaging. You keep your existing booking links — we do not take a commission on stays.'

export function listingSubscriptionLineItem(
  propertyTitle: string,
  productImageUrl?: string | null
): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID
  const useConfiguredPrice =
    priceId && priceId.startsWith('price_') && !priceId.includes('xxxx')

  if (useConfiguredPrice) {
    return { price: priceId, quantity: 1 }
  }

  const listing = propertyTitle.trim() || 'your treehouse'
  const image =
    productImageUrl === null
      ? undefined
      : (productImageUrl ?? process.env.STRIPE_CHECKOUT_PRODUCT_IMAGE)?.trim()

  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: 5000,
      recurring: { interval: 'year' },
      product_data: {
        name: 'Annual host listing — $50/year',
        description: `${LISTING_BENEFITS_BLURB}\n\nListing: “${listing}”`,
        ...(image ? { images: [image] } : {}),
        metadata: {
          propertyTitle: listing,
          billing: 'annual_single_charge',
        },
      },
    },
  }
}
