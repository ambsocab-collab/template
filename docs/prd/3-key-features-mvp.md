# **3. KEY FEATURES (MVP)**

## **Core Features**
1. **Autenticación con Clerk**
   - Sign up / Login / Logout
   - Social auth ready (GitHub, Google, etc)
   - Password reset básico
   - Session management automático

2. **Dashboard Autenticado**
   - Landing page pública
   - Dashboard privado para usuarios autenticados
   - Redirección automática (login → dashboard)
   - Layout básico (sidebar/navbar)

3. **Gestión de Usuario**
   - Profile page (editar nombre, email)
   - Avatar básico (Clerk avatar)
   - Settings page estructura básica
   - Delete account option

4. **Integración de Pagos (Stripe)**
   - Setup básico de Stripe
   - Botón "Upgrade" a plan
   - Webhook de confirmación de pago
   - Estado de suscripción en BD

5. **Base de Datos**
   - Schema para: usuarios, suscripciones, logs
   - Drizzle ORM configurado
   - Migrations automáticas
   - SQLite local + instrucciones para producción

6. **UI/UX Básico**
   - Dark mode toggle
   - Mobile responsive (Tailwind CSS)
   - shadcn/ui components
   - Consistent design system

## **Out of Scope (v1)**
- Admin panel avanzado
- Email automáticos (se configura después)
- Analytics integrado
- Multi-tenancy
- API REST documentada

---
