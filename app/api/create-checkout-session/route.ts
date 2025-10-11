import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { userId, propertyTitle, propertyId } = await request.json()

    if (!userId || !propertyTitle || !propertyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Stripe checkout session for annual subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // Option 1: Use your Price ID (recommended)
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || 'price_xxxxxxxxxxxx',
          quantity: 1,
          
          // Option 2: Create dynamic subscription price (alternative)
          // price_data: {
          //   currency: 'usd',
          //   product_data: {
          //     name: 'Treehouse Trips Annual Listing',
          //     description: `Annual subscription for "${propertyTitle}"`,
          //     images: ['https://treehousetrips.com/logo.png'],
          //   },
          //   unit_amount: 5000, // $50.00 in cents
          //   recurring: {
          //     interval: 'year',
          //   },
          // },
        },
      ],
      mode: 'subscription', // Changed from 'payment' to 'subscription'
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create?payment=cancelled`,
      metadata: {
        userId,
        propertyId,
        propertyTitle,
        type: 'annual_subscription'
      },
      subscription_data: {
        metadata: {
          userId,
          propertyId,
          propertyTitle,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
