import type {
  BoxArrangement,
  BoxObject,
  ProjectedCell,
  ProjectedView,
  ViewingDirection,
} from "./box-types";

// ── Projection ────────────────────────────────────────────────────────

/**
 * Compute the (row, column) grid position for an object in a given view.
 *
 * Projection axes:
 * - Top  (looking down Y): row = x, column = z
 * - Front (looking along X): row = y, column = z
 * - Side (looking along Z): row = y, column = x
 */
export function getGridPosition(
  boxObject: BoxObject,
  direction: ViewingDirection,
): { row: number; column: number } {
  switch (direction) {
    case "top":
      return { row: boxObject.x, column: boxObject.z };
    case "front":
      return { row: boxObject.y, column: boxObject.z };
    case "side":
      return { row: boxObject.y, column: boxObject.x };
  }
}

// ── Public API ────────────────────────────────────────────────────────

export function projectView(
  arrangement: BoxArrangement,
  direction: ViewingDirection,
): ProjectedView {
  const cells: ProjectedCell[] = [];

  for (const boxObject of arrangement.objects) {
    const { row, column } = getGridPosition(boxObject, direction);
    const shape = boxObject.faceMapping[direction];
    cells.push({ row, column, shape, color: boxObject.color });
  }

  return { direction, gridSize: arrangement.gridSize, cells };
}

export function computeAllProjectedViews(
  arrangement: BoxArrangement,
): Record<ViewingDirection, ProjectedView> {
  return {
    top: projectView(arrangement, "top"),
    front: projectView(arrangement, "front"),
    side: projectView(arrangement, "side"),
  };
}