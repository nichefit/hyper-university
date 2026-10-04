import { LinkButton } from "@/components/ui/link-button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_50%)]" />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-silver">
            Hyper University
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
            <span className="bg-silver-gradient bg-clip-text text-transparent">
              Learn. Create. Earn.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Infly Dropcourse lets you sell what you know. Infly OG helps you
            learn skills and land real gigs — with referrals, points, and
            withdrawals built in.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton
              href="/signup"
              size="lg"
              className="bg-infly-electric hover:bg-infly-electric/90"
            >
              Start free
            </LinkButton>
            <LinkButton href="/courses" size="lg" variant="outline" className="border-white/15">
              Explore courses
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
