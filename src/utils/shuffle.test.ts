import { describe, it, expect } from "vitest";
import { shuffleWithCorrect } from "./shuffle";

describe("shuffleWithCorrect", () => {
  it("returns all items", () => {
    const result = shuffleWithCorrect("a", ["b", "c", "d"]);
    expect(result.items).toHaveLength(4);
    expect(result.items.sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("correctIndex points to the correct item", () => {
    const correct = { value: "correct" };
    const wrong = [{ value: "w1" }, { value: "w2" }, { value: "w3" }] as const;
    const result = shuffleWithCorrect(correct, wrong);
    expect(result.items[result.correctIndex]).toBe(correct);
  });

  it("shuffles deterministically with a seeded random", () => {
    let i = 0;
    const values = [0.1, 0.9, 0.3, 0.7, 0.5, 0.2];
    const seeded = () => values[i++];

    const result = shuffleWithCorrect("a", ["b", "c", "d"], seeded);
    expect(result.items[result.correctIndex]).toBe("a");
  });

  it("works with two items", () => {
    const result = shuffleWithCorrect("correct", ["wrong"]);
    expect(result.items).toHaveLength(2);
    expect(result.items[result.correctIndex]).toBe("correct");
  });

  it("tracks correctIndex through multiple swaps", () => {
    // Run many times to exercise different shuffle paths
    for (let run = 0; run < 50; run++) {
      const correct = Symbol("correct");
      const wrong = [Symbol("w1"), Symbol("w2"), Symbol("w3")];
      const result = shuffleWithCorrect(correct, wrong);
      expect(result.items[result.correctIndex]).toBe(correct);
    }
  });
});
