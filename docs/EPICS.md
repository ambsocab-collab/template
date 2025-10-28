# PROJECT EPICS & STORY BREAKDOWN

## next-sqlite-starter

**Version:** 1.0
**Created:** 2025-10-28
**Owner:** Product Owner (Sarah)
**Status:** Ready for Sprint Planning

---

## EXECUTIVE SUMMARY

This document breaks down the next-sqlite-starter MVP into 4 sequential epics and 18 user stories. Each epic builds on the previous, ensuring dependencies are resolved before implementation begins.

**Timeline:** ~1 week (7 days, ~40 hours)

```
Epic 1: Setup & Authentication      [Days 1-2]  (10 hours)
  ↓
Epic 2: Dashboard & Database        [Days 2-3]  (10 hours)
  ↓
Epic 3: Stripe & Payments           [Days 4-5]  (10 hours)
  ↓
Epic 4: Testing, Docs & Deploy      [Days 6-7]  (10 hours)
```

---

## EPIC 1: SETUP & AUTHENTICATION

**Duration:** 2 days (10 hours)
**Priority:** 🔴 CRITICAL (blocks all other epics)
**Acceptance Criteria:**
- [ ] Next.js project initializes and runs locally
- [ ] Clerk authentication fully integrated
- [ ] Auth middleware protects dashboard routes
- [ ] User can sign up, sign in, and log out
- [ ] No TypeScript errors

---

### Story 1.1: Initialize Next.js Project

**Acceptance Criteria:**
- [ ] `next create-app@latest` executed with App Router
- [ ] Tailwind CSS configured
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] `npm run dev` starts server on port 3000
- [ ] `npm run build` succeeds without errors
- [ ] `.gitignore` includes `.env.local`, `node_modules`, `.next`

**Subtasks:**
```
1. Run: npx create-next-app@latest next-sqlite-starter
   - Select: App Router (yes)
   - TypeScript (yes)
   - Tailwind (yes)
   - ESLint (yes)

2. Verify: npm run dev → http://localhost:3000 loads

3. Configure TypeScript:
   - Edit tsconfig.json: strict: true
   - Run: npm run type-check (should pass)

4. Configure ESLint + Prettier:
   - Create .eslintrc.json
   - Create .prettierrc.json
   - Add scripts to package.json

5. Create .github/workflows/ci.yaml for CI/CD
```

**Assigned to:** Lead Developer
**Estimated:** 2-3 hours
**Dependency:** None

---

### Story 1.2: Install Core Dependencies

**Acceptance Criteria:**
- [ ] All dependencies installed via `npm install`
- [ ] No peer dependency warnings
- [ ] `package.json` lock file committed

**Dependencies to Install:**
```bash
npm install @clerk/nextjs@latest clerk
npm install drizzle-orm better-sqlite3
npm install stripe
npm install shadcn-ui
npm install tailwindcss postcss autoprefixer
npm install zod  # for validation

npm install --save-dev @types/better-sqlite3
npm install --save-dev drizzle-kit
npm install --save-dev jest @testing-library/react
npm install --save-dev playwright
npm install --save-dev @playwright/test
```

**Subtasks:**
```
1. Run: npm install (all packages above)
2. Verify: npm list (no errors)
3. Check: npx next info (Next.js 14+ confirmed)
4. Commit: git add package-lock.json && git commit
```

**Assigned to:** Lead Developer
**Estimated:** 1-2 hours
**Dependency:** Story 1.1

---

### Story 1.3: Set Up Clerk Authentication

**Acceptance Criteria:**
- [ ] Clerk project created and keys generated
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`
- [ ] Clerk middleware in `middleware.ts` protects dashboard routes
- [ ] Sign-up page at `/sign-up` redirects to Clerk form
- [ ] Sign-in page at `/sign-in` redirects to Clerk form
- [ ] Logged-in user can access `/dashboard`
- [ ] Unauthenticated user redirected to sign-in
- [ ] User can log out (session ends)

**Subtasks:**
```
1. Create Clerk account at https://clerk.com
2. Create new application (next-sqlite-starter)
3. Copy keys to .env.local:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

4. Create app/middleware.ts:
   - Import clerkMiddleware from @clerk/nextjs/server
   - Define protected routes: /(dashboard)(.*)
   - Apply middleware to all requests

5. Create app/(auth)/sign-up/page.tsx:
   - Import SignUp from @clerk/nextjs
   - Export <SignUp />

6. Create app/(auth)/sign-in/page.tsx:
   - Import SignIn from @clerk/nextjs
   - Export <SignIn />

7. Create app/(dashboard)/page.tsx:
   - Fetch user via auth() from @clerk/nextjs/server
   - Return: <h1>Welcome, {user.firstName}!</h1>

8. Test flow:
   - Visit http://localhost:3000
   - Click "Get Started"
   - Sign up with test account
   - Should redirect to /dashboard
   - Verify: user.firstName displayed
```

**Assigned to:** Auth Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.2

---

### Story 1.4: Create Landing Page

**Acceptance Criteria:**
- [ ] Landing page at `/` (public)
- [ ] Shows value prop of app
- [ ] "Get Started" CTA button
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode toggle in navbar
- [ ] No authentication required to view

**Subtasks:**
```
1. Create app/page.tsx (landing page)
   - Import shadcn/ui Button, Card components
   - Create hero section with:
     - Headline: "Build faster with next-sqlite-starter"
     - Subheadline: "All you need for a modern SaaS in one template"
     - CTA Button: <Link href="/sign-up">Get Started</Link>

2. Create app/components/navbar.tsx:
   - Logo/brand name (left)
   - Dark mode toggle (right)
   - Conditionally show "Sign In" / "Dashboard" link based on auth

3. Create app/components/theme-toggle.tsx:
   - Sun/Moon icons
   - onClick: toggle dark/light mode
   - Store preference in localStorage

4. Create app/layout.tsx:
   - Include Clerk provider wrapper
   - Include navbar component
   - Apply theme provider (dark mode)

5. Design features section (3 cards):
   - "Pre-built Authentication"
   - "Database Ready"
   - "Stripe Integration"

6. Mobile responsive check:
   - Test on 375px width (iPhone SE)
   - Verify: text readable, buttons tappable (48px)
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.3

---

### Story 1.5: Create Layout & Navigation

**Acceptance Criteria:**
- [ ] Dashboard sidebar layout (desktop)
- [ ] Hamburger menu (mobile)
- [ ] Navigation items: Home, Profile, Settings
- [ ] User avatar dropdown in top navbar
- [ ] Logout option in dropdown
- [ ] Responsive (sidebar hidden on mobile, hamburger shows)
- [ ] No navigation items visible until authenticated

**Subtasks:**
```
1. Create app/(dashboard)/layout.tsx:
   - Split: sidebar (left) + main content (right)
   - Apply Clerk auth check: redirect unauthenticated

2. Create app/components/sidebar.tsx:
   - Navigation links (Home, Profile, Settings)
   - Active route indicator (bold, colored border)
   - Mobile: Hidden on screens < 768px

3. Create app/components/mobile-nav.tsx:
   - Hamburger icon (☰)
   - onClick: slide in sidebar from left
   - Click outside: close sidebar
   - Mobile-only (> 768px: hidden)

4. Create app/components/navbar.tsx (update):
   - Logo (left)
   - Page title or breadcrumb (center)
   - Dark mode toggle + User avatar (right)
   - Avatar: display user.imageUrl (from Clerk)

5. Create app/components/user-dropdown.tsx:
   - Avatar image (clickable)
   - Dropdown menu:
     - Profile
     - Settings
     - Logout
   - Logout: import { SignOutButton } from @clerk/nextjs

6. Responsive testing:
   - Desktop (1024px+): sidebar always visible
   - Tablet (768px-1023px): sidebar toggleable
   - Mobile (< 768px): hamburger only, sidebar overlay
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.4

---

## EPIC 2: DASHBOARD & DATABASE

**Duration:** 2 days (10 hours)
**Priority:** 🔴 CRITICAL
**Dependencies:** Epic 1 (all stories)

**Acceptance Criteria:**
- [ ] SQLite database initialized
- [ ] User table created with Drizzle schema
- [ ] Subscription table created
- [ ] Dashboard home page loads user data
- [ ] Profile edit page works
- [ ] Settings page accessible
- [ ] All forms save to database

---

### Story 2.1: Initialize SQLite & Drizzle ORM

**Acceptance Criteria:**
- [ ] `db/schema.ts` defines users, subscriptions, audit_logs tables
- [ ] `lib/db.ts` exports Drizzle client
- [ ] `npx drizzle-kit push:sqlite` succeeds
- [ ] `dev.db` file created locally
- [ ] Drizzle Studio accessible (`npx drizzle-kit studio`)

**Subtasks:**
```
1. Create drizzle.config.ts:
   import { defineConfig } from "drizzle-kit";
   export default defineConfig({
     dialect: "sqlite",
     schema: "./db/schema.ts",
     out: "./db/migrations",
     dbCredentials: {
       url: process.env.DATABASE_URL || "dev.db",
     },
   });

2. Create db/schema.ts:
   - users table: id, email, firstName, lastName, avatar, subscriptionStatus, createdAt, updatedAt
   - subscriptions table: id, userId, stripeCustomerId, stripeSubscriptionId, status, plan, etc.
   - audit_logs table (optional for v1): id, userId, action, details, createdAt

3. Create lib/db.ts:
   import { drizzle } from "drizzle-orm/better-sqlite3";
   import Database from "better-sqlite3";
   import * as schema from "@/db/schema";

   const sqlite = new Database(process.env.DATABASE_URL || "dev.db");
   export const db = drizzle(sqlite, { schema });

4. Create .env.local:
   DATABASE_URL=dev.db

5. Run migrations:
   npx drizzle-kit push:sqlite

6. Verify:
   ls dev.db  # file exists
   npx drizzle-kit studio  # opens UI
```

**Assigned to:** Backend Developer
**Estimated:** 1-2 hours
**Dependency:** Epic 1

---

### Story 2.2: Create User Profile Initialization

**Acceptance Criteria:**
- [ ] When new user signs up (Clerk), backend creates User record in DB
- [ ] User record includes email, firstName (required), lastName (required)
- [ ] User record linked to Clerk user ID
- [ ] Subscription record auto-created with status="free"
- [ ] Stripe customer created (empty ID stored initially)

**Subtasks:**
```
1. Create lib/actions/user.ts:
   async function initializeUser(clerkUserId: string, email: string) {
     return db.insert(users).values({
       id: clerkUserId,
       email,
       firstName: "First",
       lastName: "Last",
       subscriptionStatus: "free",
     });
   }

2. Create lib/actions/subscription.ts:
   async function initializeSubscription(userId: string) {
     return db.insert(subscriptions).values({
       userId,
       stripeCustomerId: "", // created later
       status: "free",
       plan: "free",
     });
   }

3. Create API route app/api/user/initialize/route.ts:
   - POST handler
   - Extract clerkUserId and email from request
   - Call initializeUser() + initializeSubscription()
   - Return 200 with user data

4. Create Clerk webhook at app/api/webhooks/clerk/route.ts:
   - Listen for user.created event
   - Extract clerkUserId, email
   - Call POST /api/user/initialize
   - Return 200

5. Set Clerk webhook URL:
   - Clerk Dashboard → Webhooks
   - Endpoint: https://localhost:3000/api/webhooks/clerk
   - Select: user.created event

6. Test:
   - Sign up new user at http://localhost:3000/sign-up
   - Check dev.db (Drizzle Studio):
     npx drizzle-kit studio
   - Verify: user row created with correct fields
```

**Assigned to:** Backend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 2.1

---

### Story 2.3: Create Profile Page (View & Edit)

**Acceptance Criteria:**
- [ ] Profile page at `/(dashboard)/profile`
- [ ] Displays user first name, last name, email (read-only)
- [ ] Form allows editing first & last name
- [ ] Save button submits to API
- [ ] Success toast shown on save
- [ ] Form validates (both first & last name required)
- [ ] Error toast shown on failure

**Subtasks:**
```
1. Create app/(dashboard)/profile/page.tsx (Server Component):
   - Fetch user via auth()
   - Query database for user record
   - Pass user data to <ProfileForm />

2. Create app/(dashboard)/profile/profile-form.tsx (Client Component):
   - 'use client'
   - useState for firstName, lastName
   - onChange handlers for inputs
   - Submit handler: POST /api/user/profile
   - Show loading state (disabled inputs, spinner on button)
   - Handle errors and success toasts

3. Create API route app/api/user/profile/route.ts:
   GET /api/user/profile:
     - Extract userId from auth()
     - Query users table
     - Return { user }

   POST /api/user/profile:
     - Extract userId from auth()
     - Validate firstName, lastName (not empty)
     - Update users table
     - Return { user }

4. Create form component:
   - shadcn/ui Input components
   - shadcn/ui Label components
   - shadcn/ui Button
   - Client-side validation before submit

5. Create toast notification:
   - Import { useToast } from @/hooks/use-toast
   - toast({ title: "Success", description: "Profile updated" })

6. Test flow:
   - Navigate to /(dashboard)/profile
   - Verify user data displays
   - Edit first name, click Save
   - Verify success toast
   - Refresh page (verify data persists)
   - Edit with empty field (verify error)
```

**Assigned to:** Full-Stack Developer
**Estimated:** 2-3 hours
**Dependency:** Story 2.1, 2.2

---

### Story 2.4: Create Settings Page

**Acceptance Criteria:**
- [ ] Settings page at `/(dashboard)/settings`
- [ ] Shows: Dark Mode toggle, Preferences section
- [ ] "Manage Subscription" link (links to billing page)
- [ ] "Delete Account" button (links to confirmation modal)
- [ ] Responsive design

**Subtasks:**
```
1. Create app/(dashboard)/settings/page.tsx:
   - Server component
   - Display settings structure

2. Create app/(dashboard)/settings/preferences.tsx:
   - Dark mode toggle
   - Future: notifications, language, etc.

3. Create app/(dashboard)/settings/billing-preview.tsx:
   - Current plan badge (Free / Pro)
   - "Manage Subscription" button/link
   - Links to /(dashboard)/settings/subscription

4. Create app/(dashboard)/settings/danger-zone.tsx:
   - Red background section
   - "Delete Account" button
   - Warning: "This action cannot be undone"
   - onClick: open DeleteAccountModal

5. Create modals/delete-account-modal.tsx:
   - Title: "Delete Account"
   - Warning message
   - Input field: "Confirm your email"
   - Confirm button (disabled until email matches)
   - Submit: POST /api/user/delete

6. Test:
   - Navigate to /(dashboard)/settings
   - Toggle dark mode (verify theme changes)
   - View billing section
   - View danger zone
   - Attempt delete with wrong email (button disabled)
   - Attempt delete with correct email (opens confirmation)
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 2.3

---

### Story 2.5: Implement Account Deletion

**Acceptance Criteria:**
- [ ] DELETE /api/user endpoint works
- [ ] Requires email confirmation
- [ ] Cascades delete: user → subscriptions → audit logs
- [ ] Cancels Stripe subscription (if active)
- [ ] Logs out user session (Clerk)
- [ ] Redirects to landing page

**Subtasks:**
```
1. Create API route app/api/user/route.ts:
   DELETE handler:
   - Extract userId from auth()
   - Extract confirmEmail from request body
   - Verify confirmEmail matches user.email
   - Query subscriptions for user
   - If stripeSubscriptionId exists:
     - Call stripe.subscriptions.cancel()
   - Delete all audit_logs for user
   - Delete subscription record
   - Delete user record
   - Return 200 { success: true }
   - Frontend handles Clerk logout via SignOutButton

2. Test flow:
   - Create test user account
   - Sign in
   - Navigate to Settings → Danger Zone
   - Click "Delete Account"
   - Type email
   - Click Confirm
   - Verify:
     - Modal shows loading state
     - User logged out (redirected to landing page)
     - Cannot log in with deleted account
     - Check database: user/subscription records deleted
```

**Assigned to:** Backend Developer
**Estimated:** 1-2 hours
**Dependency:** Story 2.4

---

## EPIC 3: STRIPE & PAYMENTS

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

### Story 3.1: Set Up Stripe SDK & Keys

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

### Story 3.2: Create Subscription Page & Pricing Table

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

### Story 3.3: Implement Checkout Flow (Stripe Checkout Session)

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

### Story 3.4: Set Up Stripe Webhook for Payment Confirmation

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

### Story 3.5: Display Subscription Status & Pro Badge

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

## EPIC 4: TESTING, DOCUMENTATION & DEPLOYMENT

**Duration:** 2 days (10 hours)
**Priority:** 🔴 CRITICAL
**Dependencies:** All previous epics

**Acceptance Criteria:**
- [ ] All tests passing (unit, integration, e2e)
- [ ] TypeScript checks pass
- [ ] ESLint passes
- [ ] Documentation complete
- [ ] README has setup instructions
- [ ] Deployed to Vercel successfully

---

### Story 4.1: Set Up Testing Infrastructure

**Acceptance Criteria:**
- [ ] Jest configured with Next.js
- [ ] React Testing Library installed
- [ ] First unit test passes
- [ ] Test scripts in package.json work
- [ ] Coverage reports generated

**Subtasks:**
```
1. Create jest.config.js:
   const nextJest = require('next/jest')
   const createJestConfig = nextJest({
     dir: './',
   })
   const customJestConfig = {
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     testEnvironment: 'jest-environment-jsdom',
   }
   module.exports = createJestConfig(customJestConfig)

2. Create jest.setup.js:
   import '@testing-library/jest-dom'

3. Install testing packages:
   npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

4. Update package.json scripts:
   "test": "jest",
   "test:watch": "jest --watch",
   "test:coverage": "jest --coverage"

5. Create first test:
   tests/unit/components/plan-badge.test.tsx
   - Test: renders "Free" for free plan
   - Test: renders "Pro" for pro plan with correct styling

6. Run: npm test
   Verify: test passes
```

**Assigned to:** Backend/QA Developer
**Estimated:** 1-2 hours
**Dependency:** Epic 1

---

### Story 4.2: Set Up E2E Testing (Playwright)

**Acceptance Criteria:**
- [ ] Playwright configured
- [ ] First E2E test (signup flow) passes
- [ ] Test scripts in package.json work
- [ ] CI runs E2E tests

**Subtasks:**
```
1. Create playwright.config.ts:
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     fullyParallel: true,
     use: {
       baseURL: 'http://localhost:3000',
     },
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   });

2. Create tests/e2e/auth.spec.ts:
   test('new user can sign up', async ({ page }) => {
     await page.goto('/');
     await page.click('button:has-text("Get Started")');
     await page.waitForURL('**/sign-up');
     // Fill form, submit, verify redirect
   });

3. Update package.json:
   "test:e2e": "playwright test"

4. Run: npm run test:e2e
   Verify: tests pass locally
```

**Assigned to:** QA Developer
**Estimated:** 1-2 hours
**Dependency:** Epic 3

---

### Story 4.3: Create Comprehensive README

**Acceptance Criteria:**
- [ ] Setup instructions complete
- [ ] Environment variables documented
- [ ] Development commands listed
- [ ] Deployment section included
- [ ] Troubleshooting section included
- [ ] License included

**Subtasks:**
```
1. Update README.md with sections:
   - What is next-sqlite-starter?
   - Features
   - Tech Stack
   - Getting Started (5 steps)
   - Environment Variables
   - Development Commands
   - Testing
   - Deployment (link to DEPLOYMENT.md)
   - Troubleshooting
   - Contributing
   - License

2. Create DEVELOPMENT.md:
   - Local development setup
   - Database setup (Drizzle Studio)
   - Running tests
   - Debugging tips

3. Create CONTRIBUTING.md:
   - How to contribute
   - Code style guidelines
   - PR process
```

**Assigned to:** Documentation Lead
**Estimated:** 1-2 hours
**Dependency:** Epic 1

---

### Story 4.4: Create Troubleshooting Guide

**Acceptance Criteria:**
- [ ] Common errors documented
- [ ] Solutions provided
- [ ] References to docs
- [ ] Examples included

**Subtasks:**
```
1. Create TROUBLESHOOTING.md with sections:
   - Setup Issues (SQLite, dependencies)
   - Authentication Issues (Clerk keys, middleware)
   - Database Issues (migrations, queries)
   - Stripe Issues (webhook testing, keys)
   - Deployment Issues (Vercel build, env vars)
```

**Assigned to:** Backend Developer
**Estimated:** 1-2 hours
**Dependency:** Epic 3

---

### Story 4.5: Set Up CI/CD Pipeline

**Acceptance Criteria:**
- [ ] GitHub Actions workflow created
- [ ] Tests run on PR
- [ ] Build succeeds on main
- [ ] Auto-deploy to Vercel on main merge
- [ ] Workflow shows status badge in README

**Subtasks:**
```
1. Create .github/workflows/ci.yaml:
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: 'npm'
         - run: npm ci
         - run: npm run lint
         - run: npm run type-check
         - run: npm run test
         - run: npm run build

     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - uses: vercel/action@main
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

2. Add Vercel secrets to GitHub:
   - Settings → Secrets and variables → Actions
   - Add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

3. Test: Push to branch, PR created
   Verify: GitHub Actions runs tests
```

**Assigned to:** DevOps/Backend Developer
**Estimated:** 1-2 hours
**Dependency:** Epic 3

---

### Story 4.6: Deploy to Production (Vercel)

**Acceptance Criteria:**
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] First successful deployment
- [ ] Production monitoring (Sentry) configured
- [ ] Rollback procedure tested
- [ ] All acceptance criteria from PRD met

**Subtasks:**
```
1. Follow DEPLOYMENT.md:
   - Create Vercel project
   - Add environment variables
   - Configure database (KV or Postgres)
   - Configure Stripe webhook for production
   - Configure Clerk for production

2. Set up Sentry:
   - Create account at sentry.io
   - Create project
   - Add DSN to env vars
   - Initialize in app/layout.tsx

3. Test production flows:
   - Sign up new user
   - Edit profile
   - Upgrade to Pro (test mode card)
   - Delete account

4. Verify monitoring:
   - Sentry dashboard shows errors (if any)
   - Vercel Analytics dashboard accessible
   - Uptime monitoring shows 200 responses

5. Final Acceptance Criteria (from PRD):
   □ App runs locally (npm run dev)
   □ Clerk auth works
   □ Dashboard protected by auth
   □ Stripe webhook receives and updates DB
   □ Dark mode toggle works
   □ Mobile responsive
   □ README clear
   □ .env.example complete
   □ Vercel deploy works
   □ TypeScript no errors
```

**Assigned to:** DevOps/Backend Developer
**Estimated:** 2-3 hours
**Dependency:** All previous stories

---

## DEPENDENCY GRAPH

```
Epic 1: Setup & Auth
├── Story 1.1: Initialize Next.js
├── Story 1.2: Install Dependencies
├── Story 1.3: Clerk Auth
├── Story 1.4: Landing Page
└── Story 1.5: Navigation Layout
    ↓
Epic 2: Dashboard & Database
├── Story 2.1: SQLite & Drizzle
├── Story 2.2: User Initialization
├── Story 2.3: Profile Page
├── Story 2.4: Settings Page
└── Story 2.5: Delete Account
    ↓
Epic 3: Stripe & Payments
├── Story 3.1: Stripe SDK
├── Story 3.2: Pricing Page
├── Story 3.3: Checkout Flow
├── Story 3.4: Webhook Handler
└── Story 3.5: Subscription Badge
    ↓
Epic 4: Testing & Deployment
├── Story 4.1: Jest Setup
├── Story 4.2: Playwright E2E
├── Story 4.3: README
├── Story 4.4: Troubleshooting
├── Story 4.5: CI/CD
└── Story 4.6: Vercel Deploy
```

---

## TEAM ALLOCATION & TIMELINE

### Recommended Team Composition

- **Backend Developer**: Stories 2.1, 2.2, 2.5, 3.1, 3.4, 4.4, 4.6
- **Frontend Developer**: Stories 1.4, 1.5, 2.3, 3.2, 3.5
- **Full-Stack Developer**: Stories 2.4, 3.3, 2.3
- **Lead Developer**: Story 1.1, 1.2, 1.3, 1.5
- **QA/Testing**: Stories 4.1, 4.2
- **DevOps**: Stories 4.5, 4.6
- **Documentation**: Story 4.3, 4.4

### Weekly Timeline

**Week 1:**
- **Days 1-2 (Tue-Wed):** Epic 1 (Setup & Auth)
- **Days 2-3 (Wed-Thu):** Epic 2 (Dashboard & DB)
- **Days 4-5 (Fri-Mon):** Epic 3 (Payments)
- **Days 6-7 (Mon-Tue):** Epic 4 (Testing & Deploy)

### Hour Breakdown

```
Epic 1: 10 hours
  1.1: 2-3h → 1.2: 1-2h → 1.3: 2-3h → 1.4: 2-3h → 1.5: 2-3h

Epic 2: 10 hours
  2.1: 1-2h → 2.2: 2-3h → 2.3: 2-3h → 2.4: 2-3h → 2.5: 1-2h

Epic 3: 10 hours
  3.1: 0.5h → 3.2: 2-3h → 3.3: 2-3h → 3.4: 2-3h → 3.5: 1-2h

Epic 4: 10 hours
  4.1: 1-2h → 4.2: 1-2h → 4.3: 1-2h → 4.4: 1-2h → 4.5: 1-2h → 4.6: 2-3h

Total: ~40 hours
```

---

## SUCCESS CRITERIA FOR PROJECT

- ✅ All 18 stories completed
- ✅ All tests passing
- ✅ Zero TypeScript errors
- ✅ Deployed to Vercel
- ✅ Monitoring (Sentry) configured
- ✅ Documentation complete
- ✅ Team comfortable with codebase
- ✅ Ready for user feedback collection

---

**Document Version:** 1.0
**Created:** 2025-10-28
**Owner:** Product Owner (Sarah)
**Next Review:** After Story 1.5 completion (Day 2)
