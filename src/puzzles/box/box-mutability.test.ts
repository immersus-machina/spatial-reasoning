import { describe, it, expect } from "vitest";
import { findMutableCells } from "./box-mutability";
import { EASY_FLAT_SHAPES, ALL_FLAT_SHAPES } from "./box-shapes";
import type {
  BoxArrangement,
  BoxObject,
  FaceMapping,
  ViewingDirection,
} from "./box-types";

// ── Helpers ──────────────────────────────────────────────────────────

function makeObject(
  shape: BoxObject["shape"],
  color: BoxObject["color"],
  x: number,
  y: number,
  z: number,
  faceMapping: FaceMapping,
): BoxObject {
  return { shape, color, x, y, z, faceMapping };
}

function makeArrangement(
  gridSize: 3 | 4,
  objects: BoxObject[],
): BoxArrangement {
  return { gridSize, objects };
}

// ── findMutableCells ─────────────────────────────────────────────────

describe("findMutableCells", () => {
  it("cube is never mutable in easy mode", () => {
    const arrangement = makeArrangement(3, [
      makeObject("cube", "red", 0, 0, 0, {
        top: "square",
        front: "square",
        side: "square",
      }),
    ]);

    for (const direction of ["top", "front", "side"] as ViewingDirection[]) {
      const mutable = findMutableCells(arrangement, direction, EASY_FLAT_SHAPES);
      expect(mutable).toHaveLength(0);
    }
  });

  it("sphere is always mutable in easy mode", () => {
    const arrangement = makeArrangement(3, [
      makeObject("sphere", "blue", 0, 0, 0, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
    ]);

    for (const direction of ["top", "front", "side"] as ViewingDirection[]) {
      const mutable = findMutableCells(arrangement, direction, EASY_FLAT_SHAPES);
      expect(mutable).toHaveLength(1);
      expect(mutable[0].originalShape).toBe("circle");
      expect(mutable[0].mutations).toContain("square");
    }
  });

  it("cylinder with square toward missing is mutable in easy mode", () => {
    // Circle on side, square on top and front
    const arrangement = makeArrangement(3, [
      makeObject("cylinder", "yellow", 0, 0, 0, {
        top: "square",
        front: "square",
        side: "circle",
      }),
    ]);

    // Missing=top → square face, changing to circle gives (circle, square, circle)
    // = 2 circles + 1 square → impossible
    const mutableTop = findMutableCells(arrangement, "top", EASY_FLAT_SHAPES);
    expect(mutableTop).toHaveLength(1);
    expect(mutableTop[0].originalShape).toBe("square");

    // Missing=front → square face, same logic
    const mutableFront = findMutableCells(arrangement, "front", EASY_FLAT_SHAPES);
    expect(mutableFront).toHaveLength(1);

    // Missing=side → circle face, changing to square gives (square, square, square)
    // = cube → valid, NOT mutable
    const mutableSide = findMutableCells(arrangement, "side", EASY_FLAT_SHAPES);
    expect(mutableSide).toHaveLength(0);
  });

  it("returns correct grid positions", () => {
    const arrangement = makeArrangement(3, [
      makeObject("sphere", "red", 1, 2, 0, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
    ]);

    const mutable = findMutableCells(arrangement, "side", EASY_FLAT_SHAPES);
    expect(mutable).toHaveLength(1);
    // side: row=y=2, column=z=0
    expect(mutable[0].row).toBe(2);
    expect(mutable[0].column).toBe(0);
  });

  it("preserves original color", () => {
    const arrangement = makeArrangement(3, [
      makeObject("sphere", "yellow", 0, 0, 0, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
    ]);

    const mutable = findMutableCells(arrangement, "top", EASY_FLAT_SHAPES);
    expect(mutable[0].originalColor).toBe("yellow");
  });

  it("finds multiple mutable cells in a mixed arrangement", () => {
    const arrangement = makeArrangement(3, [
      makeObject("cube", "red", 0, 0, 0, {
        top: "square",
        front: "square",
        side: "square",
      }),
      makeObject("sphere", "blue", 1, 1, 1, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
      makeObject("cylinder", "yellow", 2, 2, 2, {
        top: "square",
        front: "square",
        side: "circle",
      }),
    ]);

    // Missing=top: sphere (mutable) + cylinder with square toward top (mutable) = 2
    const mutable = findMutableCells(arrangement, "top", EASY_FLAT_SHAPES);
    expect(mutable).toHaveLength(2);
    expect(mutable.map((m) => m.originalColor).sort((a, b) => a.localeCompare(b))).toEqual(["blue", "yellow"]);
  });

  it("cube is never mutable even in hard mode", () => {
    // (square,square,square): square→circle = cylinder (valid),
    // square→triangle = triangularPrism (valid). No impossible mutation.
    const arrangement = makeArrangement(4, [
      makeObject("cube", "red", 0, 0, 0, {
        top: "square",
        front: "square",
        side: "square",
      }),
    ]);

    for (const direction of ["top", "front", "side"] as ViewingDirection[]) {
      const mutable = findMutableCells(arrangement, direction, ALL_FLAT_SHAPES);
      expect(mutable).toHaveLength(0);
    }
  });

  it("all objects yield distinct grid positions", () => {
    const arrangement = makeArrangement(3, [
      makeObject("sphere", "red", 0, 0, 0, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
      makeObject("sphere", "blue", 1, 1, 1, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
      makeObject("sphere", "yellow", 2, 2, 2, {
        top: "circle",
        front: "circle",
        side: "circle",
      }),
    ]);

    const mutable = findMutableCells(arrangement, "top", EASY_FLAT_SHAPES);
    expect(mutable).toHaveLength(3);
    const positions = new Set(mutable.map((m) => `${m.row},${m.column}`));
    expect(positions.size).toBe(3);
  });
});
