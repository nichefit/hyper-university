export type PointsRule = {
  action: string;
  points: number;
};

export function pointsForAction(
  rules: PointsRule[],
  action: string,
): number {
  const rule = rules.find((r) => r.action === action);
  return rule?.points ?? 0;
}

export function exchangePointsToPaise(
  points: number,
  pointsPerRupee: number,
): number {
  if (points <= 0 || pointsPerRupee <= 0) {
    throw new Error("Invalid exchange");
  }
  const rupees = points / pointsPerRupee;
  return Math.floor(rupees * 100);
}

export function canExchange(
  points: number,
  minPoints: number,
  monthlyExchanged: number,
  monthlyCap: number,
): { ok: boolean; reason?: string } {
  if (points < minPoints) {
    return { ok: false, reason: `Minimum ${minPoints} points required` };
  }
  if (monthlyExchanged + points > monthlyCap) {
    return { ok: false, reason: "Monthly exchange cap reached" };
  }
  return { ok: true };
}
