import { describe, it, expect } from "vitest";
import {
  ALL_CORNER_POSITIONS,
  ALL_FACE_POSITIONS,
  getCornerRing,
} from "./sphere-topology";

describe("ALL_CORNER_POSITIONS", () => {
  it("has 8 entries", () => {
    expect(ALL_CORNER_POSITIONS).toHaveLength(8);
  });
});

describe("ALL_FACE_POSITIONS", () => {
  it("has 6 entries", () => {
    expect(ALL_FACE_POSITIONS).toHaveLength(6);
  });
});

describe("getCornerRing", () => {
  it("returns exactly 6 positions for every corner", () => {
    for (const corner of ALL_CORNER_POSITIONS) {
      expect(getCornerRing(corner)).toHaveLength(6);
    }
  });

  it("contains 3 corners and 3 faces for every corner", () => {
    const corners = new Set<string>(ALL_CORNER_POSITIONS);
    const faces = new Set<string>(ALL_FACE_POSITIONS);

    for (const corner of ALL_CORNER_POSITIONS) {
      const ring = getCornerRing(corner);
      const cornerCount = ring.filter((p) => corners.has(p)).length;
      const faceCount = ring.filter((p) => faces.has(p)).length;
      expect(cornerCount).toBe(3);
      expect(faceCount).toBe(3);
    }
  });

  it("alternates between face and corner positions", () => {
    const corners = new Set<string>(ALL_CORNER_POSITIONS);

    for (const corner of ALL_CORNER_POSITIONS) {
      const ring = getCornerRing(corner);
      const isCorner = ring.map((p) => corners.has(p));
      for (let idx = 0; idx < 6; idx++) {
        expect(isCorner[idx]).not.toBe(isCorner[(idx + 1) % 6]);
      }
    }
  });

  it("is symmetric: if B is in A's ring then A is in B's ring", () => {
    const corners = new Set<string>(ALL_CORNER_POSITIONS);

    for (const corner of ALL_CORNER_POSITIONS) {
      const ring = getCornerRing(corner);
      const neighborCorners = ring.filter((p) => corners.has(p));
      for (const neighbor of neighborCorners) {
        const neighborRing = getCornerRing(
          neighbor as Parameters<typeof getCornerRing>[0],
        );
        expect(neighborRing).toContain(corner);
      }
    }
  });

  it("does not include the corner itself in its ring", () => {
    for (const corner of ALL_CORNER_POSITIONS) {
      const ring = getCornerRing(corner);
      expect(ring).not.toContain(corner);
    }
  });

  it("returns correct ring for nearBottomLeft", () => {
    expect(getCornerRing("nearBottomLeft")).toEqual([
      "nearBottomRight",
      "near",
      "nearTopLeft",
      "left",
      "farBottomLeft",
      "bottom",
    ]);
  });

  it("returns correct ring for nearBottomRight", () => {
    expect(getCornerRing("nearBottomRight")).toEqual([
      "bottom",
      "farBottomRight",
      "right",
      "nearTopRight",
      "near",
      "nearBottomLeft",
    ]);
  });

  it("returns correct ring for farTopRight", () => {
    expect(getCornerRing("farTopRight")).toEqual([
      "top",
      "nearTopRight",
      "right",
      "farBottomRight",
      "far",
      "farTopLeft",
    ]);
  });
});
