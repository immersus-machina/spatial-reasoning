import { describe, it, expect } from "vitest";
import type { SphereArrangement } from "./sphere-types";
import {
  ALL_SPHERE_COLORS,
  getColor,
  getRandomDifferentColor,
} from "./sphere-colors";

describe("ALL_SPHERE_COLORS", () => {
  it("has 3 entries", () => {
    expect(ALL_SPHERE_COLORS).toHaveLength(3);
  });
});

describe("getColor", () => {
  const arrangement: SphereArrangement = [
    { position: "nearBottomLeft", color: "red" },
    { position: "nearBottomRight", color: "blue" },
    { position: "nearTopLeft", color: "yellow" },
    { position: "nearTopRight", color: "red" },
    { position: "farBottomLeft", color: "blue" },
    { position: "farBottomRight", color: "yellow" },
    { position: "farTopLeft", color: "red" },
    { position: "farTopRight", color: "blue" },
    { position: "left", color: "red" },
    { position: "right", color: "blue" },
    { position: "bottom", color: "yellow" },
    { position: "top", color: "red" },
    { position: "near", color: "blue" },
    { position: "far", color: "yellow" },
  ];

  it("returns the correct color for a corner position", () => {
    expect(getColor(arrangement, "nearBottomLeft")).toBe("red");
    expect(getColor(arrangement, "farTopRight")).toBe("blue");
  });

  it("returns the correct color for a face position", () => {
    expect(getColor(arrangement, "bottom")).toBe("yellow");
    expect(getColor(arrangement, "near")).toBe("blue");
  });
});

describe("getRandomDifferentColor", () => {
  it("never returns the same color", () => {
    for (const color of ALL_SPHERE_COLORS) {
      for (let i = 0; i < 20; i++) {
        const result = getRandomDifferentColor(color, Math.random);
        expect(result).not.toBe(color);
        expect(ALL_SPHERE_COLORS).toContain(result);
      }
    }
  });

  it("can return either of the other two colors", () => {
    const results = new Set<string>();
    let calls = 0;
    const fakeRandom = () => {
      calls++;
      return calls % 2 === 0 ? 0 : 0.99;
    };
    results.add(getRandomDifferentColor("red", fakeRandom));
    results.add(getRandomDifferentColor("red", fakeRandom));
    expect(results.size).toBe(2);
    expect(results).not.toContain("red");
  });
});
