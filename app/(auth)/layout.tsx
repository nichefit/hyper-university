export const dynamic = "force-dynamic";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getServerUser } from "@/lib/auth/get-user";

export default async function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getServerUser();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader
        isAuthenticated={!!user}
        userEmail={user?.email}
        fullName={profile?.full_name}
        username={profile?.username}
        avatarUrl={profile?.avatar_url}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
