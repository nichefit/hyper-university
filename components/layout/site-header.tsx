"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { LinkButton } from "@/components/ui/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/user-nav";
const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/gigs", label: "Gigs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About" },
];

type SiteHeaderProps = {
  isAuthenticated?: boolean;
  userEmail?: string;
  fullName?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
};

export function SiteHeader({
  isAuthenticated,
  userEmail,
  fullName,
  username,
  avatarUrl,
}: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname === link.href
                  ? "text-white"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserNav
              email={userEmail}
              fullName={fullName}
              username={username}
              avatarUrl={avatarUrl}
            />
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" className="hidden sm:inline-flex">
                Log in
              </LinkButton>
              <LinkButton href="/signup" className="bg-infly-electric text-white hover:bg-infly-electric/90">
                Get started
              </LinkButton>
            </>
          )}

          <Sheet>
            <SheetTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-black">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo href={undefined} />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link href="/login" className="text-lg">
                    Log in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
