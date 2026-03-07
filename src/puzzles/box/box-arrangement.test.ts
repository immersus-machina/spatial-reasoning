import { describe, it, expect } from "vitest";
import { generateBoxArrangement, reorientForMutability } from "./box-arrangement";
import type { ViewingDirection } from "./box-types";
import { seededRandom } from "../../tests/seeded-random";

describe("generateBoxArrangement", () => {
  it("generates valid easy arrangement", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(42));
    expect(arrangement.gridSize).toBe(3);
    expect(arrangement.objects.length).toBeGreaterThanOrEqual(5);
    expect(arrangement.objects.length).toBeLessThanOrEqual(8);
  });

  it("generates valid hard arrangement", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(42));
    expect(arrangement.gridSize).toBe(4);
    expect(arrangement.objects.length).toBeGreaterThanOrEqual(7);
    expect(arrangement.objects.length).toBeLessThanOrEqual(11);
  });

  it("all objects have valid grid coordinates", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(99));
    for (const obj of arrangement.objects) {
      expect(obj.x).toBeGreaterThanOrEqual(0);
      expect(obj.x).toBeLessThanOrEqual(arrangement.gridSize - 1);
      expect(obj.y).toBeGreaterThanOrEqual(0);
      expect(obj.y).toBeLessThanOrEqual(arrangement.gridSize - 1);
      expect(obj.z).toBeGreaterThanOrEqual(0);
      expect(obj.z).toBeLessThanOrEqual(arrangement.gridSize - 1);
    }
  });

  it("no two objects project to the same cell in any view", () => {
    for (let trial = 0; trial < 10; trial++) {
      const arrangement = generateBoxArrangement(
        "hard",
        seededRandom(77 + trial),
      );

      const topKeys = arrangement.objects.map((o) => `${o.x},${o.z}`);
      expect(new Set(topKeys).size).toBe(topKeys.length);

      const frontKeys = arrangement.objects.map((o) => `${o.y},${o.x}`);
      expect(new Set(frontKeys).size).toBe(frontKeys.length);

      const sideKeys = arrangement.objects.map((o) => `${o.y},${o.z}`);
      expect(new Set(sideKeys).size).toBe(sideKeys.length);
    }
  });

  it("all objects have face mappings", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(33));
    for (const obj of arrangement.objects) {
      expect(obj.faceMapping).toBeDefined();
      expect(obj.faceMapping.top).toBeDefined();
      expect(obj.faceMapping.front).toBeDefined();
      expect(obj.faceMapping.side).toBeDefined();
    }
  });

  it("easy mode uses only easy shapes", () => {
    const easyShapes = new Set(["cube", "sphere", "cylinder"]);
    for (let trial = 1; trial <= 10; trial++) {
      const arrangement = generateBoxArrangement(
        "easy",
        seededRandom(trial),
      );
      for (const obj of arrangement.objects) {
        expect(easyShapes.has(obj.shape)).toBe(true);
      }
    }
  });

  it("throws on degenerate random (always returns 0)", () => {
    const alwaysZero = () => 0;
    expect(() => generateBoxArrangement("easy", alwaysZero)).toThrow();
  });

  it("is deterministic with same seed", () => {
    const a1 = generateBoxArrangement("hard", seededRandom(42));
    const a2 = generateBoxArrangement("hard", seededRandom(42));

    expect(a1.objects.length).toBe(a2.objects.length);
    for (let i = 0; i < a1.objects.length; i++) {
      expect(a1.objects[i].x).toBe(a2.objects[i].x);
      expect(a1.objects[i].y).toBe(a2.objects[i].y);
      expect(a1.objects[i].z).toBe(a2.objects[i].z);
      expect(a1.objects[i].shape).toBe(a2.objects[i].shape);
      expect(a1.objects[i].color).toBe(a2.objects[i].color);
    }
  });
});

describe("reorientForMutability", () => {
  it("moves circle face away from missing direction for cylinders", () => {
    for (const missingDirection of ["top", "front", "side"] as ViewingDirection[]) {
      const arrangement = generateBoxArrangement("easy", seededRandom(42));
      const reoriented = reorientForMutability(
        arrangement, missingDirection, arrangement.objects.length, seededRandom(99),
      );

      for (const boxObject of reoriented.objects) {
        if (boxObject.shape === "cylinder") {
          expect(boxObject.faceMapping[missingDirection]).toBe("square");
        }
      }
    }
  });

  it("does not modify objects that are not cylinders or prisms", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "top", arrangement.objects.length, seededRandom(99),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      const shape = arrangement.objects[i].shape;
      if (shape !== "cylinder" && shape !== "triangularPrism") {
        expect(reoriented.objects[i]).toEqual(arrangement.objects[i]);
      }
    }
  });

  it("preserves cylinder face composition (2 squares, 1 circle)", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "front", arrangement.objects.length, seededRandom(99),
    );

    for (const boxObject of reoriented.objects) {
      if (boxObject.shape === "cylinder") {
        const faces = [boxObject.faceMapping.top, boxObject.faceMapping.front, boxObject.faceMapping.side];
        expect(faces.filter((f) => f === "square")).toHaveLength(2);
        expect(faces.filter((f) => f === "circle")).toHaveLength(1);
      }
    }
  });

  it("does not touch cylinders already showing square toward missing direction", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "top", arrangement.objects.length, seededRandom(99),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      const original = arrangement.objects[i];
      if (original.shape === "cylinder" && original.faceMapping.top === "square") {
        expect(reoriented.objects[i].faceMapping).toEqual(original.faceMapping);
      }
    }
  });

  it("moves triangle face away from missing direction for prisms", () => {
    for (const missingDirection of ["top", "front", "side"] as ViewingDirection[]) {
      const arrangement = generateBoxArrangement("hard", seededRandom(42));
      const reoriented = reorientForMutability(
        arrangement, missingDirection, arrangement.objects.length, seededRandom(99),
      );

      for (const boxObject of reoriented.objects) {
        if (boxObject.shape === "triangularPrism") {
          expect(boxObject.faceMapping[missingDirection]).toBe("square");
        }
      }
    }
  });

  it("preserves prism face composition (2 squares, 1 triangle)", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "front", arrangement.objects.length, seededRandom(99),
    );

    const triangleShapes = new Set(["triangleUp", "triangleDown", "triangleLeft", "triangleRight"]);
    for (const boxObject of reoriented.objects) {
      if (boxObject.shape === "triangularPrism") {
        const faces = [boxObject.faceMapping.top, boxObject.faceMapping.front, boxObject.faceMapping.side];
        expect(faces.filter((f) => f === "square")).toHaveLength(2);
        expect(faces.filter((f) => triangleShapes.has(f))).toHaveLength(1);
      }
    }
  });

  it("does not touch prisms already showing square toward missing direction", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "top", arrangement.objects.length, seededRandom(99),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      const original = arrangement.objects[i];
      if (original.shape === "triangularPrism" && original.faceMapping.top === "square") {
        expect(reoriented.objects[i].faceMapping).toEqual(original.faceMapping);
      }
    }
  });

  it("reorients nothing when count is 0", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "top", 0, seededRandom(99),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      expect(reoriented.objects[i]).toEqual(arrangement.objects[i]);
    }
  });

  it("only reorients up to count candidates", () => {
    const arrangement = generateBoxArrangement("easy", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "top", 1, seededRandom(99),
    );

    let reorientedCount = 0;
    for (let i = 0; i < arrangement.objects.length; i++) {
      if (arrangement.objects[i].shape === "cylinder"
        && arrangement.objects[i].faceMapping.top === "circle"
        && reoriented.objects[i].faceMapping.top === "square") {
        reorientedCount++;
      }
    }
    expect(reorientedCount).toBeLessThanOrEqual(1);
  });

  it("preserves object positions and colors", () => {
    const arrangement = generateBoxArrangement("hard", seededRandom(42));
    const reoriented = reorientForMutability(
      arrangement, "side", arrangement.objects.length, seededRandom(99),
    );

    for (let i = 0; i < arrangement.objects.length; i++) {
      expect(reoriented.objects[i].x).toBe(arrangement.objects[i].x);
      expect(reoriented.objects[i].y).toBe(arrangement.objects[i].y);
      expect(reoriented.objects[i].z).toBe(arrangement.objects[i].z);
      expect(reoriented.objects[i].color).toBe(arrangement.objects[i].color);
      expect(reoriented.objects[i].shape).toBe(arrangement.objects[i].shape);
    }
  });
});
