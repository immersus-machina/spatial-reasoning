import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CubeArrangement, CubeFace, FlatView } from "./cube-types";
import { seededRandom } from "../../tests/seeded-random";

// ── Mocks ──────────────────────────────────────────────────────────────

vi.mock("./cube-arrangement", () => ({
  generateCubeArrangement: vi.fn(),
}));

vi.mock("./cube-views", async (importOriginal) => {
  const original = await importOriginal<typeof import("./cube-views")>();
  return {
    FLAT_VIEW_KEYS: original.FLAT_VIEW_KEYS,
    computeAllFlatViews: vi.fn(),
    rotateFlatViewClockwise: vi.fn(),
    areFlatViewsEqual: vi.fn(),
  };
});

vi.mock("./cube-faces", () => ({
  getRandomDifferentFace: vi.fn(),
}));

// ── Imports (after mocks) ──────────────────────────────────────────────

import { generateCubePuzzle } from "./cube-puzzle";
import { generateCubeArrangement } from "./cube-arrangement";
import {
  computeAllFlatViews,
  rotateFlatViewClockwise,
  areFlatViewsEqual,
} from "./cube-views";
import { getRandomDifferentFace } from "./cube-faces";

// ── Test data ──────────────────────────────────────────────────────────

function makeFlatView(face: CubeFace): FlatView {
  return {
    topLeft: face,
    topCenter: face,
    topRight: face,
    centerLeft: face,
    center: face,
    centerRight: face,
    bottomLeft: face,
    bottomCenter: face,
    bottomRight: face,
  };
}

const FAKE_ARRANGEMENT = [] as unknown as CubeArrangement;

const FAKE_VIEWS: FlatView[] = [
  makeFlatView("frontA"),
  makeFlatView("backA"),
  makeFlatView("frontB"),
  makeFlatView("backB"),
  makeFlatView("frontC"),
  makeFlatView("backC"),
];

const WRONG_VIEW_COUNT = 3;
const ROTATION_COUNT = 4;

// ── Tests ──────────────────────────────────────────────────────────────

describe("generateCubePuzzle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateCubeArrangement).mockReturnValue(FAKE_ARRANGEMENT);
    vi.mocked(computeAllFlatViews).mockReturnValue(FAKE_VIEWS);
    vi.mocked(rotateFlatViewClockwise).mockImplementation((view) => view);
    vi.mocked(areFlatViewsEqual).mockReturnValue(false);
    vi.mocked(getRandomDifferentFace).mockReturnValue("backC");
  });

  it("passes the random function to generateCubeArrangement", () => {
    const random = seededRandom(42);
    generateCubePuzzle(random);

    expect(generateCubeArrangement).toHaveBeenCalledWith(random);
  });

  it("computes flat views from the generated arrangement", () => {
    generateCubePuzzle(seededRandom(42));

    expect(computeAllFlatViews).toHaveBeenCalledWith(FAKE_ARRANGEMENT);
  });

  it("returns the arrangement from generateCubeArrangement", () => {
    const puzzle = generateCubePuzzle(seededRandom(42));

    expect(puzzle.arrangement).toBe(FAKE_ARRANGEMENT);
  });

  it("correct view is one of the computed flat views", () => {
    const puzzle = generateCubePuzzle(seededRandom(42));

    expect(FAKE_VIEWS).toContainEqual(puzzle.correctView);
  });

  it("returns exactly 3 wrong views", () => {
    const puzzle = generateCubePuzzle(seededRandom(42));

    expect(puzzle.wrongViews).toHaveLength(WRONG_VIEW_COUNT);
  });

  it("replaces 1, 2, and 3 positions in the three wrong views respectively", () => {
    generateCubePuzzle(seededRandom(42));

    expect(getRandomDifferentFace).toHaveBeenCalledTimes(1 + 2 + 3);
  });

  it("wrong views contain the replacement face from getRandomDifferentFace", () => {
    const puzzle = generateCubePuzzle(seededRandom(42));

    for (const wrongView of puzzle.wrongViews) {
      const faces = Object.values(wrongView) as CubeFace[];
      expect(faces).toContain("backC");
    }
  });

  it("validates each wrong view against all valid views in all rotations", () => {
    generateCubePuzzle(seededRandom(42));

    expect(areFlatViewsEqual).toHaveBeenCalledTimes(
      WRONG_VIEW_COUNT * FAKE_VIEWS.length * ROTATION_COUNT,
    );
  });

  it("applies rotation to views", () => {
    generateCubePuzzle(seededRandom(42));

    expect(rotateFlatViewClockwise).toHaveBeenCalled();
  });

  it("throws when wrong view generation exhausts retries", () => {
    vi.mocked(areFlatViewsEqual).mockReturnValue(true);

    expect(() => generateCubePuzzle(seededRandom(42))).toThrow(
      /Failed to generate wrong view/,
    );
  });

  it("produces 3 different wrong views", () => {
    const puzzle = generateCubePuzzle(seededRandom(42));

    const wrongViewsAsStrings = puzzle.wrongViews.map((view) =>
      JSON.stringify(view),
    );
    const uniqueWrongViews = new Set(wrongViewsAsStrings);
    expect(uniqueWrongViews.size).toBe(WRONG_VIEW_COUNT);
  });
});
