# Stripe Checkout — branding & pricing display

Host listing checkout is configured in code (`lib/stripe-host-checkout-session.ts`) and can be tuned in the Stripe Dashboard.

## Fix “$4.17 / month billed annually” confusion

That line is **not** a monthly bill. Stripe can show an *equivalent monthly rate* under the annual total when a Dashboard setting is on.

1. Open [Stripe Dashboard → Settings → Checkout and Payment Links](https://dashboard.stripe.com/settings/checkout)
2. Find **Pricing display** (or “Display yearly prices in monthly terms”)
3. Set it to show the **annual amount** (turn off “per month” display for yearly prices)

After this, Checkout should emphasize **$50.00 per year** without the misleading monthly subtitle.

Our checkout session also adds custom text: *“You pay $50 today — one charge, not monthly.”*

## Branding (logo & colors)

Code applies on each session:

- Cream background `#faf8f5`
- Forest green button `#3a5636`
- Serif font (`lora`)
- Display name: **Treehouse Trips**

Optional logo (HTTPS, square PNG recommended):

```bash
STRIPE_CHECKOUT_LOGO_URL=https://yoursite.com/path/to/logo.png
```

You can also set default branding under [Checkout branding](https://dashboard.stripe.com/settings/branding) so receipts and invoices match.

## Reusable price ID (`STRIPE_SUBSCRIPTION_PRICE_ID`)

If you use a fixed Price from the Dashboard, update the **Product** there too:

- **Name:** `Annual host listing — $50/year (one payment)`
- **Description:** One $50 charge per year, not monthly. Map placement, listing page, guest messaging. No commission on Airbnb bookings.

Dynamic `price_data` in code already uses this copy when no price ID is set.

## Test

Use test mode and card `4242 4242 4242 4242`. Confirm the left panel shows benefits, annual total is clear, and submit-area text mentions a single $50 charge today.
