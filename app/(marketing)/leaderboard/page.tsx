export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
      <p className="mt-2 text-muted-foreground">
        Rankings update from points ledger snapshots once live data is connected.
      </p>
    </div>
  );
}
