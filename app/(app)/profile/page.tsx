"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/auth";
import { updateProfileAction } from "@/server/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      college: "",
      city: "",
      website: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select(
          "full_name, bio, college, city, website, twitter, linkedin, instagram",
        )
        .eq("id", user.id)
        .single();
      if (data) {
        form.reset({
          fullName: data.full_name ?? "",
          bio: data.bio ?? "",
          college: data.college ?? "",
          city: data.city ?? "",
          website: data.website ?? "",
          twitter: data.twitter ?? "",
          linkedin: data.linkedin ?? "",
          instagram: data.instagram ?? "",
        });
      }
    });
  }, [form]);

  async function onSubmit(values: ProfileUpdateInput) {
    setLoading(true);
    const result = await updateProfileAction(values);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else toast.success("Profile updated");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Your profile</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-glass-panel p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...form.register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} {...form.register("bio")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Input id="college" {...form.register("college")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register("city")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" {...form.register("website")} />
        </div>
        <Button
          type="submit"
          className="bg-infly-electric hover:bg-infly-electric/90"
          disabled={loading}
        >
          Save changes
        </Button>
      </form>
    </div>
  );
}
