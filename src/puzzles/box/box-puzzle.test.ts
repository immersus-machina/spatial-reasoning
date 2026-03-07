import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  BoxArrangement,
  MutableCell,
  ProjectedCell,
  ProjectedView,
  ViewingDirection,
} from "./box-types";
import { seededRandom } from "../../tests/seeded-random";

// ── Mocks ──────────────────────────────────────────────────────────────

vi.mock("./box-arrangement", () => ({
  generateBoxArrangement: vi.fn(),
  reorientForMutability: vi.fn(),
}));

vi.mock("./box-views", () => ({
  computeAllProjectedViews: vi.fn(),
}));

vi.mock("./box-mutability", () => ({
  findMutableCells: vi.fn(),
}));

vi.mock("./box-depth-ambiguity", () => ({
  enforceUniqueDepthMapping: vi.fn(),
}));

vi.mock("./box-shapes", async (importOriginal) => {
  const original = await importOriginal<typeof import("./box-shapes")>();
  return {
    ALL_DIRECTIONS: original.ALL_DIRECTIONS,
    ALL_FLAT_SHAPES: original.ALL_FLAT_SHAPES,
    EASY_FLAT_SHAPES: original.EASY_FLAT_SHAPES,
  };
});

// ── Imports (after mocks) ──────────────────────────────────────────────

import { generateBoxPuzzle } from "./box-puzzle";
import {
  generateBoxArrangement,
  reorientForMutability,
} from "./box-arrangement";
import { computeAllProjectedViews } from "./box-views";
import { findMutableCells } from "./box-mutability";
import { enforceUniqueDepthMapping } from "./box-depth-ambiguity";

// ── Test data ──────────────────────────────────────────────────────────

const FAKE_ARRANGEMENT = {
  gridSize: 3,
  objects: [],
} as unknown as BoxArrangement;

const FAKE_ENFORCED_ARRANGEMENT = {
  gridSize: 3,
  objects: [],
} as unknown as BoxArrangement;

function makeView(direction: ViewingDirection): ProjectedView {
  const cells: ProjectedCell[] = [
    { row: 0, column: 0, shape: "circle", color: "red" },
    { row: 0, column: 1, shape: "square", color: "blue" },
    { row: 1, column: 1, shape: "circle", color: "yellow" },
  ];
  return { direction, gridSize: 3, cells };
}

const FAKE_VIEWS: Record<ViewingDirection, ProjectedView> = {
  top: makeView("top"),
  front: makeView("front"),
  side: makeView("side"),
};

const FAKE_MUTABLE_CELLS: MutableCell[] = [
  { row: 0, column: 0, originalShape: "circle", originalColor: "red", mutations: ["square"] },
  { row: 0, column: 1, originalShape: "square", originalColor: "blue", mutations: ["circle"] },
  { row: 1, column: 1, originalShape: "circle", originalColor: "yellow", mutations: ["square"] },
  { row: 1, column: 0, originalShape: "square", originalColor: "red", mutations: ["circle"] },
];

// ── Tests ──────────────────────────────────────────────────────────────

describe("generateBoxPuzzle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateBoxArrangement).mockReturnValue(FAKE_ARRANGEMENT);
    vi.mocked(enforceUniqueDepthMapping).mockReturnValue(FAKE_ENFORCED_ARRANGEMENT);
    vi.mocked(reorientForMutability).mockReturnValue(FAKE_ARRANGEMENT);
    vi.mocked(computeAllProjectedViews).mockReturnValue(FAKE_VIEWS);
    vi.mocked(findMutableCells).mockReturnValue(FAKE_MUTABLE_CELLS);
  });

  it("passes difficulty and random to generateBoxArrangement", () => {
    const random = seededRandom(42);
    generateBoxPuzzle("easy", random);

    expect(generateBoxArrangement).toHaveBeenCalledWith("easy", random);
  });

  it("does not call reorientForMutability when enough mutable cells", () => {
    generateBoxPuzzle("easy", seededRandom(42));

    expect(reorientForMutability).not.toHaveBeenCalled();
  });

  it("calls reorientForMutability when not enough mutable cells", () => {
    vi.mocked(findMutableCells)
      .mockReturnValueOnce([FAKE_MUTABLE_CELLS[0], FAKE_MUTABLE_CELLS[1]])
      .mockReturnValueOnce(FAKE_MUTABLE_CELLS);

    generateBoxPuzzle("easy", seededRandom(42));

    expect(reorientForMutability).toHaveBeenCalledWith(
      FAKE_ENFORCED_ARRANGEMENT,
      expect.any(String),
      expect.any(Number),
      expect.any(Function),
    );
  });


  it("calls enforceUniqueDepthMapping with arrangement and missing direction", () => {
    const random = seededRandom(42);
    const puzzle = generateBoxPuzzle("hard", random);

    expect(enforceUniqueDepthMapping).toHaveBeenCalledWith(
      FAKE_ARRANGEMENT,
      puzzle.missingDirection,
      random,
    );
  });

  it("computes all views from the enforced arrangement", () => {
    generateBoxPuzzle("easy", seededRandom(42));

    expect(computeAllProjectedViews).toHaveBeenCalledWith(FAKE_ENFORCED_ARRANGEMENT);
  });

  it("calls findMutableCells with enforced arrangement and missing direction", () => {
    const puzzle = generateBoxPuzzle("easy", seededRandom(42));

    expect(findMutableCells).toHaveBeenCalledWith(
      FAKE_ENFORCED_ARRANGEMENT,
      puzzle.missingDirection,
      expect.any(Object),
    );
  });

  it("returns the enforced arrangement", () => {
    const puzzle = generateBoxPuzzle("hard", seededRandom(42));

    expect(puzzle.arrangement).toBe(FAKE_ENFORCED_ARRANGEMENT);
  });

  it("returns exactly 2 known views and 3 wrong views", () => {
    const puzzle = generateBoxPuzzle("easy", seededRandom(42));

    expect(puzzle.knownViews).toHaveLength(2);
    expect(puzzle.wrongViews).toHaveLength(3);
  });

  it("correct view direction matches missingDirection", () => {
    const puzzle = generateBoxPuzzle("hard", seededRandom(33));

    expect(puzzle.correctView.direction).toBe(puzzle.missingDirection);
  });

  it("all 3 directions are covered between known views and missing direction", () => {
    const puzzle = generateBoxPuzzle("easy", seededRandom(55));

    const directions = new Set([
      puzzle.knownViews[0].direction,
      puzzle.knownViews[1].direction,
      puzzle.missingDirection,
    ]);
    expect(directions).toEqual(new Set(["top", "front", "side"]));
  });

  it("known views do not include the missing direction", () => {
    const puzzle = generateBoxPuzzle("hard", seededRandom(99));

    for (const knownView of puzzle.knownViews) {
      expect(knownView.direction).not.toBe(puzzle.missingDirection);
    }
  });

  it("wrong views have same direction and gridSize as correct view", () => {
    const puzzle = generateBoxPuzzle("easy", seededRandom(77));

    for (const wrongView of puzzle.wrongViews) {
      expect(wrongView.direction).toBe(puzzle.correctView.direction);
      expect(wrongView.gridSize).toBe(puzzle.correctView.gridSize);
    }
  });

  it("wrong views differ from correct view (have mutations applied)", () => {
    const puzzle = generateBoxPuzzle("easy", seededRandom(42));

    for (const wrongView of puzzle.wrongViews) {
      const hasDifference = wrongView.cells.some((cell) => {
        const correctCell = puzzle.correctView.cells.find(
          (c) => c.row === cell.row && c.column === cell.column,
        );
        return correctCell && cell.shape !== correctCell.shape;
      });
      expect(hasDifference).toBe(true);
    }
  });

  it("throws when not enough mutable cells", () => {
    vi.mocked(findMutableCells).mockReturnValue([
      FAKE_MUTABLE_CELLS[0],
      FAKE_MUTABLE_CELLS[1],
    ]);

    expect(() => generateBoxPuzzle("easy", seededRandom(42))).toThrow(
      /mutable cells found/,
    );
  });
});
