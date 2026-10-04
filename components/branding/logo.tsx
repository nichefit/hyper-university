import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
  href?: string;
};

export function Logo({ className, showText = true, href = "/" }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Infly"
        width={36}
        height={36}
        className="h-9 w-9 object-contain"
        priority
      />
      {showText && (
        <span className="font-heading text-lg font-bold tracking-[0.2em] text-foreground">
          INFLY
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infly-electric rounded-sm">
        {content}
      </Link>
    );
  }

  return content;
}
