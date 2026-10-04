# Supabase Auth configuration

## Environment (`.env.local`)

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...   # optional; admin route checks in middleware
```

Run SQL migrations in order under `supabase/migrations/`.

---

## Authentication → URL configuration

| Setting | Localhost | Production (example) |
|--------|-----------|----------------------|
| **Site URL** | `http://localhost:3000` | `https://your-domain.com` |
| **Redirect URLs** (add each) | `http://localhost:3000/auth/callback` | `https://your-domain.com/auth/callback` |
| | `http://localhost:3000/**` | `https://your-domain.com/**` |

Supabase must allow the callback URL used in code: `{NEXT_PUBLIC_APP_URL}/auth/callback`.

---

## Email auth

1. **Authentication → Providers → Email**: enable Email provider.
2. **Confirm email**: turn **on** if you want verification before login (recommended).
3. **Authentication → Email templates**:
   - **Confirm signup**: link should use `{{ .ConfirmationURL }}` (default). Redirect lands on `/auth/callback` via `emailRedirectTo` in sign-up.
   - **Reset password**: default template; link redirects through `/auth/callback?next=/reset-password`.

---

## Google OAuth

1. **Authentication → Providers → Google**: enable.
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Application type: **Web application**
   - **Authorized JavaScript origins**: `http://localhost:3000`, `https://your-domain.com`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (from Supabase Google provider page)
3. Paste **Client ID** and **Client Secret** into Supabase Google provider settings.

---

## Database

Apply migrations. New users get a `profiles` row via trigger `handle_new_user` with `referral_code`, optional `referred_by`, and `role = 'user'`.

**Promote admin:**

```sql
update public.profiles set role = 'admin' where id = 'YOUR_USER_UUID';
```

---

## App routes

| Route | Purpose |
|-------|---------|
| `/signup` | Register |
| `/login` | Email / Google login |
| `/verify-email` | Post-signup + resend |
| `/forgot-password` | Request reset email |
| `/reset-password` | Set new password (after email link) |
| `/auth/callback` | OAuth + email link code exchange |
| `/onboarding` | Path selection until `onboarding_completed` |
| `/dashboard` | Home after onboarding |

Protected (login required): `/dashboard`, `/admin`, `/onboarding`, `/wallet`, `/creator`, `/profile`.
