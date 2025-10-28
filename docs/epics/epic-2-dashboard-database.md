# EPIC 2: DASHBOARD & DATABASE

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

## Story 2.1: Initialize SQLite & Drizzle ORM

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

## Story 2.2: Create User Profile Initialization

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

## Story 2.3: Create Profile Page (View & Edit)

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

## Story 2.4: Create Settings Page

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

## Story 2.5: Implement Account Deletion

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
