import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Payment successful for session:', session.id)
      // Here you would typically:
      // 1. Update user's membership status in your database
      // 2. Send confirmation email
      // 3. Grant access to exclusive properties
      break
    
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription created:', subscription.id)
      break
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', deletedSubscription.id)
      // Here you would typically:
      // 1. Revoke user's membership access
      // 2. Send cancellation confirmation email
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
