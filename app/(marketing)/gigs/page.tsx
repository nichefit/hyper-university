export const metadata = { title: "Explore gigs" };

export default function GigsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Gig marketplace</h1>
      <p className="mt-2 text-muted-foreground">
        Verified skill badges required to apply. Connect Supabase and publish gigs
        from the client dashboard.
      </p>
    </div>
  );
}
