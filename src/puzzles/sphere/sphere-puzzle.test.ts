import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  Neighborhood,
  SphereArrangement,
  SphereColor,
} from "./sphere-types";
import { seededRandom } from "../../tests/seeded-random";

// ── Mocks ──────────────────────────────────────────────────────────────

vi.mock("./sphere-arrangement", () => ({
  generateSphereArrangement: vi.fn(),
}));

vi.mock("./sphere-neighborhoods", () => ({
  computeAllNeighborhoods: vi.fn(),
  areNeighborhoodsEqual: vi.fn(),
  rotateRing: vi.fn(),
}));

vi.mock("./sphere-colors", () => ({
  getRandomDifferentColor: vi.fn(),
}));

vi.mock("./sphere-topology", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("./sphere-topology")>();
  return {
    ALL_CORNER_POSITIONS: original.ALL_CORNER_POSITIONS,
  };
});

// ── Imports (after mocks) ──────────────────────────────────────────────

import { generateSpherePuzzle } from "./sphere-puzzle";
import { generateSphereArrangement } from "./sphere-arrangement";
import {
  computeAllNeighborhoods,
  areNeighborhoodsEqual,
  rotateRing,
} from "./sphere-neighborhoods";
import { getRandomDifferentColor } from "./sphere-colors";

// ── Test data ──────────────────────────────────────────────────────────

const FAKE_ARRANGEMENT = {} as unknown as SphereArrangement;

const C: SphereColor[] = ["red", "blue", "yellow"];

// Each neighborhood must be unique under JSON serialization so that
// pickDistinctIndices produces distinct correct answers.
const FAKE_NEIGHBORHOODS: Neighborhood[] = [
  { center: C[0], ring: [C[0], C[0], C[0], C[0], C[0], C[0]] },
  { center: C[1], ring: [C[1], C[1], C[1], C[1], C[1], C[1]] },
  { center: C[2], ring: [C[2], C[2], C[2], C[2], C[2], C[2]] },
  { center: C[0], ring: [C[1], C[0], C[0], C[0], C[0], C[0]] },
  { center: C[1], ring: [C[2], C[1], C[1], C[1], C[1], C[1]] },
  { center: C[2], ring: [C[0], C[2], C[2], C[2], C[2], C[2]] },
  { center: C[0], ring: [C[2], C[1], C[0], C[0], C[0], C[0]] },
  { center: C[1], ring: [C[0], C[2], C[1], C[1], C[1], C[1]] },
];

// ── Tests ──────────────────────────────────────────────────────────────

describe("generateSpherePuzzle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateSphereArrangement).mockReturnValue(FAKE_ARRANGEMENT);
    vi.mocked(computeAllNeighborhoods).mockReturnValue(FAKE_NEIGHBORHOODS);
    vi.mocked(rotateRing).mockImplementation((ring) => ring);
    vi.mocked(areNeighborhoodsEqual).mockReturnValue(false);
    vi.mocked(getRandomDifferentColor).mockReturnValue("yellow");
  });

  it("passes the random function to generateSphereArrangement", () => {
    const random = seededRandom(42);
    generateSpherePuzzle(random);

    expect(generateSphereArrangement).toHaveBeenCalledWith(random);
  });

  it("computes neighborhoods from the generated arrangement", () => {
    generateSpherePuzzle(seededRandom(42));

    expect(computeAllNeighborhoods).toHaveBeenCalledWith(FAKE_ARRANGEMENT);
  });

  it("returns the arrangement from generateSphereArrangement", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    expect(puzzle.arrangement).toBe(FAKE_ARRANGEMENT);
  });

  it("returns exactly 3 correct answers", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    expect(puzzle.correctAnswers).toHaveLength(3);
  });

  it("returns exactly 1 wrong answer", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    expect(puzzle.wrongAnswer).toBeDefined();
    expect(puzzle.wrongAnswer.center).toBeDefined();
    expect(puzzle.wrongAnswer.ring).toHaveLength(6);
  });

  it("correct answers have centers from the neighborhoods", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    const validCenters = FAKE_NEIGHBORHOODS.map((n) => n.center);
    for (const correct of puzzle.correctAnswers) {
      expect(validCenters).toContain(correct.center);
    }
  });

  it("wrong answer contains the replacement color from getRandomDifferentColor", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    const wrong = puzzle.wrongAnswer;
    const allColors = [wrong.center, ...wrong.ring];
    expect(allColors).toContain("yellow");
  });

  it("validates wrong answer against all neighborhoods under rotation", () => {
    generateSpherePuzzle(seededRandom(42));

    expect(areNeighborhoodsEqual).toHaveBeenCalled();
  });

  it("throws when wrong answer generation exhausts retries", () => {
    vi.mocked(areNeighborhoodsEqual).mockReturnValue(true);

    expect(() => generateSpherePuzzle(seededRandom(42))).toThrow(
      /Failed to generate valid wrong answer/,
    );
  });

  it("uses rotateRing for random ring rotation", () => {
    generateSpherePuzzle(seededRandom(42));

    expect(rotateRing).toHaveBeenCalled();
  });

  it("correct answers come from distinct neighborhoods", () => {
    const puzzle = generateSpherePuzzle(seededRandom(42));

    const correctCenters = puzzle.correctAnswers.map((c) =>
      JSON.stringify(c),
    );
    const uniqueCorrect = new Set(correctCenters);
    expect(uniqueCorrect.size).toBe(3);
  });
});
