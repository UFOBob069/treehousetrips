# Stripe Webhook Events for Treehouse Trips

## Webhook Endpoint
Configure in Stripe Dashboard: `https://yourdomain.com/api/webhook/stripe`

## Events to Listen To

### ✅ Currently Implemented
- `checkout.session.completed` - Payment successful, activate listing

### 🎯 Critical Events (Add These)

#### Payment Success
- `payment_intent.succeeded` - Payment processed successfully
- `charge.succeeded` - Final confirmation of payment

#### Payment Failures
- `payment_intent.payment_failed` - Payment attempt failed
- `checkout.session.expired` - Payment session expired
- `payment_intent.canceled` - Payment was cancelled

#### Refunds & Disputes
- `charge.refunded` - Refund issued, deactivate listing
- `charge.dispute.created` - Host disputed charge
- `charge.dispute.closed` - Dispute resolved

### 📋 Optional (For Future Features)

#### Recurring Subscriptions (if you add auto-renewal)
- `customer.subscription.created` - New subscription started
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Recurring payment successful
- `invoice.payment_failed` - Recurring payment failed
- `invoice.upcoming` - Invoice due soon (send reminder)

#### Advanced Features
- `customer.created` - Track customer creation
- `customer.updated` - Customer info changed
- `payment_method.attached` - Payment method added
- `payment_method.detached` - Payment method removed

## Event Priority

### High Priority (Implement Now)
1. `checkout.session.completed` ✅
2. `payment_intent.succeeded`
3. `payment_intent.payment_failed`
4. `charge.refunded`

### Medium Priority
5. `checkout.session.expired`
6. `charge.dispute.created`
7. `charge.dispute.closed`
8. `payment_intent.canceled`

### Low Priority (Future)
- Subscription events (if adding auto-renewal)
- Customer events (for analytics)

## Testing Webhooks

Use Stripe CLI to test:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded
```

## Webhook Security

✅ Always verify webhook signatures
✅ Use idempotency keys for duplicate events
✅ Log all webhook events for debugging
✅ Return 200 status quickly (process async if needed)

