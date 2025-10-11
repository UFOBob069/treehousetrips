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

    console.log(`Received webhook event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        const userId = session.metadata?.userId
        const propertyId = session.metadata?.propertyId
        const propertyTitle = session.metadata?.propertyTitle
        
        if (propertyId && session.mode === 'subscription') {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          
          // Calculate subscription end date from Stripe subscription
          const endDate = new Date((subscription as any).current_period_end * 1000)
          const startDate = new Date((subscription as any).current_period_start * 1000)
          
          // Update property with subscription information
          await updateProperty(propertyId, {
            isPaid: true,
            subscriptionStatus: 'active',
            subscriptionStartDate: startDate as any,
            subscriptionEndDate: endDate as any,
            stripePaymentId: session.payment_intent as string,
            stripeSubscriptionId: (subscription as any).id,
            stripeCustomerId: (subscription as any).customer,
            isPublished: true, // Auto-publish after payment
          })
          
          console.log(`✅ Annual subscription activated for property ${propertyId}: ${propertyTitle}`)
          console.log(`Subscription ID: ${(subscription as any).id}`)
          console.log(`Renews: ${endDate.toLocaleDateString()}`)
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const propertyId = subscription.metadata?.propertyId
        
        if (propertyId) {
          const endDate = new Date(subscription.current_period_end * 1000)
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'canceled' ? 'canceled' : 'expired'
          
          await updateProperty(propertyId, {
            subscriptionStatus: status,
            subscriptionEndDate: endDate as any,
            isPublished: status === 'active',
          })
          
          console.log(`🔄 Subscription updated for property ${propertyId}`)
          console.log(`New status: ${status}, Ends: ${endDate.toLocaleDateString()}`)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const propertyId = subscription.metadata?.propertyId
        
        if (propertyId) {
          await updateProperty(propertyId, {
            subscriptionStatus: 'canceled',
            isPublished: false,
            isPaid: false,
          })
          
          console.log(`❌ Subscription canceled for property ${propertyId}`)
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        
        // This fires on renewal payments
        if (invoice.billing_reason === 'subscription_cycle') {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          ) as any
          const propertyId = subscription.metadata?.propertyId
          
          if (propertyId) {
            const endDate = new Date(subscription.current_period_end * 1000)
            
            await updateProperty(propertyId, {
              subscriptionStatus: 'active',
              subscriptionEndDate: endDate as any,
              isPublished: true,
            })
            
            console.log(`✅ Renewal payment succeeded for property ${propertyId}`)
            console.log(`Next renewal: ${endDate.toLocaleDateString()}`)
          }
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        ) as any
        const propertyId = subscription.metadata?.propertyId
        
        if (propertyId) {
          await updateProperty(propertyId, {
            subscriptionStatus: 'expired',
            isPublished: false,
          })
          
          console.error(`❌ Renewal payment failed for property ${propertyId}`)
          // TODO: Send email to host about failed payment
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`)
        // Additional confirmation logging
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(`❌ Payment failed: ${paymentIntent.id}`)
        console.error(`Reason: ${paymentIntent.last_payment_error?.message}`)
        // TODO: Notify host about payment failure
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`⏱️ Checkout session expired: ${session.id}`)
        // Optional: Track abandoned checkouts for analytics
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntent = charge.payment_intent as string
        
        console.log(`💸 Refund issued for charge: ${charge.id}`)
        
        // Find and deactivate the property associated with this payment
        // TODO: Add function to find property by payment intent ID
        // await updatePropertyByPaymentId(paymentIntent, {
        //   isPaid: false,
        //   subscriptionStatus: 'expired',
        //   isPublished: false,
        // })
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.warn(`⚠️ Dispute created: ${dispute.id}`)
        console.warn(`Reason: ${dispute.reason}`)
        // TODO: Alert admin about dispute
        break
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute
        console.log(`🏁 Dispute closed: ${dispute.id}`)
        console.log(`Status: ${dispute.status}`)
        // TODO: Handle based on dispute outcome
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`🚫 Payment cancelled: ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
