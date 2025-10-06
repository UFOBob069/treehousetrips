import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { updateProperty } from '@/lib/firestore'
import { serverTimestamp } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const userId = session.metadata?.userId
      const propertyId = session.metadata?.propertyId
      const propertyTitle = session.metadata?.propertyTitle
      
      if (propertyId) {
        // Calculate subscription end date (1 year from now)
        const endDate = new Date()
        endDate.setFullYear(endDate.getFullYear() + 1)
        
        // Update property with payment information
        await updateProperty(propertyId, {
          isPaid: true,
          subscriptionStatus: 'active',
          subscriptionStartDate: new Date() as any,
          subscriptionEndDate: endDate as any,
          stripePaymentId: session.payment_intent as string,
          isPublished: true, // Auto-publish after payment
        })
        
        console.log(`Listing fee paid for property ${propertyId}: ${propertyTitle}`)
        console.log(`Subscription active until: ${endDate.toLocaleDateString()}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
