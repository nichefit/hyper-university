/** All money values are stored as integer paise (1 INR = 100 paise). */

export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) throw new Error("Invalid amount");
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paiseToRupees(paise));
}

export function splitCommission(
  grossPaise: number,
  commissionPercent: number,
): { platformPaise: number; creatorPaise: number } {
  if (grossPaise < 0 || commissionPercent < 0 || commissionPercent > 100) {
    throw new Error("Invalid commission split");
  }
  const platformPaise = Math.floor((grossPaise * commissionPercent) / 100);
  const creatorPaise = grossPaise - platformPaise;
  return { platformPaise, creatorPaise };
}
