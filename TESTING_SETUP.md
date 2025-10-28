# TESTING SETUP GUIDE

## next-sqlite-starter

**Version:** 1.0
**Created:** 2025-10-28
**Status:** Ready for Development

---

## OVERVIEW

This guide covers setting up three testing layers:

1. **Unit Tests** (Jest + React Testing Library) - 70% coverage
2. **Integration Tests** (Jest + Mocked APIs) - 20% coverage
3. **E2E Tests** (Playwright) - 10% coverage

**Total Setup Time:** ~2-3 hours

---

## PREREQUISITES

Ensure you have:
- Node.js 18+
- npm or pnpm
- Next.js 14+ project initialized
- Clerk & Stripe configured locally

---

## 1. UNIT TESTS (Jest + React Testing Library)

### Step 1: Install Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Step 2: Create jest.config.js

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!app/**/__tests__/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Step 3: Create jest.setup.js

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

### Step 4: Update package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Step 5: Create First Unit Test

Create a simple component test:

```typescript
// app/components/plan-badge.test.tsx
import { render, screen } from '@testing-library/react'
import { PlanBadge } from './plan-badge'

describe('PlanBadge', () => {
  it('renders "Free" for free plan', () => {
    render(<PlanBadge plan="free" />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders "Pro" for pro plan', () => {
    render(<PlanBadge plan="pro" />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('applies correct styling for pro plan', () => {
    render(<PlanBadge plan="pro" />)
    const badge = screen.getByText('Pro')
    expect(badge).toHaveClass('bg-indigo-600', 'text-white')
  })
})
```

### Step 6: Run Tests

```bash
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Unit Test Best Practices

**Test Naming Convention:**
```typescript
describe('ComponentName', () => {
  it('should [expected behavior]', () => {
    // test code
  })
})
```

**Example Tests to Create:**

1. **Button Component**
   - Renders button text
   - Calls onClick handler
   - Disables when disabled prop true

2. **Form Input**
   - Validates on blur
   - Shows error message
   - Updates value on change

3. **Plan Badge**
   - Shows "Free" with gray styling
   - Shows "Pro" with indigo styling

4. **Utils Functions**
   - Date formatting
   - Currency formatting
   - String utilities

---

## 2. INTEGRATION TESTS (Jest + API Mocking)

### Setup API Mocks

```typescript
// __mocks__/clerk.ts
export const auth = jest.fn().mockResolvedValue({
  userId: 'test-user-123',
  sessionId: 'test-session-123',
})

export const SignUp = jest.fn(() => <div>Sign Up Form</div>)
export const SignIn = jest.fn(() => <div>Sign In Form</div>)
```

### Example Integration Test

```typescript
// app/api/user/profile/__tests__/route.test.ts
import { GET, POST } from '../route'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

jest.mock('@clerk/nextjs/server')
jest.mock('@/lib/db')

describe('GET /api/user/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns user profile for authenticated user', async () => {
    const mockUserId = 'user-123'
    ;(auth as jest.Mock).mockResolvedValue({ userId: mockUserId })
    ;(db.query.users.findFirst as jest.Mock).mockResolvedValue({
      id: mockUserId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    })

    const response = await GET(
      new Request('http://localhost:3000/api/user/profile')
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.user.firstName).toBe('John')
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ userId: null })

    const response = await GET(
      new Request('http://localhost:3000/api/user/profile')
    )

    expect(response.status).toBe(401)
  })
})
```

### Integration Test Best Practices

- Mock external dependencies (Clerk, Stripe, Database)
- Test both success and failure paths
- Test validation and error handling
- Verify database interactions

---

## 3. E2E TESTS (Playwright)

### Step 1: Install Playwright

```bash
npm install --save-dev @playwright/test
```

### Step 2: Create playwright.config.ts

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Step 3: Update package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Step 4: Create First E2E Test

```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads landing page', async ({ page }) => {
    await page.goto('/')

    // Verify page title
    await expect(page).toHaveTitle(/next-sqlite-starter/)

    // Verify headline exists
    await expect(
      page.locator('h1:has-text("Build faster with next-sqlite-starter")')
    ).toBeVisible()

    // Verify CTA button exists
    const ctaButton = page.locator('button:has-text("Get Started")')
    await expect(ctaButton).toBeVisible()
  })

  test('navigates to sign-up on CTA click', async ({ page }) => {
    await page.goto('/')

    // Click Get Started button
    await page.click('button:has-text("Get Started")')

    // Should navigate to sign-up
    await page.waitForURL('**/sign-up')
    expect(page.url()).toContain('/sign-up')
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/')

    // Find dark mode toggle
    const toggle = page.locator('button[aria-label="Toggle dark mode"]')
    await expect(toggle).toBeVisible()

    // Click toggle
    await toggle.click()

    // Verify dark mode applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })
})
```

### Step 5: Run E2E Tests

```bash
# Run all tests
npm run test:e2e

# Run in UI mode (visual mode)
npm run test:e2e:ui

# Debug mode (step through)
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run with specific browser
npx playwright test --project=chromium
```

### Common E2E Test Scenarios

**Authentication Flow:**
```typescript
test('user can sign up and access dashboard', async ({ page }) => {
  // Navigate to landing
  await page.goto('/')
  await page.click('button:has-text("Get Started")')

  // Wait for Clerk form (may be iframe)
  await page.waitForURL('**/sign-up')

  // Fill form
  await page.fill('input[name="email_address"]', 'test@example.com')
  await page.fill('input[name="password"]', 'SecurePass123!')

  // Submit
  await page.click('button:has-text("Create account")')

  // Should redirect to dashboard
  await page.waitForURL('**/\\(dashboard\\)')
  await expect(page.locator('h1:has-text("Welcome")')).toBeVisible()
})
```

**Profile Editing:**
```typescript
test('user can edit profile', async ({ page, context }) => {
  // Must be logged in first
  // (In real tests, use shared auth state)

  // Navigate to profile
  await page.goto('/(dashboard)/profile')

  // Edit form
  await page.fill('input[name="firstName"]', 'Jane')
  await page.click('button:has-text("Save Profile")')

  // Verify success message
  await expect(page.locator('text=Profile updated')).toBeVisible()
})
```

**Payment Flow:**
```typescript
test('user can upgrade to pro', async ({ page }) => {
  // Navigate to subscription page
  await page.goto('/(dashboard)/settings/subscription')

  // Click "Choose Pro"
  await page.click('button:has-text("Choose Pro")')

  // Should redirect to Stripe (or show modal)
  // For test: use Stripe test card
  await page.fill('[placeholder="Card number"]', '4242424242424242')
  await page.fill('[placeholder="MM / YY"]', '12/25')
  await page.fill('[placeholder="CVC"]', '123')

  // Subscribe
  await page.click('button:has-text("Subscribe")')

  // Should show success
  await expect(page.locator('text=Welcome to Pro')).toBeVisible()
})
```

### E2E Test Best Practices

1. **Use selectors that won't break:**
   - Prefer `data-testid` over class names
   - Use accessible names: `button:has-text("...")`

2. **Handle async operations:**
   ```typescript
   // Wait for navigation
   await page.waitForURL('**/dashboard')

   // Wait for element to appear
   await expect(element).toBeVisible()

   // Wait for network idle
   await page.waitForLoadState('networkidle')
   ```

3. **Test real user flows:**
   - Don't test implementation details
   - Test what users actually do
   - Include error scenarios

4. **Keep tests isolated:**
   - Each test should set up its own data
   - Don't depend on test execution order

---

## TESTING PYRAMID

```
E2E Tests (10%)
├── Auth flows
├── Payment flows
└── Critical user journeys

Integration Tests (20%)
├── API route testing
├── Database interactions
└── External service mocking

Unit Tests (70%)
├── Components
├── Hooks
├── Utilities
└── Business logic
```

---

## CI/CD INTEGRATION

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yaml
name: Tests

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
      - run: npm run test -- --coverage
      - run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## COVERAGE GOALS

| Type | Target | How to Check |
|------|--------|-------------|
| Unit Tests | 80%+ | `npm run test:coverage` |
| Integration Tests | 60%+ | `npm run test:coverage` |
| E2E Tests | All critical flows | Manual review of test.spec.ts |
| Overall | 85%+ | Coverage report |

View coverage:
```bash
npm run test:coverage
open coverage/index.html  # or coverage/index.html
```

---

## DEBUGGING TESTS

### Debug Jest Tests

```bash
# Run single test file
npm test -- profile-form.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="button"

# Watch mode (auto-rerun on save)
npm run test:watch
```

### Debug E2E Tests

```bash
# UI mode (visual debugging)
npm run test:e2e:ui

# Debug mode (step through)
npm run test:e2e:debug

# Generate trace for failed test
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

## PERFORMANCE TIPS

1. **Run tests in parallel:**
   ```bash
   npm test -- --maxWorkers=4
   ```

2. **Skip slow tests during development:**
   ```typescript
   test.skip('slow integration test', () => {
     // ...
   })
   ```

3. **Cache dependencies:**
   - GitHub Actions uses `cache: npm`
   - Vercel caches node_modules automatically

---

## CHECKLIST FOR PRODUCTION

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Coverage > 85%
- [ ] No skipped tests (except approved ones)
- [ ] CI pipeline green on main branch
- [ ] E2E tests run in CI/CD

---

**Document Version:** 1.0
**Owner:** QA Team
**Last Updated:** 2025-10-28
