import Stripe from 'stripe'
import { listingSubscriptionLineItem } from '@/lib/stripe-server'

export function getCheckoutLogoUrl(): string | undefined {
  const fromEnv = process.env.STRIPE_CHECKOUT_LOGO_URL?.trim()
  return fromEnv || undefined
}

function checkoutBranding(): Stripe.Checkout.SessionCreateParams.BrandingSettings {
  const logoUrl = getCheckoutLogoUrl()
  return {
    display_name: 'Treehouse Trips',
    background_color: '#faf8f5',
    button_color: '#3a5636',
    border_style: 'rounded',
    ...(logoUrl
      ? {
          logo: { type: 'url' as const, url: logoUrl },
        }
      : {}),
  }
}

function checkoutCustomText(propertyTitle: string): Stripe.Checkout.SessionCreateParams.CustomText {
  const listing = propertyTitle.trim() || 'your treehouse'
  return {
    submit: {
      message:
        'You pay $50 today — one charge, not monthly. Your listing renews once per year at $50 unless you cancel before renewal.',
    },
    after_submit: {
      message:
        'Secure checkout by Stripe. By subscribing you agree to annual listing terms; cancel before renewal from your dashboard. Questions: support@treehousetrips.com',
    },
  }
}

export function buildHostListingCheckoutSession(
  opts: {
    baseUrl: string
    userId: string
    propertyId: string
    propertyTitle: string
    customerEmail?: string
  }
): Stripe.Checkout.SessionCreateParams {
  const { baseUrl, userId, propertyId, propertyTitle, customerEmail } = opts
  const listing = propertyTitle.trim() || 'your treehouse'

  return {
    payment_method_types: ['card'],
    line_items: [listingSubscriptionLineItem(propertyTitle, null)],
    mode: 'subscription',
    success_url: `${baseUrl}/dashboard/subscriptions?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/subscriptions?payment=cancelled&property=${encodeURIComponent(propertyId)}`,
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    branding_settings: checkoutBranding(),
    custom_text: checkoutCustomText(propertyTitle),
    consent_collection: {
      payment_method_reuse_agreement: { position: 'hidden' },
    },
    metadata: {
      userId,
      propertyId,
      propertyTitle: listing,
      type: 'annual_subscription',
    },
    subscription_data: {
      description: `Annual listing for “${listing}” — $50/year, billed once per year`,
      metadata: {
        userId,
        propertyId,
        propertyTitle: listing,
      },
    },
  }
}
