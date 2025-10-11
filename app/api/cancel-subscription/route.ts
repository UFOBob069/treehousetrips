import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { updateProperty } from '@/lib/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { propertyId, subscriptionId } = await request.json()

    if (!propertyId || !subscriptionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Cancel the subscription at period end (not immediately)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    console.log(`Subscription ${subscriptionId} set to cancel at period end`)

    // Update property status
    await updateProperty(propertyId, {
      subscriptionStatus: 'canceled',
    })

    return NextResponse.json({ 
      success: true, 
      cancelAt: new Date(subscription.cancel_at! * 1000).toLocaleDateString() 
    })
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}

