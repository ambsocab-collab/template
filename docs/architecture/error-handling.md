# **ERROR HANDLING**

## **API Error Response Format**

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

## **Frontend Error Handling**

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

## **Backend Error Handling**

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

## **Common Error Codes**

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
