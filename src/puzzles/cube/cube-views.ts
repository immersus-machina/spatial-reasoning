import type {
  CubeArrangement,
  CubeFace,
  CubePlacement,
  FlatView,
  GridColumn,
  GridDepth,
  GridRow,
  ViewingDirection,
} from "./cube-types";
import { getVisibleFace } from "./cube-faces";

// ── Constants ──────────────────────────────────────────────────────────

const ALL_VIEWING_DIRECTIONS: readonly ViewingDirection[] = [
  "front",
  "back",
  "top",
  "bottom",
  "right",
  "left",
];

/** The 9 FlatView keys in row-major order (top-left to bottom-right). */
export const FLAT_VIEW_KEYS: readonly (keyof FlatView)[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "center",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

// ── Numeric position helpers ───────────────────────────────────────────

function rowToNumeric(row: GridRow): number {
  switch (row) {
    case "top":
      return -1;
    case "center":
      return 0;
    case "bottom":
      return 1;
  }
}

function columnToNumeric(column: GridColumn): number {
  switch (column) {
    case "left":
      return -1;
    case "center":
      return 0;
    case "right":
      return 1;
  }
}

function depthToNumeric(depth: GridDepth): number {
  switch (depth) {
    case "near":
      return 1;
    case "center":
      return 0;
    case "far":
      return -1;
  }
}

/**
 * Convert a numeric (viewColumn, viewRow) pair to a FlatView key.
 * viewColumn: -1 = left, 0 = center, +1 = right
 * viewRow:    -1 = top,  0 = center, +1 = bottom
 */
function numericToFlatViewKey(
  viewColumn: number,
  viewRow: number,
): keyof FlatView {
  const rowIndex = viewRow + 1;
  const colIndex = viewColumn + 1;
  return FLAT_VIEW_KEYS[rowIndex * 3 + colIndex];
}

// ── Coordinate transformation ──────────────────────────────────────────

function projectPosition(
  placement: CubePlacement,
  direction: ViewingDirection,
): keyof FlatView {
  const column = columnToNumeric(placement.column);
  const row = rowToNumeric(placement.row);
  const depth = depthToNumeric(placement.depth);

  let viewColumn: number;
  let viewRow: number;

  switch (direction) {
    case "front":
      viewColumn = column;
      viewRow = row;
      break;
    case "back":
      viewColumn = -column;
      viewRow = row;
      break;
    case "top":
      viewColumn = column;
      viewRow = -depth;
      break;
    case "bottom":
      viewColumn = column;
      viewRow = depth;
      break;
    case "right":
      viewColumn = -depth;
      viewRow = row;
      break;
    case "left":
      viewColumn = depth;
      viewRow = row;
      break;
  }

  return numericToFlatViewKey(viewColumn, viewRow);
}

// ── Public API ─────────────────────────────────────────────────────────

export function projectFlatView(
  arrangement: CubeArrangement,
  direction: ViewingDirection,
): FlatView {
  const projected = new Map<keyof FlatView, CubeFace>();

  for (const cube of arrangement) {
    const key = projectPosition(cube, direction);
    const face = getVisibleFace(cube.orientation, direction);

    if (projected.has(key)) {
      throw new Error(
        `Two cubes project to the same position '${key}' when viewed from '${direction}'`,
      );
    }
    projected.set(key, face);
  }

  // Safe: 9 cubes in a 3x3 grid always project to all 9 positions
  return {
    topLeft: projected.get("topLeft")!,
    topCenter: projected.get("topCenter")!,
    topRight: projected.get("topRight")!,
    centerLeft: projected.get("centerLeft")!,
    center: projected.get("center")!,
    centerRight: projected.get("centerRight")!,
    bottomLeft: projected.get("bottomLeft")!,
    bottomCenter: projected.get("bottomCenter")!,
    bottomRight: projected.get("bottomRight")!,
  };
}

export function computeAllFlatViews(
  arrangement: CubeArrangement,
): readonly FlatView[] {
  return ALL_VIEWING_DIRECTIONS.map((direction) =>
    projectFlatView(arrangement, direction),
  );
}

export function rotateFlatViewClockwise(view: FlatView): FlatView {
  return {
    topLeft: view.bottomLeft,
    topCenter: view.centerLeft,
    topRight: view.topLeft,
    centerLeft: view.bottomCenter,
    center: view.center,
    centerRight: view.topCenter,
    bottomLeft: view.bottomRight,
    bottomCenter: view.centerRight,
    bottomRight: view.topRight,
  };
}

export function areFlatViewsEqual(
  flatView1: FlatView,
  flatView2: FlatView,
): boolean {
  return FLAT_VIEW_KEYS.every((key) => flatView1[key] === flatView2[key]);
}
