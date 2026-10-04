export const metadata = { title: "Wallet" };

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Wallet</h1>
      <p className="mt-2 text-muted-foreground">
        Cash balance, points, and withdrawals will appear here.
      </p>
    </div>
  );
}
