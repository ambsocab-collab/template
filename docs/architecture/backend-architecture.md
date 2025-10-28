# **BACKEND ARCHITECTURE**

## **API Route Pattern**

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

## **Stripe Webhook Handler**

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

## **Database Access Patterns**

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
