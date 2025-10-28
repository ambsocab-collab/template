# TROUBLESHOOTING GUIDE

## next-sqlite-starter

**Last Updated:** 2025-10-28
**Status:** MVP Edition

---

## QUICK HELP

**Something broken?**

1. Read the relevant section below
2. Check the solution steps
3. Still stuck? Check GitHub Issues
4. Create a new issue with your error message

---

## TABLE OF CONTENTS

1. [Setup & Installation Issues](#setup--installation-issues)
2. [Development & Runtime Issues](#development--runtime-issues)
3. [Authentication (Clerk) Issues](#authentication-clerk-issues)
4. [Database & Drizzle Issues](#database--drizzle-issues)
5. [Stripe Payment Issues](#stripe-payment-issues)
6. [Deployment & Vercel Issues](#deployment--vercel-issues)
7. [Performance & Optimization](#performance--optimization)
8. [Testing Issues](#testing-issues)

---

## SETUP & INSTALLATION ISSUES

### ❌ `npm install` fails with peer dependency errors

**Symptoms:**
```
npm ERR! found 0 vulnerabilities, but 17 packages have unmet peer dependencies
npm WARN ... requires a peer of react@^18 but none is installed
```

**Solution:**
```bash
# Try with --legacy-peer-deps flag
npm install --legacy-peer-deps

# OR use npm 9+
npm install  # npm 9 handles peer deps better

# OR try with pnpm (more reliable)
npm install -g pnpm
pnpm install
```

**Root Cause:** Package version conflicts (especially with shadcn/ui components)

---

### ❌ `node_modules` issues or corrupted installation

**Symptoms:**
```
Error: Cannot find module '@clerk/nextjs'
Module not found: Can't resolve '@/components/ui/button'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# On Windows:
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

**Prevention:** Don't manually edit `node_modules`; always use `npm install` to add/update packages.

---

### ❌ `.env.local` not being read

**Symptoms:**
```
Clerk: PublishableKey is not set.
Stripe: Missing STRIPE_SECRET_KEY environment variable
```

**Solution:**

1. **Verify file exists:**
   ```bash
   ls .env.local  # Should exist in project root
   ```

2. **Check format:** Must be in project **root**, not in subdirectory
   ```
   ✅ /next-sqlite-starter/.env.local
   ❌ /next-sqlite-starter/app/.env.local  (wrong location)
   ```

3. **Copy from example:**
   ```bash
   cp .env.example .env.local
   # Fill in your actual keys
   ```

4. **Restart dev server** after adding env vars:
   ```bash
   npm run dev
   # (sometimes Next.js doesn't reload env vars)
   ```

5. **Verify keys are correct:**
   - Check Clerk dashboard for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Check Stripe dashboard for `STRIPE_SECRET_KEY`
   - Ensure test mode vs. live mode (should be test in local dev)

---

### ❌ Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE :::3000
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux

# Or on Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Run dev server on different port
npm run dev -- -p 3001
```

**Prevention:** Use `npm run dev` which typically kills old processes automatically.

---

## DEVELOPMENT & RUNTIME ISSUES

### ❌ `npm run dev` starts but site won't load

**Symptoms:**
```
Server running at http://localhost:3000
But visiting localhost:3000 shows blank page or "Cannot GET /"
```

**Solution:**

1. **Check terminal for errors:**
   - Look for red error messages in terminal
   - Check for TypeScript compilation errors

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check if page files exist:**
   ```bash
   ls app/page.tsx  # Landing page
   ls app/layout.tsx  # Root layout
   ```

4. **Check browser console:**
   - Open DevTools (F12) → Console tab
   - Look for JavaScript errors (red text)

---

### ❌ TypeScript errors prevent build

**Symptoms:**
```
Type 'string' is not assignable to type 'never'
Property 'email' does not exist on type 'User'
```

**Solution:**

1. **Run type check:**
   ```bash
   npm run type-check
   ```

2. **Fix errors shown in output:**
   - Go to file and line number
   - Import missing types or fix type mismatch
   - Reference `lib/types.ts` for shared types

3. **Rebuild:**
   ```bash
   npm run build
   ```

**Common Fixes:**
- Ensure `User` type is imported from `lib/types.ts`
- Check database schema matches TypeScript types
- Verify API response types match frontend expectations

---

### ❌ Dark mode not persisting

**Symptoms:**
```
Dark mode toggle works, but reloading page resets to light mode
```

**Solution:**

Check `app/components/theme-toggle.tsx`:

```typescript
// Should save to localStorage
localStorage.setItem('theme', isDark ? 'dark' : 'light');

// And read on mount:
useEffect(() => {
  const saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved);
}, []);
```

---

## AUTHENTICATION (CLERK) ISSUES

### ❌ Clerk sign-up form doesn't appear

**Symptoms:**
```
Navigate to /sign-up, see blank page or just navbar
Clerk form not loading
```

**Solution:**

1. **Check Clerk keys in .env.local:**
   ```bash
   # Must start with pk_test_
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Verify Clerk provider in layout.tsx:**
   ```typescript
   import { ClerkProvider } from '@clerk/nextjs';

   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         {children}
       </ClerkProvider>
     );
   }
   ```

3. **Check SignUp component path:**
   ```typescript
   // app/(auth)/sign-up/page.tsx
   import { SignUp } from '@clerk/nextjs';

   export default function SignUpPage() {
     return <SignUp />;  // Not <SignUp path="/sign-up" />
   }
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

### ❌ "Unauthorized" on protected routes

**Symptoms:**
```
Can't access /dashboard
Error: Unauthorized (401)
```

**Solution:**

1. **Verify you're signed in:**
   - Check Clerk user button (top navbar)
   - If not logged in, go to /sign-up first

2. **Check middleware.ts:**
   ```typescript
   import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

   const isProtectedRoute = createRouteMatcher([
     '/(dashboard)(.*)',
     '/api/user(.*)',
     '/api/subscription(.*)',
   ]);

   export default clerkMiddleware((auth, req) => {
     if (isProtectedRoute(req)) {
       auth().protect();
     }
   });
   ```

3. **Check route exists:**
   ```bash
   ls app/\(dashboard\)/page.tsx  # (with parentheses)
   ```

---

### ❌ "Invalid API key" from Clerk

**Symptoms:**
```
Error: Invalid API Key
Secret key did not work
```

**Solution:**

1. **Check you're using test keys (not live):**
   - Dashboard should show "Test Mode" toggle (on)
   - Keys should start with `pk_test_` and `sk_test_`

2. **Regenerate keys if corrupted:**
   - Clerk Dashboard → API Keys → Regenerate
   - Copy new keys to .env.local
   - Restart dev server

3. **Verify key format:**
   - No extra spaces or quotes
   - `CLERK_SECRET_KEY=sk_test_...` (not `'sk_test_...'`)

---

### ❌ Auth token not persisting across page reloads

**Symptoms:**
```
Can see user info on one page
Refresh page → "not logged in"
```

**Solution:**

1. **Check Clerk session configuration:**
   - Clerk dashboard → Settings → Sessions
   - Default is 1 week; adjust if needed

2. **Check browser cookies:**
   - DevTools → Application → Cookies
   - Should see `__clerk_db_jwt` cookie
   - Should not be "session" type (should be persistent)

3. **Check for CORS issues** (if on production):
   - Verify domain is allowlisted in Clerk dashboard
   - Check browser console for CORS errors

---

## DATABASE & DRIZZLE ISSUES

### ❌ `dev.db` file not created

**Symptoms:**
```
ENOENT: no such file or directory, open 'dev.db'
```

**Solution:**

1. **Run migrations:**
   ```bash
   npx drizzle-kit push:sqlite
   ```
   This creates `dev.db` and sets up tables

2. **Verify DATABASE_URL:**
   ```bash
   echo $DATABASE_URL  # Should be "dev.db"
   ```

3. **Check directory permissions:**
   ```bash
   # Ensure project directory is writable
   chmod -R u+w .
   ```

---

### ❌ "Cannot find module 'better-sqlite3'"

**Symptoms:**
```
Error: Cannot find module 'better-sqlite3'
```

**Solution:**

1. **Reinstall binary dependency:**
   ```bash
   npm install better-sqlite3 --build-from-source
   ```

2. **On Windows, ensure Python is installed:**
   - `python --version` (should be 3.x)
   - Install from python.org if missing

3. **On macOS, ensure Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   npm install better-sqlite3
   ```

---

### ❌ Drizzle migrations fail

**Symptoms:**
```
Error: SQLITE_ERROR: table "users" already exists
```

**Solution:**

1. **Check current database state:**
   ```bash
   npx drizzle-kit studio  # Opens Drizzle UI
   # Verify tables exist
   ```

2. **If tables exist but schema mismatches:**
   ```bash
   # Option A: Reset database (dev only!)
   npx drizzle-kit drop
   npx drizzle-kit push:sqlite

   # Option B: Create manual migration
   npx drizzle-kit generate:sqlite
   # Manually edit migration file
   npx drizzle-kit migrate:sqlite
   ```

3. **Verify schema.ts matches database:**
   - Check table names in schema match database
   - Check column types match

---

### ❌ User data not saving to database

**Symptoms:**
```
Sign up new user
Refresh page → no user record
```

**Solution:**

1. **Check if user creation API is called:**
   - Add `console.log` in POST /api/user/initialize
   - Check browser network tab (DevTools → Network)
   - Verify POST request to `/api/webhooks/clerk` succeeds

2. **Check Clerk webhook configuration:**
   - Clerk Dashboard → Webhooks
   - Endpoint should be: `http://localhost:3000/api/webhooks/clerk`
   - Events: `user.created`

3. **Verify database insertion:**
   ```bash
   npx drizzle-kit studio
   # Navigate to "users" table
   # Should see new user record
   ```

4. **Check for errors:**
   - `npm run dev` terminal: look for error logs
   - Browser console (DevTools → Console)
   - Check API route return value

---

### ❌ "Incorrect number of parameters" in Drizzle query

**Symptoms:**
```
Error: Incorrect number of parameters
```

**Solution:**

1. **Check query syntax:**
   ```typescript
   // ✅ Correct
   const user = await db.query.users.findFirst({
     where: eq(users.id, userId),
   });

   // ❌ Wrong - missing eq()
   const user = await db.query.users.findFirst({
     where: { id: userId },
   });
   ```

2. **Always use comparison operators:**
   ```typescript
   import { eq, and, or } from 'drizzle-orm';

   // Equals
   eq(users.id, userId)

   // And/Or
   and(eq(users.id, userId), eq(users.email, email))
   ```

---

## STRIPE PAYMENT ISSUES

### ❌ Stripe keys not loading

**Symptoms:**
```
Stripe: PublishableKey is not set
Stripe is not defined
```

**Solution:**

1. **Check env vars:**
   ```bash
   # .env.local must have:
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Verify keys are test mode (not live):**
   - Stripe Dashboard: Check "Viewing test data" toggle
   - Keys should start with `sk_test_` and `pk_test_`

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

### ❌ Stripe checkout not opening

**Symptoms:**
```
Click "Choose Pro" button
Nothing happens or page redirects to blank page
```

**Solution:**

1. **Check API response:**
   - DevTools → Network tab
   - Click "Choose Pro"
   - Find POST request to `/api/subscription/checkout`
   - Response should be: `{ sessionId, checkoutUrl }`

2. **If request fails (red status code):**
   - Check Stripe keys again (see above)
   - Check API route exists: `app/api/subscription/checkout/route.ts`
   - Check for errors in `npm run dev` terminal

3. **If checkoutUrl is blank:**
   ```typescript
   // In app/api/subscription/checkout/route.ts
   // Make sure returning correct data:
   return Response.json({
     sessionId: session.id,
     checkoutUrl: session.url,  // Must not be null
   });
   ```

4. **Redirect to checkout:**
   ```typescript
   // In checkout-button.tsx
   window.location.href = response.checkoutUrl;
   ```

---

### ❌ Stripe webhook not firing

**Symptoms:**
```
Complete payment in Stripe Checkout
Success page shows
But subscription.status stays "free" (not updated)
```

**Solution:**

1. **Test webhook locally with Stripe CLI:**
   ```bash
   # Install Stripe CLI
   npm install -g stripe

   # Login
   stripe login

   # Listen for webhooks
   stripe listen --forward-to http://localhost:3000/api/webhook/stripe

   # (Copy webhook secret from output)
   # Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...

   # In another terminal, trigger test event
   stripe trigger checkout.session.completed
   ```

2. **Verify webhook endpoint URL:**
   - Stripe Dashboard → Webhooks
   - Endpoint should be: `http://localhost:3000/api/webhook/stripe`
   - (Or your production URL when deployed)

3. **Check webhook secret:**
   ```bash
   # In .env.local
   STRIPE_WEBHOOK_SECRET=whsec_test_...
   # (Must match what Stripe shows)
   ```

4. **Verify webhook handler is processing:**
   - Add `console.log` in webhook handler
   - Watch `npm run dev` terminal
   - Trigger test event, should see logs

5. **Check event type handling:**
   ```typescript
   switch (event.type) {
     case 'checkout.session.completed':
       console.log('Payment received!');
       // ... update DB
   }
   ```

---

### ❌ "Card declined" error

**Symptoms:**
```
In Stripe Checkout:
"Your card was declined. Please try another payment method."
```

**Solution:**

1. **Verify you're in test mode:**
   - Stripe Dashboard: "Viewing test data" toggle should be ON
   - Cards: Use `4242 4242 4242 4242` (test card)

2. **Test card format:**
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ```

3. **If still declined:**
   - Try different test card: `5555 5555 5555 4444`
   - Check Stripe dashboard for rate limiting
   - Check browser console for JavaScript errors

---

### ❌ Webhook signature verification fails

**Symptoms:**
```
Error: No signatures found matching the expected signature for payload
```

**Solution:**

1. **Verify webhook secret matches:**
   ```typescript
   const sig = request.headers.get('stripe-signature');
   const event = stripe.webhooks.constructEvent(
     body,
     sig,
     process.env.STRIPE_WEBHOOK_SECRET!  // Must match exactly
   );
   ```

2. **Check secret format:**
   - Should start with `whsec_`
   - Should match what Stripe dashboard shows
   - Ensure no extra spaces

3. **Re-copy secret from Stripe:**
   - Stripe Dashboard → Webhooks → Endpoint
   - Copy secret (click "Reveal" if hidden)
   - Update .env.local
   - Restart dev server

---

## DEPLOYMENT & VERCEL ISSUES

### ❌ "Build failed" on Vercel

**Symptoms:**
```
Vercel dashboard shows red ✗ Build Failed
Build log shows TypeScript or dependency errors
```

**Solution:**

1. **Check build log in Vercel:**
   - Dashboard → Deployments → Failed deployment → Logs
   - Find first error (usually at top)

2. **Common causes:**
   ```
   A) Missing environment variable
   B) TypeScript error
   C) Failed dependency install
   D) Port 3000 in use
   ```

3. **Fix locally first:**
   ```bash
   npm run build
   npm run type-check
   npm run lint
   # All should succeed locally
   ```

4. **If env var missing:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add missing variable
   - Redeploy

---

### ❌ "Error 500" after deploying to Vercel

**Symptoms:**
```
https://next-sqlite-starter.vercel.app loads blank page
Or shows: "Error 500"
```

**Solution:**

1. **Check Vercel function logs:**
   - Vercel Dashboard → Project → Functions (serverless logs)
   - Look for error messages

2. **Check Sentry** (if configured):
   - sentry.io dashboard
   - Recent issues should show error details

3. **Common causes:**
   - Database connection string incorrect
   - Missing environment variable at runtime
   - Clerk keys are test mode (not production)
   - API route has uncaught error

4. **Test locally against Vercel env:**
   ```bash
   vercel env pull  # Downloads env vars
   npm run build
   npm run start  # Simulate production
   ```

---

### ❌ Clerk/Stripe webhooks not working on Vercel

**Symptoms:**
```
Locally: everything works
Vercel: webhooks never fire
```

**Solution:**

1. **Update webhook URLs in services:**
   - Clerk Dashboard → Webhooks:
     Endpoint: `https://next-sqlite-starter.vercel.app/api/webhooks/clerk`
   - Stripe Dashboard → Webhooks:
     Endpoint: `https://next-sqlite-starter.vercel.app/api/webhook/stripe`

2. **Use production keys (not test):**
   - Clerk: `pk_live_...` and `sk_live_...`
   - Stripe: `sk_live_...` and `pk_live_...`
   - (Not `pk_test_` in production)

3. **Test webhook manually:**
   ```bash
   # Clerk webhook test
   curl -X POST https://next-sqlite-starter.vercel.app/api/webhooks/clerk \
     -H "Content-Type: application/json" \
     -d '{"type":"user.created",...}'

   # Stripe webhook test
   stripe trigger --account sk_live_... checkout.session.completed
   ```

---

### ❌ SQLite database doesn't persist on Vercel

**Symptoms:**
```
Locally: user data saves to dev.db
Vercel: user signs up, but data disappears on next deploy
```

**Root Cause:** Vercel's filesystem is ephemeral (doesn't persist across deployments)

**Solution:** Migrate to PostgreSQL or Vercel KV

1. **Use Vercel KV (easiest):**
   - Vercel Dashboard → Storage → Create Database → KV
   - Add connection string to env vars
   - Update Drizzle to use KV driver

2. **Use Postgres (recommended):**
   - Create DB on Render.com or Railway.app
   - Add connection string: `postgresql://user:pass@host:5432/db`
   - Update Drizzle config to use postgres driver
   - Run migrations

3. **See DEPLOYMENT.md** for detailed setup

---

## PERFORMANCE & OPTIMIZATION

### ❌ Site loads slowly

**Symptoms:**
```
First Contentful Paint (FCP) > 3 seconds
Lighthouse score < 70
```

**Solution:**

1. **Check bundle size:**
   ```bash
   npm run analyze  # (if configured)
   # Or use: npx next-bundle-analyzer
   ```

2. **Optimize images:**
   ```typescript
   // ✅ Use Next.js Image component
   import Image from 'next/image';
   <Image src={src} alt="desc" width={100} height={100} />

   // ❌ Don't use <img>
   <img src={src} />
   ```

3. **Code-split components:**
   ```typescript
   // Lazy load heavy components
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./Heavy'));
   ```

4. **Enable caching:**
   - Use ISR (Incremental Static Regeneration) for dashboard

---

## TESTING ISSUES

### ❌ Jest tests fail with "Cannot find module"

**Symptoms:**
```
Cannot find module '@/components/...'
```

**Solution:**

1. **Check jest.config.js:**
   ```javascript
   module.exports = {
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1',
     },
   };
   ```

2. **Verify paths in tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

---

### ❌ E2E tests fail with "Timeout"

**Symptoms:**
```
Test timeout exceeded
Page didn't load in time
```

**Solution:**

1. **Increase timeout in playwright.config.ts:**
   ```typescript
   export default defineConfig({
     timeout: 30000,  // 30 seconds
     expect: {
       timeout: 5000,
     },
   });
   ```

2. **Check if dev server is running:**
   ```bash
   npm run dev  # Must be running for E2E tests
   ```

3. **Add debug logs:**
   ```typescript
   test('...', async ({ page }) => {
     await page.goto('/');
     console.log('Page loaded');
     // ... rest of test
   });

   // Run with: npx playwright test --debug
   ```

---

## STILL STUCK?

1. **Check existing GitHub Issues:**
   - Search for your error message
   - May already have solution documented

2. **Create GitHub Issue with:**
   - Exact error message
   - Steps to reproduce
   - Environment (OS, Node version, npm version)
   - Output of `npm run type-check` and `npm run build`

3. **Check Documentation:**
   - DEVELOPMENT.md
   - DEPLOYMENT.md
   - Architecture.md
   - PRD.md

4. **Ask for Help:**
   - Check Discord/Community channels
   - Tag with `help wanted` label

---

**Last Updated:** 2025-10-28
**Contributed by:** Development Team
