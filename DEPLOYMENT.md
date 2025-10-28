# DEPLOYMENT GUIDE

## next-sqlite-starter Deployment to Vercel

**Last Updated:** 2025-10-28
**Status:** Ready for First Deployment

---

## TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Initial Setup (First-Time Deployment)](#initial-setup-first-time-deployment)
3. [Environment Variables Configuration](#environment-variables-configuration)
4. [Vercel Project Creation](#vercel-project-creation)
5. [Deployment Pipeline](#deployment-pipeline)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Production Checklist](#production-checklist)

---

## PREREQUISITES

Before deploying, ensure you have:

- ✅ GitHub account with repository access
- ✅ Vercel account (free tier sufficient for MVP)
- ✅ Clerk account with production keys
- ✅ Stripe account with live/test keys
- ✅ All environment variables ready (see below)
- ✅ Application builds successfully locally (`npm run build`)

**Verification Command:**
```bash
npm run build
npm run type-check
npm run lint
# All should pass without errors
```

---

## INITIAL SETUP (FIRST-TIME DEPLOYMENT)

### Step 1: Push Repository to GitHub

If not already done:

```bash
# Initialize git (if new project)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: next-sqlite-starter MVP"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/next-sqlite-starter.git

# Push to main branch
git branch -M main
git push -u origin main
```

**Verify:** Visit `https://github.com/YOUR_USERNAME/next-sqlite-starter` and confirm files are present.

---

### Step 2: Create Vercel Project

**Option A: Using Vercel Dashboard (Recommended for first-time)**

1. Go to [vercel.com](https://vercel.com)
2. Sign in (or create account)
3. Click **"Add New..." → "Project"**
4. Select **GitHub** as source
5. Find your `next-sqlite-starter` repository
6. Click **Import**
7. Follow prompts (see Step 3 for environment variables)

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from project directory
cd next-sqlite-starter
vercel

# Follow interactive prompts
# Select: Vercel (default)
# Project name: next-sqlite-starter
# Root directory: ./ (default)
```

---

### Step 3: Add Environment Variables to Vercel

**Critical:** Do NOT commit `.env.local` to GitHub. Only `.env.example` should be in repo.

#### In Vercel Dashboard:

1. Go to your project: `vercel.com/dashboard`
2. Select **next-sqlite-starter** project
3. Go to **Settings → Environment Variables**
4. Add each variable as **Environment Variable** (not **System Environment Variable**)

#### Required Variables:

| Variable | Value | Example | Visibility |
|----------|-------|---------|-----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard | `pk_live_...` | Public OK |
| `CLERK_SECRET_KEY` | From Clerk dashboard | `sk_live_...` | Production only |
| `STRIPE_SECRET_KEY` | From Stripe dashboard | `sk_live_...` | Production only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard | `pk_live_...` | Public OK |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook config | `whsec_...` | Production only |
| `DATABASE_URL` | Database file location | `dev.db` or `prod.db` | Production only |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL | `https://next-sqlite-starter.vercel.app` | Production only |

**Setting Visibility:**

- **Public Prefix** (`NEXT_PUBLIC_*`): Visible in browser; only use for non-sensitive keys
- **Private Variables**: Invisible to browser; use for secrets

**Example Setup in Vercel:**

```
Name: CLERK_SECRET_KEY
Value: sk_live_abc123def456...
Environments: Production, Preview, Development (if desired)
```

---

### Step 4: Configure Database Persistence

**Important:** SQLite on Vercel requires special configuration for production.

#### Option A: Vercel KV (Recommended for MVP)

SQLite won't persist across Vercel deployments by default (ephemeral filesystem). For MVP, use Vercel KV instead:

1. In Vercel dashboard, go to **Storage → Create Database**
2. Select **KV (Redis)** or **Postgres** (if upgrading)
3. Add connection string to env vars as `DATABASE_URL`
4. Update `lib/db.ts` to use new connection

**OR**

#### Option B: Self-Hosted PostgreSQL

1. Create PostgreSQL database (e.g., on Railway, Render, or AWS RDS)
2. Add connection string: `DATABASE_URL=postgresql://user:pass@host:5432/db`
3. Update Drizzle config to use PostgreSQL driver
4. Run migrations: `npx drizzle-kit push:postgres`

**OR**

#### Option C: SQLite with S3 Backup (Not Recommended for MVP)

If staying with SQLite:
- Use `vercel-postgres` edge config + cron jobs for S3 backups
- Complex; recommend upgrading to PostgreSQL instead

**Recommendation for MVP:** Start with **Vercel KV** or **Postgres**, not SQLite.

---

### Step 5: Deploy

After environment variables are set:

1. **From GitHub:**
   - Push to `main` branch
   - Vercel auto-deploys (watch build logs in dashboard)

2. **From CLI:**
   ```bash
   vercel --prod
   ```

3. **From Vercel Dashboard:**
   - Go to project → **Deployments**
   - Click **Deploy** (redeploys latest commit)

---

## ENVIRONMENT VARIABLES CONFIGURATION

### Development (Local)

Create `.env.local` (NOT committed):

```bash
# Clerk (Get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Database
DATABASE_URL=dev.db

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)

Set in Vercel dashboard (DO NOT commit to `.env.local`):

```bash
# All LIVE keys (from test → live in each service)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# Database (KV/Postgres, not SQLite)
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=https://next-sqlite-starter.vercel.app
```

### Staging (Optional)

Create separate Vercel project `next-sqlite-starter-staging`:

```bash
# Same as production, but with TEST keys + staging DB
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://staging-next-sqlite.vercel.app
```

---

## VERCEL PROJECT CREATION

### vercel.json Configuration

Create `vercel.json` in project root (optional but recommended):

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "nodeVersion": "18.x",
  "env": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@next_sqlite_starter_clerk_pk",
    "CLERK_SECRET_KEY": "@next_sqlite_starter_clerk_sk",
    "STRIPE_SECRET_KEY": "@next_sqlite_starter_stripe_sk",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@next_sqlite_starter_stripe_pk",
    "STRIPE_WEBHOOK_SECRET": "@next_sqlite_starter_stripe_webhook",
    "DATABASE_URL": "@next_sqlite_starter_database_url",
    "NEXT_PUBLIC_APP_URL": "@next_sqlite_starter_app_url"
  }
}
```

**Note:** The `@variable_name` syntax references Vercel secrets (set via dashboard).

---

## DEPLOYMENT PIPELINE

### Automatic Deployments

**Production (main branch):**
```
git push origin main
  ↓
GitHub webhook triggers Vercel
  ↓
Vercel runs: npm ci → npm run build
  ↓
Tests run (from CI workflow)
  ↓
Deploy to production.vercel.app (if build succeeds)
```

**Preview (PR branch):**
```
Create GitHub PR on any branch
  ↓
Vercel auto-creates preview deployment
  ↓
Share preview URL in PR comments
  ↓
Review changes before merging
```

### Manual Deployments

If needed:

```bash
# Deploy current branch as preview
vercel

# Deploy to production
vercel --prod

# Deploy specific environment
vercel --env production
```

---

## POST-DEPLOYMENT VERIFICATION

### Immediate Checks (after deployment)

1. **Site loads without errors:**
   ```bash
   curl https://next-sqlite-starter.vercel.app
   # Should return HTML with status 200
   ```

2. **Landing page renders:**
   - Visit `https://next-sqlite-starter.vercel.app`
   - Should see landing page with "Get Started" button

3. **Clerk authentication works:**
   - Click "Get Started"
   - Should redirect to Clerk sign-up
   - Create test account
   - Should redirect to dashboard after signup

4. **API routes respond:**
   ```bash
   curl -H "Authorization: Bearer $CLERK_TOKEN" \
     https://next-sqlite-starter.vercel.app/api/user/profile
   # Should return user data (or 401 if not auth'd)
   ```

5. **Database connection works:**
   - Sign up new user
   - Check database (Vercel dashboard or Drizzle Studio)
   - Should see user record created

6. **Stripe integration ready:**
   - Navigate to Settings → Subscription
   - Should see "Upgrade to Pro" button
   - Click it (don't complete payment in test mode)
   - Should reach Stripe test checkout

### Verification Checklist

```
□ Site loads (200 status)
□ Landing page visible
□ Clerk sign-up works
□ Dashboard accessible after auth
□ User profile saved to database
□ Stripe checkout loads
□ No JavaScript errors in console
□ Dark mode toggle works
□ Mobile responsive (check on mobile device)
```

---

## MONITORING & ALERTS

### Set Up Error Tracking (Sentry)

1. **Create Sentry account** at [sentry.io](https://sentry.io)
2. **Create project** for next-sqlite-starter
3. **Add to environment variables:**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project-id
   ```
4. **Initialize in layout.tsx** (see Architecture doc)
5. **Test:** Trigger error in browser console
6. **Verify:** Error appears in Sentry dashboard within 30 seconds

### Vercel Analytics

Automatically enabled with Vercel deployment. View at:
- Dashboard → Project → **Analytics**
- Tracks: Core Web Vitals, traffic, errors

### Email Alerts (Optional)

In Vercel dashboard:
1. **Settings → Notifications**
2. Enable "Failed Deployments" email
3. Enable "New Error" alerts (if using Sentry)

---

## ROLLBACK PROCEDURES

### Rollback to Previous Deployment

**If latest deployment has critical bugs:**

#### Option 1: Revert Git Commit (Recommended)

```bash
# Find last good commit
git log --oneline
# e.g., abc1234 Fix: auth bug
#       def5678 Feature: new signup flow (BAD)

# Revert the bad commit
git revert def5678

# Push revert to main
git push origin main

# Vercel auto-deploys revert
```

#### Option 2: Deploy Previous Version (Vercel Dashboard)

1. Go to Vercel dashboard
2. **Deployments** tab
3. Find last successful deployment
4. Click **⋯ (menu) → Promote to Production**
5. Confirms and redeploys within 30 seconds

#### Option 3: Manual Rollback via CLI

```bash
# List recent deployments
vercel deployments

# Find deployment ID (e.g., dpl_abc123)
# Roll back to it
vercel promote dpl_abc123
```

### Rollback Checklist

After rolling back:

```
□ Verify previous version deployed (check Vercel dashboard)
□ Test critical flows (login, upgrade, profile edit)
□ Monitor Sentry for errors (should drop)
□ Notify team of rollback reason
□ Create GitHub issue for root cause analysis
□ Fix issue on develop branch
□ Redeploy with fix after testing
```

---

## TROUBLESHOOTING

### Build Fails on Vercel

**Error: "Build failed"**

1. **Check Vercel build logs:**
   - Dashboard → Deployments → Click failed deployment → Logs
2. **Common causes:**
   - Missing environment variables (error in `next build`)
   - TypeScript errors (strict mode enabled)
   - Dependency installation failed
   - Port 3000 already in use

**Solution:**
```bash
# Test build locally
npm run build
npm run type-check

# Check for missing env vars
grep -r "process.env\." app/
# Verify all referenced vars are in Vercel env vars
```

### Deployment Succeeds but Site 500 Errors

**Error: "Error 500" on https://next-sqlite-starter.vercel.app**

1. **Check Sentry:** Dashboard → Issues
2. **Check Vercel logs:** Dashboard → Functions (serverless logs)
3. **Common causes:**
   - Database connection string incorrect
   - Missing environment variable at runtime
   - Clerk webhook not configured
   - API route has uncaught error

**Solution:**
```bash
# Verify env vars exist in Vercel (not just local)
vercel env pull  # Downloads env vars

# Check logs in real-time
vercel logs --follow
```

### Database Connection Fails

**Error: "ENOENT: no such file or directory, open 'dev.db'"**

**Cause:** SQLite database file doesn't exist on Vercel (ephemeral filesystem).

**Solution:** Migrate to **Vercel KV** or **PostgreSQL** (see Step 4 above).

### Clerk Authentication Not Working

**Error: "Unauthorized" on dashboard routes**

1. **Check Clerk keys in Vercel:**
   ```bash
   vercel env pull
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   ```
2. **Verify keys match Clerk dashboard** (test vs. live)
3. **Check Clerk redirect URIs:**
   - Clerk dashboard → Applications → Allowed Redirect URLs
   - Add: `https://next-sqlite-starter.vercel.app`

### Stripe Webhook Not Firing

**Error: "Webhook endpoint not called after payment"**

1. **Check Stripe webhook endpoint:**
   - Stripe dashboard → Webhooks
   - Endpoint URL should be: `https://next-sqlite-starter.vercel.app/api/webhook/stripe`
2. **Verify webhook secret in Vercel:** `STRIPE_WEBHOOK_SECRET`
3. **Test webhook manually:**
   ```bash
   # Install Stripe CLI
   stripe listen --forward-to next-sqlite-starter.vercel.app/api/webhook/stripe

   # Trigger test payment
   stripe trigger payment_intent.succeeded
   ```

---

## PRODUCTION CHECKLIST

**Before considering MVP "released" in production:**

### Pre-Deployment (Dev)

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript checks pass (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] E2E tests pass on staging (`npm run test:e2e`)
- [ ] Bundle size < 200KB (check with `npm run analyze`)

### Environment Setup

- [ ] All required env vars defined in Vercel
- [ ] Clerk live keys (not test keys)
- [ ] Stripe live keys (not test keys)
- [ ] Database connection string configured
- [ ] Sentry project created and DSN added
- [ ] Database migrations run (`npx drizzle-kit push`)

### Security

- [ ] HTTPS enforced (automatic on Vercel)
- [ ] `.env.local` in `.gitignore` (never committed)
- [ ] Secrets not logged to console
- [ ] CORS headers configured (if needed)
- [ ] Rate limiting enabled on sensitive endpoints

### Monitoring

- [ ] Sentry connected and testing errors
- [ ] Vercel Analytics dashboard accessible
- [ ] Email alerts configured for deployments
- [ ] Uptime monitoring configured (e.g., Better Uptime)
- [ ] Database backups scheduled (if using managed DB)

### Testing

- [ ] Test sign-up flow (new user → dashboard)
- [ ] Test profile edit (edit name → saved)
- [ ] Test upgrade flow (free → pro, Stripe test payment)
- [ ] Test account deletion (delete account → logged out)
- [ ] Test on mobile device (responsive, touch works)
- [ ] Test error states (trigger 500 error, check Sentry)

### Documentation

- [ ] README has production setup instructions
- [ ] Runbook (this doc) reviewed with team
- [ ] Rollback procedure documented and tested
- [ ] Team knows how to access Sentry, Vercel, Clerk, Stripe dashboards

### Go-Live

- [ ] Team approval to launch
- [ ] Monitor Sentry for first hour post-deployment
- [ ] Be available for quick rollback if issues arise
- [ ] Post-launch: gather user feedback on setup time

---

## SUPPORT & ESCALATION

### Common Questions

**Q: How do I see server logs?**
```bash
vercel logs --follow  # Real-time logs
vercel logs           # Last 50 logs
```

**Q: How do I update environment variables?**
- Vercel dashboard → Settings → Environment Variables
- Changes apply to next deployment

**Q: How do I view database on production?**
- If Vercel KV: Use Vercel dashboard → Storage
- If Postgres: Use Drizzle Studio or DB client (e.g., pgAdmin)
- If SQLite: Not accessible on Vercel (use backup)

**Q: Can I test Stripe in production?**
- Yes! Use Stripe's test mode cards (e.g., `4242 4242 4242 4242`)
- Toggle in Stripe dashboard: **Viewing Test Data**

### Escalation Path

1. **Can't deploy:** Check Vercel build logs → GitHub actions CI status
2. **Site 500 errors:** Check Sentry → Vercel function logs
3. **Clerk/Stripe not working:** Check respective service dashboards + API key validity
4. **Database issues:** Check Vercel KV/Postgres dashboard + connection string
5. **Still stuck:** Check troubleshooting section above or create GitHub issue

---

**Document Version:** 1.0
**Next Review:** After first successful production deployment
**Owner:** DevOps / Infrastructure Team
