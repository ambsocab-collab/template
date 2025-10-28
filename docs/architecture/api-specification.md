# **API SPECIFICATION**

## **REST API Overview**

**Base URL (Production):** `https://next-sqlite-starter.vercel.app`
**Base URL (Local):** `http://localhost:3000`
**Authentication:** Clerk JWT token (auto-included in cookies via middleware)
**Content-Type:** `application/json`

## **Core Endpoints**

### **User Profile API**

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

### **Subscription API**

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

## **Error Response Format**

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
