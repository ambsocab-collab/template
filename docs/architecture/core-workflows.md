# **CORE WORKFLOWS**

## **Workflow 1: New User Sign-Up → Dashboard**

```
1. User lands on Landing page (/)
2. Clicks "Get Started" button
3. Redirected to Clerk sign-up (/sign-up)
4. Clerk creates user account
5. Clerk creates session
6. Redirected to Dashboard (/(dashboard))
   - Middleware checks auth via Clerk
   - System creates User record in SQLite
   - Stripe creates customer record
   - System creates Subscription record (free plan)
7. User sees "Welcome, {firstName}!" and profile completion CTA
```

**Key Points:**
- Clerk handles auth
- Backend initializes user in database
- Subscription starts as "free"

---

## **Workflow 2: Profile Edit**

```
1. User navigates to /(dashboard)/profile
2. Profile form displays current data
3. User edits first/last name
4. User clicks "Save"
5. Frontend validates input
6. POST /api/user/profile with { firstName, lastName }
7. Backend validates and updates User record
8. Backend returns updated user
9. Frontend shows success toast
10. Form displays updated data
```

**Key Points:**
- Client-side validation before submit
- Server-side validation in API route
- Optimistic updates (optional enhancement)

---

## **Workflow 3: Free User → Pro Upgrade**

```
1. User clicks "Upgrade to Pro" (sidebar or dashboard CTA)
2. User navigated to /(dashboard)/settings/subscription
3. User reviews pricing table
4. User clicks "Choose Pro"
5. Frontend calls POST /api/subscription/checkout
6. Backend:
   a. Validates user is still on free plan
   b. Creates Stripe checkout session
   c. Stores metadata: { userId }
   d. Returns sessionId and checkoutUrl
7. Frontend redirects to Stripe Checkout (iframe/modal)
8. User enters payment details
9. Stripe processes payment
   a. If successful: checkout.session.completed event triggered
   b. If failed: user sees error; can retry
10. Stripe webhook → POST /api/webhook/stripe
11. Backend:
    a. Verifies Stripe signature
    b. Finds user by sessionId metadata
    c. Updates Subscription: status='active', plan='pro'
    d. Updates User: subscriptionStatus='pro'
    e. Sets currentPeriodStart/End from Stripe
12. Backend triggers email confirmation (future)
13. User auto-redirected to success page
14. Dashboard shows Pro badge
15. User can access premium features
```

**Key Points:**
- Stripe handles payment securely
- Webhook confirms payment server-side (async)
- Subscription status reliable via webhook, not client state
- Idempotent handler (same webhook can be retried safely)

---

## **Workflow 4: Delete Account**

```
1. User navigates to /(dashboard)/settings
2. User scrolls to "Danger Zone"
3. User clicks "Delete Account"
4. Modal appears with warning
5. Modal requires user to type email to confirm
6. User types email
7. User clicks "Confirm Deletion"
8. Frontend POST /api/user with { confirmEmail }
9. Backend:
   a. Verifies email matches user email
   b. Gets user's subscription
   c. Cancels Stripe subscription (if active)
   d. Deletes all user data (cascades)
   e. Logs out user (Clerk)
10. Frontend shows success message
11. Auto-redirect to landing page
```

**Key Points:**
- Multi-step confirmation prevents accidental deletion
- Stripe subscription canceled (idempotent)
- Database cascades delete user and subscriptions

---
