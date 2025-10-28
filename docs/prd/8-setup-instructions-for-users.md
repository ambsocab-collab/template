# **8. SETUP INSTRUCTIONS (FOR USERS)**

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
