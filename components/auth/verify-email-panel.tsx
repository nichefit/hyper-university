"use client";

import { useState } from "react";
import { resendVerificationAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerifyEmailPanel({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function resend() {
    setLoading(true);
    const result = await resendVerificationAction({ email });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else toast.success("Verification email sent");
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        We sent a verification link to{" "}
        <span className="font-medium text-foreground">{email}</span>. Click the
        link to activate your account, then log in.
      </p>
      <Button
        type="button"
        variant="outline"
        className="border-white/15"
        onClick={resend}
        disabled={loading || !email}
      >
        {loading ? "Sending…" : "Resend verification email"}
      </Button>
    </div>
  );
}
