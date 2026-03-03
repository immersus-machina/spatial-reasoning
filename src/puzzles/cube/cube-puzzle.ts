import type { CubePuzzle, FlatView } from "./cube-types";
import { getRandomDifferentFace } from "./cube-faces";
import { generateCubeArrangement } from "./cube-arrangement";
import {
  computeAllFlatViews,
  rotateFlatViewClockwise,
  areFlatViewsEqual,
  FLAT_VIEW_KEYS,
} from "./cube-views";

// ── Helpers ───────────────────────────────────────────────────────────

const VIEW_COUNT = 6;

function randomViewIndex(random: () => number): number {
  return Math.floor(random() * VIEW_COUNT);
}

function pickThreeDistinctViewIndices(
  random: () => number,
): [number, number, number] {
  const indices: number[] = [];
  while (indices.length < 3) {
    const index = randomViewIndex(random);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices as [number, number, number];
}

// ── Wrong answer generation ────────────────────────────────────────────

function pickDistinctPositions(count: number, random: () => number): number[] {
  const positions: number[] = [];

  while (positions.length < count) {
    const index = Math.floor(random() * 9);
    if (!positions.includes(index)) {
      positions.push(index);
    }
  }

  return positions;
}

/**
 * Check whether a candidate wrong view matches any of the valid views
 * in any of the 4 rotations (0, 90, 180, 270 degrees).
 */
function isWrongViewTrulyWrong(
  candidate: FlatView,
  allValidViews: readonly FlatView[],
): boolean {
  for (const validView of allValidViews) {
    let rotated = validView;
    for (let rotation = 0; rotation < 4; rotation++) {
      if (areFlatViewsEqual(candidate, rotated)) {
        return false;
      }
      rotated = rotateFlatViewClockwise(rotated);
    }
  }
  return true;
}

function generateWrongView(
  baseView: FlatView,
  errorCount: number,
  allValidViews: readonly FlatView[],
  random: () => number,
): FlatView | null {
  const replacements = Object.fromEntries(
    pickDistinctPositions(errorCount, random).map((pos) => {
      const key = FLAT_VIEW_KEYS[pos];
      return [key, getRandomDifferentFace(baseView[key], random)];
    }),
  );

  const modified = { ...baseView, ...replacements };

  if (!isWrongViewTrulyWrong(modified, allValidViews)) {
    return null;
  }

  return modified;
}

function applyRandomRotation(view: FlatView, random: () => number): FlatView {
  const rotations = Math.floor(random() * 3) + 1;
  let result = view;
  for (let i = 0; i < rotations; i++) {
    result = rotateFlatViewClockwise(result);
  }
  return result;
}

const MAX_WRONG_VIEW_RETRIES = 20;

function generateWrongViewWithRetries(
  errorCount: number,
  baseView: FlatView,
  allViews: readonly FlatView[],
  random: () => number,
): FlatView {
  for (let attempt = 0; attempt < MAX_WRONG_VIEW_RETRIES; attempt++) {
    const wrongView = generateWrongView(baseView, errorCount, allViews, random);
    if (wrongView !== null) {
      return applyRandomRotation(wrongView, random);
    }
  }

  throw new Error(
    `Failed to generate wrong view with ${errorCount} error(s) after ${MAX_WRONG_VIEW_RETRIES} attempts`,
  );
}

// ── Public API ─────────────────────────────────────────────────────────

export function generateCubePuzzle(
  random: () => number = Math.random,
): CubePuzzle {
  const arrangement = generateCubeArrangement(random);
  const allViews = computeAllFlatViews(arrangement);

  const correctView = applyRandomRotation(
    allViews[randomViewIndex(random)],
    random,
  );

  const wrongBaseIndices = pickThreeDistinctViewIndices(random);

  return {
    arrangement,
    correctView,
    wrongViews: [
      generateWrongViewWithRetries(1, allViews[wrongBaseIndices[0]], allViews, random),
      generateWrongViewWithRetries(2, allViews[wrongBaseIndices[1]], allViews, random),
      generateWrongViewWithRetries(3, allViews[wrongBaseIndices[2]], allViews, random),
    ] as const,
  };
}
