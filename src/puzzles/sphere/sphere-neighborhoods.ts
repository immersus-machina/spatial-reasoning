import type {
  ColorRing,
  CornerPosition,
  Neighborhood,
  SphereArrangement,
} from "./sphere-types";
import { getColor } from "./sphere-colors";
import { ALL_CORNER_POSITIONS, getCornerRing } from "./sphere-topology";

export function computeNeighborhood(
  arrangement: SphereArrangement,
  corner: CornerPosition,
): Neighborhood {
  const ring = getCornerRing(corner);
  return {
    center: getColor(arrangement, corner),
    ring: [
      getColor(arrangement, ring[0]),
      getColor(arrangement, ring[1]),
      getColor(arrangement, ring[2]),
      getColor(arrangement, ring[3]),
      getColor(arrangement, ring[4]),
      getColor(arrangement, ring[5]),
    ],
  };
}

export function computeAllNeighborhoods(
  arrangement: SphereArrangement,
): readonly Neighborhood[] {
  return ALL_CORNER_POSITIONS.map((corner) =>
    computeNeighborhood(arrangement, corner),
  );
}

export function rotateRing(ring: ColorRing): ColorRing {
  return [ring[1], ring[2], ring[3], ring[4], ring[5], ring[0]];
}

export function areNeighborhoodsEqual(
  a: Neighborhood,
  b: Neighborhood,
): boolean {
  if (a.center !== b.center) return false;
  for (let i = 0; i < 6; i++) {
    if (a.ring[i] !== b.ring[i]) return false;
  }
  return true;
}

