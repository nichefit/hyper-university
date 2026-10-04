import { AuthCard } from "@/components/auth/auth-card";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email ?? "";

  return (
    <AuthCard title="Check your email">
      <VerifyEmailPanel email={email} />
    </AuthCard>
  );
}
