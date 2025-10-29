# Project Source Tree Structure

## Overview
Complete directory structure of the next-sqlite-starter application, organized by functional domains.

---

## Root Level Files
```
next-sqlite-starter/
├── .clerk/                          # Clerk authentication configuration
├── .github/                         # GitHub workflows and CI/CD
├── app/                             # Next.js App Router (Main Application)
├── components/                      # Shared React components
├── db/                              # Database configuration & schemas
├── lib/                             # Utility libraries and helpers
├── public/                          # Static assets
├── tests/                           # Test suites (unit & e2e)
├── .env.local                       # Environment variables (local)
├── .gitignore                       # Git ignore rules
├── .prettierrc.json                 # Prettier code formatting config
├── components.json                  # UI components metadata
├── drizzle.config.ts                # Drizzle ORM configuration
├── eslint.config.mjs                # ESLint configuration
├── jest.config.js                   # Jest testing configuration
├── jest.setup.js                    # Jest test setup
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                    # Next.js TypeScript definitions
├── package.json                     # Node dependencies & scripts
├── package-lock.json                # Locked dependency versions
├── playwright.config.ts             # Playwright e2e test config
├── postcss.config.mjs               # PostCSS configuration (Tailwind)
├── proxy.ts                         # Proxy/Middleware configuration
├── README.md                        # Project documentation
├── tailwind.config.ts               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

---

## Detailed Directory Structure

### `/app` - Next.js App Router (Main Application)
Primary application code using Next.js App Router pattern.

```
app/
├── (auth)/                          # Route group: Authentication pages
│   ├── layout.tsx                   # Auth layout wrapper
│   ├── sign-in/
│   │   └── [[...rest]]/
│   │       └── page.tsx             # Sign-in page with Clerk integration
│   └── sign-up/
│       └── [[...rest]]/
│           └── page.tsx             # Sign-up page with Clerk integration
│
├── (dashboard)/                     # Route group: Dashboard pages
│   ├── layout.tsx                   # Dashboard layout wrapper
│   └── page.tsx                     # Main dashboard page
│
├── components/                      # App-level reusable components
│   ├── navbar.tsx                   # Navigation bar component
│   └── theme-toggle.tsx             # Dark/light theme toggle
│
├── layout.tsx                       # Root layout wrapper
├── layout-client.tsx                # Client-side layout configuration
├── page.tsx                         # Home/landing page (/)
├── globals.css                      # Global CSS styles
└── favicon.ico                      # Application favicon
```

**Key Features:**
- Route groups (`(auth)`, `(dashboard)`) for logical organization
- Clerk authentication integration (sign-in/sign-up)
- Responsive layout system
- Dark mode support via theme toggle

---

### `/components` - Shared UI Components
Reusable React components across the application.

```
components/
├── ui/                              # Shadcn/ui component library
│   ├── button.tsx                   # Button component
│   ├── card.tsx                     # Card component
│   └── [other-ui-components]/       # Additional UI primitives
│
└── DashboardErrorBoundary.tsx       # Error boundary for dashboard
```

**Purpose:**
- Centralized component library
- Shared UI primitives using shadcn/ui
- Error handling components

---

### `/db` - Database Layer
Database schema, configuration, and migrations.

```
db/
├── index.ts                         # Database connection & exports
└── schema.ts                        # Drizzle ORM schema definitions
```

**Technology Stack:**
- **ORM**: Drizzle ORM
- **Database**: SQLite
- **Configuration**: `drizzle.config.ts` (root level)

---

### `/lib` - Utility Libraries
Shared utilities and helper functions.

```
lib/
├── stripe.ts                        # Stripe payment integration utilities
└── utils.ts                         # General utility functions
```

**Contents:**
- Payment processing (Stripe)
- Common utilities and helpers

---

### `/public` - Static Assets
Public files served by the web server.

```
public/
├── file.svg                         # SVG asset
├── globe.svg                        # SVG asset
├── next.svg                         # Next.js logo
├── vercel.svg                       # Vercel logo
└── window.svg                       # SVG asset
```

---

### `/tests` - Test Suites
Automated testing for unit and end-to-end scenarios.

```
tests/
├── unit/                            # Unit tests
│   ├── dashboard-layout.test.ts     # Dashboard layout component tests
│   ├── middleware.test.ts           # Proxy/middleware tests
│   └── [other-unit-tests]/
│
└── e2e/                             # End-to-end tests
    ├── auth.spec.ts                 # Authentication flow tests
    └── [other-e2e-tests]/
```

**Test Frameworks:**
- **Unit Tests**: Jest
- **E2E Tests**: Playwright

---

### `/.clerk` - Clerk Configuration
Clerk authentication provider configuration.

```
.clerk/
└── .tmp/                            # Temporary Clerk files
    ├── keyless.json                 # Keyless authentication config
    ├── telemetry.json               # Usage telemetry
    └── README.md                    # Clerk setup documentation
```

---

### `/.github` - GitHub Configuration
CI/CD and GitHub-specific configurations.

```
.github/
└── workflows/
    └── ci.yaml                      # Continuous Integration pipeline
```

**Purpose:**
- Automated testing on push/PR
- Build verification

---

## Configuration Files Overview

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options |
| `next.config.ts` | Next.js build and runtime configuration |
| `tailwind.config.ts` | Tailwind CSS theme and plugins |
| `postcss.config.mjs` | PostCSS processors (Tailwind support) |
| `jest.config.js` | Jest test runner configuration |
| `jest.setup.js` | Jest test environment setup |
| `playwright.config.ts` | Playwright e2e test configuration |
| `eslint.config.mjs` | Code linting rules |
| `.prettierrc.json` | Code formatting standards |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `components.json` | UI component library metadata |
| `proxy.ts` | Request proxy/middleware logic |
| `.env.local` | Local environment variables |

---

## Dependency Management

- **Package Manager**: npm
- **Lock File**: `package-lock.json` (all versions locked)
- **Configuration**: `package.json`

---

## Key Architectural Patterns

### Route Organization
- **Route Groups**: `(auth)` and `(dashboard)` organize related routes
- **Dynamic Routes**: `[[...rest]]` for catch-all patterns (Clerk integration)
- **Layouts**: Hierarchical layout structure for inheritance and composition

### Component Structure
- **UI Library**: Shadcn/ui for consistent, accessible components
- **Error Boundaries**: Separate error handling components
- **Theme Support**: Client-side theme toggle for dark/light modes

### Database
- **ORM**: Drizzle for type-safe database queries
- **Database**: SQLite for lightweight, self-contained storage
- **Schema**: Centralized in `db/schema.ts`

### Testing
- **Unit Tests**: Jest for component and utility testing
- **E2E Tests**: Playwright for user flow validation
- **CI/CD**: GitHub Actions for automated testing

### Authentication
- **Provider**: Clerk for managed authentication
- **Integration**: Route group `(auth)` with sign-in/sign-up
- **Configuration**: `.clerk/` directory for provider setup

---

## Development Workflow

1. **Code Changes**: Edit files in `/app`, `/components`, `/lib`
2. **Database Changes**: Update `/db/schema.ts`, run migrations via Drizzle
3. **Styling**: Modify `/app/globals.css` or component-specific styles (Tailwind)
4. **Testing**: Add tests in `/tests/unit` or `/tests/e2e`
5. **Build**: `npm run build` (uses `next.config.ts`)
6. **Deployment**: Configured in GitHub Actions (`/.github/workflows/ci.yaml`)

---

## File Size & Performance Notes

- **node_modules**: Excluded from this tree (see `.gitignore`)
- **.next Build**: Generated on build, excluded from repository
- **Total Source Files**: ~50 tracked files
- **Main Application Code**: ~15 files in `/app`

---

## Summary

The project follows a **modular, feature-driven architecture**:

- ✅ **Clear Route Organization** via route groups
- ✅ **Reusable Components** in centralized `/components`
- ✅ **Type-Safe Database** with Drizzle ORM and SQLite
- ✅ **Comprehensive Testing** with Jest and Playwright
- ✅ **Production Ready** with Clerk auth, Stripe integration, error boundaries
- ✅ **Developer Experience** with TypeScript, Tailwind, and ESLint

