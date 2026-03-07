import { describe, it, expect } from "vitest";
import { enforceUniqueDepthMapping } from "./box-depth-ambiguity";
import { getGridPosition, getDepthValue } from "./box-coordinates";
import { seededRandom } from "../../tests/seeded-random";
import type {
  BoxArrangement,
  BoxColor,
  BoxObject,
  ViewingDirection,
} from "./box-types";

// ── Helpers ──────────────────────────────────────────────────────────

function makeObject(
  x: number,
  y: number,
  z: number,
  color: BoxColor,
): BoxObject {
  return {
    shape: "cube",
    color,
    x,
    y,
    z,
    faceMapping: { top: "square", front: "square", side: "square" },
  };
}

function makeArrangement(
  gridSize: 3 | 4,
  objects: BoxObject[],
): BoxArrangement {
  return { gridSize, objects };
}

interface DepthEntry {
  readonly depth: number;
  readonly objectIndex: number;
}

function buildTestDepthIndex(
  arrangement: BoxArrangement,
  direction: ViewingDirection,
): Map<number, Map<number, DepthEntry>> {
  const byRow = new Map<number, Map<number, DepthEntry>>();
  for (let i = 0; i < arrangement.objects.length; i++) {
    const { row, column } = getGridPosition(arrangement.objects[i], direction);
    const depth = getDepthValue(arrangement.objects[i], direction);
    let columnMap = byRow.get(row);
    if (!columnMap) {
      columnMap = new Map();
      byRow.set(row, columnMap);
    }
    columnMap.set(column, { depth, objectIndex: i });
  }
  return byRow;
}

function isCrossedAndMonochromatic(
  rowMapA: ReadonlyMap<number, DepthEntry>,
  rowMapB: ReadonlyMap<number, DepthEntry>,
  columnA: number,
  columnB: number,
  objects: readonly BoxObject[],
): boolean {
  const topLeft = rowMapA.get(columnA);
  const topRight = rowMapA.get(columnB);
  const bottomLeft = rowMapB.get(columnA);
  const bottomRight = rowMapB.get(columnB);
  if (!topLeft || !topRight || !bottomLeft || !bottomRight) return false;

  if (
    topLeft.depth !== bottomRight.depth ||
    topRight.depth !== bottomLeft.depth ||
    topLeft.depth === topRight.depth
  ) {
    return false;
  }

  const color = objects[topLeft.objectIndex].color;
  return (
    objects[topRight.objectIndex].color === color &&
    objects[bottomLeft.objectIndex].color === color &&
    objects[bottomRight.objectIndex].color === color
  );
}

function hasMonochromaticCrossing(
  rowMapA: ReadonlyMap<number, DepthEntry>,
  rowMapB: ReadonlyMap<number, DepthEntry>,
  objects: readonly BoxObject[],
): boolean {
  const sharedColumns: number[] = [];
  for (const column of rowMapA.keys()) {
    if (rowMapB.has(column)) sharedColumns.push(column);
  }

  for (let columnA = 0; columnA < sharedColumns.length; columnA++) {
    for (let columnB = columnA + 1; columnB < sharedColumns.length; columnB++) {
      if (isCrossedAndMonochromatic(
        rowMapA,
        rowMapB,
        sharedColumns[columnA],
        sharedColumns[columnB],
        objects,
      )) {
        return true;
      }
    }
  }
  return false;
}

function hasMonochromaticRectangle(
  arrangement: BoxArrangement,
  direction: ViewingDirection,
): boolean {
  const byRow = buildTestDepthIndex(arrangement, direction);
  const rows = [...byRow.values()];

  for (let rowA = 0; rowA < rows.length; rowA++) {
    for (let rowB = rowA + 1; rowB < rows.length; rowB++) {
      if (hasMonochromaticCrossing(rows[rowA], rows[rowB], arrangement.objects)) {
        return true;
      }
    }
  }

  return false;
}

// ── enforceUniqueDepthMapping ────────────────────────────────────────

describe("enforceUniqueDepthMapping", () => {
  it("resolves a monochromatic crossed rectangle", () => {
    const arrangement = makeArrangement(4, [
      makeObject(0, 0, 0, "red"),
      makeObject(0, 1, 1, "red"),
      makeObject(1, 0, 1, "red"),
      makeObject(1, 1, 0, "red"),
    ]);

    expect(hasMonochromaticRectangle(arrangement, "top")).toBe(true);

    const result = enforceUniqueDepthMapping(
      arrangement,
      "top",
      seededRandom(42),
    );

    expect(hasMonochromaticRectangle(result, "top")).toBe(false);
  });

  it("preserves positions, shapes, and faceMapping", () => {
    const arrangement = makeArrangement(4, [
      makeObject(0, 0, 0, "red"),
      makeObject(0, 1, 1, "red"),
      makeObject(1, 0, 1, "red"),
      makeObject(1, 1, 0, "red"),
    ]);

    const result = enforceUniqueDepthMapping(
      arrangement,
      "top",
      seededRandom(42),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      expect(result.objects[i].x).toBe(arrangement.objects[i].x);
      expect(result.objects[i].y).toBe(arrangement.objects[i].y);
      expect(result.objects[i].z).toBe(arrangement.objects[i].z);
      expect(result.objects[i].shape).toBe(arrangement.objects[i].shape);
      expect(result.objects[i].faceMapping).toEqual(
        arrangement.objects[i].faceMapping,
      );
    }
  });

  it("leaves mixed-color rectangle unchanged", () => {
    const arrangement = makeArrangement(4, [
      makeObject(0, 0, 0, "red"),
      makeObject(0, 1, 1, "blue"),
      makeObject(1, 0, 1, "yellow"),
      makeObject(1, 1, 0, "red"),
    ]);

    const result = enforceUniqueDepthMapping(
      arrangement,
      "top",
      seededRandom(42),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      expect(result.objects[i].color).toBe(arrangement.objects[i].color);
    }
  });

  it("works for all three missing directions", () => {
    const directions: ViewingDirection[] = ["top", "front", "side"];

    for (const dir of directions) {
      const arrangement = makeArrangement(4, [
        makeObject(0, 0, 0, "red"),
        makeObject(0, 1, 1, "red"),
        makeObject(1, 0, 1, "red"),
        makeObject(1, 1, 0, "red"),
      ]);

      expect(hasMonochromaticRectangle(arrangement, dir)).toBe(true);

      const result = enforceUniqueDepthMapping(
        arrangement,
        dir,
        seededRandom(99),
      );

      expect(hasMonochromaticRectangle(result, dir)).toBe(false);
    }
  });
});
