# **SECURITY & PERFORMANCE**

## **Frontend Security**

- **HTTPS:** Enforced on Vercel (all traffic encrypted)
- **CSP Headers:** Content Security Policy to prevent XSS
- **XSS Prevention:** React escapes output; sanitize user input
- **Cookie Security:** Clerk manages secure HTTP-only cookies
- **Secrets:** Never expose `STRIPE_SECRET_KEY` or `CLERK_SECRET_KEY` to client

## **Backend Security**

- **Input Validation:** Validate all request data with Zod or similar
- **Rate Limiting:** Vercel provides automatic rate limiting; add custom middleware for sensitive endpoints
- **CORS Policy:** Allow only your domain in production
- **Webhook Verification:** Always verify Stripe signature on webhooks
- **Authentication:** Clerk middleware protects all sensitive routes
- **SQL Injection:** Drizzle ORM prevents SQL injection via parameterized queries

## **Authentication Security**

- **Token Storage:** Clerk handles JWT tokens in HTTP-only cookies (automatic)
- **Session Management:** Clerk manages session refresh; auto-logout on expiration
- **Password Policy:** Clerk enforces strong passwords (email/password or OAuth)
- **MFA Ready:** Clerk supports multi-factor authentication (can be enabled)

## **Frontend Performance**

- **Bundle Size Target:** < 200KB minified JavaScript
- **Loading Strategy:** Next.js automatic code splitting by route
- **Image Optimization:** Use Next.js Image component
- **Caching:** ISR for dashboard, browser caching for static assets
- **First Contentful Paint (FCP):** Target < 1.5 seconds

## **Backend Performance**

- **Response Time Target:** < 200ms (p95) for API routes
- **Database Optimization:** Indexes on frequently queried columns
- **Caching Strategy:** Cache subscription data (1-hour TTL)
- **Stripe Rate Limiting:** Stripe API has rate limits; implement client-side queuing if needed

## **Database Security**

- **Encryption at Rest:** SQLite data on Vercel's filesystem (encrypted)
- **Encryption in Transit:** All API calls over HTTPS
- **Access Control:** Only backend API routes access database
- **Backup Strategy:** Regular exports to S3 (future)

---
