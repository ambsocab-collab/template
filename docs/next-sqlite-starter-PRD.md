# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

## **next-sqlite-starter**

**Version**: 1.0
**Date**: 2025-10-28
**Status**: Ready for Development

---

## **1. EXECUTIVE SUMMARY**

**next-sqlite-starter** es una plantilla minimalista de aplicación web full-stack diseñada para desarrolladores que quieren lanzar un SaaS o aplicación web rápidamente sin complejidad innecesaria.

Incluye autenticación (Clerk), base de datos (SQLite + Drizzle ORM), pagos (Stripe) y estructura lista para producción. Sirve como punto de partida para proyectos que pueden expandirse después.

---

## **2. PRODUCT OVERVIEW**

### **What**
Una plantilla boilerplate pre-configurada con las herramientas esenciales para un SaaS MVP.

### **Why**
- Reduce tiempo de setup inicial (de días a minutos)
- Elimina decisiones técnicas repetidas
- Proporciona estructura escalable pero simple
- Enfoque minimalista: solo lo necesario

### **Who**
- Desarrolladores indie/freelancers
- Startups en early-stage
- Equipos que quieren estandarizar stack
- Personas que quieren prototipar rápido

---

## **3. KEY FEATURES (MVP)**

### **Core Features**
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

### **Out of Scope (v1)**
- Admin panel avanzado
- Email automáticos (se configura después)
- Analytics integrado
- Multi-tenancy
- API REST documentada

---

## **4. TECHNICAL STACK**

```
Frontend:       Next.js 14+ (App Router, TypeScript)
Auth:           Clerk
Database:       SQLite + Drizzle ORM
Payments:       Stripe
Styling:        Tailwind CSS + shadcn/ui
Hosting:        Vercel (recomendado)
Package Mgr:    npm/pnpm
Runtime:        Node.js 18+
```

---

## **5. USER FLOWS**

### **Flow 1: Usuario Nuevo → Suscripción**
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

### **Flow 2: Usuario Autenticado**
```
Dashboard (home)
  → Profile (editar datos)
  → Settings (preferencias)
  → Upgrade/Manage Subscription
  → Logout
```

---

## **6. SUCCESS METRICS**

| Métrica | Target |
|---------|--------|
| Setup time | < 5 min para dev experimentado |
| First deployment | < 15 min |
| Code clarity | Fácil de modificar/extender |
| Documentation | Readme claro + inline comments |
| Bundle size | < 200KB (JS minificado) |

---

## **7. PROJECT STRUCTURE**

```
next-sqlite-starter/
├── app/
│   ├── (auth)/
│   │   └── sign-in/ sign-up/
│   ├── (dashboard)/
│   │   ├── page.tsx (dashboard home)
│   │   ├── profile/
│   │   ├── settings/
│   │   └── layout.tsx (navbar/sidebar)
│   ├── api/
│   │   ├── stripe/
│   │   │   └── webhook.ts
│   │   └── auth/
│   ├── page.tsx (landing)
│   └── layout.tsx
├── db/
│   ├── schema.ts (Drizzle schema)
│   ├── migrations/
│   └── index.ts (client)
├── lib/
│   ├── stripe.ts
│   ├── clerk.ts
│   ├── utils.ts
│   └── db.ts
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── theme-toggle.tsx
├── .env.example
├── package.json
└── README.md
```

---

## **8. SETUP INSTRUCTIONS (FOR USERS)**

```bash
# 1. Clone
git clone https://github.com/yourusername/next-sqlite-starter.git
cd next-sqlite-starter

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
# Fill: CLERK_KEY, STRIPE_KEY, DATABASE_URL

# 4. Database
npx drizzle-kit push

# 5. Run
npm run dev

# 6. Deploy
# Push to GitHub → Connect to Vercel → Auto-deploy
```

---

## **9. DEPENDENCIES (MINIMAL)**

```json
{
  "next": "^14.0",
  "react": "^18",
  "@clerk/nextjs": "^latest",
  "drizzle-orm": "^latest",
  "better-sqlite3": "^latest",
  "stripe": "^latest",
  "tailwindcss": "^latest",
  "typescript": "^latest"
}
```

---

## **10. ACCEPTANCE CRITERIA**

- [ ] App runs locally con `npm run dev` sin errores
- [ ] Clerk auth funciona (sign up/login/logout)
- [ ] Dashboard es accesible solo autenticados
- [ ] Stripe webhook recibe y actualiza BD
- [ ] Dark mode toggle funciona
- [ ] Mobile responsive en móvil
- [ ] README tiene instrucciones claras
- [ ] .env.example tiene todas las keys necesarias
- [ ] Deploy a Vercel funciona en 1 click
- [ ] TypeScript sin errores (`tsc --noEmit`)

---

## **11. TIMELINE**

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Setup + Auth | 2-3 días | Clerk integrado |
| Dashboard + DB | 2-3 días | Schema + basic UI |
| Stripe integración | 2-3 días | Payments + webhooks |
| Polish + Deploy | 1-2 días | Docs + Vercel deploy |
| **Total** | **~1 semana** | **Plantilla lista** |

---

## **12. RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|-----------|
| SQLite no escala a millones de usuarios | Docs claras: "Upgrade a PostgreSQL cuando necesites" |
| Stripe webhook testing complicado | Incluir Stripe CLI setup en README |
| Users confused por opciones | Docs + comments en código |
| Setup failures | Troubleshooting section en README |

---

## **13. FUTURE ENHANCEMENTS (v2+)**

- [ ] Email notifications (SendGrid/Resend)
- [ ] Admin dashboard
- [ ] Analytics
- [ ] API REST documentada
- [ ] Database migration guide (SQLite → PostgreSQL)
- [ ] Testing setup (Jest + Playwright)
- [ ] GitHub Actions para CI/CD
- [ ] Multi-tenancy support

---

## **14. DEPENDENCIES & INTEGRATIONS**

- **Clerk API** - Authentication
- **Stripe API** - Payments & webhooks
- **Vercel** - Hosting (optional but recommended)
- **GitHub** - Version control

---

**Next Steps:**
1. ✅ Aprobación de PRD
2. Crear repositorio GitHub
3. Setup inicial (Next.js + Tailwind)
4. Integrar Clerk
5. Drizzle ORM + SQLite
6. Stripe integration
7. Testing & documentación
8. Release v1.0
