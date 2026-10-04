import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const SAFE_NEXT = /^\/(?!\/)([a-zA-Z0-9/_-]+)?$/;

export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !SAFE_NEXT.test(next) || next.startsWith("/login")) {
    return "/dashboard";
  }
  return next;
}

export async function resolvePostAuthPath(
  supabase: SupabaseClient<Database>,
  userId: string,
  next?: string | null,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    return "/onboarding";
  }

  return sanitizeNextPath(next);
}
