# next-sqlite-starter

A minimal, production-ready boilerplate for building SaaS and web applications with Next.js, SQLite, Clerk, and Stripe.

**Features:**

- ✅ Authentication with Clerk (sign up, login, social auth)
- ✅ Database with SQLite + Drizzle ORM
- ✅ Payment integration with Stripe
- ✅ Dark mode toggle
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript support
- ✅ Ready to deploy on Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Clerk account (free)
- Stripe account (free)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/next-sqlite-starter.git
cd next-sqlite-starter
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in the following variables:

**Clerk** - Get from https://dashboard.clerk.com

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Stripe** - Get from https://dashboard.stripe.com

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (needed for webhooks)

### 3. Initialize Database

```bash
npm run db:push
```

This creates the SQLite database with the required schema:

- `users` - User accounts
- `subscriptions` - Subscription/billing data
- `activity_logs` - Activity tracking

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
next-sqlite-starter/
├── app/
│   ├── (auth)/           # Authentication routes (sign-in, sign-up)
│   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── page.tsx      # Dashboard home
│   │   ├── profile/      # User profile page
│   │   ├── settings/     # Settings page
│   │   └── layout.tsx    # Navbar/sidebar layout
│   ├── api/              # API routes
│   │   ├── stripe/       # Stripe webhooks
│   │   └── auth/         # Auth endpoints
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout
├── db/
│   ├── schema.ts         # Drizzle schema
│   ├── migrations/       # Auto-generated migrations
│   └── index.ts          # Database client
├── lib/
│   ├── stripe.ts         # Stripe utilities
│   ├── utils.ts          # Helper functions
│   └── clerk.ts          # Clerk utilities (coming soon)
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── theme-toggle.tsx
└── .env.example          # Example environment variables
```

## Authentication

Uses **Clerk** for secure authentication:

- Sign up with email or social auth (Google, GitHub, etc.)
- Automatic session management
- Built-in password reset
- User profile management

Protected routes use Clerk's middleware. See `middleware.ts` for configuration.

## Database

**SQLite** with **Drizzle ORM** provides a simple, type-safe database layer:

```typescript
import { db, users } from "@/db";

// Query example
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.id, userId),
});
```

**To upgrade to PostgreSQL in production:**

1. Change `drizzle.config.ts` dialect to `"postgresql"`
2. Update `DATABASE_URL` to PostgreSQL connection string
3. Run `npm run db:push` to migrate

## Payments (Stripe)

Stripe integration handles:

- Customer creation
- Subscription checkout
- Webhook processing
- Subscription status tracking

### Set Up Stripe Webhooks Locally

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Paste the signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## UI/Components

Uses **Tailwind CSS** for styling and includes **shadcn/ui** for common components.

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add [component-name]
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Select this repo
4. Add environment variables in "Environment Variables" section
5. Deploy

### Environment Variables for Production

Make sure these are set in Vercel:

- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL` (for PostgreSQL or other database)

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push schema changes to database
npm run db:generate # Generate migrations
```

## Troubleshooting

### Clerk Not Working

- Verify keys in `.env.local` match Clerk dashboard
- Check Clerk middleware is configured in `middleware.ts`

### Stripe Webhooks Not Firing Locally

- Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verify signing secret is in `.env.local`

### Database Errors

- Ensure `DATABASE_URL` is set correctly
- Run `npm run db:push` to sync schema
- Delete `sqlite.db` if corrupted and regenerate

## Future Enhancements

- [ ] Email notifications (Resend/SendGrid)
- [ ] Admin dashboard
- [ ] Analytics
- [ ] REST API documentation
- [ ] CI/CD with GitHub Actions
- [ ] Testing setup (Jest + Playwright)
- [ ] Multi-tenancy support

## License

MIT - Feel free to use this template for your projects!

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Clerk docs: https://clerk.com/docs
3. Review Stripe docs: https://stripe.com/docs
4. Open an issue on GitHub

---

**Happy building!** 🚀
