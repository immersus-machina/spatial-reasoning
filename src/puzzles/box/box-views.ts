import type {
  BoxArrangement,
  ProjectedCell,
  ProjectedView,
  ViewingDirection,
} from "./box-types";
import { getGridPosition } from "./box-coordinates";

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
