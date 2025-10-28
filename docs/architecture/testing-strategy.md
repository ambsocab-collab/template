# **TESTING STRATEGY**

## **Testing Pyramid**

```
        ▲ E2E Tests (10%)
       / \
      /   \ Playwright
     /     \
    ▲───────▼ Integration Tests (20%)
   /         \ API routes + Database
  /           \
▲─────────────▼ Unit Tests (70%)
  Frontend    Backend
(Jest + RTL) (Jest)
```

## **Test Organization**

```
tests/
├── unit/
│   ├── components/
│   │   ├── profile-form.test.tsx
│   │   ├── plan-badge.test.tsx
│   │   └── sidebar.test.tsx
│   ├── lib/
│   │   ├── stripe.test.ts
│   │   └── utils.test.ts
│   └── hooks/
│       └── use-auth.test.ts
├── integration/
│   ├── api/
│   │   ├── user-profile.test.ts
│   │   ├── user-delete.test.ts
│   │   ├── subscription-checkout.test.ts
│   │   └── webhook-stripe.test.ts
│   └── db/
│       └── queries.test.ts
└── e2e/
    ├── auth.spec.ts                 # Sign-up → Dashboard
    ├── profile-edit.spec.ts         # Edit profile flow
    ├── upgrade.spec.ts              # Free → Pro upgrade
    ├── delete-account.spec.ts       # Account deletion
    └── payment-errors.spec.ts       # Error handling
```

## **Unit Test Example**

```typescript
// tests/unit/components/plan-badge.test.tsx
import { render, screen } from '@testing-library/react';
import { PlanBadge } from '@/components/plan-badge';

describe('PlanBadge', () => {
  it('renders "Free" for free plan', () => {
    render(<PlanBadge plan="free" />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Free')).toHaveClass('bg-gray-200');
  });

  it('renders "Pro" for pro plan with correct styling', () => {
    render(<PlanBadge plan="pro" />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toHaveClass('bg-indigo-600', 'text-white');
  });
});
```

## **Integration Test Example**

```typescript
// tests/integration/api/user-profile.test.ts
import { GET, POST } from '@/app/api/user/profile/route';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server');

describe('GET /api/user/profile', () => {
  it('returns user profile for authenticated user', async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: 'user-123' });

    const response = await GET(
      new Request('http://localhost:3000/api/user/profile')
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe('user-123');
  });

  it('returns 401 for unauthenticated user', async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: null });

    const response = await GET(
      new Request('http://localhost:3000/api/user/profile')
    );

    expect(response.status).toBe(401);
  });
});
```

## **E2E Test Example (Playwright)**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('new user can sign up and access dashboard', async ({ page }) => {
    // Navigate to landing
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/next-sqlite-starter/);

    // Click "Get Started"
    await page.click('button:has-text("Get Started")');

    // Wait for Clerk sign-up modal
    await page.waitForURL('**/sign-up');

    // Fill sign-up form
    await page.fill('input[name="email_address"]', 'newuser@test.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Create account")');

    // Should redirect to dashboard
    await page.waitForURL('**/\\(dashboard\\)');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

---
