import type { BoxArrangement, BoxObject, ViewingDirection } from "./box-types";
import { ALL_COLORS } from "./box-shapes";
import { getGridPosition, getDepthValue } from "./box-coordinates";

// ── Types ─────────────────────────────────────────────────────────────

interface GridDepthEntry {
  readonly depth: number;
  readonly objectIndex: number;
}

interface CrossedRectangle {
  readonly topLeftObjectIndex: number;
  readonly topRightObjectIndex: number;
  readonly bottomLeftObjectIndex: number;
  readonly bottomRightObjectIndex: number;
}

// ── Helpers ───────────────────────────────────────────────────────────

function findSharedColumns(
  rowMapA: ReadonlyMap<number, GridDepthEntry>,
  rowMapB: ReadonlyMap<number, GridDepthEntry>,
): number[] {
  const shared: number[] = [];
  for (const column of rowMapA.keys()) {
    if (rowMapB.has(column)) shared.push(column);
  }
  return shared;
}

function checkCrossedDepths(
  rowMapA: ReadonlyMap<number, GridDepthEntry>,
  rowMapB: ReadonlyMap<number, GridDepthEntry>,
  columnA: number,
  columnB: number,
): CrossedRectangle | null {
  const topLeft = rowMapA.get(columnA);
  const topRight = rowMapA.get(columnB);
  const bottomLeft = rowMapB.get(columnA);
  const bottomRight = rowMapB.get(columnB);
  if (!topLeft || !topRight || !bottomLeft || !bottomRight) return null;

  if (
    topLeft.depth === bottomRight.depth &&
    topRight.depth === bottomLeft.depth &&
    topLeft.depth !== topRight.depth
  ) {
    return {
      topLeftObjectIndex: topLeft.objectIndex,
      topRightObjectIndex: topRight.objectIndex,
      bottomLeftObjectIndex: bottomLeft.objectIndex,
      bottomRightObjectIndex: bottomRight.objectIndex,
    };
  }
  return null;
}

function buildGridDepthIndex(
  arrangement: BoxArrangement,
  direction: ViewingDirection,
): Map<number, Map<number, GridDepthEntry>> {
  const byRow = new Map<number, Map<number, GridDepthEntry>>();
  for (let i = 0; i < arrangement.objects.length; i++) {
    const boxObject = arrangement.objects[i];
    const { row, column } = getGridPosition(boxObject, direction);
    const depth = getDepthValue(boxObject, direction);
    let columnMap = byRow.get(row);
    if (!columnMap) {
      columnMap = new Map();
      byRow.set(row, columnMap);
    }
    columnMap.set(column, { depth, objectIndex: i });
  }
  return byRow;
}

function searchAllRowPairs(
  byRow: ReadonlyMap<number, Map<number, GridDepthEntry>>,
): CrossedRectangle[] {
  const rectangles: CrossedRectangle[] = [];
  const rows = [...byRow.values()];

  for (let rowA = 0; rowA < rows.length; rowA++) {
    for (let rowB = rowA + 1; rowB < rows.length; rowB++) {
      const sharedColumns = findSharedColumns(rows[rowA], rows[rowB]);

      for (let columnA = 0; columnA < sharedColumns.length; columnA++) {
        for (
          let columnB = columnA + 1;
          columnB < sharedColumns.length;
          columnB++
        ) {
          const rectangle = checkCrossedDepths(
            rows[rowA],
            rows[rowB],
            sharedColumns[columnA],
            sharedColumns[columnB],
          );
          if (rectangle) {
            rectangles.push(rectangle);
          }
        }
      }
    }
  }

  return rectangles;
}

/**
 * Find all crossed-depth rectangles in an arrangement for a given
 * viewing direction. These are 2×2 sub-grids in the missing view where
 * swapping depths produces identical known views — making the puzzle
 * ambiguous if the 4 objects share a color.
 *
 * Returns at most 4 rectangles (for a full 4×4 grid), at most 2 for
 * sparse grids (7–11 objects). Returns none for 3×3 grids.
 */
function findCrossedRectangles(
  arrangement: BoxArrangement,
  missingDirection: ViewingDirection,
): CrossedRectangle[] {
  const byRow = buildGridDepthIndex(arrangement, missingDirection);
  return searchAllRowPairs(byRow);
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Recolor objects so no crossed-depth rectangle has all four objects
 * sharing a color.
 *
 * Our Latin square construction produces exactly 4 disjoint potential
 * rectangles for grid size 4 (verified exhaustively in tests). At most
 * 2 survive after picking a sparse subset. Since rectangles are
 * disjoint, recoloring one member cannot affect any other rectangle.
 * For grid size 3, no rectangles exist.
 *
 * Less than 3 % of arrangements might generate valid wrong answers 
 * without this step.
 */
export function enforceUniqueDepthMapping(
  arrangement: BoxArrangement,
  missingDirection: ViewingDirection,
  random: () => number,
): BoxArrangement {
  const rectangles = findCrossedRectangles(arrangement, missingDirection);

  const recoloredObjects: BoxObject[] = arrangement.objects.map((o) => ({
    ...o,
  }));

  for (const rectangle of rectangles) {
    const {
      topLeftObjectIndex,
      topRightObjectIndex,
      bottomLeftObjectIndex,
      bottomRightObjectIndex,
    } = rectangle;
    const color = recoloredObjects[topLeftObjectIndex].color;
    if (
      recoloredObjects[topRightObjectIndex].color !== color ||
      recoloredObjects[bottomLeftObjectIndex].color !== color ||
      recoloredObjects[bottomRightObjectIndex].color !== color
    ) {
      continue;
    }

    const indices = [
      topLeftObjectIndex,
      topRightObjectIndex,
      bottomLeftObjectIndex,
      bottomRightObjectIndex,
    ];
    const targetIndex = indices[Math.floor(random() * indices.length)];
    const otherColors = ALL_COLORS.filter(
      (c) => c !== recoloredObjects[targetIndex].color,
    );
    recoloredObjects[targetIndex] = {
      ...recoloredObjects[targetIndex],
      color: otherColors[Math.floor(random() * otherColors.length)],
    };
  }

  return { ...arrangement, objects: recoloredObjects };
}
