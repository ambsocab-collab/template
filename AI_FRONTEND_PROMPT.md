# 🎨 AI FRONTEND GENERATION PROMPT

## next-sqlite-starter

---

## **Project Context**

```
PROJECT: next-sqlite-starter (SaaS Starter Template)
PURPOSE: Minimal, production-ready boilerplate for launching SaaS apps quickly
TECH STACK: Next.js 14+ (App Router, TypeScript) | Clerk Auth | SQLite + Drizzle ORM | Stripe | Tailwind CSS | shadcn/ui
DESIGN SYSTEM: Dark mode toggle, mobile-first responsive, minimalist aesthetic
TARGET USERS: Indie developers, early-stage startups, rapid prototypers
```

---

## **HIGH-LEVEL GOAL**

Generate a complete, responsive Next.js frontend for a SaaS starter template featuring:
- Public landing page with call-to-action
- Clerk authentication (sign up/login/logout)
- Private authenticated dashboard with navigation
- User profile & settings pages
- Stripe subscription upgrade flow
- Dark mode toggle
- Mobile-first, responsive design using Tailwind CSS + shadcn/ui

---

## **DETAILED STEP-BY-STEP INSTRUCTIONS**

### **Part 1: Landing Page** (`app/page.tsx`)

1. Create a full-screen landing page with a **hero section** featuring:
   - Bold headline: "Launch Your SaaS in Days, Not Weeks"
   - Subheading: "A minimalist full-stack template with auth, database, and payments pre-configured"
   - Primary CTA button: "Get Started" (links to Clerk sign-up)
   - Secondary CTA: "View Documentation" (links to docs)

2. Add a **Features Section** with 3 columns (mobile: stacked) showcasing:
   - Feature 1: "Clerk Authentication" + icon
   - Feature 2: "SQLite Database + Drizzle ORM" + icon
   - Feature 3: "Stripe Payments Ready" + icon

3. Add a **Pricing Preview Section** showing 2 tiers (Free & Pro) with a basic comparison table

4. Add a **Footer** with:
   - Quick links (GitHub, Docs, Support)
   - Copyright notice
   - Made with ❤️

5. **Design Constraints**:
   - Use a gradient background (dark mode: dark blue/purple; light mode: light gray/white)
   - Color palette: Primary accent color (e.g., indigo-600), neutral grays
   - Typography: Large, bold headings (1.875rem+); body text (1rem)
   - Spacing: Generous padding (2rem-4rem sections)
   - Mobile: 1 column layout, touch-friendly buttons (min 44px height)

---

### **Part 2: Authentication Layout** (`app/(auth)/layout.tsx`)

1. Create a centered authentication layout that wraps sign-in and sign-up pages
2. Display the app logo/name on the left OR top
3. Use a clean card design (rounded borders, subtle shadow)
4. Responsive: Desktop (2 columns), Mobile (1 column, centered)

---

### **Part 3: Dashboard Layout** (`app/(dashboard)/layout.tsx`)

1. Create a responsive dashboard layout with:
   - **Top Navbar** (mobile: 48px height):
     - Left: App logo/home link
     - Center: Page title/breadcrumbs
     - Right: User avatar dropdown + dark mode toggle

   - **Sidebar** (desktop only, 256px width):
     - Logo at top
     - Navigation links:
       - Home (dashboard)
       - Profile
       - Settings
       - Upgrade (Stripe)
     - User card at bottom with avatar + name + logout

   - **Mobile Menu** (hamburger icon, slides in from left):
     - Same links as sidebar
     - Closes on link click

2. **Responsive Behavior**:
   - Desktop (≥768px): Sidebar visible + navbar
   - Tablet (640-768px): Collapsible sidebar + navbar
   - Mobile (<640px): Hamburger menu + navbar

3. **Design**: Subtle borders between sections, consistent spacing, dark mode support

---

### **Part 4: Dashboard Home Page** (`app/(dashboard)/page.tsx`)

1. Display a **Welcome Section**:
   - "Welcome back, {User.firstName}!"
   - Show current subscription status (Free or Pro)
   - Display a banner if subscription is about to expire

2. Create a **Quick Stats Grid** (responsive: 1 col mobile, 2 col tablet, 3+ col desktop):
   - Card 1: "Subscription Status" → "Pro" or "Free" (with icon)
   - Card 2: "Next Billing Date" → Date (if subscribed)
   - Card 3: "Account Created" → Date

3. Add an **Action Cards Section**:
   - Card 1: "Complete Your Profile" (link to `/profile`)
   - Card 2: "Upgrade to Pro" (link to Stripe checkout) - only show if Free user
   - Card 3: "Manage Subscription" (link to `/settings`) - only show if Pro user

4. **Design**: Light background cards, clear typography, plenty of whitespace

---

### **Part 5: Profile Page** (`app/(dashboard)/profile/page.tsx`)

1. Create a **Profile Form** with sections:

   **Section A: Profile Information**
   - Input: First Name (required)
   - Input: Last Name (required)
   - Input: Email (read-only, from Clerk)
   - Button: "Save Changes" (disabled if no changes)
   - Success toast on save

   **Section B: Avatar** (optional)
   - Display current avatar (from Clerk)
   - Button: "Change Avatar" (links to Clerk profile manager, or show upload option)

2. **Form Behavior**:
   - Show form validation errors below each field
   - Disable submit button while loading
   - Show success/error toast notifications

3. **Design**: Two-column form (desktop), single column (mobile), light input fields with subtle focus states

---

### **Part 6: Settings Page** (`app/(dashboard)/settings/page.tsx`)

1. Create **Settings Tabs or Sections**:

   **Tab 1: Preferences**
   - Toggle: "Dark Mode" (uses theme context)
   - Toggle: "Email Notifications" (placeholder for future)
   - Select: "Timezone" (placeholder)
   - Button: "Save Preferences"

   **Tab 2: Billing**
   - Current Plan: "Free" or "Pro" (with badge)
   - Next Billing Date: (if Pro)
   - Button: "View Subscription Details" (links to settings/subscription)
   - Button: "Upgrade to Pro" (if Free) - links to Stripe

   **Tab 3: Danger Zone**
   - Text: "Irreversible Actions"
   - Button: "Delete Account" (red, shows confirmation modal)
   - On confirm: Call API to delete user account

2. **Design**: Light background, tab navigation (or collapsible sections), danger actions in red

---

### **Part 7: Upgrade/Checkout Flow** (Stripe Integration)

1. Create a **Pricing Page** (`app/(dashboard)/settings/subscription` or similar):
   - Show 2 plan cards side-by-side (Free vs Pro)
   - Free plan: Show current badge
   - Pro plan: Show price, features list, "Upgrade" button
   - On "Upgrade" click: Redirect to Stripe Checkout (server-side)

2. **Checkout Success Page** (`app/checkout/success`):
   - Celebratory message: "Welcome to Pro! 🎉"
   - Show next steps
   - Button: "Return to Dashboard"

3. **Design**: Clear pricing cards, green CTA for upgrade, confetti animation on success (optional)

---

## **CODE EXAMPLES, DATA STRUCTURES & CONSTRAINTS**

### **Environment Variables (Expected)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
DATABASE_URL=file:./local.db
NEXT_PUBLIC_APP_URL=http://localhost:3000 (dev) or https://yourdomain.com (prod)
```

### **User Data Structure** (from Clerk + DB)
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

interface Subscription {
  userId: string;
  plan: "free" | "pro";
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  status: "active" | "cancelled" | "past_due";
}
```

### **Design System Colors** (Tailwind)
- **Primary**: `indigo-600` (interactive elements)
- **Secondary**: `gray-600` (secondary text)
- **Background**: `white` (light mode) / `gray-950` (dark mode)
- **Card Background**: `gray-50` (light) / `gray-900` (dark)
- **Borders**: `gray-200` (light) / `gray-800` (dark)
- **Success**: `green-600`
- **Warning**: `yellow-600`
- **Danger**: `red-600`

### **Component Library**
- Use **shadcn/ui** components wherever available:
  - Button, Input, Card, Avatar, Dropdown Menu, Tabs, Modal/Dialog, Toast notifications
- Do NOT use external UI libraries beyond shadcn/ui
- Do NOT add external animation libraries (use Tailwind animations only)

### **What NOT to Do**
- Do NOT create or modify any backend API files
- Do NOT add form submission handlers that call undocumented endpoints
- Do NOT hardcode user data; always fetch from Clerk or the database
- Do NOT add analytics, tracking, or third-party scripts
- Do NOT modify the database schema or migrations
- Do NOT use client-side only routing; use Next.js App Router navigation

---

## **STRICT SCOPE DEFINITION**

### **Files You MUST Create**
```
app/page.tsx                           → Landing page
app/(auth)/layout.tsx                  → Auth layout wrapper
app/(auth)/sign-in/page.tsx            → Sign-in page (Clerk)
app/(auth)/sign-up/page.tsx            → Sign-up page (Clerk)
app/(dashboard)/layout.tsx             → Dashboard layout (navbar + sidebar)
app/(dashboard)/page.tsx               → Dashboard home
app/(dashboard)/profile/page.tsx       → Profile edit page
app/(dashboard)/settings/page.tsx      → Settings page
app/(dashboard)/settings/subscription/ → Subscription management (optional)
app/checkout/success/page.tsx          → Stripe success page
components/navbar.tsx                  → Top navigation component
components/sidebar.tsx                 → Sidebar navigation component
components/theme-toggle.tsx            → Dark mode toggle button
components/ui/*                        → shadcn/ui components (as needed)
```

### **Files You MUST NOT Modify or Create**
- Any files in `app/api/` (backend is separate)
- `db/` folder (database schema is separate)
- `lib/stripe.ts`, `lib/clerk.ts`, `lib/db.ts` (utilities are separate)
- `package.json` (dependencies managed separately)
- `.env.local` (environment config is separate)

### **Navigation/Routing Constraints**
- Use Next.js `<Link>` from `next/link` for all internal navigation
- Use Next.js `useRouter` for programmatic navigation after Stripe redirect
- Protect dashboard routes with Clerk middleware (already configured in `middleware.ts`)
- Public routes: `/`, `/(auth)/*`
- Protected routes: `/(dashboard)/*`, `/checkout/*`

---

## **DESIGN SYSTEM GUIDELINES**

### **Spacing Scale** (Tailwind):
- Gaps/padding: `px-4`, `py-2` (mobile); `px-6`, `py-4` (desktop)
- Section spacing: `mt-8`, `mb-8` between sections

### **Typography**:
- Headings: `text-3xl` (page title), `text-2xl` (section), `text-xl` (cards)
- Body: `text-base` (normal), `text-sm` (secondary)
- Font family: System default (Tailwind default)

### **Buttons**:
- Primary: `bg-indigo-600 hover:bg-indigo-700 text-white`
- Secondary: `bg-gray-200 hover:bg-gray-300 text-gray-900`
- Danger: `bg-red-600 hover:bg-red-700 text-white`

### **Cards**:
- `bg-white dark:bg-gray-900`
- `border border-gray-200 dark:border-gray-800`
- `rounded-lg p-6`
- Subtle shadow: `shadow-sm`

### **Responsive Breakpoints**:
- Mobile: `<640px`
- Tablet: `640px-768px`
- Desktop: `≥768px`

---

## **HOW TO USE THIS PROMPT**

1. **Copy the prompt content** (from "PROJECT: next-sqlite-starter" onwards)
2. **Paste into Vercel v0 or Lovable.ai**
3. **Start with one component at a time**:
   - First: Landing page
   - Second: Auth layout
   - Third: Dashboard layout + home page
   - Then: Individual dashboard pages (profile, settings, etc.)
4. **Review and refine** each output before moving to the next
5. **Ask follow-up questions** if the AI output needs tweaks (colors, spacing, behavior, etc.)

---

## **IMPORTANT REMINDERS**

✅ **All AI-generated code will require:**
- Human review for code quality and security
- Testing on multiple devices (mobile, tablet, desktop)
- Refinement for your specific brand colors and messaging
- Integration testing with actual Clerk and Stripe accounts

✅ **After code generation:**
- Check TypeScript types match your backend
- Test Clerk authentication flow end-to-end
- Test Stripe redirect and success page flow
- Ensure dark mode works correctly across all pages
- Verify mobile responsiveness on real devices

---

**Generated for: next-sqlite-starter**
**Date: 2025-10-28**
**Ready to use with: Vercel v0, Lovable.ai, or similar AI frontend tools**