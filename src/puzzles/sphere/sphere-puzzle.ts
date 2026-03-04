import type {
  ColorRing,
  Neighborhood,
  SphereColor,
  SpherePuzzle,
} from "./sphere-types";
import { getRandomDifferentColor } from "./sphere-colors";
import { ALL_CORNER_POSITIONS } from "./sphere-topology";
import { generateSphereArrangement } from "./sphere-arrangement";
import {
  areNeighborhoodsEqual,
  computeAllNeighborhoods,
  rotateRing,
} from "./sphere-neighborhoods";

const MAX_WRONG_ANSWER_RETRIES = 20;

function applyRandomRingRotation(
  neighborhood: Neighborhood,
  random: () => number,
): Neighborhood {
  const steps = Math.floor(random() * 6);
  let ring = neighborhood.ring;
  for (let i = 0; i < steps; i++) {
    ring = rotateRing(ring);
  }
  return { center: neighborhood.center, ring };
}

function pickDistinctIndices(
  count: number,
  max: number,
  random: () => number,
): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const idx = Math.floor(random() * max);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  return indices;
}

/**
 * Check whether a candidate wrong neighborhood matches any of the valid
 * neighborhoods in any of the 6 ring rotations.
 */
function isWrongNeighborhoodTrulyWrong(
  candidate: Neighborhood,
  allNeighborhoods: readonly Neighborhood[],
): boolean {
  for (const real of allNeighborhoods) {
    let rotated = real.ring;
    for (let rotation = 0; rotation < 6; rotation++) {
      if (areNeighborhoodsEqual(candidate, { center: real.center, ring: rotated })) {
        return false;
      }
      rotated = rotateRing(rotated);
    }
  }
  return true;
}

function generateWrongAnswer(
  baseNeighborhood: Neighborhood,
  allNeighborhoods: readonly Neighborhood[],
  random: () => number,
): Neighborhood {
  for (let attempt = 0; attempt < MAX_WRONG_ANSWER_RETRIES; attempt++) {
    // Pick position 0-6: 0-5 = ring position, 6 = center
    const position = Math.floor(random() * 7);

    let center: SphereColor;
    let ring: ColorRing;

    if (position === 6) {
      center = getRandomDifferentColor(baseNeighborhood.center, random);
      ring = baseNeighborhood.ring;
    } else {
      center = baseNeighborhood.center;
      const ringCopy = [...baseNeighborhood.ring] as [
        SphereColor,
        SphereColor,
        SphereColor,
        SphereColor,
        SphereColor,
        SphereColor,
      ];
      ringCopy[position] = getRandomDifferentColor(ringCopy[position], random);
      ring = ringCopy;
    }

    const candidate: Neighborhood = { center, ring };
    if (isWrongNeighborhoodTrulyWrong(candidate, allNeighborhoods)) {
      return candidate;
    }
  }

  throw new Error(
    `Failed to generate valid wrong answer after ${MAX_WRONG_ANSWER_RETRIES} attempts`,
  );
}

export function generateSpherePuzzle(
  random: () => number = Math.random,
): SpherePuzzle {
  const arrangement = generateSphereArrangement(random);
  const allNeighborhoods = computeAllNeighborhoods(arrangement);

  const [correctIdx0, correctIdx1, correctIdx2, wrongBaseIdx] =
    pickDistinctIndices(4, ALL_CORNER_POSITIONS.length, random);

  const correct0 = applyRandomRingRotation(allNeighborhoods[correctIdx0], random);
  const correct1 = applyRandomRingRotation(allNeighborhoods[correctIdx1], random);
  const correct2 = applyRandomRingRotation(allNeighborhoods[correctIdx2], random);

  const wrongBase = allNeighborhoods[wrongBaseIdx];
  const wrong = generateWrongAnswer(wrongBase, allNeighborhoods, random);
  const wrongRotated = applyRandomRingRotation(wrong, random);

  return {
    arrangement,
    correctAnswers: [correct0, correct1, correct2],
    wrongAnswer: wrongRotated,
  };
}
