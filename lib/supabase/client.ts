import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { requireSupabaseEnv } from "@/lib/env";

export function createClient() {
  const { url, anon } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, anon);
}
