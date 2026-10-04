"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/server/actions/auth";

export type UserNavProps = {
  email?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  username?: string | null;
};

export function UserNav({
  email,
  fullName,
  avatarUrl,
  username,
}: UserNavProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const displayName = fullName ?? username ?? "Account";
  const initials =
    fullName?.slice(0, 2).toUpperCase() ??
    username?.slice(0, 2).toUpperCase() ??
    email?.slice(0, 2).toUpperCase() ??
    "IN";

  function signOut() {
    startTransition(async () => {
      await signOutAction();
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 rounded-full p-0 outline-none"
        aria-label="Open account menu"
        disabled={pending}
      >
        <Avatar className="h-9 w-9 border border-white/10">
          <AvatarImage src={avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} disabled={pending}>
          {pending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
