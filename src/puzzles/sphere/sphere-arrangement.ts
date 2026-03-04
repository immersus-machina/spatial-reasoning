import type {
  SphereArrangement,
  SphereColor,
  SpherePlacement,
} from "./sphere-types";
import { ALL_SPHERE_COLORS } from "./sphere-colors";
import {
  ALL_CORNER_POSITIONS,
  ALL_FACE_POSITIONS,
} from "./sphere-topology";

function pickColorWithLimit(
  counts: Record<SphereColor, number>,
  limit: number,
  random: () => number,
): SphereColor {
  const available = ALL_SPHERE_COLORS.filter((c) => counts[c] < limit);
  if (available.length === 0) {
    throw new Error(`No color available under limit ${limit}`);
  }
  return available[Math.floor(random() * available.length)];
}

function assignCorners(random: () => number): SpherePlacement[] {
  const counts: Record<SphereColor, number> = { red: 0, blue: 0, yellow: 0 };
  return ALL_CORNER_POSITIONS.map((corner) => {
    const color = pickColorWithLimit(counts, 3, random);
    counts[color]++;
    return { position: corner, color };
  });
}

function assignFaces(random: () => number): SpherePlacement[] {
  const counts: Record<SphereColor, number> = { red: 0, blue: 0, yellow: 0 };
  const placements: SpherePlacement[] = [];

  for (let fi = 0; fi < ALL_FACE_POSITIONS.length; fi++) {
    const face = ALL_FACE_POSITIONS[fi];
    const remaining = ALL_FACE_POSITIONS.length - fi;
    const totalNeeded = ALL_SPHERE_COLORS.reduce(
      (sum, c) => sum + Math.max(0, 2 - counts[c]),
      0,
    );

    let color: SphereColor;
    if (remaining === totalNeeded) {
      const forced = ALL_SPHERE_COLORS.find((c) => counts[c] < 2);
      if (forced === undefined) {
        throw new Error("No color available for forced face assignment");
      }
      color = forced;
    } else {
      color = pickColorWithLimit(counts, 2, random);
    }

    placements.push({ position: face, color });
    counts[color]++;
  }

  return placements;
}

export function generateSphereArrangement(
  random: () => number = Math.random,
): SphereArrangement {
  return [...assignCorners(random), ...assignFaces(random)] as unknown as SphereArrangement;
}
