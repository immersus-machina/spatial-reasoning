/** All 3D shape types used in the box puzzle. */
export type BoxShape =
  | "cube"
  | "sphere"
  | "cone"
  | "cylinder"
  | "triangularPrism"
  | "squarePyramid";

export type BoxColor = "red" | "blue" | "yellow";

/** The 3 orthographic view directions for the box. */
export type ViewingDirection = "top" | "front" | "side";

export type BoxDifficulty = "easy" | "hard";

/** A 2D shape as it appears in a projection view cell. */
export type FlatShape =
  | "square"
  | "circle"
  | "triangleUp"
  | "triangleDown"
  | "triangleLeft"
  | "triangleRight";

/** The base shape category (ignoring triangle orientation). */
export type BaseShape = "square" | "circle" | "triangle";

/**
 * How a 3D object's faces are assigned to the 3 view directions.
 * Each entry is the FlatShape visible from that direction.
 */
export interface FaceMapping {
  readonly top: FlatShape;
  readonly front: FlatShape;
  readonly side: FlatShape;
}

/** A single 3D object placed in the box. */
export interface BoxObject {
  readonly shape: BoxShape;
  readonly color: BoxColor;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly faceMapping: FaceMapping;
}

/** The full arrangement of objects inside the box. */
export interface BoxArrangement {
  readonly gridSize: 3 | 4;
  readonly objects: readonly BoxObject[];
}

/** A single cell in a projected view grid, carrying its own position. */
export interface ProjectedCell {
  readonly row: number;
  readonly column: number;
  readonly shape: FlatShape;
  readonly color: BoxColor;
}

/** A sparse NxN projected grid. Only cells with objects are present. */
export interface ProjectedView {
  readonly direction: ViewingDirection;
  readonly gridSize: 3 | 4;
  readonly cells: readonly ProjectedCell[];
}

/** A cell in the missing view that can be mutated to produce a wrong answer. */
export interface MutableCell {
  readonly row: number;
  readonly column: number;
  readonly originalShape: FlatShape;
  readonly originalColor: BoxColor;
  /** All valid mutations for this cell (each produces an impossible triplet). */
  readonly mutations: readonly FlatShape[];
}

/** Complete puzzle data returned by the generator. */
export interface BoxPuzzle {
  readonly arrangement: BoxArrangement;
  readonly knownViews: readonly [ProjectedView, ProjectedView];
  readonly missingDirection: ViewingDirection;
  readonly correctView: ProjectedView;
  readonly wrongViews: readonly [ProjectedView, ProjectedView, ProjectedView];
}
