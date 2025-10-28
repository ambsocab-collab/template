# **DEPLOYMENT ARCHITECTURE**

## **Frontend Deployment**

- **Platform:** Vercel
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node Version:** 18.x
- **CDN/Edge:** Vercel Edge Network (automatic)
- **Preview Deployments:** Automatic for every PR

## **Backend Deployment**

- **Platform:** Vercel Serverless Functions
- **Build Command:** Included in `next build`
- **Deployment:** Same package as frontend (monolithic)
- **Scaling:** Automatic, managed by Vercel
- **Cold starts:** Minimal for API routes

## **Database Deployment**

- **Development:** SQLite locally (dev.db)
- **Production:** SQLite on Vercel's persistent filesystem OR migrate to PostgreSQL
- **Backups:** Implement custom backup strategy (daily exports to S3)

## **Vercel Configuration**

**vercel.json:**

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "env": {
    "DATABASE_URL": "@next_sqlite_starter_database_url"
  },
  "env": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@next_sqlite_starter_clerk_pk",
    "CLERK_SECRET_KEY": "@next_sqlite_starter_clerk_sk",
    "STRIPE_SECRET_KEY": "@next_sqlite_starter_stripe_sk",
    "STRIPE_WEBHOOK_SECRET": "@next_sqlite_starter_stripe_webhook"
  }
}
```

## **CI/CD Pipeline**

**GitHub Actions (.github/workflows/ci.yaml):**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-and-lint:
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
    needs: test-and-lint
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## **Environments**

| Environment | Frontend URL | Backend URL | Database | Purpose |
|-------------|--------------|-------------|----------|---------|
| **Local Dev** | http://localhost:3000 | http://localhost:3000/api | SQLite (dev.db) | Local development |
| **Staging** | https://staging-next-sqlite.vercel.app | https://staging-next-sqlite.vercel.app/api | SQLite or PostgreSQL | Pre-release QA |
| **Production** | https://next-sqlite-starter.vercel.app | https://next-sqlite-starter.vercel.app/api | SQLite → PostgreSQL | Live |

---
