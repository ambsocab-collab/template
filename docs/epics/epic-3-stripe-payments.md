# EPIC 3: STRIPE & PAYMENTS

**Duration:** 2 days (10 hours)
**Priority:** 🔴 CRITICAL
**Dependencies:** Epic 1 & Epic 2 (all stories)

**Acceptance Criteria:**
- [ ] Stripe account created (test mode)
- [ ] "Upgrade to Pro" button on dashboard
- [ ] Stripe checkout flow works
- [ ] Webhook confirms payment
- [ ] Subscription status updated in DB
- [ ] User can view current plan and upgrade

---

## Story 3.1: Set Up Stripe SDK & Keys

**Acceptance Criteria:**
- [ ] Stripe account created at stripe.com
- [ ] Test mode keys in `.env.local`
- [ ] `lib/stripe.ts` exports Stripe client (server-side)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` accessible on frontend
- [ ] No errors when importing Stripe

**Subtasks:**
```
1. Create Stripe account at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy test mode keys:
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
4. Add to .env.local:
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_test_... (will get later)

5. Create lib/stripe.ts:
   import Stripe from 'stripe';
   export const stripe = new Stripe(
     process.env.STRIPE_SECRET_KEY!
   );

6. Test imports:
   - Import { stripe } from @/lib/stripe
   - console.log(stripe) (verify no errors)
```

**Assigned to:** Backend Developer
**Estimated:** 30 mins
**Dependency:** Epic 2

---

## Story 3.2: Create Subscription Page & Pricing Table

**Acceptance Criteria:**
- [ ] Subscription page at `/(dashboard)/settings/subscription`
- [ ] Displays current plan (Free / Pro badge)
- [ ] Pricing table showing Free vs Pro features
- [ ] "Choose Pro" button (calls checkout API)
- [ ] "Already Pro?" message for pro users
- [ ] Responsive design

**Subtasks:**
```
1. Create app/(dashboard)/settings/subscription/page.tsx:
   - Server component
   - Fetch user's current subscription from DB
   - Pass to <PricingTable /> component

2. Create app/(dashboard)/settings/subscription/pricing-table.tsx:
   - Display Free plan: current, not upgradeable
   - Display Pro plan: $9/month, "Choose Pro" button
   - Feature comparison table:
     - Basic features (both plans)
     - Pro-only features

3. Create app/(dashboard)/settings/subscription/checkout-button.tsx:
   - 'use client'
   - onClick: POST /api/subscription/checkout
   - Show loading spinner while processing
   - Redirect to Stripe Checkout URL

4. Design pricing table with shadcn/ui:
   - Use Card components
   - Use Button for CTA
   - Use Badge for "Free" / "Pro" labels

5. Test:
   - Navigate to /(dashboard)/settings/subscription
   - Verify current plan displays
   - Verify pricing table visible
   - (Don't click Checkout yet; will test in 3.3)
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 3.1

---

## Story 3.3: Implement Checkout Flow (Stripe Checkout Session)

**Acceptance Criteria:**
- [ ] POST /api/subscription/checkout creates Stripe session
- [ ] Returns sessionId and checkoutUrl
- [ ] Frontend redirects to Stripe Checkout
- [ ] User can enter payment details (test card: 4242 4242 4242 4242)
- [ ] Successful payment returns session.completed event

**Subtasks:**
```
1. Create lib/stripe-customer.ts:
   async function getOrCreateStripeCustomer(userId: string, email: string) {
     const subscription = await db.query.subscriptions.findFirst({
       where: eq(subscriptions.userId, userId)
     });

     if (subscription?.stripeCustomerId) {
       return subscription.stripeCustomerId;
     }

     const customer = await stripe.customers.create({ email });

     await db.update(subscriptions)
       .set({ stripeCustomerId: customer.id })
       .where(eq(subscriptions.userId, userId));

     return customer.id;
   }

2. Create API route app/api/subscription/checkout/route.ts:
   POST handler:
   - Extract userId from auth()
   - Validate plan = "pro"
   - Get or create Stripe customer
   - Create Stripe checkout session:
     stripe.checkout.sessions.create({
       customer: customerId,
       line_items: [{
         price: process.env.STRIPE_PRICE_PRO_MONTHLY,
         quantity: 1
       }],
       mode: 'subscription',
       metadata: { userId },
       success_url: `${appUrl}/(dashboard)/checkout/success`,
       cancel_url: `${appUrl}/(dashboard)/settings/subscription`,
     })
   - Return { sessionId, checkoutUrl }

3. Create success page app/(dashboard)/checkout/success/page.tsx:
   - Display: "Welcome to Pro! 🎉"
   - Show: "Setting up your account..."
   - Auto-redirect to dashboard after 3 seconds
   - Allow manual redirect with button

4. Test Checkout:
   - Click "Choose Pro" on pricing page
   - Redirected to Stripe Checkout
   - Fill in test card: 4242 4242 4242 4242
   - Expiry: any future date
   - CVC: any 3 digits
   - Click "Subscribe"
   - Should show success page

5. Note: Webhook not yet configured, so DB won't update yet (will do in 3.4)
```

**Assigned to:** Full-Stack Developer
**Estimated:** 2-3 hours
**Dependency:** Story 3.2

---

## Story 3.4: Set Up Stripe Webhook for Payment Confirmation

**Acceptance Criteria:**
- [ ] Webhook endpoint at `/api/webhook/stripe`
- [ ] Receives Stripe events
- [ ] Verifies Stripe signature
- [ ] Updates subscription status on checkout.session.completed
- [ ] Updates subscription status on customer.subscription.deleted
- [ ] Idempotent (safe to retry)

**Subtasks:**
```
1. Create API route app/api/webhook/stripe/route.ts:
   POST handler:
   - Get request body as text
   - Get stripe-signature header
   - Call stripe.webhooks.constructEvent(body, sig, webhook_secret)
   - Handle event types:
     - checkout.session.completed:
       a. Extract sessionId and metadata.userId
       b. Get Stripe subscription details
       c. Update DB: subscriptions.set({
            status: 'active',
            plan: 'pro',
            stripeSubscriptionId: session.subscription,
            currentPeriodStart: new Date(session.created * 1000)
          })
       d. Update DB: users.set({ subscriptionStatus: 'pro' })
     - customer.subscription.deleted:
       a. Find subscription by stripeSubscriptionId
       b. Update: status: 'canceled', plan: 'free'
     - customer.subscription.updated (handle past_due):
       a. If status === 'past_due':
          Update: status: 'past_due'
   - Return 200 { received: true }
   - Catch errors: log but still return 200 (prevent retry flood)

2. Create STRIPE_WEBHOOK_SECRET in Vercel:
   - Stripe Dashboard → Webhooks
   - Create new endpoint:
     Endpoint URL: https://next-sqlite-starter.vercel.app/api/webhook/stripe
     Events: customer.subscription.created, checkout.session.completed, customer.subscription.deleted, customer.subscription.updated
   - Copy signing secret: whsec_...
   - Add to .env.local

3. Test Webhook Locally (using Stripe CLI):
   npm install -g stripe
   stripe login
   stripe listen --forward-to http://localhost:3000/api/webhook/stripe
   (Copy signing secret from CLI output)

   In another terminal:
   stripe trigger payment_intent.succeeded

   Verify: Webhook received in first terminal

4. Test Full Flow:
   - Upgrade to Pro (complete payment)
   - Wait for webhook to fire (~2 seconds)
   - Check DB (Drizzle Studio): subscription.status should be "active"
   - Dashboard should show "Pro" badge
```

**Assigned to:** Backend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 3.3

---

## Story 3.5: Display Subscription Status & Pro Badge

**Acceptance Criteria:**
- [ ] Dashboard shows current plan badge (Free / Pro)
- [ ] Profile page shows plan badge
- [ ] Settings page shows current plan
- [ ] Pro users see "Manage Subscription" instead of "Upgrade"
- [ ] Badge styling: Free = gray, Pro = indigo

**Subtasks:**
```
1. Create app/components/plan-badge.tsx:
   - Accepts plan prop ('free' | 'pro')
   - Free: <Badge variant="secondary">Free</Badge>
   - Pro: <Badge variant="default">Pro</Badge>

2. Update app/(dashboard)/page.tsx:
   - Fetch user's subscription.plan
   - Display <PlanBadge plan={subscription.plan} />

3. Update app/(dashboard)/profile/page.tsx:
   - Display plan badge on profile

4. Update app/(dashboard)/settings/subscription/page.tsx:
   - If plan === 'pro':
     - Hide "Choose Pro" button
     - Show "Current Plan: Pro"
     - Show billing period end date
     - Show "Cancel Subscription" button (optional for v1)
   - If plan === 'free':
     - Show "Upgrade to Pro" button

5. Update sidebar navigation:
   - If plan === 'free': show "Upgrade" link
   - If plan === 'pro': show "Manage Subscription" link

6. Test:
   - Free user: see "Free" badge everywhere, "Upgrade" link in sidebar
   - Upgrade user (via Story 3.4)
   - Refresh: see "Pro" badge, "Manage Subscription" link
```

**Assigned to:** Frontend Developer
**Estimated:** 1-2 hours
**Dependency:** Story 3.4

---
