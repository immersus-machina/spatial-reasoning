import type { CubeFace, CubeOrientation } from "../puzzles/cube/cube-types";
import { getOppositeFace, getRightFace } from "../puzzles/cube/cube-faces";

/**
 * Three.js BoxGeometry material indices:
 *   0: +X (right)   1: -X (left)
 *   2: +Y (top)     3: -Y (bottom)
 *   4: +Z (front)   5: -Z (back)
 */
export type BoxFaceOrder = readonly [
  positiveX: CubeFace,
  negativeX: CubeFace,
  positiveY: CubeFace,
  negativeY: CubeFace,
  positiveZ: CubeFace,
  negativeZ: CubeFace,
];

export function getOrientedFaces(orientation: CubeOrientation): BoxFaceOrder {
  const { facingViewer, facingUp } = orientation;
  const right = getRightFace(facingViewer, facingUp);

  return [
    right,
    getOppositeFace(right),
    facingUp,
    getOppositeFace(facingUp),
    facingViewer,
    getOppositeFace(facingViewer),
  ];
}
