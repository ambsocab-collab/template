# **MONITORING & OBSERVABILITY**

## **Frontend Monitoring**

- **Tool:** Sentry (error tracking)
- **Metrics:** Core Web Vitals (LCP, FID, CLS)
- **Analytics:** Vercel Analytics (automatic with Vercel deployment)
- **What to Track:**
  - JavaScript errors
  - API call failures
  - User session duration
  - Page load times

**Setup:**

```typescript
// app/layout.tsx
import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}
```

## **Backend Monitoring**

- **Tool:** Vercel's built-in logging + Sentry
- **Metrics:**
  - API request rate
  - Error rate (5xx responses)
  - Response time (p50, p95, p99)
  - Database query performance

**Logging:**

```typescript
// Log important events
console.log(`[${new Date().toISOString()}] User signed up: ${userId}`);
console.error(`[${new Date().toISOString()}] Stripe webhook failed: ${error}`);
```

## **Key Metrics to Monitor**

| Metric | Target | Tool |
|--------|--------|------|
| **Uptime** | 99.9% | Vercel dashboard |
| **API Response Time (p95)** | < 200ms | Vercel Analytics |
| **Database Query Time (p95)** | < 50ms | Drizzle logs + monitoring |
| **Error Rate** | < 0.1% | Sentry |
| **Core Web Vitals (LCP)** | < 2.5s | Vercel Analytics |
| **Stripe Webhook Success** | 100% (with retries) | Stripe dashboard |

---
