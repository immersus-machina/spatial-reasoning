import type {
  CornerPosition,
  FacePosition,
  SpherePosition,
} from "./sphere-types";

export const ALL_CORNER_POSITIONS: readonly CornerPosition[] = [
  "nearBottomLeft",
  "nearBottomRight",
  "nearTopLeft",
  "nearTopRight",
  "farBottomLeft",
  "farBottomRight",
  "farTopLeft",
  "farTopRight",
];

export const ALL_FACE_POSITIONS: readonly FacePosition[] = [
  "left",
  "right",
  "bottom",
  "top",
  "near",
  "far",
];

type Ring6<T> = readonly [T, T, T, T, T, T];

/**
 * The 6 neighbor positions around each corner, in ring order.
 * The ring alternates between face and corner positions.
 *
 * Each corner of the 2×2×2 cube touches 3 face-center spheres (one per axis)
 * and 3 other corner spheres (one per axis flip). These 6 neighbors form a
 * ring when ordered by alternating axis: face, corner, face, corner, ...
 *
 * With only 8 corners, hardcoding the rings is simpler and more readable
 * than computing them from a coordinate system with parity-dependent winding.
 */
const CORNER_RINGS: Record<CornerPosition, Ring6<SpherePosition>> = {
  nearBottomLeft: ["nearBottomRight", "near", "nearTopLeft", "left", "farBottomLeft", "bottom"],
  nearBottomRight: ["bottom", "farBottomRight", "right", "nearTopRight", "near", "nearBottomLeft"],
  nearTopLeft: ["top", "farTopLeft", "left", "nearBottomLeft", "near", "nearTopRight"],
  nearTopRight: ["nearTopLeft", "near", "nearBottomRight", "right", "farTopRight", "top"],
  farBottomLeft: ["bottom", "nearBottomLeft", "left", "farTopLeft", "far", "farBottomRight"],
  farBottomRight: ["farBottomLeft", "far", "farTopRight", "right", "nearBottomRight", "bottom"],
  farTopLeft: ["farTopRight", "far", "farBottomLeft", "left", "nearTopLeft", "top"],
  farTopRight: ["top", "nearTopRight", "right", "farBottomRight", "far", "farTopLeft"],
};

export function getCornerRing(corner: CornerPosition): Ring6<SpherePosition> {
  return CORNER_RINGS[corner];
}
