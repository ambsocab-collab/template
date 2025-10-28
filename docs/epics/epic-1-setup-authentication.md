# EPIC 1: SETUP & AUTHENTICATION

**Duration:** 2 days (10 hours)
**Priority:** 🔴 CRITICAL (blocks all other epics)
**Acceptance Criteria:**
- [ ] Next.js project initializes and runs locally
- [ ] Clerk authentication fully integrated
- [ ] Auth middleware protects dashboard routes
- [ ] User can sign up, sign in, and log out
- [ ] No TypeScript errors

---

## Story 1.1: Initialize Next.js Project

**Acceptance Criteria:**
- [ ] `next create-app@latest` executed with App Router
- [ ] Tailwind CSS configured
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] `npm run dev` starts server on port 3000
- [ ] `npm run build` succeeds without errors
- [ ] `.gitignore` includes `.env.local`, `node_modules`, `.next`

**Subtasks:**
```
1. Run: npx create-next-app@latest next-sqlite-starter
   - Select: App Router (yes)
   - TypeScript (yes)
   - Tailwind (yes)
   - ESLint (yes)

2. Verify: npm run dev → http://localhost:3000 loads

3. Configure TypeScript:
   - Edit tsconfig.json: strict: true
   - Run: npm run type-check (should pass)

4. Configure ESLint + Prettier:
   - Create .eslintrc.json
   - Create .prettierrc.json
   - Add scripts to package.json

5. Create .github/workflows/ci.yaml for CI/CD
```

**Assigned to:** Lead Developer
**Estimated:** 2-3 hours
**Dependency:** None

---

## Story 1.2: Install Core Dependencies

**Acceptance Criteria:**
- [ ] All dependencies installed via `npm install`
- [ ] No peer dependency warnings
- [ ] `package.json` lock file committed

**Dependencies to Install:**
```bash
npm install @clerk/nextjs@latest clerk
npm install drizzle-orm better-sqlite3
npm install stripe
npm install shadcn-ui
npm install tailwindcss postcss autoprefixer
npm install zod  # for validation

npm install --save-dev @types/better-sqlite3
npm install --save-dev drizzle-kit
npm install --save-dev jest @testing-library/react
npm install --save-dev playwright
npm install --save-dev @playwright/test
```

**Subtasks:**
```
1. Run: npm install (all packages above)
2. Verify: npm list (no errors)
3. Check: npx next info (Next.js 14+ confirmed)
4. Commit: git add package-lock.json && git commit
```

**Assigned to:** Lead Developer
**Estimated:** 1-2 hours
**Dependency:** Story 1.1

---

## Story 1.3: Set Up Clerk Authentication

**Acceptance Criteria:**
- [ ] Clerk project created and keys generated
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`
- [ ] Clerk middleware in `middleware.ts` protects dashboard routes
- [ ] Sign-up page at `/sign-up` redirects to Clerk form
- [ ] Sign-in page at `/sign-in` redirects to Clerk form
- [ ] Logged-in user can access `/dashboard`
- [ ] Unauthenticated user redirected to sign-in
- [ ] User can log out (session ends)

**Subtasks:**
```
1. Create Clerk account at https://clerk.com
2. Create new application (next-sqlite-starter)
3. Copy keys to .env.local:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

4. Create app/middleware.ts:
   - Import clerkMiddleware from @clerk/nextjs/server
   - Define protected routes: /(dashboard)(.*)
   - Apply middleware to all requests

5. Create app/(auth)/sign-up/page.tsx:
   - Import SignUp from @clerk/nextjs
   - Export <SignUp />

6. Create app/(auth)/sign-in/page.tsx:
   - Import SignIn from @clerk/nextjs
   - Export <SignIn />

7. Create app/(dashboard)/page.tsx:
   - Fetch user via auth() from @clerk/nextjs/server
   - Return: <h1>Welcome, {user.firstName}!</h1>

8. Test flow:
   - Visit http://localhost:3000
   - Click "Get Started"
   - Sign up with test account
   - Should redirect to /dashboard
   - Verify: user.firstName displayed
```

**Assigned to:** Auth Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.2

---

## Story 1.4: Create Landing Page

**Acceptance Criteria:**
- [ ] Landing page at `/` (public)
- [ ] Shows value prop of app
- [ ] "Get Started" CTA button
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode toggle in navbar
- [ ] No authentication required to view

**Subtasks:**
```
1. Create app/page.tsx (landing page)
   - Import shadcn/ui Button, Card components
   - Create hero section with:
     - Headline: "Build faster with next-sqlite-starter"
     - Subheadline: "All you need for a modern SaaS in one template"
     - CTA Button: <Link href="/sign-up">Get Started</Link>

2. Create app/components/navbar.tsx:
   - Logo/brand name (left)
   - Dark mode toggle (right)
   - Conditionally show "Sign In" / "Dashboard" link based on auth

3. Create app/components/theme-toggle.tsx:
   - Sun/Moon icons
   - onClick: toggle dark/light mode
   - Store preference in localStorage

4. Create app/layout.tsx:
   - Include Clerk provider wrapper
   - Include navbar component
   - Apply theme provider (dark mode)

5. Design features section (3 cards):
   - "Pre-built Authentication"
   - "Database Ready"
   - "Stripe Integration"

6. Mobile responsive check:
   - Test on 375px width (iPhone SE)
   - Verify: text readable, buttons tappable (48px)
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.3

---

## Story 1.5: Create Layout & Navigation

**Acceptance Criteria:**
- [ ] Dashboard sidebar layout (desktop)
- [ ] Hamburger menu (mobile)
- [ ] Navigation items: Home, Profile, Settings
- [ ] User avatar dropdown in top navbar
- [ ] Logout option in dropdown
- [ ] Responsive (sidebar hidden on mobile, hamburger shows)
- [ ] No navigation items visible until authenticated

**Subtasks:**
```
1. Create app/(dashboard)/layout.tsx:
   - Split: sidebar (left) + main content (right)
   - Apply Clerk auth check: redirect unauthenticated

2. Create app/components/sidebar.tsx:
   - Navigation links (Home, Profile, Settings)
   - Active route indicator (bold, colored border)
   - Mobile: Hidden on screens < 768px

3. Create app/components/mobile-nav.tsx:
   - Hamburger icon (☰)
   - onClick: slide in sidebar from left
   - Click outside: close sidebar
   - Mobile-only (> 768px: hidden)

4. Create app/components/navbar.tsx (update):
   - Logo (left)
   - Page title or breadcrumb (center)
   - Dark mode toggle + User avatar (right)
   - Avatar: display user.imageUrl (from Clerk)

5. Create app/components/user-dropdown.tsx:
   - Avatar image (clickable)
   - Dropdown menu:
     - Profile
     - Settings
     - Logout
   - Logout: import { SignOutButton } from @clerk/nextjs

6. Responsive testing:
   - Desktop (1024px+): sidebar always visible
   - Tablet (768px-1023px): sidebar toggleable
   - Mobile (< 768px): hamburger only, sidebar overlay
```

**Assigned to:** Frontend Developer
**Estimated:** 2-3 hours
**Dependency:** Story 1.1, 1.4

---
