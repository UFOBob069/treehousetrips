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

## 3. Webhook Setup
1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

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
