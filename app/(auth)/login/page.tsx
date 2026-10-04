import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Log in" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <AuthCard title="Welcome back">
      {searchParams.error === "auth" && (
        <p className="mb-4 text-center text-sm text-destructive">
          Sign in failed or the link expired. Try again.
        </p>
      )}
      <SignInForm nextPath={searchParams.next} />
    </AuthCard>
  );
}
