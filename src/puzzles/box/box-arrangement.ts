import type {
  BoxArrangement,
  BoxColor,
  BoxDifficulty,
  BoxObject,
  BoxShape,
  FaceMapping,
  ViewingDirection,
} from "./box-types";
import {
  ALL_COLORS,
  ALL_DIRECTIONS,
  assignFaceMapping,
  getShapesForDifficulty,
  toBaseShape,
} from "./box-shapes";
import { pickDistinct, pickIntInRange, pickRandom } from "../../utils/random";

// ── Constants ─────────────────────────────────────────────────────────

const EASY_OBJECT_COUNT = { min: 5, max: 8 };
const HARD_OBJECT_COUNT = { min: 7, max: 11 };
const MAX_OBJECT_GENERATION_RETRIES = 100;

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Generate a list of (shape, color) pairs for the objects in the box.
 *
 * Constraints:
 * - No shape type can exceed 50% of the total count
 */
function generateObjects(
  count: number,
  shapes: readonly BoxShape[],
  random: () => number,
): { shape: BoxShape; color: BoxColor }[] {
  const result: { shape: BoxShape; color: BoxColor }[] = [];
  const shapeCounts = new Map<BoxShape, number>();
  const maxPerShape = Math.floor(count / 2);

  let attempts = 0;
  while (result.length < count) {
    if (attempts++ >= MAX_OBJECT_GENERATION_RETRIES) {
      throw new Error(
        `Failed to generate ${count} objects after ${MAX_OBJECT_GENERATION_RETRIES} attempts`,
      );
    }
    const shape = pickRandom(shapes, random);
    const currentCount = shapeCounts.get(shape) ?? 0;
    if (currentCount < maxPerShape) {
      const color = pickRandom(ALL_COLORS, random);
      result.push({ shape, color });
      shapeCounts.set(shape, currentCount + 1);
    }
  }

  return result;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

/** Fisher-Yates shuffle returning a random permutation of [0..n-1]. */
function randomPermutation(n: number, random: () => number): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

/**
 * Generate N² conflict-free positions from a randomized Latin square.
 *
 * A Latin square L[x][y] = z ensures:
 * - All (x, z) pairs are distinct (top projection)
 * - All (x, y) pairs are distinct (front projection)
 * - All (y, z) pairs are distinct (side projection)
 *
 * We start with L[x][y] = (x + y) % N and randomize by permuting
 * the row indices, column indices, and symbol values.
 */
function buildLatinSquarePositions(
  gridSize: number,
  random: () => number,
): Position[] {
  const rowPerm = randomPermutation(gridSize, random);
  const colPerm = randomPermutation(gridSize, random);
  const symPerm = randomPermutation(gridSize, random);

  const positions: Position[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const z = symPerm[(rowPerm[x] + colPerm[y]) % gridSize];
      positions.push({ x, y, z });
    }
  }
  return positions;
}

/**
 * Check whether an object is a reorientation candidate: its "unique" face
 * points toward the missing direction, making the cell non-mutable.
 *
 * - Cylinder: unique face is "circle" (among square, square, circle).
 * - Triangular prism: unique face is "triangle" (among triangle, square, square).
 */
function isReorientCandidate(
  boxObject: BoxObject,
  missingDirection: ViewingDirection,
): boolean {
  if (boxObject.shape === "cylinder") {
    return boxObject.faceMapping[missingDirection] === "circle";
  }
  if (boxObject.shape === "triangularPrism") {
    return toBaseShape(boxObject.faceMapping[missingDirection]) === "triangle";
  }
  return false;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Re-orient cylinders and triangular prisms so their "unique" face
 * does not point toward the missing direction, making them mutable.
 *
 * Only reorients up to `count` objects (chosen randomly among candidates).
 * Moving the unique face to a known direction exposes a square face
 * toward the missing direction, enabling shape mutations.
 */
export function reorientForMutability(
  arrangement: BoxArrangement,
  missingDirection: ViewingDirection,
  count: number,
  random: () => number,
): BoxArrangement {
  const knownDirections = ALL_DIRECTIONS.filter(
    (direction) => direction !== missingDirection,
  );

  // Collect candidate indices and pick at most `count` to reorient.
  const candidateIndices: number[] = [];
  for (let i = 0; i < arrangement.objects.length; i++) {
    if (isReorientCandidate(arrangement.objects[i], missingDirection)) {
      candidateIndices.push(i);
    }
  }
  const reorientSet = new Set(
    pickDistinct(
      candidateIndices,
      Math.min(count, candidateIndices.length),
      random,
    ),
  );

  const newObjects: BoxObject[] = arrangement.objects.map(
    (boxObject, index) => {
      if (!reorientSet.has(index)) return boxObject;

      if (boxObject.shape === "cylinder") {
        const circleDirection =
          knownDirections[Math.floor(random() * knownDirections.length)];
        const faceMapping: FaceMapping = {
          top: "square",
          front: "square",
          side: "square",
          [circleDirection]: "circle",
        };
        return { ...boxObject, faceMapping };
      }

      // triangularPrism
      const triangleDirection =
        knownDirections[Math.floor(random() * knownDirections.length)];
      const originalTriangle = boxObject.faceMapping[missingDirection];
      const faceMapping: FaceMapping = {
        top: "square",
        front: "square",
        side: "square",
        [triangleDirection]: originalTriangle,
      };
      return { ...boxObject, faceMapping };
    },
  );

  return { ...arrangement, objects: newObjects };
}

export function generateBoxArrangement(
  difficulty: BoxDifficulty,
  random: () => number = Math.random,
): BoxArrangement {
  const gridSize = difficulty === "easy" ? 3 : 4;
  const shapes = getShapesForDifficulty(difficulty);
  const range = difficulty === "easy" ? EASY_OBJECT_COUNT : HARD_OBJECT_COUNT;
  const count = pickIntInRange(range.min, range.max, random);

  const objectDefinitions = generateObjects(count, shapes, random);

  // All N² positions from a randomized Latin square are guaranteed conflict-free.
  // Pick `count` of them randomly.
  const allPositions = buildLatinSquarePositions(gridSize, random);
  const positions = pickDistinct(allPositions, count, random);

  const objects: BoxObject[] = objectDefinitions.map((definition, i) => {
    const { x, y, z } = positions[i];
    const faceMapping = assignFaceMapping(definition.shape, random);
    return { shape: definition.shape, color: definition.color, x, y, z, faceMapping };
  });

  return { gridSize, objects };
}
