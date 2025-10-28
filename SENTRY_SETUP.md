# SENTRY MONITORING SETUP

## next-sqlite-starter

**Version:** 1.0
**Created:** 2025-10-28
**Status:** Ready for Development & Production

---

## OVERVIEW

Sentry is an error tracking and performance monitoring platform. This guide covers:

1. **Creating a Sentry project**
2. **Installing Sentry SDK in Next.js**
3. **Configuring error tracking**
4. **Setting up alerts**
5. **Testing error capture**

**Setup Time:** ~30 minutes for local development, ~1 hour for production

---

## PREREQUISITES

- Sentry account (free tier available at sentry.io)
- Next.js 14 project
- npm or pnpm

---

## STEP 1: CREATE SENTRY PROJECT

### 1.1 Sign Up at Sentry.io

1. Go to [sentry.io](https://sentry.io)
2. Click **Sign Up** (or log in if existing account)
3. Create account with GitHub (recommended) or email

### 1.2 Create Organization & Project

1. After login, click **Create Organization**
2. Name: `next-sqlite-starter` (or your project name)
3. Select **Next.js** as platform
4. Click **Create Project**

### 1.3 Copy DSN (Data Source Name)

1. You'll see a setup wizard with your DSN:
   ```
   https://examplePublicKey@o0.ingest.sentry.io/projectid
   ```
2. Copy this DSN (you'll need it soon)

---

## STEP 2: INSTALL SENTRY SDK

### 2.1 Install Packages

```bash
npm install @sentry/nextjs @sentry/profiling-node
```

### 2.2 Run Sentry Wizard (Automatic Setup - Recommended)

```bash
npx @sentry/wizard@latest -i nextjs
```

This wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Update `next.config.js`
- Create `.sentryclirc` (optional)

Follow prompts and paste your DSN when asked.

**If wizard doesn't work, do manual setup (below):**

### 2.3 Manual Setup (If Wizard Fails)

#### Create sentry.client.config.ts

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  // Performance monitoring
  tracesSampleRate: 1.0,
  // Set sample rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 0.1,
  // Set `tracePropagationTargets` to control what URLs distributed tracing should be enabled for
  tracePropagationTargets: ['localhost', /^\//],
  // ...
  // Note: if you want to override the automatic integration for performance monitoring,
  // we recommend `beforeSend` hook (see below)
})

// If you want to override the automatic instrumentation for performance monitoring,
// you can use the `beforeSend` hook to filter out transactions or fingerprint errors differently
Sentry.addEventProcessor((event, hint) => {
  // Filter out transaction if it matches certain criteria
  if (event.type === 'transaction') {
    // example filtering condition
    if (event.request?.url?.includes('/health')) {
      return null
    }
  }
  return event
})
```

#### Create sentry.server.config.ts

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  // Performance monitoring
  tracesSampleRate: 1.0,
  // Set sample rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 0.1,
  // ...
})
```

#### Update next.config.js

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // your Next.js config here
  swcMinify: true,
  // ... rest of config
}

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  // For organization-wide secret keys you in environment variable can be used, at it
  // adds too much bloat to the config file
  // authToken: process.env.SENTRY_AUTH_TOKEN,

  org: 'your-org-name',  // Replace with your Sentry org
  project: 'next-sqlite-starter',  // Replace with your project name
})
```

#### Wrap Root Layout

```typescript
// app/layout.tsx
import * as Sentry from '@sentry/nextjs'

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html>
    <body>
      {children}
      {/* This component may be omitted, but the the Sentry Feedback widget won't be visible */}
      <Sentry.Feedback />
    </body>
  </html>
)

export default Sentry.withProfiler(RootLayout)
```

---

## STEP 3: ADD ENVIRONMENT VARIABLES

### 3.1 Development (.env.local)

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/projectid
SENTRY_ORG=your-org-name
SENTRY_PROJECT=next-sqlite-starter
SENTRY_AUTH_TOKEN=your-auth-token  # (optional, for source map uploads)
```

### 3.2 Production (Vercel)

1. Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/projectid
   SENTRY_AUTH_TOKEN=your-auth-token  # (for production builds)
   ```

---

## STEP 4: TEST SENTRY

### 4.1 Capture Manual Error

Create test page:

```typescript
// app/test-sentry/page.tsx
'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'

export default function TestSentryPage() {
  const [error, setError] = useState<Error | null>(null)

  const testError = () => {
    try {
      throw new Error('Test error from Sentry')
    } catch (err) {
      if (err instanceof Error) {
        Sentry.captureException(err)
        setError(err)
      }
    }
  }

  const testMessage = () => {
    Sentry.captureMessage('Test message from Sentry', 'info')
    alert('Message sent to Sentry')
  }

  return (
    <div className="p-8 space-y-4">
      <h1>Sentry Test Page</h1>
      <p>Click buttons to send test events to Sentry</p>

      <Button onClick={testError} variant="destructive">
        Trigger Error
      </Button>

      <Button onClick={testMessage}>
        Send Message
      </Button>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <p>Error sent: {error.message}</p>
        </div>
      )}
    </div>
  )
}
```

### 4.2 Test Locally

```bash
npm run dev

# Visit http://localhost:3000/test-sentry
# Click buttons
# Check Sentry dashboard (should show events within 30 seconds)
```

### 4.3 Delete Test Page After Testing

```bash
rm -rf app/test-sentry
```

---

## STEP 5: CONFIGURE ALERTS

### 5.1 Email Alerts (Default)

Sentry sends email alerts automatically for:
- New issues
- Issue regressions
- Spike in error rate

To customize:

1. Sentry Dashboard → **Alerts**
2. Click **Create Alert Rule**
3. Configure conditions:
   - When: Error rate > 5%
   - For: 5 minutes
   - Action: Send email to team@example.com

### 5.2 Slack Integration (Recommended)

1. Sentry Dashboard → **Settings → Integrations**
2. Search for **Slack**
3. Click **Add to Slack**
4. Authorize Sentry in Slack workspace
5. Select channel (e.g., #alerts)

Now errors appear in Slack in real-time.

### 5.3 Custom Webhooks

For custom integrations:

1. **Settings → Integrations → Webhooks**
2. Add endpoint URL
3. Sentry will POST error data to your endpoint

Example webhook:
```typescript
// app/api/webhooks/sentry/route.ts
export async function POST(request: Request) {
  const data = await request.json()

  // Send notification (e.g., to Discord, custom service)
  console.log('Sentry webhook:', data)

  return Response.json({ ok: true })
}
```

---

## STEP 6: BEST PRACTICES

### 6.1 Capture User Context

```typescript
import * as Sentry from '@sentry/nextjs'
import { useAuth } from '@clerk/nextjs'

export function SetSentryUserContext() {
  const { userId } = useAuth()

  if (userId) {
    Sentry.setUser({
      id: userId,
      email: 'user@example.com',  // optional
    })
  }
}
```

Call this in your app layout or after user logs in.

### 6.2 Add Breadcrumbs

```typescript
import * as Sentry from '@sentry/nextjs'

// Track user actions
Sentry.captureMessage('User clicked upgrade button', 'info')

// Or add breadcrumb
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'Clicked upgrade button',
  level: 'info',
})
```

### 6.3 Enrich Error Context

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  await stripe.customers.create(...)
} catch (error) {
  Sentry.captureException(error, {
    contexts: {
      stripe: {
        customerId: customerId,
        action: 'create_customer',
      },
    },
    tags: {
      feature: 'stripe-integration',
    },
  })
}
```

### 6.4 Performance Monitoring

Automatically enabled with `tracesSampleRate`. To add custom transactions:

```typescript
import * as Sentry from '@sentry/nextjs'

export async function heavyOperation() {
  const transaction = Sentry.startTransaction({
    name: 'Heavy Operation',
    op: 'process',
  })

  try {
    // ... do work
  } catch (error) {
    transaction.setStatus('internal_error')
    throw error
  } finally {
    transaction.finish()
  }
}
```

---

## STEP 7: MONITORING DASHBOARD

### 7.1 Check Issues in Real-Time

1. Sentry Dashboard → **Issues**
2. See all errors grouped by type
3. Click issue to see:
   - Error message & stack trace
   - User context
   - Breadcrumbs (action history)
   - Affected releases

### 7.2 Set Up Dashboards

1. Sentry Dashboard → **Dashboards**
2. Create custom dashboard with widgets:
   - Error rate (last 24h)
   - Top errors by frequency
   - New issues
   - Affected users count

### 7.3 Release Tracking

Tag your releases for better error tracking:

```bash
# During deployment
sentry-cli releases create next-sqlite-starter@1.0.0
sentry-cli releases set-commits next-sqlite-starter@1.0.0 --auto
```

---

## PRODUCTION CHECKLIST

Before launching to production:

- [ ] Sentry DSN set in Vercel environment variables
- [ ] Email alerts configured
- [ ] Slack integration added
- [ ] Test error sent to Sentry
- [ ] User context set in Sentry
- [ ] Performance monitoring enabled
- [ ] Alerts threshold appropriate (not too sensitive)
- [ ] Team members have Sentry dashboard access
- [ ] Source maps configured (see below)

---

## SOURCE MAPS (OPTIONAL)

Source maps help you see your original code in Sentry (instead of minified code).

### Enable Source Map Upload

1. **Get Auth Token:**
   - Sentry Dashboard → Settings → Auth Tokens
   - Create new token with `project:releases` scope

2. **Add to Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `SENTRY_AUTH_TOKEN=your-token`

3. **Sentry CLI will automatically upload source maps during build**

---

## SAMPLE ERRORS TO TEST

### 1. Frontend Error

```typescript
const handleClick = () => {
  throw new Error('Test frontend error')
}
```

### 2. API Route Error

```typescript
// app/api/test/route.ts
export async function GET() {
  throw new Error('Test API error')
}
```

### 3. Unhandled Promise Rejection

```typescript
Promise.reject(new Error('Test unhandled rejection'))
```

---

## TROUBLESHOOTING

### Issue: Events not appearing in Sentry

**Solution:**
1. Verify DSN is correct (check .env vars)
2. Check browser console for errors
3. Verify network tab (Sentry API requests going through)
4. Wait 30+ seconds (may have delay)
5. Check Sentry dashboard is looking at correct project/org

### Issue: Source Maps Not Uploading

**Solution:**
1. Verify `SENTRY_AUTH_TOKEN` in env vars
2. Check build logs: `npm run build` output
3. Manually upload: `sentry-cli releases files upload-sourcemaps .next`

### Issue: Too Many Alerts

**Solution:**
1. Adjust alert thresholds (less sensitive)
2. Ignore known issues (Sentry → Issues → Ignore)
3. Create ignore rules for noise (e.g., bot errors)

---

## CLEANUP

### Ignore Non-Critical Errors

1. Sentry Dashboard → **Issues**
2. Click issue → **Ignore**
3. Optionally set expiration (1 day, 1 week, etc.)

### Resolve Resolved Issues

1. Click issue → **Resolve**
2. Will stop alerting until error recurs

### Delete Project (If Needed)

1. Sentry Dashboard → **Settings → Projects → Delete Project**
2. ⚠️ **Warning:** Cannot be undone

---

## NEXT STEPS

1. ✅ Create Sentry project
2. ✅ Install SDK
3. ✅ Add environment variables
4. ✅ Test error capture
5. ✅ Configure alerts
6. ✅ Deploy to production
7. ✅ Monitor dashboard for errors

---

**Document Version:** 1.0
**Owner:** DevOps / Backend Team
**Last Updated:** 2025-10-28
