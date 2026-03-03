/**
 * Face relationships and orientation logic for cubes.
 *
 * Each face pair maps to a coordinate axis: A → Z, B → Y, C → X.
 * These form a right-handed system, so the right face is the
 * cross product: right = up × front.
 */

import type { CubeFace, CubeOrientation, ViewingDirection } from "./cube-types";

// ── Axis model ──────────────────────────────────────────────────────────

type AxisName = "X" | "Y" | "Z";

/** A face decomposed into its coordinate axis and direction along that axis. */
interface SignedAxis {
  readonly axis: AxisName;
  readonly direction: number; // +1 (front side) or -1 (back side)
}

/** Decompose a face into its coordinate axis and direction. */
function toSignedAxis(face: CubeFace): SignedAxis {
  switch (face) {
    case "frontA":
      return { axis: "Z", direction: +1 };
    case "backA":
      return { axis: "Z", direction: -1 };
    case "frontB":
      return { axis: "Y", direction: +1 };
    case "backB":
      return { axis: "Y", direction: -1 };
    case "frontC":
      return { axis: "X", direction: +1 };
    case "backC":
      return { axis: "X", direction: -1 };
  }
}

/** Convert a coordinate axis and direction back to a face. */
function toFace(signedAxis: SignedAxis): CubeFace {
  switch (signedAxis.axis) {
    case "Z":
      return signedAxis.direction > 0 ? "frontA" : "backA";
    case "Y":
      return signedAxis.direction > 0 ? "frontB" : "backB";
    case "X":
      return signedAxis.direction > 0 ? "frontC" : "backC";
  }
}

/**
 * Cross product of two coordinate axes.
 *
 * Right-hand rule:
 *   X × Y = +Z,  Y × Z = +X,  Z × X = +Y
 *
 * Reversing the order negates the result:
 *   Y × X = -Z,  Z × Y = -X,  X × Z = -Y
 */
function crossProduct(first: AxisName, second: AxisName): SignedAxis {
  // Right-hand rule: X → Y → Z → X
  if (first === "X" && second === "Y") return { axis: "Z", direction: +1 };
  if (first === "Y" && second === "Z") return { axis: "X", direction: +1 };
  if (first === "Z" && second === "X") return { axis: "Y", direction: +1 };
  // Reverse: negative
  if (first === "Y" && second === "X") return { axis: "Z", direction: -1 };
  if (first === "Z" && second === "Y") return { axis: "X", direction: -1 };
  if (first === "X" && second === "Z") return { axis: "Y", direction: -1 };

  throw new Error(`Cannot cross-product axis ${first} with itself`);
}

// ── All faces ───────────────────────────────────────────────────────────

const ALL_FACES: readonly CubeFace[] = [
  "frontA",
  "frontB",
  "frontC",
  "backA",
  "backB",
  "backC",
] as const;

// ── Public API ──────────────────────────────────────────────────────────

/** Get the opposite face (the face on the far side of the cube). */
export function getOppositeFace(face: CubeFace): CubeFace {
  switch (face) {
    case "frontA":
      return "backA";
    case "backA":
      return "frontA";
    case "frontB":
      return "backB";
    case "backB":
      return "frontB";
    case "frontC":
      return "backC";
    case "backC":
      return "frontC";
  }
}

/** Get the four faces perpendicular to the given face. */
export function getPerpendicularFaces(face: CubeFace): readonly CubeFace[] {
  const opposite = getOppositeFace(face);
  return ALL_FACES.filter((f) => f !== face && f !== opposite);
}

/**
 * Get a random face that is different from the given face.
 * Used when generating wrong answers.
 */
export function getRandomDifferentFace(
  face: CubeFace,
  random: () => number = Math.random,
): CubeFace {
  const others = ALL_FACES.filter((f) => f !== face);
  return others[Math.floor(random() * others.length)];
}

/**
 * Given a cube's orientation, determine which face is visible
 * from a given viewing direction.
 */
export function getVisibleFace(
  orientation: CubeOrientation,
  direction: ViewingDirection,
): CubeFace {
  const { facingViewer, facingUp } = orientation;

  switch (direction) {
    case "front":
      return facingViewer;
    case "back":
      return getOppositeFace(facingViewer);
    case "top":
      return facingUp;
    case "bottom":
      return getOppositeFace(facingUp);
    case "right":
      return getRightFace(facingViewer, facingUp);
    case "left":
      return getOppositeFace(getRightFace(facingViewer, facingUp));
  }
}

/**
 * Determine which face points right, given which face is toward the viewer
 * and which is up. Computed as the cross product: right = up × front.
 */
export function getRightFace(front: CubeFace, up: CubeFace): CubeFace {
  const frontAxis = toSignedAxis(front);
  const upAxis = toSignedAxis(up);

  const cross = crossProduct(upAxis.axis, frontAxis.axis);
  const resultDirection =
    cross.direction * upAxis.direction * frontAxis.direction;

  return toFace({ axis: cross.axis, direction: resultDirection });
}

/**
 * Check whether a (facingViewer, facingUp) pair is a valid orientation.
 * The up face must be perpendicular to the front face.
 */
export function isValidOrientation(front: CubeFace, up: CubeFace): boolean {
  return up !== front && up !== getOppositeFace(front);
}

/** All six cube faces. */
export function getAllFaces(): readonly CubeFace[] {
  return ALL_FACES;
}
