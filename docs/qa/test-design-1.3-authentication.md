# Test Design: Story 1.3 - Clerk Authentication

**Story:** 1.3 Setup Clerk Authentication
**Test Architecture Date:** 2025-10-29
**Designed By:** Quinn (Test Architect)
**Test Framework Recommendations:** Playwright (E2E), Jest (Unit/Integration), Mock Service Worker (Integration)

---

## Executive Summary

This document provides **actionable test scenarios** for comprehensive coverage of Clerk authentication implementation. Includes:
- ✅ 4 critical E2E test scenarios
- ✅ 8 unit test scenarios for components
- ✅ 6 integration test scenarios for middleware/layout
- ✅ 5 error/negative path test scenarios
- ✅ Implementation guidance and estimated effort

**Total Test Coverage:** 23 test scenarios
**Estimated Implementation Effort:** 12-14 hours
**Priority:** CRITICAL for production readiness

---

## Test Strategy Overview

### Coverage Goals
| Aspect | Target | Current | Gap |
|--------|--------|---------|-----|
| Happy Path (E2E) | 100% | 0% (manual only) | 4 scenarios |
| Error Paths | 80% | 0% | 5 scenarios |
| Component Units | 90% | 0% | 8 scenarios |
| Integration | 85% | 0% | 6 scenarios |
| **Overall** | **90%** | **~5%** | **23 scenarios** |

### Test Pyramid Strategy
```
        /\           Error Scenarios (5)
       /  \
      /----\         Integration Tests (6)
     /      \
    /--------\       Unit Tests (8)
   /          \
  /____________\     E2E Tests (4 critical paths)
```

---

## 1. END-TO-END (E2E) TEST SCENARIOS

### Test Framework: Playwright
**Why Playwright:** Next.js native support, excellent for testing real browser behavior, handles async/redirects well

#### Installation
```bash
npm install -D @playwright/test @clerk/testing
```

#### Configuration File: `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
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
  ],
});
```

---

### E2E Scenario 1: New User Signup Flow
**Acceptance Criteria:** AC #1, #2, #4, #5, #6
**Risk Level:** CRITICAL
**Priority:** P0 (Block deployment without this)

#### Test Case 1.1: Complete Signup → Dashboard Access
**Objective:** Verify new user can sign up and access dashboard
**Preconditions:**
- App is running locally
- Clerk test environment configured
- Database is clean (no test user)

**Test Steps:**
1. Navigate to `/sign-up`
2. Verify Sign-Up form is displayed
3. Fill in: email (test_newuser_TIMESTAMP@example.com), password, name
4. Submit form
5. Verify redirect to `/dashboard`
6. Verify welcome message displays
7. Verify "Sign Out" button is visible
8. Verify user info section shows "authenticated"

**Expected Outcomes:**
- ✅ `/sign-up` page loads without errors
- ✅ Clerk form renders (input fields visible)
- ✅ Form submission succeeds
- ✅ Redirects to `/dashboard` (URL changes)
- ✅ Dashboard welcome message visible
- ✅ No console errors

**Playwright Code:**
```typescript
// e2e/auth-signup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('User can complete signup and access dashboard', async ({ page }) => {
    // Navigate to signup
    await page.goto('/sign-up');

    // Verify form is displayed
    await expect(page.locator('text=Sign up')).toBeVisible();

    // Fill form (Clerk form selector may vary)
    const timestamp = Date.now();
    const testEmail = `test_${timestamp}@example.com`;

    await page.fill('input[name="email_address"]', testEmail);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'User');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Verify dashboard content
    await expect(page.locator('text=Welcome to Your Dashboard')).toBeVisible();
    await expect(page.locator('text=successfully authenticated')).toBeVisible();
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });
});
```

**Test Data:**
- Email: `test_signup_${timestamp}@example.com` (unique per run)
- Password: `TestPassword123!` (Clerk requirement: 8+ chars, mixed case, numbers)
- Name: "Test User"

**Cleanup:**
- Delete test user from Clerk dashboard after test (or use Clerk test account)
- Alternative: Use Clerk test API to cleanup

**Estimated Effort:** 2 hours (including Playwright setup)

---

#### Test Case 1.2: Signup Form Validation
**Objective:** Verify form validation works (negative path)
**Preconditions:** Same as 1.1

**Test Steps:**
1. Navigate to `/sign-up`
2. Leave email field empty, try submit → Verify error message
3. Enter weak password (< 8 chars) → Verify error message
4. Fill valid form but submit twice → Verify only one account created

**Expected Outcomes:**
- ✅ Invalid email shows error
- ✅ Weak password shows error
- ✅ No duplicate accounts created

**Playwright Code:**
```typescript
test('Signup form validates input correctly', async ({ page }) => {
  await page.goto('/sign-up');

  // Try submit with empty email
  await page.click('button[type="submit"]');
  await expect(page.locator('text=email')).toContainText(/required|invalid/i);

  // Enter weak password
  await page.fill('input[name="email_address"]', 'test@example.com');
  await page.fill('input[name="password"]', 'weak');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=password')).toContainText(/strong|8 characters/i);
});
```

**Estimated Effort:** 1 hour

---

### E2E Scenario 2: Existing User Login Flow
**Acceptance Criteria:** AC #5, #6, #8
**Risk Level:** CRITICAL
**Priority:** P0

#### Test Case 2.1: Existing User Can Sign In and Access Dashboard
**Objective:** Verify returning user can login and access protected route
**Preconditions:**
- Test account exists in Clerk (email: `test_existing@example.com`)
- App is running
- Test user logged out (no active session)

**Test Steps:**
1. Navigate to `/sign-in`
2. Verify Sign-In form is displayed
3. Enter test account email and password
4. Submit form
5. Verify redirect to `/dashboard`
6. Verify welcome message
7. Verify user session is active (can navigate within dashboard)

**Expected Outcomes:**
- ✅ Sign-in form loads
- ✅ Credentials accepted
- ✅ Redirects to `/dashboard`
- ✅ Session persists (no immediate logout)
- ✅ Can click links within dashboard without re-authenticating

**Playwright Code:**
```typescript
test('Existing user can sign in and access dashboard', async ({ page }) => {
  await page.goto('/sign-in');

  // Verify form
  await expect(page.locator('text=Sign in')).toBeVisible();

  // Sign in
  await page.fill('input[name="email_address"]', 'test_existing@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL('/dashboard');

  // Verify authenticated state
  await expect(page.locator('text=Welcome to Your Dashboard')).toBeVisible();
  await expect(page.locator('text=User is authenticated')).toBeVisible();
});
```

**Test Data:**
- Email: `test_existing@example.com`
- Password: `TestPassword123!`
- Created in Clerk dashboard beforehand

**Estimated Effort:** 1.5 hours

---

#### Test Case 2.2: Invalid Credentials Rejected
**Objective:** Verify wrong password shows error
**Preconditions:** Test account exists

**Test Steps:**
1. Navigate to `/sign-in`
2. Enter valid email but wrong password
3. Submit form
4. Verify error message appears
5. Verify user stays on `/sign-in` (no redirect)

**Expected Outcomes:**
- ✅ Error message displayed (e.g., "Invalid email or password")
- ✅ Stays on `/sign-in`
- ✅ No session created

**Playwright Code:**
```typescript
test('Invalid credentials show error', async ({ page }) => {
  await page.goto('/sign-in');

  await page.fill('input[name="email_address"]', 'test_existing@example.com');
  await page.fill('input[name="password"]', 'WrongPassword123!');
  await page.click('button[type="submit"]');

  // Should stay on sign-in page
  await expect(page).toHaveURL('/sign-in');

  // Error message should appear
  await expect(page.locator('text=/invalid|incorrect/i')).toBeVisible();
});
```

**Estimated Effort:** 1 hour

---

### E2E Scenario 3: Protected Route Access Control
**Acceptance Criteria:** AC #7
**Risk Level:** CRITICAL
**Priority:** P0

#### Test Case 3.1: Unauthenticated Access Redirects to Sign-In
**Objective:** Verify unauthorized users cannot access `/dashboard`
**Preconditions:**
- User is NOT logged in (clean session)
- App is running

**Test Steps:**
1. Ensure no active session (clear cookies or new browser context)
2. Directly navigate to `/dashboard`
3. Verify redirect to `/sign-in`
4. Verify `/sign-in` page displays

**Expected Outcomes:**
- ✅ Attempting to access `/dashboard` redirects to `/sign-in`
- ✅ URL shows `/sign-in`
- ✅ Sign-in form is visible
- ✅ No console errors

**Playwright Code:**
```typescript
test('Unauthenticated user redirected to sign-in', async ({ page }) => {
  // Start with clean context (no cookies)
  const context = await browser.newContext();
  const newPage = await context.newPage();

  // Try to access protected route
  await newPage.goto('/dashboard');

  // Should redirect to sign-in
  await expect(newPage).toHaveURL('/sign-in');
  await expect(newPage.locator('text=Sign in')).toBeVisible();

  await context.close();
});
```

**Estimated Effort:** 1.5 hours

---

#### Test Case 3.2: Authenticated User CAN Access Dashboard
**Objective:** Verify authenticated users can access protected routes
**Preconditions:**
- User is logged in
- Session is valid

**Test Steps:**
1. Sign in (from Test 2.1)
2. Navigate to `/dashboard`
3. Verify page loads without redirect
4. Verify dashboard content visible

**Expected Outcomes:**
- ✅ Dashboard page loads
- ✅ Welcome message visible
- ✅ No redirect to sign-in

**Playwright Code:**
```typescript
test('Authenticated user can access dashboard', async ({ page }) => {
  // Sign in first
  await page.goto('/sign-in');
  await page.fill('input[name="email_address"]', 'test_existing@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Now navigate to dashboard directly
  await page.goto('/dashboard');

  // Should stay on dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

**Estimated Effort:** 1 hour

---

### E2E Scenario 4: Logout Flow
**Acceptance Criteria:** AC #8
**Risk Level:** CRITICAL
**Priority:** P0

#### Test Case 4.1: User Can Log Out and Session Ends
**Objective:** Verify logout clears session and redirects appropriately
**Preconditions:**
- User is logged in and on dashboard

**Test Steps:**
1. Sign in (from Test 2.1)
2. Click "Sign Out" button
3. Verify redirect away from dashboard (to sign-in or landing page)
4. Verify cannot access dashboard without signing in again
5. Verify clicking sign-in works (can login again after logout)

**Expected Outcomes:**
- ✅ Click Sign Out button
- ✅ Session ends (Clerk cookies cleared)
- ✅ Redirect to `/sign-in` or `/`
- ✅ Subsequent `/dashboard` access redirects to `/sign-in`
- ✅ Can sign in again successfully

**Playwright Code:**
```typescript
test('User logout clears session and redirects', async ({ page }) => {
  // Sign in first
  await page.goto('/sign-in');
  await page.fill('input[name="email_address"]', 'test_existing@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Click Sign Out
  await page.click('button:has-text("Sign Out")');

  // Should redirect (Clerk handles redirect destination)
  await page.waitForNavigation();

  // Try to access dashboard
  await page.goto('/dashboard');

  // Should redirect back to sign-in
  await expect(page).toHaveURL('/sign-in');
  await expect(page.locator('text=Sign in')).toBeVisible();
});
```

**Estimated Effort:** 1.5 hours

---

#### Test Case 4.2: Session Persists Across Page Reloads
**Objective:** Verify cookies persist session when reloading
**Preconditions:**
- User logged in

**Test Steps:**
1. Sign in
2. Reload page (`page.reload()`)
3. Verify user still authenticated (dashboard still accessible)
4. Verify no need to sign in again

**Expected Outcomes:**
- ✅ Session persists after reload
- ✅ No redirect to sign-in
- ✅ Dashboard content still visible

**Playwright Code:**
```typescript
test('Session persists across page reloads', async ({ page }) => {
  // Sign in
  await page.goto('/sign-in');
  await page.fill('input[name="email_address"]', 'test_existing@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Reload
  await page.reload();

  // Should still be on dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

**Estimated Effort:** 0.5 hours

---

### E2E Test Summary
**Total E2E Test Cases:** 6
**Estimated Implementation Time:** 8-9 hours
**Location:** `e2e/auth.spec.ts`

**Test Execution Command:**
```bash
npx playwright test
# Or for specific test:
npx playwright test auth.spec.ts
# With UI mode:
npx playwright test --ui
```

**CI/CD Integration:**
```yaml
# Add to GitHub Actions
- name: Run E2E tests
  run: npx playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## 2. UNIT TEST SCENARIOS

### Test Framework: Jest
**Why Jest:** Already configured, Next.js native support, good component testing

#### Unit Test 1: AuthLayout Component
**File:** `__tests__/auth-layout.test.tsx`
**Component Under Test:** `app/(auth)/layout.tsx`

**Test Cases:**

**1.1: AuthLayout Renders Children Correctly**
```typescript
import { render, screen } from '@testing-library/react';
import AuthLayout from '@/app/(auth)/layout';

describe('AuthLayout', () => {
  it('renders children in centered container', () => {
    render(
      <AuthLayout>
        <div data-testid="test-child">Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toHaveTextContent('Test Content');
  });

  it('applies gradient background styling', () => {
    const { container } = render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('bg-gradient-to-br');
    expect(outerDiv).toHaveClass('from-slate-900');
    expect(outerDiv).toHaveClass('to-slate-800');
  });

  it('centers content vertically and horizontally', () => {
    const { container } = render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('flex');
    expect(outerDiv).toHaveClass('items-center');
    expect(outerDiv).toHaveClass('justify-center');
    expect(outerDiv).toHaveClass('min-h-screen');
  });

  it('constrains content width to max-w-md', () => {
    const { container } = render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    const innerDiv = container.querySelector('.max-w-md');
    expect(innerDiv).toBeInTheDocument();
  });
});
```

**Estimated Effort:** 1 hour

---

#### Unit Test 2: SignUp Page Component
**File:** `__tests__/sign-up-page.test.tsx`
**Component Under Test:** `app/(auth)/sign-up/page.tsx`

**Test Cases:**

**2.1: SignUp Component Renders**
```typescript
import { render, screen } from '@testing-library/react';
import SignUpPage from '@/app/(auth)/sign-up/page';
import { SignUp } from '@clerk/nextjs';

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignUp: jest.fn(() => <div data-testid="clerk-signup">Mocked SignUp</div>),
}));

describe('SignUpPage', () => {
  it('renders Clerk SignUp component', () => {
    render(<SignUpPage />);

    expect(screen.getByTestId('clerk-signup')).toBeInTheDocument();
    expect(SignUp).toHaveBeenCalled();
  });

  it('exports as default', () => {
    // Component should be default export
    expect(SignUpPage).toBeDefined();
  });
});
```

**Estimated Effort:** 1 hour

---

#### Unit Test 3: SignIn Page Component
**File:** `__tests__/sign-in-page.test.tsx`
**Component Under Test:** `app/(auth)/sign-in/page.tsx`

**Similar to SignUp test**

**Estimated Effort:** 0.5 hours

---

#### Unit Test 4: DashboardPage Component
**File:** `__tests__/dashboard-page.test.tsx`
**Component Under Test:** `app/(dashboard)/page.tsx`

**Test Cases:**

**4.1: Dashboard Displays Welcome Message**
```typescript
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(dashboard)/page';
import { SignOutButton } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  SignOutButton: jest.fn(({ children }) => <div data-testid="signout-button">{children}</div>),
}));

describe('DashboardPage', () => {
  it('renders welcome message', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/Welcome to Your Dashboard/i)).toBeInTheDocument();
  });

  it('displays authenticated state message', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/successfully authenticated/i)).toBeInTheDocument();
  });

  it('renders SignOut button', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('signout-button')).toBeInTheDocument();
  });

  it('includes user information section', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/User Information/i)).toBeInTheDocument();
    expect(screen.getByText(/can securely access/i)).toBeInTheDocument();
  });

  it('has use server directive (check source)', () => {
    // This is a build-time check - verify in source code
    const source = require('fs').readFileSync(
      require('path').join(__dirname, '../app/(dashboard)/page.tsx'),
      'utf-8'
    );
    expect(source).toContain('use server');
  });
});
```

**Estimated Effort:** 1.5 hours

---

#### Unit Test 5: DashboardLayout Component
**File:** `__tests__/dashboard-layout.test.tsx`
**Component Under Test:** `app/(dashboard)/layout.tsx`

**Test Cases:**

**5.1: Layout Renders Nav and Children**
```typescript
import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/app/(dashboard)/layout';

// Mock auth function
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'test-user-id' })),
}));

// Mock redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('DashboardLayout', () => {
  it('renders navigation with dashboard title', async () => {
    render(
      <DashboardLayout>
        <div data-testid="test-child">Test Child</div>
      </DashboardLayout>
    );

    await screen.findByText(/Dashboard/i);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders children in main element', async () => {
    render(
      <DashboardLayout>
        <div data-testid="test-child">Test Child</div>
      </DashboardLayout>
    );

    await screen.findByTestId('test-child');
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
```

**Note:** Testing async components with auth() is complex; see Integration Tests (Section 3) for better approach.

**Estimated Effort:** 2 hours

---

#### Unit Test 6: RootLayoutClient Component
**File:** `__tests__/root-layout-client.test.tsx`
**Component Under Test:** `app/layout-client.tsx`

**Test Cases:**

**6.1: ClerkProvider Wraps Children**
```typescript
import { render, screen } from '@testing-library/react';
import RootLayoutClient from '@/app/layout-client';
import { ClerkProvider } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: jest.fn(({ children }) => <div data-testid="clerk-provider">{children}</div>),
  SignInButton: jest.fn(() => <button data-testid="signin-btn">Sign In</button>),
  SignUpButton: jest.fn(({ children }) => <button data-testid="signup-btn">{children}</button>),
  SignedIn: jest.fn(({ children }) => <div data-testid="signed-in">{children}</div>),
  SignedOut: jest.fn(({ children }) => <div data-testid="signed-out">{children}</div>),
  UserButton: jest.fn(() => <div data-testid="user-button">UserButton</div>),
}));

describe('RootLayoutClient', () => {
  it('wraps children with ClerkProvider', () => {
    render(
      <RootLayoutClient>
        <div data-testid="test-child">Test</div>
      </RootLayoutClient>
    );

    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders header with navigation buttons', () => {
    render(
      <RootLayoutClient>
        <div>Test</div>
      </RootLayoutClient>
    );

    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    expect(screen.getByTestId('signed-in')).toBeInTheDocument();
  });

  it('shows SignIn/SignUp buttons when signed out', () => {
    render(
      <RootLayoutClient>
        <div>Test</div>
      </RootLayoutClient>
    );

    expect(screen.getByTestId('signin-btn')).toBeInTheDocument();
    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
  });

  it('shows UserButton when signed in', () => {
    render(
      <RootLayoutClient>
        <div>Test</div>
      </RootLayoutClient>
    );

    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
```

**Estimated Effort:** 1.5 hours

---

### Unit Test Summary
**Total Unit Test Cases:** 8
**Estimated Implementation Time:** 9 hours
**Command to Run:**
```bash
npm test -- __tests__/auth*.test.tsx
# Or with coverage:
npm test -- __tests__/auth*.test.tsx --coverage
```

---

## 3. INTEGRATION TEST SCENARIOS

### Test Framework: Jest + Mock Service Worker (MSW) + Supertest
**Why MSW:** Mocks HTTP requests without mocking Clerk internals

#### Integration Test 1: Middleware Configuration
**File:** `__tests__/middleware.integration.test.ts`
**Component Under Test:** `middleware.ts`

**Test Cases:**

**1.1: Middleware Matcher Configuration**
```typescript
// Jest configuration needed: testEnvironment: 'node' for this test
import { config } from '../../middleware';

describe('Middleware Configuration', () => {
  it('exports config with matcher pattern', () => {
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
  });

  it('matcher includes root and API routes', () => {
    expect(config.matcher).toContainEqual('/');
    expect(config.matcher.some((m: string) => m.includes('api'))).toBe(true);
  });

  it('matcher excludes static assets', () => {
    // The pattern "/((?!.*\\..*|_next).*)" should exclude dotfiles and _next
    const pattern = config.matcher[0];
    expect(pattern).toContain('?!'); // negative lookahead
    expect(pattern).toContain('_next');
  });
});
```

**Note:** Full middleware testing requires Next.js test utilities; see documentation.

**Estimated Effort:** 1.5 hours

---

#### Integration Test 2: Dashboard Layout Auth Check
**File:** `__tests__/dashboard-auth-flow.integration.test.tsx`
**Tests:** Layout auth check → redirect flow

**Test Setup:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/app/(dashboard)/layout';

// Mock auth and redirect
jest.mock('@clerk/nextjs/server');
jest.mock('next/navigation');

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('DashboardLayout Auth Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to sign-in when userId is missing', async () => {
    mockAuth.mockResolvedValue({ userId: null } as any);

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('renders children when userId is present', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as any);

    const { container } = render(
      <DashboardLayout>
        <div data-testid="dashboard-content">Dashboard Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(container.querySelector('[data-testid="dashboard-content"]')).toBeInTheDocument();
    });
  });

  it('calls auth() on every render', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as any);

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockAuth).toHaveBeenCalled();
    });
  });
});
```

**Estimated Effort:** 2 hours

---

#### Integration Test 3: Auth Layout + SignUp Component Flow
**File:** `__tests__/signup-flow.integration.test.tsx`

**Test:**
```typescript
import { render, screen } from '@testing-library/react';
import AuthLayout from '@/app/(auth)/layout';
import SignUpPage from '@/app/(auth)/sign-up/page';

jest.mock('@clerk/nextjs', () => ({
  SignUp: jest.fn(() => <div data-testid="signup-form">SignUp Form</div>),
}));

describe('SignUp Layout Integration', () => {
  it('renders SignUp form inside AuthLayout', () => {
    render(
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    );

    // Should be centered
    const layout = screen.getByTestId('signup-form').closest('[class*="flex"]');
    expect(layout).toHaveClass('items-center');
    expect(layout).toHaveClass('justify-center');
  });
});
```

**Estimated Effort:** 1 hour

---

#### Integration Test 4: Clerk Provider Integration
**File:** `__tests__/clerk-provider.integration.test.tsx`

**Test:**
```typescript
import { render, screen } from '@testing-library/react';
import RootLayoutClient from '@/app/layout-client';

// Mock Clerk but not the provider itself for real testing
jest.mock('@clerk/nextjs', () => {
  const actual = jest.requireActual('@clerk/nextjs');
  return {
    ...actual,
    SignInButton: () => <button data-testid="signin-btn">Sign In</button>,
    SignUpButton: () => <button data-testid="signup-btn">Sign Up</button>,
  };
}, { virtual: true });

describe('ClerkProvider Integration', () => {
  it('provides Clerk context to children', () => {
    render(
      <RootLayoutClient>
        <div data-testid="child-content">Child</div>
      </RootLayoutClient>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    // Children should have access to Clerk context (verified by actual app working)
  });
});
```

**Estimated Effort:** 1 hour

---

#### Integration Test 5: Route Protection Chain
**File:** `__tests__/route-protection.integration.test.ts`
**Purpose:** Verify middleware + layout work together

**Test Concept:**
```typescript
describe('Route Protection Chain: Middleware → Layout', () => {
  it('middleware allows unauthenticated access to /sign-up', () => {
    // Middleware should NOT block /sign-up
    // Layout check should not run (no auth() call)
    // This is verified by successful E2E test
  });

  it('middleware allows unauthenticated access to /sign-in', () => {
    // Similar to above
  });

  it('middleware processes /dashboard routes', () => {
    // Middleware should process /dashboard/*
    // Layout auth() check should run
    // Should redirect if no userId
  });

  it('no infinite redirect loop', () => {
    // Verify:
    // /dashboard (no auth) → redirect to /sign-in
    // /sign-in (no auth) → stays on /sign-in (no redirect)
    // No circular dependency
  });
});
```

**Note:** Full integration testing of middleware requires Next.js test utilities or E2E tests.

**Estimated Effort:** 2 hours

---

### Integration Test Summary
**Total Integration Test Cases:** 6
**Estimated Implementation Time:** 9 hours
**Note:** Some tests are conceptual; actual implementation depends on Next.js testing utilities maturity.

---

## 4. ERROR & NEGATIVE PATH TEST SCENARIOS

### Test Framework: Jest + Playwright (for E2E error scenarios)

#### Error Test 1: Clerk Service Unavailable (E2E)
**File:** `e2e/error-scenarios.spec.ts`

**Test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Error Scenarios', () => {
  test('graceful handling when Clerk service is unavailable', async ({ page }) => {
    // This test would require:
    // 1. Mock Clerk API responses
    // 2. Return 5xx errors
    // 3. Verify error handling

    // In practice, use MSW (Mock Service Worker) to intercept Clerk requests
    // and simulate service unavailability

    // Implementation depends on how Clerk client is configured
    // For starter project, consider skipping this test
    // Add error boundary first (see recommendations)
  });
});
```

**Status:** ⚠️ Requires error boundary implementation first

**Estimated Effort:** 3 hours (including error boundary implementation)

---

#### Error Test 2: Network Timeout During Login (E2E)
**File:** `e2e/error-scenarios.spec.ts`

**Test:**
```typescript
test('handles network timeout during signin', async ({ page }) => {
  // Simulate slow/timeout network conditions
  await page.route('https://clerk.com/**', route => {
    setTimeout(() => route.abort(), 10000); // Timeout after 10s
  });

  await page.goto('/sign-in');
  await page.fill('input[name="email_address"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should show timeout error or allow retry
  await expect(page.locator('text=/timeout|try again/i')).toBeVisible();
});
```

**Estimated Effort:** 1.5 hours

---

#### Error Test 3: Concurrent Signup Attempts (E2E)
**File:** `e2e/error-scenarios.spec.ts`

**Test:**
```typescript
test('prevents duplicate account creation on double-submit', async ({ page }) => {
  await page.goto('/sign-up');

  // Fill form
  const email = `test_${Date.now()}@example.com`;
  await page.fill('input[name="email_address"]', email);
  await page.fill('input[name="password"]', 'TestPassword123!');

  // Submit twice rapidly
  const submitBtn = page.locator('button[type="submit"]');
  await submitBtn.click();
  await submitBtn.click(); // Double-click before redirect

  // Wait for potential redirect
  await page.waitForNavigation();

  // Should only create one account (verified by trying to signup again)
  await page.goto('/sign-up');
  await page.fill('input[name="email_address"]', email);
  await expect(page.locator('text=/already exists|already registered/i')).toBeVisible();
});
```

**Estimated Effort:** 1 hour

---

#### Error Test 4: Invalid JWT Token (Integration)
**File:** `__tests__/invalid-auth.integration.test.ts`

**Test:**
```typescript
describe('Invalid Auth Token Handling', () => {
  it('redirects when Clerk session is invalid', async () => {
    // Mock auth() to return invalid data
    const mockAuth = jest.fn().mockResolvedValue({
      userId: null,
      sessionId: null,
    });

    // Inject invalid state into layout
    // Verify redirect occurs
  });

  it('clears invalid cookies on next request', async () => {
    // Verify Clerk handles cookie cleanup
  });
});
```

**Estimated Effort:** 1.5 hours

---

#### Error Test 5: Slow Auth Check (Performance)
**File:** `e2e/performance.spec.ts`

**Test:**
```typescript
import { test, expect } from '@playwright/test';

test('dashboard loads within acceptable time with auth check', async ({ page }) => {
  // Measure time to first paint
  const metrics = await page.evaluate(() => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadEventEnd: navigationTiming.loadEventEnd,
      domContentLoaded: navigationTiming.domContentLoadedEventEnd,
    };
  });

  // Should load dashboard in < 2 seconds (adjust based on requirements)
  expect(metrics.loadEventEnd - metrics.domContentLoaded).toBeLessThan(2000);
});
```

**Estimated Effort:** 1 hour

---

### Error Test Summary
**Total Error Test Cases:** 5
**Estimated Implementation Time:** 8 hours
**Note:** Some tests require infrastructure (error boundary, monitoring) to be in place first

---

## 5. TEST IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)
**Effort:** 8-10 hours
**Deliverables:** E2E tests + Jest setup

**Tasks:**
- [ ] Install Playwright and configure
- [ ] Implement 6 E2E test cases (critical paths)
- [ ] Create test account in Clerk
- [ ] Set up GitHub Actions for test execution
- [ ] Document test running instructions

**Acceptance Criteria:**
- ✅ All 6 E2E tests passing
- ✅ CI/CD configured to run on PRs
- ✅ Coverage report generated

---

### Phase 2: Unit Coverage (Week 2)
**Effort:** 9 hours
**Deliverables:** Unit tests for all components

**Tasks:**
- [ ] Implement 8 unit test cases
- [ ] Achieve 85%+ coverage for `app` directory
- [ ] Set up coverage reporting
- [ ] Document mocking strategy for Clerk

**Acceptance Criteria:**
- ✅ All 8 unit tests passing
- ✅ 85%+ coverage
- ✅ CI checks for coverage regression

---

### Phase 3: Integration & Error Handling (Week 3)
**Effort:** 9-10 hours
**Deliverables:** Integration tests + error scenarios

**Tasks:**
- [ ] Implement error boundary in dashboard layout
- [ ] Implement 6 integration tests
- [ ] Implement 5 error scenario tests
- [ ] Add error monitoring (Sentry, etc.)

**Acceptance Criteria:**
- ✅ All tests passing
- ✅ Error scenarios documented
- ✅ Monitoring configured

---

### Phase 4: Optimization & Maintenance (Week 4)
**Effort:** 5 hours
**Deliverables:** Test infrastructure optimization

**Tasks:**
- [ ] Performance testing for auth flows
- [ ] Test suite optimization (parallelization)
- [ ] Documentation for running tests locally
- [ ] CI/CD optimization

**Acceptance Criteria:**
- ✅ Tests run in < 10 minutes total
- ✅ Documentation complete
- ✅ Team trained on test writing

---

## 6. TEST EXECUTION STRATEGY

### Local Development
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- __tests__/auth-layout.test.tsx

# Run with coverage
npm test -- --coverage

# E2E tests only
npx playwright test

# E2E with UI mode
npx playwright test --ui
```

### CI/CD Pipeline (GitHub Actions Example)
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Upload E2E report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 7. COVERAGE TARGETS & METRICS

### Acceptance Criteria for Test Coverage
| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| E2E Happy Path | 100% | 0% | Critical |
| E2E Error Paths | 80% | 0% | High |
| Unit Coverage | 90% | 0% | High |
| Integration Coverage | 85% | 0% | High |
| Branch Coverage | 80% | TBD | TBD |
| Line Coverage | 85% | TBD | TBD |

### Success Metrics
- ✅ All 23 test scenarios implemented
- ✅ 85%+ overall code coverage
- ✅ Test suite runs in < 10 minutes
- ✅ Zero test flakiness (deterministic)
- ✅ 100% CI/CD pass rate before merge

---

## 8. MOCKING STRATEGY

### Clerk Component Mocking (Jest)
```typescript
// Mock Clerk components consistently
jest.mock('@clerk/nextjs', () => ({
  SignUp: jest.fn(() => <div data-testid="clerk-signup">SignUp</div>),
  SignIn: jest.fn(() => <div data-testid="clerk-signin">SignIn</div>),
  SignOutButton: jest.fn(({ children }) => <div>{children}</div>),
  SignedIn: jest.fn(({ children }) => <div data-testid="signed-in">{children}</div>),
  SignedOut: jest.fn(({ children }) => <div data-testid="signed-out">{children}</div>),
  UserButton: jest.fn(() => <div data-testid="user-btn">UserButton</div>),
  ClerkProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  clerkMiddleware: jest.fn(),
}));
```

### Clerk Real Testing (E2E)
- Use Clerk test environment (separate from production)
- Create test accounts for each E2E run
- Use unique emails with timestamps to avoid conflicts
- Clean up test accounts after runs (or use Clerk test API)

---

## 9. TESTING TOOLS & DEPENDENCIES

### Required Packages
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@clerk/testing": "^latest"
  }
}
```

### Installation
```bash
npm install --save-dev @playwright/test @testing-library/react @testing-library/jest-dom
```

---

## 10. MAINTENANCE & EVOLUTION

### Test Review Cadence
- **Weekly:** Run full test suite, review failures
- **Monthly:** Review test coverage metrics, identify gaps
- **Quarterly:** Performance review, refactor slow tests

### Test Debt Management
- [ ] Keep failing tests to minimum (< 1 consistently)
- [ ] Monitor test runtime (< 10 minutes goal)
- [ ] Review test flakiness monthly
- [ ] Refactor slow/brittle tests

### Future Test Additions
- [ ] Visual regression testing (Playwright)
- [ ] Load testing for auth endpoints
- [ ] Accessibility testing (Axe, Playwright)
- [ ] Mobile browser testing

---

## SUMMARY

**Total Test Scenarios:** 23
**Total Estimated Effort:** 35-38 hours
**Implementation Timeline:** 4 weeks (phased approach)
**Team Capacity:** 1-2 developers

### Quick Start (Minimum Viable Testing)
**If only 1 week available:**
1. Implement 6 E2E tests (critical paths) - 8-9 hours
2. Set up CI/CD - 1-2 hours
3. Document test running - 1 hour

**Result:** Coverage of happy paths; manual testing required for error paths

### Full Testing (Recommended)
Implement all 23 test scenarios across 4 weeks as outlined in the roadmap.

---

**Test Design Complete**
Quinn, Test Architect | 2025-10-29
