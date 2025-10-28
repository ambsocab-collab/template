# **CODING STANDARDS**

## **Critical Fullstack Rules**

These standards prevent common mistakes and maintain consistency across the codebase:

1. **Type Sharing:** Always define shared types in `lib/types.ts`. Import types from there in both frontend and backend code.

2. **API Calls:** Never make direct `fetch()` calls. Use `lib/api-client.ts` wrapper for consistent error handling and headers.

3. **Environment Variables:** Access via `process.env` with validation in `lib/config.ts`. Never use directly in components.

4. **Error Handling:** All API routes must return consistent error format: `{ error: string, code?: string, timestamp, requestId }`

5. **State Updates:** Never mutate state directly. Use React hooks, Clerk context, or state management patterns.

6. **Database Queries:** Use Drizzle ORM exclusively. Never write raw SQL queries.

7. **Authentication:** Always check `auth()` from Clerk in protected API routes. Use middleware for route protection.

8. **Stripe Integration:** Verify webhook signatures every time. Handle idempotency with stable IDs.

## **Naming Conventions**

| Element | Convention | Example |
|---------|-----------|---------|
| **Components** | PascalCase | `UserProfile.tsx`, `PlanBadge.tsx` |
| **Hooks** | camelCase with 'use' | `useAuth.ts`, `useSubscription.ts` |
| **API Routes** | kebab-case | `/api/user-profile`, `/api/subscription-checkout` |
| **Database Tables** | snake_case | `users`, `subscriptions`, `audit_logs` |
| **Database Columns** | snake_case | `user_id`, `stripe_customer_id` |
| **Environment Vars** | UPPER_SNAKE_CASE | `STRIPE_SECRET_KEY`, `CLERK_SECRET_KEY` |
| **TypeScript Types** | PascalCase | `User`, `Subscription`, `UserProfile` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PLAN` |
| **Private Functions** | leadingUnderscore (optional) | `_formatPrice()`, `_validateEmail()` |

## **File Organization**

- **One component per file** (unless very small, composable pieces)
- **Group by feature**, not by type (e.g., `/profile` contains form, page, tests)
- **Shared utilities** in `lib/` (not feature-specific)
- **Tests colocate** with source code (or in `/tests` directory)

---
