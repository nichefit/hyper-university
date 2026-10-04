# Engineering decisions

## 2026-10-04

- **Phone OTP**: Deferred until Supabase phone provider is configured; email + password and Google OAuth are primary.
- **Logo**: `/public/logo.png` placeholder SVG used until user adds asset; "INFLY" text beside logo in nav.
- **Electric accent**: `#3b82f6` (blue) used sparingly on CTAs against black/silver theme.
- **Heading font**: Space Grotesk via `next/font/google`.
- **Admin bootstrap**: First user with role `admin` set via seed SQL or Supabase dashboard after signup.
