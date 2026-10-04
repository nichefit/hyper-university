import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const AUTH_ROUTES = ["/login", "/signup"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/onboarding",
  "/wallet",
  "/creator",
  "/profile",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

async function isAdmin(userId: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const admin = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

function copyCookies(
  from: NextResponse,
  to: NextResponse,
) {
  from.cookies.getAll().forEach((c) => to.cookies.set(c.name, c.value));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Legacy auth URLs
  if (pathname.startsWith("/auth/login")) {
    const url = new URL("/login", request.url);
    request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/auth/signup")) {
    const url = new URL("/signup", request.url);
    request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    return NextResponse.redirect(url);
  }

  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (!supabase) {
    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  if (user && isAuthRoute(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();
    const dest = profile?.onboarding_completed ? "/dashboard" : "/onboarding";
    const redirect = NextResponse.redirect(new URL(dest, request.url));
    copyCookies(supabaseResponse, redirect);
    return redirect;
  }

  if (!user && isProtectedPath(pathname)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (user && isProtectedPath(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    const onboardingDone = profile?.onboarding_completed ?? false;

    if (!onboardingDone && !pathname.startsWith("/onboarding")) {
      const redirect = NextResponse.redirect(new URL("/onboarding", request.url));
      copyCookies(supabaseResponse, redirect);
      return redirect;
    }

    if (onboardingDone && pathname.startsWith("/onboarding")) {
      const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
      copyCookies(supabaseResponse, redirect);
      return redirect;
    }

    if (pathname.startsWith("/admin") && !(await isAdmin(user.id))) {
      const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
      copyCookies(supabaseResponse, redirect);
      return redirect;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
