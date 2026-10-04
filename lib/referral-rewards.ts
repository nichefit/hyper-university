export function referralRewardPaise(
  qualifyingAmountPaise: number,
  rewardPercent: number,
): number {
  if (qualifyingAmountPaise <= 0 || rewardPercent <= 0) return 0;
  return Math.floor((qualifyingAmountPaise * rewardPercent) / 100);
}

export function isSelfReferral(
  referrerId: string,
  buyerId: string,
): boolean {
  return referrerId === buyerId;
}

export function isSuspiciousReferral(input: {
  referrerId: string;
  buyerId: string;
  sameIp: boolean;
  sameDeviceFingerprint: boolean;
}): boolean {
  if (isSelfReferral(input.referrerId, input.buyerId)) return true;
  if (input.sameIp && input.sameDeviceFingerprint) return true;
  return false;
}
