import { describe, it, expect } from "vitest";
import {
  assignFaceMapping,
  toBaseShape,
  trianglesMatch,
  isGeometricallyImpossible,
  EASY_SHAPES,
  HARD_SHAPES,
} from "./box-shapes";
import { seededRandom } from "../../tests/seeded-random";

describe("assignFaceMapping", () => {
  it("produces valid FlatShapes for all shape types", () => {
    const random = seededRandom(42);
    for (const shape of HARD_SHAPES) {
      const mapping = assignFaceMapping(shape, random);
      for (const direction of ["top", "front", "side"] as const) {
        const flat = mapping[direction];
        expect([
          "square",
          "circle",
          "triangleUp",
          "triangleDown",
          "triangleLeft",
          "triangleRight",
        ]).toContain(flat);
      }
    }
  });

  it("cube always has all square faces", () => {
    const random = seededRandom(99);
    for (let i = 0; i < 10; i++) {
      const mapping = assignFaceMapping("cube", random);
      expect(mapping.top).toBe("square");
      expect(mapping.front).toBe("square");
      expect(mapping.side).toBe("square");
    }
  });

  it("sphere always has all circle faces", () => {
    const random = seededRandom(77);
    for (let i = 0; i < 10; i++) {
      const mapping = assignFaceMapping("sphere", random);
      expect(mapping.top).toBe("circle");
      expect(mapping.front).toBe("circle");
      expect(mapping.side).toBe("circle");
    }
  });

  it("cone has exactly 2 triangle faces and 1 circle", () => {
    const random = seededRandom(55);
    for (let i = 0; i < 20; i++) {
      const mapping = assignFaceMapping("cone", random);
      const faces = [mapping.top, mapping.front, mapping.side];
      const triangles = faces.filter((f) => toBaseShape(f) === "triangle");
      const circles = faces.filter((f) => f === "circle");
      expect(triangles).toHaveLength(2);
      expect(circles).toHaveLength(1);
    }
  });

  it("cylinder has exactly 2 square faces and 1 circle", () => {
    const random = seededRandom(33);
    for (let i = 0; i < 20; i++) {
      const mapping = assignFaceMapping("cylinder", random);
      const faces = [mapping.top, mapping.front, mapping.side];
      const squares = faces.filter((f) => f === "square");
      const circles = faces.filter((f) => f === "circle");
      expect(squares).toHaveLength(2);
      expect(circles).toHaveLength(1);
    }
  });

  it("triangularPrism has 1 triangle and 2 squares", () => {
    const random = seededRandom(11);
    for (let i = 0; i < 20; i++) {
      const mapping = assignFaceMapping("triangularPrism", random);
      const faces = [mapping.top, mapping.front, mapping.side];
      const triangles = faces.filter((f) => toBaseShape(f) === "triangle");
      const squares = faces.filter((f) => f === "square");
      expect(triangles).toHaveLength(1);
      expect(squares).toHaveLength(2);
    }
  });

  it("squarePyramid has 2 triangles and 1 square", () => {
    const random = seededRandom(22);
    for (let i = 0; i < 20; i++) {
      const mapping = assignFaceMapping("squarePyramid", random);
      const faces = [mapping.top, mapping.front, mapping.side];
      const triangles = faces.filter((f) => toBaseShape(f) === "triangle");
      const squares = faces.filter((f) => f === "square");
      expect(triangles).toHaveLength(2);
      expect(squares).toHaveLength(1);
    }
  });
});

describe("toBaseShape", () => {
  it("maps flat shapes to base categories", () => {
    expect(toBaseShape("square")).toBe("square");
    expect(toBaseShape("circle")).toBe("circle");
    expect(toBaseShape("triangleUp")).toBe("triangle");
    expect(toBaseShape("triangleDown")).toBe("triangle");
    expect(toBaseShape("triangleLeft")).toBe("triangle");
    expect(toBaseShape("triangleRight")).toBe("triangle");
  });
});

describe("trianglesMatch", () => {
  it("triangleUp top requires triangleRight side", () => {
    expect(trianglesMatch("triangleUp", "square", "triangleRight")).toBe(true);
    expect(trianglesMatch("triangleUp", "square", "triangleLeft")).toBe(false);
  });

  it("triangleDown top requires triangleLeft side", () => {
    expect(trianglesMatch("triangleDown", "square", "triangleLeft")).toBe(true);
    expect(trianglesMatch("triangleDown", "square", "triangleRight")).toBe(false);
  });

  it("triangleLeft/Right top must match front", () => {
    expect(trianglesMatch("triangleLeft", "triangleLeft", "circle")).toBe(true);
    expect(trianglesMatch("triangleLeft", "triangleRight", "circle")).toBe(false);
    expect(trianglesMatch("triangleRight", "triangleRight", "circle")).toBe(true);
    expect(trianglesMatch("triangleRight", "triangleLeft", "circle")).toBe(false);
  });

  it("returns true when no triangles involved", () => {
    expect(trianglesMatch("square", "circle", "square")).toBe(true);
  });
});

describe("isGeometricallyImpossible", () => {
  it("returns false for valid shape compositions", () => {
    // cube: square, square, square
    expect(isGeometricallyImpossible("square", "square", "square")).toBe(false);
    // sphere: circle, circle, circle
    expect(isGeometricallyImpossible("circle", "circle", "circle")).toBe(false);
    // cylinder: square, square, circle (any order)
    expect(isGeometricallyImpossible("circle", "square", "square")).toBe(false);
    // cone: circle on top, triangleUp on front and side (valid per CORRELATED_ORIENTATIONS)
    expect(isGeometricallyImpossible("circle", "triangleUp", "triangleUp")).toBe(false);
    // triangularPrism: triangle, square, square
    expect(isGeometricallyImpossible("triangleUp", "square", "square")).toBe(false);
    // squarePyramid: top=triangleUp, front=square, side=triangleRight (side non-triangle)
    expect(isGeometricallyImpossible("triangleRight", "triangleRight", "square")).toBe(false);
  });

  it("returns true for compositions that match no 3D shape", () => {
    // 2 circles + 1 square — no shape has this
    expect(isGeometricallyImpossible("circle", "circle", "square")).toBe(true);
    // 1 triangle + 2 circles — no shape has this
    expect(isGeometricallyImpossible("triangleUp", "circle", "circle")).toBe(true);
    // 1 triangle + 1 circle + 1 square — no shape has this
    expect(isGeometricallyImpossible("triangleUp", "circle", "square")).toBe(true);
  });

  it("returns true for matching composition but inconsistent triangle orientations", () => {
    // squarePyramid composition (triangle, triangle, square) but bad orientations
    expect(isGeometricallyImpossible("triangleUp", "triangleLeft", "square")).toBe(true);
  });
});

describe("shape constants", () => {
  it("EASY_SHAPES has 3 shapes", () => {
    expect(EASY_SHAPES).toHaveLength(3);
  });

  it("HARD_SHAPES has 6 shapes", () => {
    expect(HARD_SHAPES).toHaveLength(6);
  });

  it("EASY_SHAPES is a subset of HARD_SHAPES", () => {
    for (const shape of EASY_SHAPES) {
      expect(HARD_SHAPES).toContain(shape);
    }
  });
});
