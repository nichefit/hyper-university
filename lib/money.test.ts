import { describe, expect, it } from "vitest";
import { formatINR, rupeesToPaise, splitCommission } from "./money";

describe("money", () => {
  it("converts rupees to paise", () => {
    expect(rupeesToPaise(10.5)).toBe(1050);
  });

  it("formats INR", () => {
    expect(formatINR(19900)).toContain("199");
  });

  it("splits commission", () => {
    const { platformPaise, creatorPaise } = splitCommission(10000, 20);
    expect(platformPaise).toBe(2000);
    expect(creatorPaise).toBe(8000);
  });
});
