import type { ViewingDirection } from "./box-types";

// ── Public API ────────────────────────────────────────────────────────

/**
 * Compute the (row, column) grid position for a 3D position in a given view.
 *
 * Projection axes (standard right-handed convention):
 * - Top  (looking down Y): row = x, column = z
 * - Front (looking along Z): row = y, column = x
 * - Side (looking along X): row = y, column = z
 */
export function getGridPosition(
  position: { x: number; y: number; z: number },
  direction: ViewingDirection,
): { row: number; column: number } {
  switch (direction) {
    case "top":
      return { row: position.x, column: position.z };
    case "front":
      return { row: position.y, column: position.x };
    case "side":
      return { row: position.y, column: position.z };
  }
}

/**
 * Extract the depth coordinate for a given viewing direction.
 *
 * Depth is the axis perpendicular to the viewing plane:
 * - Top  (looking down Y): depth = y
 * - Front (looking along Z): depth = z
 * - Side (looking along X): depth = x
 */
export function getDepthValue(
  position: { x: number; y: number; z: number },
  direction: ViewingDirection,
): number {
  switch (direction) {
    case "top":
      return position.y;
    case "front":
      return position.z;
    case "side":
      return position.x;
  }
}
