# Billing Setup Guide

## ✅ Implementation Complete!

The Clerk + Stripe billing system has been successfully implemented. Here's what you need to do next:

## 🔧 Required Setup Steps

### 1. Environment Variables

Add these to your `.env` file (already added with your Stripe keys):

```env
# Stripe Keys (you already have these)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SZBDQGwSq867TfUakTJJXDNRGz5XIageZfQx9DbLZM1gOPaiM2w7xZdMfaSVnA4LV8ewclWsn49E4bIqXhp7RlY00Ex0dAGzq
STRIPE_SECRET_KEY=sk_test_51SZBDQGwSq867TfUoUfxxMYzQsgBKvNEy0ZbJJc6KEU9e9Pd8nKqNtYafpCG2Pvn8EW7LbBJb1aapa6wIi6UhIzs00Fo86PZgi

# Stripe Pro Plan Price ID (REQUIRED - Get this from Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx

# Stripe Webhook Secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Stripe Price ID

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** → Create or select your Pro plan product
3. Create a **Price** for $9.99/month (recurring)
4. Copy the **Price ID** (starts with `price_`)
5. Add it to `.env` as `STRIPE_PRO_PRICE_ID`

### 3. Database Migration

Run the database migration to add subscription fields:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

This will add the following fields to the `users` table:
- `subscriptionStatus` (free, trial, pro)
- `subscriptionPlan` (basic, pro)
- `subscriptionEndDate` (for trial tracking)
- `stripeCustomerId`
- `stripeSubscriptionId`

### 4. Set Up Stripe Webhook (For Production)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/subscription/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to `.env` as `STRIPE_WEBHOOK_SECRET`

### 5. Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the flow:
   - Sign up a new user (should get 30-day trial automatically)
   - Go to `/workspace/billing` to see subscription status
   - Try creating 11 courses (should block at 10)
   - Try creating 11 interviews (should block at 10)
   - Click "Upgrade to Pro" to test Stripe checkout

## 📋 Features Implemented

✅ **Subscription Management**
- Basic Plan: 10 courses, 10 interviews, 30-day trial
- Pro Plan: Unlimited courses and interviews, $9.99/month
- Automatic trial initialization for new users

✅ **Feature Gating**
- Course creation limit enforcement
- Interview creation limit enforcement
- Upgrade prompts when limits reached

✅ **Billing Page**
- Beautiful UI with animations
- Plan comparison
- Usage statistics
- Upgrade/downgrade functionality

✅ **Subscription Status Display**
- Badge in workspace header
- Badge in dashboard header
- Trial countdown display

✅ **API Routes**
- `/api/subscription/check` - Check subscription status
- `/api/subscription/create` - Create Stripe checkout session
- `/api/subscription/cancel` - Cancel subscription
- `/api/subscription/webhook` - Handle Stripe webhooks

✅ **Database Integration**
- Subscription status tracking
- Trial period management
- Stripe customer/subscription ID storage

## 🎯 Next Steps

1. **Get your Stripe Price ID** and add it to `.env.local`
2. **Run database migrations** to update schema
3. **Test the billing flow** with test cards from Stripe
4. **Set up webhooks** for production deployment

## 🧪 Testing with Stripe Test Cards

Use these test card numbers in Stripe checkout:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any CVC

## 📝 Important Notes

- New users automatically get a 30-day trial
- Trial users have Basic plan limits (10 courses, 10 interviews)
- Pro plan users have unlimited access
- Subscription status is checked before creating courses/interviews
- Webhooks update subscription status automatically

## 🐛 Troubleshooting

**Issue**: "Stripe Price ID not configured"
- **Solution**: Add `STRIPE_PRO_PRICE_ID` to `.env`

**Issue**: Webhook not working
- **Solution**: Make sure `STRIPE_WEBHOOK_SECRET` is set and endpoint URL is correct

**Issue**: Subscription status not updating
- **Solution**: Check webhook events in Stripe Dashboard and verify webhook secret

## 🎉 You're All Set!

Once you've completed the setup steps above, your billing system will be fully functional!

