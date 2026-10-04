"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { resetPasswordAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setLoading(true);
    try {
      const result = await resetPasswordAction(values);
      if (result?.error) toast.error(result.error);
    } catch {
      // redirect
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput id="password" {...form.register("password")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput id="confirmPassword" {...form.register("confirmPassword")} />
      </div>
      <Button
        type="submit"
        className="w-full bg-infly-electric hover:bg-infly-electric/90"
        disabled={loading}
      >
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
