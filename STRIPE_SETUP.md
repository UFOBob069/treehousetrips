# Treehouse Trips - Stripe Setup Guide

## 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the dashboard

## 2. Environment Variables
Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. Create Subscription Product
1. Go to Stripe Dashboard → Products → Add Product
2. Fill in:
   - Name: `Treehouse Trips Annual Listing`
   - Description: `Annual subscription for one treehouse property`
   - Billing period: **Yearly**
   - Price: `$50.00`
3. Copy the **Price ID** (starts with `price_`)
4. Add to `.env.local`:
   ```bash
   STRIPE_SUBSCRIPTION_PRICE_ID=price_xxxxxxxxxxxx
   ```

## 4. Webhook Setup
1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select these events:
   
   **Critical - Subscription Events:**
   - ✅ `checkout.session.completed` (Initial subscription)
   - ✅ `customer.subscription.updated` (Subscription changes)
   - ✅ `customer.subscription.deleted` (Subscription canceled)
   - ✅ `invoice.payment_succeeded` (Renewal successful)
   - ✅ `invoice.payment_failed` (Renewal failed)
   
   **Payment Events:**
   - ✅ `payment_intent.succeeded` (Payment confirmed)
   - ✅ `payment_intent.payment_failed` (Payment failed)
   - ✅ `checkout.session.expired` (Session timeout)
   
   **Refund & Dispute Events:**
   - ✅ `charge.refunded` (Refund issued)
   - ✅ `charge.dispute.created` (Dispute opened)
   - ✅ `charge.dispute.closed` (Dispute resolved)
   - ✅ `payment_intent.canceled` (Payment cancelled)

4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Testing Webhooks Locally
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded
```

## 4. Test Cards
Use these test card numbers:
- Success: `4242424242424242`
- Decline: `4000000000000002`

## 5. Deploy Firestore Rules
```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```
