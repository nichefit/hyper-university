"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { forgotPasswordAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: { email: string }) {
    setLoading(true);
    const result = await forgotPasswordAction(values);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      setSent(true);
      toast.success("Check your email for a reset link");
    }
  }

  return (
    <AuthCard title="Reset password">
      {sent ? (
        <div className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            If an account exists for that email, we sent a password reset link.
          </p>
          <Link href="/login" className="text-infly-electric hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          </div>
          <Button
            type="submit"
            className="w-full bg-infly-electric hover:bg-infly-electric/90"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
