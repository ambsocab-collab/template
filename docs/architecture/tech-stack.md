# **TECH STACK**

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
