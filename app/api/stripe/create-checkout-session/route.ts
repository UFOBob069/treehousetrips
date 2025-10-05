import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { applicationData, successUrl, cancelUrl } = await request.json()
    const priceId = process.env.STRIPE_APPLICATION_PRICE_ID || 'price_1234567890'

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Replace with your actual Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        applicationId: `app_${Date.now()}`,
        hostEmail: applicationData.hostEmail,
        propertyName: applicationData.propertyName,
        propertyLocation: applicationData.propertyLocation,
      },
      customer_email: applicationData.hostEmail,
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          applicationId: `app_${Date.now()}`,
          hostEmail: applicationData.hostEmail,
          propertyName: applicationData.propertyName,
        },
      },
    })

    // Store application data in database (you'll need to implement this)
    // For now, we'll just log it
    console.log('Application submitted:', {
      applicationId: `app_${Date.now()}`,
      hostEmail: applicationData.hostEmail,
      propertyName: applicationData.propertyName,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
