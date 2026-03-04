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
  return arrangement.find((p) => p.position === position)!.color;
}

export function getRandomDifferentColor(
  color: SphereColor,
  random: () => number = Math.random,
): SphereColor {
  const others = ALL_SPHERE_COLORS.filter((c) => c !== color);
  return others[Math.floor(random() * others.length)];
}
