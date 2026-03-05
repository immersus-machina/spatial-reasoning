import { describe, it, expect } from "vitest";
import { pickRandom, pickDistinct, pickDistinctIndices, shuffle } from "./random";
import { seededRandom } from "../tests/seeded-random";

describe("pickRandom", () => {
  it("returns an item from the array", () => {
    const items = ["a", "b", "c"];
    const result = pickRandom(items, seededRandom(42));
    expect(items).toContain(result);
  });
});

describe("pickDistinct", () => {
  it("returns n distinct items", () => {
    const items = [1, 2, 3, 4, 5];
    const result = pickDistinct(items, 3, seededRandom(42));
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it("all items come from the source array", () => {
    const items = ["a", "b", "c", "d"];
    const result = pickDistinct(items, 2, seededRandom(99));
    for (const item of result) {
      expect(items).toContain(item);
    }
  });

  it("returns all items when n equals array length", () => {
    const items = [1, 2, 3];
    const result = pickDistinct(items, 3, seededRandom(42));
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it("does not modify the original array", () => {
    const items = [1, 2, 3, 4] as const;
    pickDistinct(items, 2, seededRandom(42));
    expect(items).toEqual([1, 2, 3, 4]);
  });
});

describe("pickDistinctIndices", () => {
  it("returns count distinct indices in [0, max)", () => {
    const result = pickDistinctIndices(4, 10, seededRandom(42));
    expect(result).toHaveLength(4);
    expect(new Set(result).size).toBe(4);
    for (const idx of result) {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(10);
    }
  });

  it("returns all indices when count equals max", () => {
    const result = pickDistinctIndices(3, 3, seededRandom(42));
    expect(result.sort()).toEqual([0, 1, 2]);
  });
});

describe("shuffle", () => {
  it("returns array with same elements", () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items, seededRandom(42));
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not modify the original array", () => {
    const items = [1, 2, 3];
    shuffle(items, seededRandom(42));
    expect(items).toEqual([1, 2, 3]);
  });

  it("returns same length", () => {
    const result = shuffle(["a", "b", "c", "d"], seededRandom(99));
    expect(result).toHaveLength(4);
  });
});
