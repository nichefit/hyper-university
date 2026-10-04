"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { signInAction, signInWithGoogleAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { toast } from "sonner";

export function SignInForm({ nextPath }: { nextPath?: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", next: nextPath },
  });

  async function onSubmit(values: SignInInput) {
    setLoading(true);
    try {
      const result = await signInAction({ ...values, next: nextPath });
      if (result?.error) toast.error(result.error);
    } catch {
      // redirect
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    const result = await signInWithGoogleAction(nextPath);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-infly-electric hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        className="w-full bg-infly-electric hover:bg-infly-electric/90"
        disabled={loading}
      >
        {loading ? "Logging in…" : "Log in"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full border-white/15"
        onClick={google}
        disabled={loading}
      >
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-infly-electric hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
