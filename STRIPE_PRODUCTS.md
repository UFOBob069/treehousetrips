# Stripe Products Setup for Treehouse Trips

## Current Setup: Dynamic Pricing ✅

Your code currently creates prices dynamically for each checkout. This works great and requires **no Stripe Dashboard setup**!

```typescript
// Each checkout creates a new price with custom description
product_data: {
  name: 'Treehouse Trips Annual Listing Fee',
  description: `Annual listing fee for "${propertyTitle}"`,
  images: ['https://treehousetrips.com/logo.png'],
}
```

**Pros:**
- ✅ Custom description per property
- ✅ No manual setup required
- ✅ Flexible for future changes
- ✅ Already working!

## Alternative: Reusable Product (Optional)

If you want cleaner Stripe reporting and analytics, create a reusable product:

### Product Setup in Stripe Dashboard

1. **Go to**: Stripe Dashboard → Products → Add Product

2. **Product Information:**
   - **Name**: `Treehouse Trips Annual Listing Fee`
   - **Description**: `Annual listing fee for one treehouse property on Treehouse Trips platform`
   - **Statement Descriptor**: `TREEHOUSETRIPS` (shows on credit cards)
   - **Image**: Upload your logo (recommended size: 1024x1024px)

3. **Pricing:**
   - **Model**: Standard pricing
   - **Price**: `$50.00`
   - **Billing Period**: One-time
   - **Currency**: USD

4. **Save and Copy Price ID**: `price_xxxxxxxxxxxx`

### Update Code to Use Product

If you create a product, update your code:

```typescript
// Option 1: Use price ID directly (simpler)
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID, // 'price_xxxxxxxxxxxx'
      quantity: 1,
    },
  ],
  // ... rest of config
})

// Option 2: Keep dynamic with product reference
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product: process.env.STRIPE_PRODUCT_ID, // Reuse product
        unit_amount: 5000,
      },
      quantity: 1,
    },
  ],
  // ... rest of config
})
```

Add to `.env.local`:
```bash
STRIPE_PRODUCT_ID=prod_xxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxx
```

## Recommendation: Stick with Dynamic Pricing

For your use case (per-listing fees with custom descriptions), **keep your current implementation**. It's:
- ✅ Already working
- ✅ More flexible
- ✅ Better UX (shows property name in checkout)
- ✅ No additional setup needed

You can always switch to reusable products later if you need better reporting.

## Future Products (Optional)

### Premium Listing (Future Feature)
- **Name**: `Treehouse Trips Premium Listing`
- **Price**: `$99/year`
- **Benefits**: Featured placement, priority support

### Multi-Listing Discount (Future Feature)
- **Name**: `Treehouse Trips 3-Property Bundle`
- **Price**: `$120/year` (save $30)
- **Description**: Annual fee for 3 properties

### Featured Upgrade (Future Feature)
- **Name**: `Featured Listing Upgrade`
- **Price**: `$25/month`
- **Description**: Premium placement in search results

## Testing Products

### Test Mode Products
Create separate products for testing:
- Name: `[TEST] Treehouse Trips Listing Fee`
- Price: `$0.50` (easier for testing)

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Product Best Practices

1. **Use Clear Names**: Include "Treehouse Trips" in product names
2. **Add Images**: Upload a logo or product image
3. **Statement Descriptors**: Keep under 22 characters
4. **Test Mode First**: Test everything before going live
5. **Metadata**: Add metadata for tracking (propertyId, etc.)

## Current Status

✅ **You don't need to create any products right now!**

Your dynamic pricing implementation works perfectly for:
- Per-listing payments
- Custom property descriptions
- Flexible pricing
- Easy updates

Proceed with deployment and create products later if needed for analytics or multi-tier pricing.

