import type {
  BaseShape,
  BoxDifficulty,
  BoxShape,
  FaceMapping,
  FlatShape,
  ViewingDirection,
} from "./box-types";

// ── Constants ─────────────────────────────────────────────────────────

type BaseFaces = Readonly<Record<ViewingDirection, BaseShape>>;

/**
 * The 3 base face shapes for each 3D shape type before any random rotation.
 * Triangles are not oriented at this stage.
 */
const SHAPE_FACES: Record<BoxShape, BaseFaces> = {
  cube: { top: "square", front: "square", side: "square" },
  sphere: { top: "circle", front: "circle", side: "circle" },
  cone: { top: "triangle", front: "triangle", side: "circle" },
  cylinder: { top: "square", front: "square", side: "circle" },
  triangularPrism: { top: "triangle", front: "square", side: "square" },
  squarePyramid: { top: "triangle", front: "triangle", side: "square" },
};

export const ALL_DIRECTIONS: readonly ViewingDirection[] = ["top", "front", "side"];

export const EASY_SHAPES: readonly BoxShape[] = ["cube", "sphere", "cylinder"];

export const HARD_SHAPES: readonly BoxShape[] = [
  "cube",
  "sphere",
  "cone",
  "cylinder",
  "triangularPrism",
  "squarePyramid",
];

export const ALL_COLORS: readonly ("red" | "blue" | "yellow")[] = [
  "red",
  "blue",
  "yellow",
];

/** All flat shapes used in easy mode (no triangles). */
export const EASY_FLAT_SHAPES: readonly FlatShape[] = ["square", "circle"];

/** All flat shapes including triangle orientations. */
export const ALL_FLAT_SHAPES: readonly FlatShape[] = [
  "square",
  "circle",
  "triangleUp",
  "triangleDown",
  "triangleLeft",
  "triangleRight",
];

const TRIANGLE_ORIENTATIONS: readonly FlatShape[] = [
  "triangleUp",
  "triangleDown",
  "triangleLeft",
  "triangleRight",
];

export function getShapesForDifficulty(
  difficulty: BoxDifficulty,
): readonly BoxShape[] {
  return difficulty === "easy" ? EASY_SHAPES : HARD_SHAPES;
}

// ── Base shape helpers ───────────────────────────────────────────────

/** Extract the base shape category from a FlatShape. */
export function toBaseShape(shape: FlatShape): BaseShape {
  if (shape === "square") return "square";
  if (shape === "circle") return "circle";
  return "triangle";
}

// ── Face mapping (rotation + triangle orientation) ───────────────────

/** Randomly rotates which face maps to which view direction. */
function rotateFacesRandomly(
  faces: BaseFaces,
  random: () => number,
): BaseFaces {
  const dirs = ALL_DIRECTIONS;
  const s = Math.floor(random() * 3);
  return {
    top: faces[dirs[s]],
    front: faces[dirs[(s + 1) % 3]],
    side: faces[dirs[(s + 2) % 3]],
  };
}

/**
 * Correlated triangle orientations for shapes with 2 triangles (cone, square pyramid).
 *
 * Keyed by the non-triangle face direction, each entry has two variants (coin flip).
 * Only the triangle face orientations are stored (the non-triangle face is unchanged).
 *
 * - top is non-triangle → front and side are triangles
 * - front is non-triangle → top and side are triangles
 * - side is non-triangle → top and front are triangles
 */
const CORRELATED_ORIENTATIONS: Record<
  ViewingDirection,
  readonly [
    Readonly<Partial<Record<ViewingDirection, FlatShape>>>,
    Readonly<Partial<Record<ViewingDirection, FlatShape>>>,
  ]
> = {
  top: [
    { front: "triangleUp", side: "triangleUp" },
    { front: "triangleDown", side: "triangleDown" },
  ],
  front: [
    { top: "triangleUp", side: "triangleRight" },
    { top: "triangleDown", side: "triangleLeft" },
  ],
  side: [
    { top: "triangleRight", front: "triangleRight" },
    { top: "triangleLeft", front: "triangleLeft" },
  ],
};

/**
 * Assign triangle orientations based on shape type and which faces are triangles.
 *
 * - **Cone / Square Pyramid** (2 triangles): correlated orientations based on
 *   which face is non-triangle (lookup table in CORRELATED_ORIENTATIONS).
 * - **Triangular Prism** (1 triangle): independent random orientation.
 * - **Other shapes**: no triangles, nothing to orient.
 */
function orientTriangles(
  baseFaces: BaseFaces,
  shape: BoxShape,
  random: () => number,
): FaceMapping {
  const result: Record<ViewingDirection, FlatShape> = {
    top: baseFaces.top as FlatShape,
    front: baseFaces.front as FlatShape,
    side: baseFaces.side as FlatShape,
  };

  if (shape === "cone" || shape === "squarePyramid") {
    const nonTriangleDirection = ALL_DIRECTIONS.find((direction) => baseFaces[direction] !== "triangle")!;
    const coin = Math.floor(random() * 2);
    const orientations = CORRELATED_ORIENTATIONS[nonTriangleDirection][coin];
    for (const direction of ALL_DIRECTIONS) {
      if (baseFaces[direction] === "triangle") {
        result[direction] = orientations[direction]!;
      }
    }
  } else if (shape === "triangularPrism") {
    const pick = TRIANGLE_ORIENTATIONS[Math.floor(random() * 4)];
    for (const direction of ALL_DIRECTIONS) {
      if (baseFaces[direction] === "triangle") {
        result[direction] = pick;
      }
    }
  }

  return result;
}

/**
 * Assign a random face mapping for a 3D shape: which FlatShape is visible
 * from each of the 3 view directions.
 */
export function assignFaceMapping(
  shape: BoxShape,
  random: () => number,
): FaceMapping {
  const baseFaces = SHAPE_FACES[shape];
  const rotated = rotateFacesRandomly(baseFaces, random);
  return orientTriangles(rotated, shape, random);
}

// ── Validation (for wrong answer generation) ─────────────────────────

/**
 * Encode the base shape counts of a face triplet as a single number.
 * Formula: squares * 16 + circles * 4 + triangles.
 */
function calculateCompositionSignature(
  top: FlatShape,
  front: FlatShape,
  side: FlatShape,
): number {
  let squares = 0;
  let circles = 0;
  let triangles = 0;
  for (const shape of [top, front, side]) {
    const base = toBaseShape(shape);
    if (base === "square") squares++;
    else if (base === "circle") circles++;
    else triangles++;
  }
  return squares * 16 + circles * 4 + triangles;
}

/** All face compositions that correspond to a valid 3D shape. */
const VALID_COMPOSITIONS = new Set([
  48, // cube:            3 squares
  12, // sphere:          3 circles
   6, // cone:            1 circle,  2 triangles
  36, // cylinder:        2 squares, 1 circle
  33, // triangularPrism: 2 squares, 1 triangle
  18, // squarePyramid:   1 square,  2 triangles
]);

function isBaseShapeCompositionValid(
  top: FlatShape,
  front: FlatShape,
  side: FlatShape,
): boolean {
  return VALID_COMPOSITIONS.has(
    calculateCompositionSignature(top, front, side),
  );
}

/**
 * Check whether triangle orientations across 3 views are consistent with
 * a valid 3D object.
 *
 * Returns true if the orientations could come from a real object.
 */
export function trianglesMatch(
  top: FlatShape,
  front: FlatShape,
  side: FlatShape,
): boolean {
  if (toBaseShape(top) === "triangle") {
    if (top === "triangleUp") return side === "triangleRight";
    if (top === "triangleDown") return side === "triangleLeft";
    if (top === "triangleLeft" || top === "triangleRight") return top === front;
  }
  if (toBaseShape(front) === "triangle") {
    if (front === "triangleUp" || front === "triangleDown")
      return front === side;
  }
  // No triangle constraints to check
  return true;
}

/**
 * Check whether a face combination is geometrically impossible — i.e., no
 * valid 3D shape (from SHAPE_FACES) could produce this combination of flat
 * shapes across the three views.
 *
 * Returns true if the combination is impossible (good for a wrong answer).
 */
export function isGeometricallyImpossible(
  topShape: FlatShape,
  frontShape: FlatShape,
  sideShape: FlatShape,
): boolean {
  if (!isBaseShapeCompositionValid(topShape, frontShape, sideShape)) return true;

  // Valid composition — but if 2+ triangles, check orientation consistency
  const triangleCount = [topShape, frontShape, sideShape].filter(
    (s) => toBaseShape(s) === "triangle",
  ).length;
  if (triangleCount >= 2 && !trianglesMatch(topShape, frontShape, sideShape)) {
    return true;
  }

  return false;
}
