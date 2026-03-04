import { describe, it, expect } from "vitest";
import type { SphereColor } from "./sphere-types";
import { getColor } from "./sphere-colors";
import {
  ALL_CORNER_POSITIONS,
  ALL_FACE_POSITIONS,
} from "./sphere-topology";
import { generateSphereArrangement } from "./sphere-arrangement";
import { seededRandom } from "../../tests/seeded-random";

describe("generateSphereArrangement", () => {
  it("fills all 14 positions", () => {
    const arrangement = generateSphereArrangement(seededRandom(1));
    expect(arrangement).toHaveLength(14);
    const allPositions = [...ALL_CORNER_POSITIONS, ...ALL_FACE_POSITIONS];
    for (const pos of allPositions) {
      const color = getColor(arrangement, pos);
      expect(color).toBeDefined();
      expect(["red", "blue", "yellow"]).toContain(color);
    }
  });

  it("each placement knows its own position", () => {
    const arrangement = generateSphereArrangement(seededRandom(1));
    const positions = arrangement.map((p) => p.position);
    const allPositions = [...ALL_CORNER_POSITIONS, ...ALL_FACE_POSITIONS];
    expect(positions).toEqual(allPositions);
  });

  it("assigns at most 3 of any color to corners", () => {
    const arrangement = generateSphereArrangement(seededRandom(42));
    const counts: Record<SphereColor, number> = { red: 0, blue: 0, yellow: 0 };
    for (const corner of ALL_CORNER_POSITIONS) {
      counts[getColor(arrangement, corner)]++;
    }
    expect(counts.red).toBeLessThanOrEqual(3);
    expect(counts.blue).toBeLessThanOrEqual(3);
    expect(counts.yellow).toBeLessThanOrEqual(3);
    expect(counts.red + counts.blue + counts.yellow).toBe(8);
  });

  it("assigns exactly 2 of each color to faces", () => {
    const arrangement = generateSphereArrangement(seededRandom(42));
    const counts: Record<SphereColor, number> = { red: 0, blue: 0, yellow: 0 };
    for (const face of ALL_FACE_POSITIONS) {
      counts[getColor(arrangement, face)]++;
    }
    expect(counts.red).toBe(2);
    expect(counts.blue).toBe(2);
    expect(counts.yellow).toBe(2);
  });

  it("is deterministic with the same seed", () => {
    const a = generateSphereArrangement(seededRandom(99));
    const b = generateSphereArrangement(seededRandom(99));
    expect(a).toEqual(b);
  });

  it("satisfies constraints across many seeds", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const arrangement = generateSphereArrangement(seededRandom(seed));

      const cornerCounts: Record<SphereColor, number> = {
        red: 0,
        blue: 0,
        yellow: 0,
      };
      for (const corner of ALL_CORNER_POSITIONS) {
        cornerCounts[getColor(arrangement, corner)]++;
      }
      expect(cornerCounts.red).toBeLessThanOrEqual(3);
      expect(cornerCounts.blue).toBeLessThanOrEqual(3);
      expect(cornerCounts.yellow).toBeLessThanOrEqual(3);

      const faceCounts: Record<SphereColor, number> = {
        red: 0,
        blue: 0,
        yellow: 0,
      };
      for (const face of ALL_FACE_POSITIONS) {
        faceCounts[getColor(arrangement, face)]++;
      }
      expect(faceCounts.red).toBe(2);
      expect(faceCounts.blue).toBe(2);
      expect(faceCounts.yellow).toBe(2);
    }
  });
});
