import { describe, expect, it } from "vitest";
import { canExchange, exchangePointsToPaise, pointsForAction } from "./points";

describe("points", () => {
  it("resolves rule points", () => {
    expect(
      pointsForAction([{ action: "daily_login", points: 5 }], "daily_login"),
    ).toBe(5);
  });

  it("exchanges points to paise", () => {
    expect(exchangePointsToPaise(100, 100)).toBe(100);
  });

  it("enforces caps", () => {
    expect(canExchange(50, 100, 0, 1000).ok).toBe(false);
    expect(canExchange(200, 100, 900, 1000).ok).toBe(false);
    expect(canExchange(200, 100, 0, 1000).ok).toBe(true);
  });
});
