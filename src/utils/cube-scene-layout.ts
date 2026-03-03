import type {
  GridColumn,
  GridDepth,
  GridRow,
} from "../puzzles/cube/cube-types";

const CUBE_SPACING = 1;

function rowToY(row: GridRow): number {
  switch (row) {
    case "top":
      return CUBE_SPACING;
    case "center":
      return 0;
    case "bottom":
      return -CUBE_SPACING;
  }
}

function columnToX(column: GridColumn): number {
  switch (column) {
    case "left":
      return -CUBE_SPACING;
    case "center":
      return 0;
    case "right":
      return CUBE_SPACING;
  }
}

function depthToZ(depth: GridDepth): number {
  switch (depth) {
    case "near":
      return CUBE_SPACING;
    case "center":
      return 0;
    case "far":
      return -CUBE_SPACING;
  }
}

export function getPlacementPosition(
  row: GridRow,
  column: GridColumn,
  depth: GridDepth,
): [x: number, y: number, z: number] {
  return [columnToX(column), rowToY(row), depthToZ(depth)];
}
