import { describe, it, expect, vi } from "vitest";
import type { CubeFace, GridDepth, GridRow, GridColumn } from "./cube-types";
import { seededRandom } from "../../tests/seeded-random";

// ── Mocks ──────────────────────────────────────────────────────────────

const PERPENDICULAR_MAP: Record<CubeFace, readonly CubeFace[]> = {
  frontA: ["frontB", "backB", "frontC", "backC"],
  backA: ["frontB", "backB", "frontC", "backC"],
  frontB: ["frontA", "backA", "frontC", "backC"],
  backB: ["frontA", "backA", "frontC", "backC"],
  frontC: ["frontA", "backA", "frontB", "backB"],
  backC: ["frontA", "backA", "frontB", "backB"],
};

vi.mock("./cube-faces", () => ({
  getAllFaces: vi.fn(
    (): CubeFace[] => [
      "frontA",
      "backA",
      "frontB",
      "backB",
      "frontC",
      "backC",
    ],
  ),
  getPerpendicularFaces: vi.fn(
    (face: CubeFace): readonly CubeFace[] => PERPENDICULAR_MAP[face],
  ),
}));

// ── Imports (after mocks) ──────────────────────────────────────────────

import { generateCubeArrangement } from "./cube-arrangement";
import { getPerpendicularFaces } from "./cube-faces";

// ── Helpers ────────────────────────────────────────────────────────────

function depthToNumber(d: GridDepth): number {
  switch (d) {
    case "near":
      return 1;
    case "center":
      return 0;
    case "far":
      return -1;
  }
}

// ── Tests ──────────────────────────────────────────────────────────────

describe("generateCubeArrangement", () => {
  it("returns exactly 9 placements", () => {
    const arrangement = generateCubeArrangement(seededRandom(42));

    expect(arrangement).toHaveLength(9);
  });

  it("assigns correct row and column to each cube index", () => {
    const arrangement = generateCubeArrangement(seededRandom(42));
    const expectedRows: GridRow[] = [
      "top",
      "top",
      "top",
      "center",
      "center",
      "center",
      "bottom",
      "bottom",
      "bottom",
    ];
    const expectedColumns: GridColumn[] = [
      "left",
      "center",
      "right",
      "left",
      "center",
      "right",
      "left",
      "center",
      "right",
    ];

    for (let i = 0; i < 9; i++) {
      expect(arrangement[i].row).toBe(expectedRows[i]);
      expect(arrangement[i].column).toBe(expectedColumns[i]);
    }
  });

  it("produces orientations where up face is perpendicular to front face", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));

      for (const cube of arrangement) {
        const perpendicular = PERPENDICULAR_MAP[cube.orientation.facingViewer];
        expect(perpendicular).toContain(cube.orientation.facingUp);
      }
    }
  });

  it("calls getPerpendicularFaces for each cube", () => {
    vi.mocked(getPerpendicularFaces).mockClear();
    generateCubeArrangement(seededRandom(42));

    expect(getPerpendicularFaces).toHaveBeenCalledTimes(9);
  });

  it("limits front face values to at most 3 per face", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));
      const counts = new Map<CubeFace, number>();

      for (const cube of arrangement) {
        const face = cube.orientation.facingViewer;
        counts.set(face, (counts.get(face) ?? 0) + 1);
      }
      for (const count of counts.values()) {
        expect(count).toBeLessThanOrEqual(3);
      }
    }
  });

  it("limits up face values to at most 3 per face", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));
      const counts = new Map<CubeFace, number>();

      for (const cube of arrangement) {
        const face = cube.orientation.facingUp;
        counts.set(face, (counts.get(face) ?? 0) + 1);
      }
      for (const count of counts.values()) {
        expect(count).toBeLessThanOrEqual(3);
      }
    }
  });

  it("produces depth values that are permutations of {near, center, far} per row", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));

      for (let row = 0; row < 3; row++) {
        const rowDepths = [0, 1, 2].map(
          (col) => arrangement[row * 3 + col].depth,
        );
        expect([...rowDepths].sort()).toEqual(["center", "far", "near"]);
      }
    }
  });

  it("produces depth values that are permutations of {near, center, far} per column", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));

      for (let col = 0; col < 3; col++) {
        const colDepths = [0, 1, 2].map(
          (row) => arrangement[row * 3 + col].depth,
        );
        expect([...colDepths].sort()).toEqual(["center", "far", "near"]);
      }
    }
  });

  it("produces depth rows that sum to zero numerically", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));

      for (let row = 0; row < 3; row++) {
        const sum = [0, 1, 2].reduce(
          (s, col) => s + depthToNumber(arrangement[row * 3 + col].depth),
          0,
        );
        expect(sum).toBe(0);
      }
    }
  });

  it("produces depth columns that sum to zero numerically", () => {
    for (let seed = 0; seed < 20; seed++) {
      const arrangement = generateCubeArrangement(seededRandom(seed));

      for (let col = 0; col < 3; col++) {
        const sum = [0, 1, 2].reduce(
          (s, row) => s + depthToNumber(arrangement[row * 3 + col].depth),
          0,
        );
        expect(sum).toBe(0);
      }
    }
  });

  it("is deterministic with the same random seed", () => {
    const a = generateCubeArrangement(seededRandom(99));
    const b = generateCubeArrangement(seededRandom(99));

    expect(a).toEqual(b);
  });
});
