/** Generate a short unique referral code for new users. */
export function generateReferralCode(seed?: string): string {
  const base = (seed ?? crypto.randomUUID()).replace(/-/g, "").slice(0, 8);
  return `INFLY${base.toUpperCase()}`;
}

export function referralLink(origin: string, code: string): string {
  const url = new URL("/signup", origin);
  url.searchParams.set("ref", code);
  return url.toString();
}
