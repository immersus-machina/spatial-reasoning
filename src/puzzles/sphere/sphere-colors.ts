import type {
  SphereArrangement,
  SphereColor,
  SpherePosition,
} from "./sphere-types";

export const ALL_SPHERE_COLORS: readonly SphereColor[] = [
  "red",
  "blue",
  "yellow",
];

export function getColor(
  arrangement: SphereArrangement,
  position: SpherePosition,
): SphereColor {
  const entry = arrangement.find((p) => p.position === position);
  if (!entry) {
    // This should never happen if the arrangement is valid, but we throw an error just in case to avoid returning undefined.
    throw new Error(`Missing sphere at position "${position}"`);
  }
  return entry.color;
}

export function getRandomDifferentColor(
  color: SphereColor,
  random: () => number = Math.random,
): SphereColor {
  const others = ALL_SPHERE_COLORS.filter((c) => c !== color);
  return others[Math.floor(random() * others.length)];
}
