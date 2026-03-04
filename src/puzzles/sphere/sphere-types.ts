export type SphereColor = "red" | "blue" | "yellow";

export type CornerPosition =
  | "nearBottomLeft"
  | "nearBottomRight"
  | "nearTopLeft"
  | "nearTopRight"
  | "farBottomLeft"
  | "farBottomRight"
  | "farTopLeft"
  | "farTopRight";

export type FacePosition =
  | "left"
  | "right"
  | "bottom"
  | "top"
  | "near"
  | "far";

export type SpherePosition = CornerPosition | FacePosition;

/** A single sphere's position and color within the 2×2×2 arrangement. */
export interface SpherePlacement {
  readonly position: SpherePosition;
  readonly color: SphereColor;
}

/** The full arrangement of 14 spheres. Each placement knows its own position. */
export type SphereArrangement = readonly [
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
  SpherePlacement,
];

export type ColorRing = readonly [
  SphereColor,
  SphereColor,
  SphereColor,
  SphereColor,
  SphereColor,
  SphereColor,
];

export interface Neighborhood {
  readonly center: SphereColor;
  readonly ring: ColorRing;
}

export interface SpherePuzzle {
  readonly arrangement: SphereArrangement;
  readonly correctAnswers: readonly [Neighborhood, Neighborhood, Neighborhood];
  readonly wrongAnswer: Neighborhood;
}
