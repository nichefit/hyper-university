import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Sign up" };

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <AuthCard title="Create your Infly account">
      <SignUpForm referralCode={searchParams.ref} />
    </AuthCard>
  );
}
