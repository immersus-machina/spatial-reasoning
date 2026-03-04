import { describe, it, expect } from "vitest";
import type { ColorRing, Neighborhood, SphereArrangement } from "./sphere-types";
import {
  computeNeighborhood,
  computeAllNeighborhoods,
  rotateRing,
  areNeighborhoodsEqual,
} from "./sphere-neighborhoods";

// Hand-built arrangement for testing.
// Corners: nearBottomLeft=red, nearBottomRight=blue, nearTopLeft=yellow,
//          nearTopRight=red, farBottomLeft=blue, farBottomRight=yellow,
//          farTopLeft=red, farTopRight=blue
// Faces: left=red, right=blue, bottom=yellow, top=red, near=blue, far=yellow
const TEST_ARRANGEMENT: SphereArrangement = [
  { position: "nearBottomLeft", color: "red" },
  { position: "nearBottomRight", color: "blue" },
  { position: "nearTopLeft", color: "yellow" },
  { position: "nearTopRight", color: "red" },
  { position: "farBottomLeft", color: "blue" },
  { position: "farBottomRight", color: "yellow" },
  { position: "farTopLeft", color: "red" },
  { position: "farTopRight", color: "blue" },
  { position: "left", color: "red" },
  { position: "right", color: "blue" },
  { position: "bottom", color: "yellow" },
  { position: "top", color: "red" },
  { position: "near", color: "blue" },
  { position: "far", color: "yellow" },
];

describe("computeNeighborhood", () => {
  // nearBottomLeft ring (odd parity): [cornerX, faceZ, cornerY, faceX, cornerZ, faceY]
  // = [nearBottomRight, near, nearTopLeft, left, farBottomLeft, bottom]
  // Colors: [blue, blue, yellow, red, blue, yellow]
  it("returns correct neighborhood for nearBottomLeft", () => {
    const n = computeNeighborhood(TEST_ARRANGEMENT, "nearBottomLeft");
    expect(n.center).toBe("red");
    expect(n.ring).toEqual(["blue", "blue", "yellow", "red", "blue", "yellow"]);
  });

  // farTopRight ring (even parity): [faceY, cornerZ, faceX, cornerY, faceZ, cornerX]
  // = [top, nearTopRight, right, farBottomRight, far, farTopLeft]
  // Colors: [red, red, blue, yellow, yellow, red]
  it("returns correct neighborhood for farTopRight", () => {
    const n = computeNeighborhood(TEST_ARRANGEMENT, "farTopRight");
    expect(n.center).toBe("blue");
    expect(n.ring).toEqual(["red", "red", "blue", "yellow", "yellow", "red"]);
  });
});

describe("computeAllNeighborhoods", () => {
  it("returns exactly 8 neighborhoods", () => {
    const neighborhoods = computeAllNeighborhoods(TEST_ARRANGEMENT);
    expect(neighborhoods).toHaveLength(8);
  });
});

describe("rotateRing", () => {
  it("shifts elements left by 1", () => {
    const ring: ColorRing = ["red", "blue", "yellow", "red", "blue", "yellow"];
    expect(rotateRing(ring)).toEqual([
      "blue",
      "yellow",
      "red",
      "blue",
      "yellow",
      "red",
    ]);
  });

  it("returns to original after 6 rotations", () => {
    const ring: ColorRing = ["red", "blue", "yellow", "red", "yellow", "blue"];
    let rotated = ring;
    for (let i = 0; i < 6; i++) {
      rotated = rotateRing(rotated);
    }
    expect(rotated).toEqual(ring);
  });
});

describe("areNeighborhoodsEqual", () => {
  const a: Neighborhood = {
    center: "red",
    ring: ["blue", "yellow", "red", "blue", "yellow", "red"],
  };

  it("returns true for identical neighborhoods", () => {
    expect(areNeighborhoodsEqual(a, { ...a })).toBe(true);
  });

  it("returns false when centers differ", () => {
    expect(areNeighborhoodsEqual(a, { ...a, center: "blue" })).toBe(false);
  });

  it("returns false when one ring element differs", () => {
    const b: Neighborhood = {
      center: "red",
      ring: ["blue", "yellow", "yellow", "blue", "yellow", "red"],
    };
    expect(areNeighborhoodsEqual(a, b)).toBe(false);
  });

  it("returns false for rotated ring", () => {
    const b: Neighborhood = {
      center: "red",
      ring: rotateRing(a.ring),
    };
    expect(areNeighborhoodsEqual(a, b)).toBe(false);
  });
});

