# **7. PROJECT STRUCTURE**

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
