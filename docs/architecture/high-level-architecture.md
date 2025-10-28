# **HIGH-LEVEL ARCHITECTURE**

## **Technical Summary**

The **next-sqlite-starter** adopts a **monolithic full-stack architecture** deployed on Vercel, combining Next.js 14 (frontend + API routes), Clerk authentication, SQLite with Drizzle ORM, and Stripe integration. This design prioritizes developer experience and minimal setup friction—the frontend and API coexist in the same Next.js application, eliminating deployment complexity while maintaining clear separation of concerns. TypeScript provides type safety across the entire stack, with potential for shared type definitions between frontend and API routes. The architecture is optimized for rapid development, with built-in support for environment variables, dark mode, and responsive UI via shadcn/ui components and Tailwind CSS. External integrations (Clerk for auth, Stripe for payments) are managed through their SDKs, reducing backend complexity.

## **Platform and Infrastructure**

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

## **Repository Structure**

**Structure:** Single-package monorepo (can evolve to multi-package with Turborepo)

**Rationale:**
- Minimal setup overhead (all code in one place initially)
- Shared types/utils via import paths
- Can evolve to `packages/` and `apps/` structure as project grows
- Next.js conventions favor colocation of routes and components

## **High-Level Architecture Diagram**

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

## **Architectural Patterns**

- **Jamstack-Adjacent Architecture:** Server-side rendering with Next.js, dynamic routes, static generation where applicable. Rationale: Combines benefits of static generation and dynamic content for performance.
- **API Routes Pattern:** Next.js API routes serve as lightweight backend endpoints. Rationale: Eliminates need for separate backend server; routes coexist with frontend.
- **Component-Based UI:** React components with shadcn/ui foundations. Rationale: Reusable, maintainable, accessible components.
- **Middleware Authentication:** Clerk middleware protects routes and provides user context. Rationale: Centralized auth, automatic session management.
- **Database Abstraction (ORM):** Drizzle ORM provides type-safe queries and migrations. Rationale: Type safety, easy migrations, lighter weight than Prisma.
- **Webhook Handling:** Stripe webhooks for async payment events. Rationale: Reliable payment confirmation, supports retries.

---
