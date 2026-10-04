import { isSupabaseConfigured } from "@/lib/env";

export function SupabaseSetupBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div
      className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-100"
      role="status"
    >
      Supabase is not configured. Edit{" "}
      <code className="rounded bg-black/40 px-1">.env.local</code> with your
      real{" "}
      <code className="rounded bg-black/40 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
      and{" "}
      <code className="rounded bg-black/40 px-1">
        NEXT_PUBLIC_SUPABASE_ANON_KEY
      </code>
      , then restart <code className="rounded bg-black/40 px-1">npm run dev</code>
      . See <code className="rounded bg-black/40 px-1">docs/SUPABASE_AUTH_SETUP.md</code>.
    </div>
  );
}
