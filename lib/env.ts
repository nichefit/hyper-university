export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return (
    !!url &&
    !!anon &&
    !url.includes("your-project") &&
    anon !== "your-anon-key"
  );
}

export function requireSupabaseEnv(): { url: string; anon: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local (Supabase → Project Settings → API).",
    );
  }
  if (!anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to .env.local (Supabase → Project Settings → API).",
    );
  }

  return { url, anon };
}

export function getSupabaseEnv() {
  if (!isSupabaseConfigured()) return null;
  return requireSupabaseEnv();
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}
