import { describe, expect, it } from "vitest";
import {
  isSelfReferral,
  isSuspiciousReferral,
  referralRewardPaise,
} from "./referral-rewards";

describe("referral rewards", () => {
  it("calculates reward", () => {
    expect(referralRewardPaise(100000, 10)).toBe(10000);
  });

  it("blocks self referral", () => {
    expect(isSelfReferral("a", "a")).toBe(true);
  });

  it("flags suspicious patterns", () => {
    expect(
      isSuspiciousReferral({
        referrerId: "a",
        buyerId: "b",
        sameIp: true,
        sameDeviceFingerprint: true,
      }),
    ).toBe(true);
  });
});
