# **DEVELOPMENT WORKFLOW**

## **Prerequisites**

- Node.js 18+ (verify: `node --version`)
- npm 9+ or pnpm 8+ (recommend pnpm for speed)
- Git
- SQLite3 (usually pre-installed on macOS/Linux; included in npm packages on Windows)

## **Initial Setup**

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

## **Development Commands**

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

## **Environment Variables**

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
