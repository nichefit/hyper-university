"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/env";
import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { resolvePostAuthPath } from "@/lib/auth/redirect";
import {
  forgotPasswordSchema,
  onboardingSchema,
  profileUpdateSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

export type ActionResult = { error?: string; success?: boolean };

export async function signUpAction(
  input: unknown,
  referralFromQuery?: string,
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const referral =
    parsed.data.referralCode?.trim().toUpperCase() ||
    referralFromQuery?.trim().toUpperCase() ||
    undefined;

  const supabase = await createClient();
  const appUrl = getAppUrl();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=/onboarding`,
      data: {
        full_name: parsed.data.fullName,
        referral_code_input: referral ?? null,
      },
    },
  });

  if (error) {
    return { error: mapAuthErrorMessage(error.message, error.code) };
  }
  if (!data.user) return { error: "Sign up failed" };

  revalidatePath("/", "layout");
  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signInAction(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthErrorMessage(error.message, error.code) };
  }

  const dest = await resolvePostAuthPath(
    supabase,
    data.user.id,
    parsed.data.next,
  );
  revalidatePath("/", "layout");
  redirect(dest);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
    },
  );

  if (error) return { error: mapAuthErrorMessage(error.message, error.code) };
  return { success: true };
}

export async function resetPasswordAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset link expired. Request a new password reset." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return { error: mapAuthErrorMessage(error.message, error.code) };

  const dest = await resolvePostAuthPath(supabase, user.id, "/dashboard");
  revalidatePath("/", "layout");
  redirect(dest);
}

export async function resendVerificationAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = resendVerificationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback?next=/onboarding`,
    },
  });

  if (error) return { error: mapAuthErrorMessage(error.message, error.code) };
  return { success: true };
}

export async function completeOnboardingAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      username: parsed.data.username,
      college: parsed.data.college,
      city: parsed.data.city,
      skills: parsed.data.skills,
      interests: parsed.data.interests,
      path: parsed.data.path,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function updateProfileAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      bio: parsed.data.bio ?? null,
      college: parsed.data.college ?? null,
      city: parsed.data.city ?? null,
      website: parsed.data.website || null,
      twitter: parsed.data.twitter ?? null,
      linkedin: parsed.data.linkedin ?? null,
      instagram: parsed.data.instagram ?? null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: true };
}

export async function signInWithGoogleAction(next?: string) {
  const supabase = await createClient();
  const appUrl = getAppUrl();
  const nextQuery = next
    ? `?next=${encodeURIComponent(next)}`
    : "?next=%2Fdashboard";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/auth/callback${nextQuery}`,
    },
  });

  if (error) return { error: mapAuthErrorMessage(error.message, error.code) };
  if (data.url) redirect(data.url);
  return { error: "Could not start Google sign in" };
}
