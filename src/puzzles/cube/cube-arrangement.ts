/**
 * Arrangement generation for the cube puzzle.
 *
 * Builds a CubeArrangement of 9 cubes, each with:
 *   - An orientation (which face points toward the viewer, which points up)
 *   - A grid position (row, column, depth)
 *
 * Constraints:
 *   - At most 3 cubes share the same front face value
 *   - At most 3 cubes share the same up face value
 *   - Each row of 3 depths is a permutation of {near, center, far}
 *   - Each column of 3 depths is a permutation of {near, center, far}
 */

import type {
  CubeArrangement,
  CubeFace,
  CubeOrientation,
  CubePlacement,
  GridColumn,
  GridDepth,
  GridRow,
} from "./cube-types";
import { getAllFaces, getPerpendicularFaces } from "./cube-faces";

// ── Grid layout ────────────────────────────────────────────────────────

/** Row for each of the 9 cube indices (0–8). */
const ROWS: readonly GridRow[] = [
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

/** Column for each of the 9 cube indices (0–8). */
const COLUMNS: readonly GridColumn[] = [
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

// ── Orientation generation ─────────────────────────────────────────────

const MAX_CUBES_PER_FACE = 3;
const MAX_RANDOM_RETRIES = 100;

function pickRandom<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function shuffle(items: number[], random: () => number): number[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateOrientations(
  random: () => number,
): readonly CubeOrientation[] {
  const allFaces = getAllFaces();
  const orientations: CubeOrientation[] = [];
  const frontCounts = new Map<CubeFace, number>();
  const upCounts = new Map<CubeFace, number>();

  for (let i = 0; i < 9; i++) {
    let front: CubeFace;
    let frontAttempts = 0;
    do {
      if (frontAttempts++ >= MAX_RANDOM_RETRIES) {
        throw new Error("Failed to pick a front face within retry limit");
      }
      front = pickRandom(allFaces, random);
    } while ((frontCounts.get(front) ?? 0) >= MAX_CUBES_PER_FACE);

    const perpendicularFaces = getPerpendicularFaces(front);
    let up: CubeFace;
    let upAttempts = 0;
    do {
      if (upAttempts++ >= MAX_RANDOM_RETRIES) {
        throw new Error("Failed to pick an up face within retry limit");
      }
      up = pickRandom(perpendicularFaces, random);
    } while ((upCounts.get(up) ?? 0) >= MAX_CUBES_PER_FACE);

    frontCounts.set(front, (frontCounts.get(front) ?? 0) + 1);
    upCounts.set(up, (upCounts.get(up) ?? 0) + 1);
    orientations.push({ facingViewer: front, facingUp: up });
  }

  return orientations;
}

// ── Depth generation ───────────────────────────────────────────────────

function generateDepthGrid(random: () => number): readonly GridDepth[] {
  const baseGrid: GridDepth[][] = [
    ["near", "center", "far"],
    ["center", "far", "near"],
    ["far", "near", "center"],
  ];

  const rowOrder = shuffle([0, 1, 2], random);
  const colOrder = shuffle([0, 1, 2], random);

  const grid: GridDepth[] = [];
  for (const row of rowOrder) {
    for (const col of colOrder) {
      grid.push(baseGrid[row][col]);
    }
  }

  return grid;
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Generate a complete cube arrangement: 9 cubes with orientations and
 * grid positions satisfying all puzzle constraints.
 */
export function generateCubeArrangement(
  random: () => number = Math.random,
): CubeArrangement {
  const orientations = generateOrientations(random);
  const depths = generateDepthGrid(random);

  const placements = orientations.map(
    (orientation, i): CubePlacement => ({
      row: ROWS[i],
      column: COLUMNS[i],
      depth: depths[i],
      orientation,
    }),
  );

  if (placements.length !== 9) {
    throw new Error(
      `Expected 9 placements, got ${placements.length}`,
    );
  }

  return [
    placements[0],
    placements[1],
    placements[2],
    placements[3],
    placements[4],
    placements[5],
    placements[6],
    placements[7],
    placements[8],
  ] as const;
}
