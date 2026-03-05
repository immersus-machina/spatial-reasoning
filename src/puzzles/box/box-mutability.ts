import type {
  BoxArrangement,
  FlatShape,
  MutableCell,
  ViewingDirection,
} from "./box-types";
import { isGeometricallyImpossible } from "./box-shapes";
import { getGridPosition } from "./box-views";

// ── Helpers ──────────────────────────────────────────────────────────

/** Build a face triplet by replacing the missing direction's shape with a test shape. */
function buildTestTriplet(
  faceMapping: {
    readonly top: FlatShape;
    readonly front: FlatShape;
    readonly side: FlatShape;
  },
  missingDirection: ViewingDirection,
  testShape: FlatShape,
): [FlatShape, FlatShape, FlatShape] {
  return [
    missingDirection === "top" ? testShape : faceMapping.top,
    missingDirection === "front" ? testShape : faceMapping.front,
    missingDirection === "side" ? testShape : faceMapping.side,
  ];
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Find all mutable cells in the missing view.
 *
 * For each object in the arrangement, we know its face shapes in all 3
 * views (from its faceMapping). A cell is mutable if replacing the shape
 * in the missing direction with a different flat shape produces a face
 * triplet that is geometrically impossible.
 *
 * Iterates over exact FlatShape values (including triangle orientations),
 * so orientation-based impossibilities are detected.
 */
export function findMutableCells(
  arrangement: BoxArrangement,
  missingDirection: ViewingDirection,
  allowedFlatShapes: readonly FlatShape[],
): MutableCell[] {
  const mutableCells: MutableCell[] = [];

  for (const boxObject of arrangement.objects) {
    const { row, column } = getGridPosition(boxObject, missingDirection);
    const originalShape = boxObject.faceMapping[missingDirection];

    const mutations = allowedFlatShapes.filter((testShape) => {
      if (testShape === originalShape) return false;
      const [testTop, testFront, testSide] = buildTestTriplet(
        boxObject.faceMapping,
        missingDirection,
        testShape,
      );
      return isGeometricallyImpossible(testTop, testFront, testSide);
    });

    if (mutations.length > 0) {
      mutableCells.push({
        row,
        column,
        originalShape,
        originalColor: boxObject.color,
        mutations,
      });
    }
  }

  return mutableCells;
}
