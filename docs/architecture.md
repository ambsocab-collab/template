# next-sqlite-starter Fullstack Architecture Document

**Version:** 1.0
**Date:** 2025-10-28
**Status:** Complete
**Last Updated:** 2025-10-28

---

## **TABLE OF CONTENTS**

1. [Introduction](#introduction)
2. [High-Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Data Models](#data-models)
5. [API Specification](#api-specification)
6. [Core Workflows](#core-workflows)
7. [Database Schema](#database-schema)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Project Structure](#project-structure)
11. [Development Workflow](#development-workflow)
12. [Deployment Architecture](#deployment-architecture)
13. [Security & Performance](#security--performance)
14. [Testing Strategy](#testing-strategy)
15. [Coding Standards](#coding-standards)
16. [Error Handling](#error-handling)
17. [Monitoring & Observability](#monitoring--observability)

---

## **INTRODUCTION**

This document outlines the **complete full-stack architecture** for **next-sqlite-starter**, a minimalist SaaS boilerplate template designed for rapid development of web applications with authentication, user management, and payment integration.

### **Purpose**

This unified architecture serves as:
- Single source of truth for AI-driven development
- Reference guide for developers implementing features
- Foundation for consistent technology decisions
- Blueprint for deployment and operations

### **Starter Template**

This project is built on **Next.js 14+** with TypeScript, combining a frontend application and backend API within a monolithic Next.js instance. The stack includes Clerk for authentication, SQLite with Drizzle ORM for data persistence, Stripe for payment processing, and Tailwind CSS + shadcn/ui for the user interface.

No additional starter template is being modified; this is a greenfield project starting from Next.js App Router conventions.

### **Key Characteristics**

- **Monolithic Full-Stack:** Frontend and backend coexist in one Next.js app
- **Serverless-First:** Deployed on Vercel using Next.js API routes (serverless functions)
- **Type-Safe:** TypeScript throughout; potential for shared type definitions
- **Minimal Dependencies:** Focus on simplicity over feature richness
- **MVP-Focused:** Only essential features; designed for rapid iteration

### **Change Log**

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-28 | 1.0 | Initial architecture document | Architect (Winston) |

---

## **HIGH-LEVEL ARCHITECTURE**

### **Technical Summary**

The **next-sqlite-starter** adopts a **monolithic full-stack architecture** deployed on Vercel, combining Next.js 14 (frontend + API routes), Clerk authentication, SQLite with Drizzle ORM, and Stripe integration. This design prioritizes developer experience and minimal setup friction—the frontend and API coexist in the same Next.js application, eliminating deployment complexity while maintaining clear separation of concerns. TypeScript provides type safety across the entire stack, with potential for shared type definitions between frontend and API routes. The architecture is optimized for rapid development, with built-in support for environment variables, dark mode, and responsive UI via shadcn/ui components and Tailwind CSS. External integrations (Clerk for auth, Stripe for payments) are managed through their SDKs, reducing backend complexity.

### **Platform and Infrastructure**

**Selected Platform:** Vercel

**Rationale:**
- Native Next.js optimization (zero-config deployment)
- Serverless by default (cost-effective for MVP)
- Built-in previews for PR testing
- Edge Functions available for future scaling
- First-party support from Next.js team

**Key Services:**
- **Vercel:** Hosting, CI/CD, serverless functions
- **Clerk:** User authentication and session management
- **Stripe:** Payment processing and subscriptions
- **SQLite:** Local/persistent database (with upgrade path to PostgreSQL)
- **Drizzle ORM:** Type-safe database access

**Upgrade Path:**
When SQLite reaches capacity (millions of users), migrate to PostgreSQL on Vercel's partner services or self-hosted. Drizzle ORM supports both databases natively.

### **Repository Structure**

**Structure:** Single-package monorepo (can evolve to multi-package with Turborepo)

**Rationale:**
- Minimal setup overhead (all code in one place initially)
- Shared types/utils via import paths
- Can evolve to `packages/` and `apps/` structure as project grows
- Next.js conventions favor colocation of routes and components

### **High-Level Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN/EDGE                           │
│  (Serves static assets, Next.js frontend)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTIONS                     │
│                  (Next.js App)                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Frontend (React Components + Pages)                │    │
│  │  - Landing page                                      │    │
│  │  - Auth pages (sign-up, sign-in)                    │    │
│  │  - Dashboard (protected routes)                      │    │
│  │  - Profile, Settings, Billing pages                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Backend (Next.js API Routes)                        │    │
│  │  - GET /api/user/profile                            │    │
│  │  - POST /api/user/profile                           │    │
│  │  - DELETE /api/user                                 │    │
│  │  - GET /api/subscription                            │    │
│  │  - POST /api/subscription/checkout                  │    │
│  │  - POST /api/webhook/stripe                         │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────┬─────────────────────────────────────────────────┘
             │
     ┌───────┼───────┐
     │       │       │
     ▼       ▼       ▼
   ┌──────┬────────┬────────┐
   │Clerk │SQLite  │ Stripe │
   │Auth  │Database │Payment │
   └──────┴────────┴────────┘
```

### **Architectural Patterns**

- **Jamstack-Adjacent Architecture:** Server-side rendering with Next.js, dynamic routes, static generation where applicable. Rationale: Combines benefits of static generation and dynamic content for performance.
- **API Routes Pattern:** Next.js API routes serve as lightweight backend endpoints. Rationale: Eliminates need for separate backend server; routes coexist with frontend.
- **Component-Based UI:** React components with shadcn/ui foundations. Rationale: Reusable, maintainable, accessible components.
- **Middleware Authentication:** Clerk middleware protects routes and provides user context. Rationale: Centralized auth, automatic session management.
- **Database Abstraction (ORM):** Drizzle ORM provides type-safe queries and migrations. Rationale: Type safety, easy migrations, lighter weight than Prisma.
- **Webhook Handling:** Stripe webhooks for async payment events. Rationale: Reliable payment confirmation, supports retries.

---

## **TECH STACK**

This is the **DEFINITIVE technology selection** for the entire project. All development must use these exact versions.

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | ^5.0 | Type safety for UI code | Reduces runtime errors, improves DX |
| **Frontend Framework** | Next.js | ^14.0 | React framework with routing/SSR | App Router, built-in API routes, Vercel integration |
| **UI Component Library** | shadcn/ui | Latest | Accessible, customizable components | Minimal dependencies, Tailwind-based, full control |
| **Styling** | Tailwind CSS | ^3.0 | Utility-first CSS | Mobile-first, dark mode support, rapid prototyping |
| **State Management** | React Context/Hooks | Built-in | Light state management | Sufficient for MVP; upgrade to Zustand if needed |
| **Authentication** | Clerk | Latest | User auth & session management | Eliminates custom auth, social login ready, built-in user management |
| **Backend Language** | TypeScript | ^5.0 | API routes in Next.js | Shared type definitions with frontend |
| **Backend Framework** | Next.js API Routes | ^14.0 | Serverless API endpoints | Colocated with frontend, no separate server deployment |
| **API Style** | REST | - | HTTP endpoints | Simple, well-understood, suitable for MVP scope |
| **Database** | SQLite | Latest | Local/persistent storage | Zero-setup, single-file, sufficient for MVP; upgrade path to PostgreSQL |
| **ORM** | Drizzle ORM | Latest | Type-safe database access | Better DX than raw SQL, lightweight, excellent TypeScript support |
| **File Storage** | Local filesystem | - | Static assets and future uploads | Vercel's filesystem for now; upgrade to Vercel Blob or S3 when needed |
| **Payment Processing** | Stripe | Latest | Payment handling & webhooks | Industry standard, PCI compliance handled, webhook verification |
| **Frontend Testing** | Jest + React Testing Library | Latest | Component & hook testing | Standard React testing stack |
| **Backend Testing** | Jest | Latest | API route testing | Node.js compatible, consistent with frontend |
| **E2E Testing** | Playwright | Latest | User flow testing | Modern, browser-based, great for signup/upgrade flows |
| **Build Tool** | Next.js | ^14.0 | Build & dev server | Integrated, zero-config, SWC compilation |
| **Bundler** | SWC | Built-in | JavaScript bundler | Fast, built-in to Next.js, Rust-based |
| **Package Manager** | npm or pnpm | Latest | Dependency management | Project choice (recommend pnpm for speed) |
| **CI/CD** | GitHub Actions | - | Automated testing & deployment | Free tier, integrates with Vercel, schedule workflows |
| **Monitoring** | Vercel Analytics + Sentry | Latest | Error tracking & performance | Frontend errors, Core Web Vitals, source map uploads |
| **Logging** | Console + Vercel logs | Built-in | Application logging | Sufficient for MVP; upgrade to DataDog if needed |

---

## **DATA MODELS**

### **1. User Model**

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

### **2. Subscription Model**

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

### **3. Audit Log Model (Optional)**

**Purpose:** Track user actions for debugging and compliance (future).

**Key Attributes:**
- `id`: string (UUID)
- `userId`: string
- `action`: enum (login, profile_update, upgrade, downgrade, logout, delete_account)
- `details`: JSON - Additional context
- `createdAt`: Date

---

## **API SPECIFICATION**

### **REST API Overview**

**Base URL (Production):** `https://next-sqlite-starter.vercel.app`
**Base URL (Local):** `http://localhost:3000`
**Authentication:** Clerk JWT token (auto-included in cookies via middleware)
**Content-Type:** `application/json`

### **Core Endpoints**

#### **User Profile API**

```
GET /api/user/profile
├─ Description: Fetch authenticated user profile
├─ Auth: Required (Clerk middleware)
├─ Request: None
└─ Response: { user: User }

POST /api/user/profile
├─ Description: Update user profile (name)
├─ Auth: Required
├─ Request: { firstName: string, lastName: string }
├─ Response: { user: User }
└─ Error: 400 (validation), 500 (server error)

DELETE /api/user
├─ Description: Delete user account and associated data
├─ Auth: Required
├─ Request: { confirmEmail: string }
├─ Response: { success: boolean }
└─ Note: Cascades to subscriptions; cancels Stripe subscription
```

#### **Subscription API**

```
GET /api/subscription
├─ Description: Fetch user's current subscription
├─ Auth: Required
├─ Request: None
└─ Response: { subscription: Subscription }

POST /api/subscription/checkout
├─ Description: Create Stripe checkout session
├─ Auth: Required
├─ Request: { plan: 'pro' }
├─ Response: { sessionId: string, checkoutUrl: string }
└─ Redirects to Stripe Checkout

POST /api/webhook/stripe
├─ Description: Handle Stripe webhook events
├─ Auth: Stripe signature verification (STRIPE_WEBHOOK_SECRET)
├─ Request: Stripe event payload
├─ Response: { received: boolean }
├─ Handles:
│  ├─ checkout.session.completed (create subscription)
│  └─ customer.subscription.deleted (mark as canceled)
└─ Note: Idempotent; safe to retry
```

### **Error Response Format**

All API errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## **CORE WORKFLOWS**

### **Workflow 1: New User Sign-Up → Dashboard**

```
1. User lands on Landing page (/)
2. Clicks "Get Started" button
3. Redirected to Clerk sign-up (/sign-up)
4. Clerk creates user account
5. Clerk creates session
6. Redirected to Dashboard (/(dashboard))
   - Middleware checks auth via Clerk
   - System creates User record in SQLite
   - Stripe creates customer record
   - System creates Subscription record (free plan)
7. User sees "Welcome, {firstName}!" and profile completion CTA
```

**Key Points:**
- Clerk handles auth
- Backend initializes user in database
- Subscription starts as "free"

---

### **Workflow 2: Profile Edit**

```
1. User navigates to /(dashboard)/profile
2. Profile form displays current data
3. User edits first/last name
4. User clicks "Save"
5. Frontend validates input
6. POST /api/user/profile with { firstName, lastName }
7. Backend validates and updates User record
8. Backend returns updated user
9. Frontend shows success toast
10. Form displays updated data
```

**Key Points:**
- Client-side validation before submit
- Server-side validation in API route
- Optimistic updates (optional enhancement)

---

### **Workflow 3: Free User → Pro Upgrade**

```
1. User clicks "Upgrade to Pro" (sidebar or dashboard CTA)
2. User navigated to /(dashboard)/settings/subscription
3. User reviews pricing table
4. User clicks "Choose Pro"
5. Frontend calls POST /api/subscription/checkout
6. Backend:
   a. Validates user is still on free plan
   b. Creates Stripe checkout session
   c. Stores metadata: { userId }
   d. Returns sessionId and checkoutUrl
7. Frontend redirects to Stripe Checkout (iframe/modal)
8. User enters payment details
9. Stripe processes payment
   a. If successful: checkout.session.completed event triggered
   b. If failed: user sees error; can retry
10. Stripe webhook → POST /api/webhook/stripe
11. Backend:
    a. Verifies Stripe signature
    b. Finds user by sessionId metadata
    c. Updates Subscription: status='active', plan='pro'
    d. Updates User: subscriptionStatus='pro'
    e. Sets currentPeriodStart/End from Stripe
12. Backend triggers email confirmation (future)
13. User auto-redirected to success page
14. Dashboard shows Pro badge
15. User can access premium features
```

**Key Points:**
- Stripe handles payment securely
- Webhook confirms payment server-side (async)
- Subscription status reliable via webhook, not client state
- Idempotent handler (same webhook can be retried safely)

---

### **Workflow 4: Delete Account**

```
1. User navigates to /(dashboard)/settings
2. User scrolls to "Danger Zone"
3. User clicks "Delete Account"
4. Modal appears with warning
5. Modal requires user to type email to confirm
6. User types email
7. User clicks "Confirm Deletion"
8. Frontend POST /api/user with { confirmEmail }
9. Backend:
   a. Verifies email matches user email
   b. Gets user's subscription
   c. Cancels Stripe subscription (if active)
   d. Deletes all user data (cascades)
   e. Logs out user (Clerk)
10. Frontend shows success message
11. Auto-redirect to landing page
```

**Key Points:**
- Multi-step confirmation prevents accidental deletion
- Stripe subscription canceled (idempotent)
- Database cascades delete user and subscriptions

---

## **DATABASE SCHEMA**

Using **Drizzle ORM** with **SQLite**:

```typescript
// db/schema.ts
import { sqliteTable, text, timestamp } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),                    // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Subscriptions table
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),                    // UUID
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("free"),
  plan: text("plan").notNull().default("free"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Audit logs table (optional, for future)
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  details: text("details"),                       // JSON as string
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  auditLogs: many(auditLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
```

### **Database Indexes**

For optimal query performance:

```sql
-- Primary key indexes (automatic)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

---

## **FRONTEND ARCHITECTURE**

### **Component Organization**

```
app/
├── (auth)/
│   ├── sign-up/
│   │   └── page.tsx                 # Clerk sign-up form (React Client)
│   ├── sign-in/
│   │   └── page.tsx                 # Clerk sign-in form (React Client)
│   └── layout.tsx                   # Auth layout
├── (dashboard)/
│   ├── page.tsx                     # Dashboard home (Server Component)
│   ├── profile/
│   │   ├── page.tsx                 # Profile page (Server Component)
│   │   └── profile-form.tsx         # Profile form (Client Component)
│   ├── settings/
│   │   ├── page.tsx                 # Settings home (Server Component)
│   │   ├── subscription/
│   │   │   ├── page.tsx             # Subscription management (Server)
│   │   │   ├── pricing.tsx          # Pricing table (Client)
│   │   │   └── checkout-button.tsx  # Stripe checkout button (Client)
│   │   └── danger-zone.tsx          # Account deletion section (Client)
│   ├── checkout/
│   │   └── success/
│   │       └── page.tsx             # Post-payment success (Server)
│   └── layout.tsx                   # Dashboard layout (Sidebar + Navbar)
├── api/
│   ├── user/
│   │   └── profile/
│   │       └── route.ts             # GET, POST /api/user/profile
│   ├── subscription/
│   │   ├── route.ts                 # GET /api/subscription
│   │   └── checkout/
│   │       └── route.ts             # POST /api/subscription/checkout
│   └── webhook/
│       └── stripe/
│           └── route.ts             # POST /api/webhook/stripe
├── components/
│   ├── ui/                          # shadcn/ui generated components
│   ├── navbar.tsx                   # Top navigation bar (Server Component)
│   ├── sidebar.tsx                  # Left sidebar (Client Component, desktop only)
│   ├── mobile-nav.tsx               # Mobile hamburger menu (Client)
│   ├── theme-toggle.tsx             # Dark mode toggle (Client)
│   ├── user-dropdown.tsx            # User menu (Client)
│   └── plan-badge.tsx               # Free/Pro badge (Client)
├── lib/
│   ├── stripe.ts                    # Stripe client & helpers
│   ├── clerk.ts                     # Clerk configuration
│   ├── db.ts                        # Database client
│   ├── api-client.ts                # Fetch wrapper
│   ├── types.ts                     # Shared TypeScript interfaces
│   └── utils.ts                     # General utilities (cn, formatters, etc.)
├── styles/
│   └── globals.css                  # Tailwind directives
├── hooks/
│   ├── use-auth.ts                  # Auth context hook (Clerk)
│   ├── use-subscription.ts          # Subscription query hook (future)
│   └── use-toast.ts                 # shadcn/ui toast hook
├── middleware.ts                    # Route protection, auth middleware
├── layout.tsx                       # Root layout (providers, fonts)
├── page.tsx                         # Landing page (/)
└── not-found.tsx                    # 404 page
```

### **Protected Route Pattern**

**Middleware (middleware.ts):**

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/(dashboard)(.*)",                // All dashboard routes
  "/api/user(.*)",                   // User API routes
  "/api/subscription(.*)",           // Subscription routes
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();                // Require authentication
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### **Frontend Example: Profile Edit Form**

```typescript
// app/(dashboard)/profile/profile-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

interface ProfileFormProps {
  initialData: User;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const data = await response.json();
      setFormData(data.user);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
```

### **State Management**

**For MVP:**
- React Context for auth state (provided by Clerk)
- React hooks for local component state
- No global state manager needed

**Future (if needed):**
- Zustand or Redux for complex state
- React Query/SWR for server state

---

## **BACKEND ARCHITECTURE**

### **API Route Pattern**

All backend logic lives in **Next.js API routes** (serverless functions):

```typescript
// app/api/user/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/user/profile
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/profile
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { firstName, lastName } = await request.json();

    // Validation
    if (!firstName?.trim() || !lastName?.trim()) {
      return Response.json(
        { error: "First and last name are required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(users)
      .set({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return Response.json({ user: updated[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### **Stripe Webhook Handler**

```typescript
// app/api/webhook/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return Response.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return Response.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;

        if (!userId) break;

        // Update subscription
        await db
          .update(subscriptions)
          .set({
            stripeSubscriptionId: session.subscription,
            status: "active",
            plan: "pro",
            currentPeriodStart: new Date(session.created * 1000),
          })
          .where(eq(subscriptions.userId, userId));

        // Update user status
        await db
          .update(users)
          .set({ subscriptionStatus: "pro" })
          .where(eq(users.id, userId));

        console.log(`Subscription activated for user: ${userId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as any;

        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            plan: "free",
            canceledAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, deletedSub.id));

        console.log(`Subscription canceled: ${deletedSub.id}`);
        break;
      }

      case "customer.subscription.updated": {
        const updatedSub = event.data.object as any;

        // Handle payment failures, dunning, etc.
        if (updatedSub.status === "past_due") {
          await db
            .update(subscriptions)
            .set({ status: "past_due" })
            .where(eq(subscriptions.stripeSubscriptionId, updatedSub.id));
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 even on error to prevent retry flood
    return Response.json({ received: true }, { status: 200 });
  }
}
```

### **Database Access Patterns**

**Using Drizzle ORM (type-safe):**

```typescript
// lib/db.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";

const sqlite = new Database(process.env.DATABASE_URL || "dev.db");
export const db = drizzle(sqlite, { schema });

// Example queries:
// Get user by ID
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});

// Get user with subscription
const userWithSub = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    subscription: true,
  },
});

// Update user
await db.update(users)
  .set({ firstName: "New Name" })
  .where(eq(users.id, userId));
```

---

## **PROJECT STRUCTURE**

```
next-sqlite-starter/
├── .github/
│   └── workflows/
│       ├── ci.yaml                  # Run tests on PR/push
│       └── deploy.yaml              # Deploy to Vercel
├── .clauserc                        # Clerk config
├── app/                             # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── profile-form.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── subscription/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pricing.tsx
│   │   │   │   └── checkout-button.tsx
│   │   │   └── danger-zone.tsx
│   │   ├── checkout/
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   │   └── route.ts
│   │   │   └── delete/
│   │   │       └── route.ts
│   │   ├── subscription/
│   │   │   ├── route.ts
│   │   │   └── checkout/
│   │   │       └── route.ts
│   │   └── webhook/
│   │       └── stripe/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                      # shadcn/ui generated
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── user-dropdown.tsx
│   │   └── plan-badge.tsx
│   ├── lib/
│   │   ├── stripe.ts
│   │   ├── clerk.ts
│   │   ├── db.ts
│   │   ├── api-client.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-subscription.ts
│   │   └── use-toast.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── themes.css
│   ├── middleware.ts
│   ├── layout.tsx
│   ├── page.tsx                     # Landing page
│   └── not-found.tsx
├── db/
│   ├── schema.ts                    # Drizzle schema definition
│   ├── migrations/                  # Generated by drizzle-kit
│   └── index.ts                     # Export database client
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   └── lib/
│   ├── integration/
│   │   └── api/
│   └── e2e/
├── .env.example                     # Environment variable template
├── .env.local                       # (not committed) Local dev env
├── .gitignore
├── .eslintrc.json                   # ESLint config
├── .prettierrc.json                 # Prettier config
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── drizzle.config.ts                # Drizzle ORM config
├── jest.config.js                   # Jest config
├── playwright.config.ts             # Playwright config
├── README.md                         # Setup instructions
└── docs/
    ├── architecture.md              # This file
    ├── prd.md                       # Product requirements
    └── uiux-spec.md                 # UI/UX specification
```

---

## **DEVELOPMENT WORKFLOW**

### **Prerequisites**

- Node.js 18+ (verify: `node --version`)
- npm 9+ or pnpm 8+ (recommend pnpm for speed)
- Git
- SQLite3 (usually pre-installed on macOS/Linux; included in npm packages on Windows)

### **Initial Setup**

```bash
# 1. Clone repository
git clone https://github.com/yourusername/next-sqlite-starter.git
cd next-sqlite-starter

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Fill in environment variables (see .env.example for details)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...
# STRIPE_SECRET_KEY=...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
# DATABASE_URL=dev.db (optional, defaults to dev.db)

# 5. Initialize database
npx drizzle-kit push:sqlite

# 6. Start development server
npm run dev

# Application available at http://localhost:3000
```

### **Development Commands**

```bash
# Start dev server (frontend + API)
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Database management
npx drizzle-kit push:sqlite          # Sync schema to database
npx drizzle-kit drop                 # Reset database (dev only)
npx drizzle-kit studio               # GUI database explorer

# Testing
npm run test                         # Run all tests
npm run test:watch                   # Watch mode
npm run test:e2e                     # E2E tests (Playwright)

# Code quality
npm run lint                         # ESLint
npm run format                       # Prettier
npm run type-check                   # TypeScript compilation check

# Other
npm run generate:types               # Generate Drizzle types (if needed)
```

### **Environment Variables**

**Required (.env.local):**

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (optional, defaults to dev.db)
DATABASE_URL=dev.db

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev
# NEXT_PUBLIC_APP_URL=https://next-sqlite-starter.vercel.app  # Prod
```

---

## **DEPLOYMENT ARCHITECTURE**

### **Frontend Deployment**

- **Platform:** Vercel
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node Version:** 18.x
- **CDN/Edge:** Vercel Edge Network (automatic)
- **Preview Deployments:** Automatic for every PR

### **Backend Deployment**

- **Platform:** Vercel Serverless Functions
- **Build Command:** Included in `next build`
- **Deployment:** Same package as frontend (monolithic)
- **Scaling:** Automatic, managed by Vercel
- **Cold starts:** Minimal for API routes

### **Database Deployment**

- **Development:** SQLite locally (dev.db)
- **Production:** SQLite on Vercel's persistent filesystem OR migrate to PostgreSQL
- **Backups:** Implement custom backup strategy (daily exports to S3)

### **Vercel Configuration**

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

### **CI/CD Pipeline**

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

### **Environments**

| Environment | Frontend URL | Backend URL | Database | Purpose |
|-------------|--------------|-------------|----------|---------|
| **Local Dev** | http://localhost:3000 | http://localhost:3000/api | SQLite (dev.db) | Local development |
| **Staging** | https://staging-next-sqlite.vercel.app | https://staging-next-sqlite.vercel.app/api | SQLite or PostgreSQL | Pre-release QA |
| **Production** | https://next-sqlite-starter.vercel.app | https://next-sqlite-starter.vercel.app/api | SQLite → PostgreSQL | Live |

---

## **SECURITY & PERFORMANCE**

### **Frontend Security**

- **HTTPS:** Enforced on Vercel (all traffic encrypted)
- **CSP Headers:** Content Security Policy to prevent XSS
- **XSS Prevention:** React escapes output; sanitize user input
- **Cookie Security:** Clerk manages secure HTTP-only cookies
- **Secrets:** Never expose `STRIPE_SECRET_KEY` or `CLERK_SECRET_KEY` to client

### **Backend Security**

- **Input Validation:** Validate all request data with Zod or similar
- **Rate Limiting:** Vercel provides automatic rate limiting; add custom middleware for sensitive endpoints
- **CORS Policy:** Allow only your domain in production
- **Webhook Verification:** Always verify Stripe signature on webhooks
- **Authentication:** Clerk middleware protects all sensitive routes
- **SQL Injection:** Drizzle ORM prevents SQL injection via parameterized queries

### **Authentication Security**

- **Token Storage:** Clerk handles JWT tokens in HTTP-only cookies (automatic)
- **Session Management:** Clerk manages session refresh; auto-logout on expiration
- **Password Policy:** Clerk enforces strong passwords (email/password or OAuth)
- **MFA Ready:** Clerk supports multi-factor authentication (can be enabled)

### **Frontend Performance**

- **Bundle Size Target:** < 200KB minified JavaScript
- **Loading Strategy:** Next.js automatic code splitting by route
- **Image Optimization:** Use Next.js Image component
- **Caching:** ISR for dashboard, browser caching for static assets
- **First Contentful Paint (FCP):** Target < 1.5 seconds

### **Backend Performance**

- **Response Time Target:** < 200ms (p95) for API routes
- **Database Optimization:** Indexes on frequently queried columns
- **Caching Strategy:** Cache subscription data (1-hour TTL)
- **Stripe Rate Limiting:** Stripe API has rate limits; implement client-side queuing if needed

### **Database Security**

- **Encryption at Rest:** SQLite data on Vercel's filesystem (encrypted)
- **Encryption in Transit:** All API calls over HTTPS
- **Access Control:** Only backend API routes access database
- **Backup Strategy:** Regular exports to S3 (future)

---

## **TESTING STRATEGY**

### **Testing Pyramid**

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

### **Test Organization**

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

### **Unit Test Example**

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

### **Integration Test Example**

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

### **E2E Test Example (Playwright)**

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

## **CODING STANDARDS**

### **Critical Fullstack Rules**

These standards prevent common mistakes and maintain consistency across the codebase:

1. **Type Sharing:** Always define shared types in `lib/types.ts`. Import types from there in both frontend and backend code.

2. **API Calls:** Never make direct `fetch()` calls. Use `lib/api-client.ts` wrapper for consistent error handling and headers.

3. **Environment Variables:** Access via `process.env` with validation in `lib/config.ts`. Never use directly in components.

4. **Error Handling:** All API routes must return consistent error format: `{ error: string, code?: string, timestamp, requestId }`

5. **State Updates:** Never mutate state directly. Use React hooks, Clerk context, or state management patterns.

6. **Database Queries:** Use Drizzle ORM exclusively. Never write raw SQL queries.

7. **Authentication:** Always check `auth()` from Clerk in protected API routes. Use middleware for route protection.

8. **Stripe Integration:** Verify webhook signatures every time. Handle idempotency with stable IDs.

### **Naming Conventions**

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

### **File Organization**

- **One component per file** (unless very small, composable pieces)
- **Group by feature**, not by type (e.g., `/profile` contains form, page, tests)
- **Shared utilities** in `lib/` (not feature-specific)
- **Tests colocate** with source code (or in `/tests` directory)

---

## **ERROR HANDLING**

### **API Error Response Format**

All API endpoints should return this format on error:

```typescript
interface ApiError {
  error: string;                          // Human-readable message
  code?: string;                          // Machine-readable code
  details?: Record<string, any>;          // Additional context
  timestamp: string;                      // ISO 8601 timestamp
  requestId: string;                      // UUID for tracing
}
```

**Helper Function:**

```typescript
// lib/error-handler.ts
export function apiError(
  status: number,
  message: string,
  code?: string,
  details?: Record<string, any>
) {
  return Response.json(
    {
      error: message,
      code,
      details,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    },
    { status }
  );
}

// Usage:
return apiError(400, 'Email already exists', 'EMAIL_EXISTS', { email });
```

### **Frontend Error Handling**

```typescript
// lib/api-client.ts
export async function apiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      const err = new Error(error.error || 'API error') as any;
      err.code = error.code;
      err.details = error.details;
      throw err;
    }

    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### **Backend Error Handling**

```typescript
// app/api/user/profile/route.ts
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return apiError(401, 'Unauthorized');

    const { firstName, lastName } = await request.json();

    if (!firstName?.trim() || !lastName?.trim()) {
      return apiError(400, 'First and last name required', 'VALIDATION_ERROR');
    }

    // ... process request

    return Response.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return apiError(500, 'Internal server error');
  }
}
```

### **Common Error Codes**

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `STRIPE_ERROR` | 402 | Stripe API failure |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## **MONITORING & OBSERVABILITY**

### **Frontend Monitoring**

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

### **Backend Monitoring**

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

### **Key Metrics to Monitor**

| Metric | Target | Tool |
|--------|--------|------|
| **Uptime** | 99.9% | Vercel dashboard |
| **API Response Time (p95)** | < 200ms | Vercel Analytics |
| **Database Query Time (p95)** | < 50ms | Drizzle logs + monitoring |
| **Error Rate** | < 0.1% | Sentry |
| **Core Web Vitals (LCP)** | < 2.5s | Vercel Analytics |
| **Stripe Webhook Success** | 100% (with retries) | Stripe dashboard |

---

## **SUMMARY**

This architecture provides:

✅ **Fast Setup:** Minimal dependencies, clear folder structure
✅ **Type Safety:** TypeScript throughout frontend and backend
✅ **Scalable:** Can evolve from monolithic to multi-package
✅ **Production-Ready:** Auth, payments, database, monitoring included
✅ **Developer Experience:** Clear conventions, documented patterns
✅ **Cost-Effective:** Serverless pricing, minimal infrastructure

---

**Document Version:** 1.0
**Last Updated:** 2025-10-28
**Next Review:** When project reaches 10K users or major feature added
