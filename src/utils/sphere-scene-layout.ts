import type { SpherePosition } from "../puzzles/sphere/sphere-types";

const POSITIONS: Record<SpherePosition, [x: number, y: number, z: number]> = {
  nearBottomLeft: [-0.5, -0.5, 0.5],
  nearBottomRight: [0.5, -0.5, 0.5],
  nearTopLeft: [-0.5, 0.5, 0.5],
  nearTopRight: [0.5, 0.5, 0.5],
  farBottomLeft: [-0.5, -0.5, -0.5],
  farBottomRight: [0.5, -0.5, -0.5],
  farTopLeft: [-0.5, 0.5, -0.5],
  farTopRight: [0.5, 0.5, -0.5],
  left: [-1, 0, 0],
  right: [1, 0, 0],
  bottom: [0, -1, 0],
  top: [0, 1, 0],
  near: [0, 0, 1],
  far: [0, 0, -1],
};

export function getSpherePosition(
  position: SpherePosition,
): [x: number, y: number, z: number] {
  return POSITIONS[position];
}
