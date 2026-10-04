import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted-foreground">
        Complete setup or connect Supabase migrations to load your profile.
      </div>
    );
  }

  const pathLabel =
    profile.path === "direct_selling" ? "Direct Selling" : "Learn & Earn";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">
          Hey, {profile.full_name?.split(" ")[0] ?? "creator"}
        </h1>
        <p className="text-muted-foreground">
          Path: {pathLabel} · Referral code{" "}
          <span className="font-mono text-white">{profile.referral_code}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Cash balance", value: "₹0" },
          { label: "Points", value: "0" },
          { label: "Rank", value: "—" },
          { label: "Courses", value: "0" },
        ].map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-glass-panel">
        <CardHeader>
          <CardTitle className="font-heading">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <LinkButton
            href="/creator/courses/new"
            className="bg-infly-electric hover:bg-infly-electric/90"
          >
            Create Dropcourse
          </LinkButton>
          <LinkButton href="/learn/tracks" variant="outline" className="border-white/15">
            Browse learning tracks
          </LinkButton>
          <LinkButton href="/gigs" variant="outline" className="border-white/15">
            Find gigs
          </LinkButton>
          <LinkButton href="/profile" variant="outline" className="border-white/15">
            Edit profile
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
