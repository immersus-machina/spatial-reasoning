/**
 * Domain types for the Cube Rotation Puzzle.
 *
 * Each cube has 6 faces arranged in 3 opposite pairs (A, B, C).
 * A cube's orientation is fully determined by which face points
 * toward the viewer and which face points up.
 *
 * Grid dimensions all use 'center' for the middle value:
 *   row:    top    | center | bottom
 *   column: left   | center | right
 *   depth:  near   | center | far
 */

/** The six faces of a cube, grouped as three opposite pairs. */
export type CubeFace =
  | 'frontA' | 'backA'
  | 'frontB' | 'backB'
  | 'frontC' | 'backC'

/** The six directions from which the 3x3x3 arrangement can be viewed. */
export type ViewingDirection = 'front' | 'back' | 'top' | 'bottom' | 'left' | 'right'

/** Row position in the 3x3 grid. */
export type GridRow = 'top' | 'center' | 'bottom'

/** Column position in the 3x3 grid. */
export type GridColumn = 'left' | 'center' | 'right'

/** Depth layer in the 3x3x3 grid. */
export type GridDepth = 'near' | 'center' | 'far'

/** A single cube's orientation in 3D space. */
export interface CubeOrientation {
  readonly facingViewer: CubeFace
  readonly facingUp: CubeFace
}

/** A single cube's full position and orientation within the 3x3x3 grid. */
export interface CubePlacement {
  readonly row: GridRow
  readonly column: GridColumn
  readonly depth: GridDepth
  readonly orientation: CubeOrientation
}

/** The 3x3x3 arrangement of 9 cubes. Each placement knows its own position. */
export type CubeArrangement = readonly [
  CubePlacement, CubePlacement, CubePlacement,
  CubePlacement, CubePlacement, CubePlacement,
  CubePlacement, CubePlacement, CubePlacement,
]

/** A flat 3x3 grid of face values — what the player sees from one direction. */
export interface FlatView {
  readonly topLeft: CubeFace
  readonly topCenter: CubeFace
  readonly topRight: CubeFace
  readonly centerLeft: CubeFace
  readonly center: CubeFace
  readonly centerRight: CubeFace
  readonly bottomLeft: CubeFace
  readonly bottomCenter: CubeFace
  readonly bottomRight: CubeFace
}

/** Complete puzzle data returned by the generator. */
export interface CubePuzzle {
  readonly arrangement: CubeArrangement
  readonly correctView: FlatView
  readonly wrongViews: readonly [FlatView, FlatView, FlatView]
}
