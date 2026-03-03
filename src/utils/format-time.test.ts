import { describe, it, expect } from "vitest";
import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("formats full minutes", () => {
    expect(formatTime(120_000)).toBe("2:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(90_000)).toBe("1:30");
  });

  it("pads seconds to two digits", () => {
    expect(formatTime(5_000)).toBe("0:05");
  });

  it("rounds up partial seconds", () => {
    expect(formatTime(1_500)).toBe("0:02");
    expect(formatTime(1_001)).toBe("0:02");
  });

  it("clamps negative values to 0:00", () => {
    expect(formatTime(-1000)).toBe("0:00");
  });

  it("shows 0:01 at 1ms remaining", () => {
    expect(formatTime(1)).toBe("0:01");
  });

  it("shows 0:00 at exactly 0", () => {
    expect(formatTime(0)).toBe("0:00");
  });
});
