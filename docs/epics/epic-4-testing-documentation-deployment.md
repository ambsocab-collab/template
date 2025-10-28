# EPIC 4: TESTING, DOCUMENTATION & DEPLOYMENT

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

## Story 4.1: Set Up Testing Infrastructure

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

## Story 4.2: Set Up E2E Testing (Playwright)

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

## Story 4.3: Create Comprehensive README

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

## Story 4.4: Create Troubleshooting Guide

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

## Story 4.5: Set Up CI/CD Pipeline

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

## Story 4.6: Deploy to Production (Vercel)

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
