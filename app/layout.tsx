import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/providers/app-providers";
import { SupabaseSetupBanner } from "@/components/setup/supabase-setup-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "Infly — Hyper University",
    template: "%s | Infly",
  },
  description:
    "Learn, create courses, sell, complete gigs, and earn with Hyper University by Infly.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-black font-sans text-foreground antialiased",
          inter.variable,
          spaceGrotesk.variable,
        )}
      >
        <AppProviders>
          <SupabaseSetupBanner />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
