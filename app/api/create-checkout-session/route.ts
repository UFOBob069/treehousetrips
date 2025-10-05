import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { userId, propertyTitle, propertyId } = await request.json()

    if (!userId || !propertyTitle || !propertyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
          product_data: {
            name: 'Treehouse Trips Annual Listing Fee',
            description: `Annual listing fee for "${propertyTitle}"`,
            images: ['https://treehousetrips.com/logo.png'], // Replace with your logo
          },
            unit_amount: 5000, // $50.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create?payment=cancelled`,
      metadata: {
        userId,
        propertyId,
        propertyTitle,
        type: 'listing_fee'
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
