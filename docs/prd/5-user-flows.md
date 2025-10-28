# **5. USER FLOWS**

## **Flow 1: Usuario Nuevo → Suscripción**
```
Landing Page
  → Click "Get Started"
  → Clerk Sign Up
  → Redirect a Dashboard
  → Profile Incomplete Warning
  → Click "Upgrade"
  → Stripe Checkout
  → Webhook → BD Updated
  → Success Page
```

## **Flow 2: Usuario Autenticado**
```
Dashboard (home)
  → Profile (editar datos)
  → Settings (preferencias)
  → Upgrade/Manage Subscription
  → Logout
```

---
