# **DATA MODELS**

## **1. User Model**

**Purpose:** Store authenticated user information and subscription status.

**Key Attributes:**
- `id`: string (Clerk User ID) - Primary identifier
- `email`: string - User email (from Clerk)
- `firstName`: string - First name (editable)
- `lastName`: string - Last name (editable)
- `avatar`: string? - Avatar URL (from Clerk)
- `subscriptionStatus`: enum ('free' | 'pro') - Current plan
- `createdAt`: Date - Account creation timestamp
- `updatedAt`: Date - Last profile update

**TypeScript Interface:**

```typescript
// lib/types.ts
export interface User {
  id: string;                      // Clerk ID
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subscriptionStatus: 'free' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}
```

**Relationships:**
- One-to-One: User → Subscription (unique subscription per user)
- One-to-Many: User → Audit Logs (optional)

---

## **2. Subscription Model**

**Purpose:** Track subscription and billing status, linked to Stripe.

**Key Attributes:**
- `id`: string (UUID) - Primary identifier
- `userId`: string - Foreign key to User
- `stripeCustomerId`: string - Stripe customer ID
- `stripeSubscriptionId`: string? - Stripe subscription ID (null if free)
- `status`: enum ('free' | 'active' | 'canceled' | 'past_due') - Subscription status
- `plan`: enum ('free' | 'pro') - Plan tier
- `currentPeriodStart`: Date? - Billing period start (null for free)
- `currentPeriodEnd`: Date? - Billing period end (null for free)
- `canceledAt`: Date? - Cancellation timestamp (null if active)
- `createdAt`: Date
- `updatedAt`: Date

**TypeScript Interface:**

```typescript
export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: 'free' | 'active' | 'canceled' | 'past_due';
  plan: 'free' | 'pro';
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Relationships:**
- Many-to-One: Subscription → User

---

## **3. Audit Log Model (Optional)**

**Purpose:** Track user actions for debugging and compliance (future).

**Key Attributes:**
- `id`: string (UUID)
- `userId`: string
- `action`: enum (login, profile_update, upgrade, downgrade, logout, delete_account)
- `details`: JSON - Additional context
- `createdAt`: Date

---
