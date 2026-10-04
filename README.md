# Hyper University (Infly)

Production-oriented Next.js 14 platform for Dropcourse, Learn & Earn (OG), referrals, points, and withdrawals — backed by Supabase.

## Stack

- Next.js 14 App Router, TypeScript (strict)
- Tailwind CSS + shadcn/ui + Framer Motion
- Supabase (Auth, Postgres, RLS, Storage)
- Razorpay, Resend (configure via env)
- TanStack Query, Zod, React Hook Form
- Vitest (money / points / referral logic)

## Quick start

1. Copy environment variables (create `.env.local`):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=Infly <noreply@yourdomain.com>
```

2. Apply migrations in `supabase/migrations` via Supabase SQL editor or CLI, then optional `supabase/seed.sql`.

3. Configure Supabase Auth — see **`docs/SUPABASE_AUTH_SETUP.md`** (Site URL, redirect URLs, Google, email templates).

4. Add your logo at `public/logo.png` (placeholder included).

5. Run:

```bash
npm install
npm run dev
```

6. **First admin**: sign up, then in SQL:

```sql
insert into public.user_roles (user_id, role)
values ('<your-auth-user-uuid>', 'admin')
on conflict do nothing;
```

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Local dev server           |
| `npm run build`| Production build           |
| `npm test`     | Unit tests                 |
| `npm run lint` | ESLint                     |

## Deploy (Vercel)

Connect repo, set the same env vars, deploy. Run migrations on your Supabase project before going live.

## Build phases

See `PROJECT_BRIEF.md` and `DECISIONS.md`. Phase 1 (foundation) is implemented; platform SQL migrations and unit-test core are in place. Remaining product surfaces (full Dropcourse builder, Razorpay checkout, ads workflow, gigs/escrow, admin CSV, Playwright) continue on the roadmap in the brief.
