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
- Default Stripe font (faster load than custom webfonts)
- Display name: **Treehouse Trips**
- No product hero image by default (faster Checkout). Optional: `STRIPE_CHECKOUT_PRODUCT_IMAGE=https://…`

Optional logo (HTTPS, square PNG recommended):

```bash
STRIPE_CHECKOUT_LOGO_URL=https://yoursite.com/path/to/logo.png
```

You can also set default branding under [Checkout branding](https://dashboard.stripe.com/settings/branding) so receipts and invoices match.

## Reusable price ID (`STRIPE_SUBSCRIPTION_PRICE_ID`)

If you use a fixed Price from the Dashboard, update the **Product** there too:

- **Name:** `Annual host listing — $50/year (one payment)`
- **Description:** One $50 charge per year, not monthly. Map placement, listing page, guest messaging. No commission on your bookings.

Dynamic `price_data` in code already uses this copy when no price ID is set.

## Test

Use test mode and card `4242 4242 4242 4242`. Confirm the left panel shows benefits, annual total is clear, and submit-area text mentions a single $50 charge today.

## Promotion codes (e.g. 40% off year one)

Checkout now shows **Add promotion code** (`allow_promotion_codes: true` in `lib/stripe-host-checkout-session.ts`).

### 1. Create the coupon (Stripe Dashboard)

1. Open [Coupons](https://dashboard.stripe.com/coupons) (use **Test mode** while testing).
2. **Create coupon**
3. Set:
   - **Type:** Percentage discount
   - **Percent off:** `40`
   - **Duration:** **Once** — applies only to the first annual charge ($50 → **$30**), then renews at full $50/year unless canceled
4. Save and note the coupon ID (e.g. `abc123`).

Optional limits: **Redemption limit**, **Expires**, or restrict to specific customers.

### 2. Create a promotion code (what hosts type at checkout)

1. Open [Promotion codes](https://dashboard.stripe.com/promotion_codes) → **New**
2. Select the coupon from step 1
3. **Code:** e.g. `TREEHOUSE40` or `LAUNCH40` (hosts enter this at checkout)
4. Set max redemptions / expiry if you want
5. Save

### 3. Test

1. Start host checkout (dashboard → activate listing).
2. On Stripe Checkout, click **Add promotion code**.
3. Enter `TREEHOUSE40` (or your code).
4. Total should show **$30.00** for the first year (40% off $50).

### Notes

- **Year two+** bills at the full annual price unless you use a different coupon duration.
- For **fixed amount** off instead (e.g. $20 off → $30), create a coupon with **Amount off** `$20.00` and duration **Once**.
- To auto-apply a code (no typing), use a Checkout Session `discounts: [{ promotion_code: 'promo_…' }]` in code — ask if you want a campaign link wired that way.
