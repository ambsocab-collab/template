# **FRONTEND ARCHITECTURE**

## **Component Organization**

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

## **Protected Route Pattern**

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

## **Frontend Example: Profile Edit Form**

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

## **State Management**

**For MVP:**
- React Context for auth state (provided by Clerk)
- React hooks for local component state
- No global state manager needed

**Future (if needed):**
- Zustand or Redux for complex state
- React Query/SWR for server state

---
