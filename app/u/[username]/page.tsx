import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  return { title: `@${params.username}` };
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, username, bio, city, college, avatar_url, skills, path",
    )
    .eq("username", params.username)
    .maybeSingle();

  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border border-white/10">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback>
            {(profile.username ?? "IN").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {profile.full_name}
          </h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>
      </div>
      {profile.bio && <p className="mt-6 text-muted-foreground">{profile.bio}</p>}
      <p className="mt-2 text-sm text-muted-foreground">
        {profile.college} · {profile.city}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(profile.skills as string[] | null)?.map((skill) => (
          <Badge key={skill} variant="secondary">{skill}</Badge>
        ))}
      </div>
    </div>
  );
}
