import type { SphereColor } from "../puzzles/sphere/sphere-types";

const COLOR_HEX: Record<SphereColor, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  yellow: "#f1c40f",
};

export function getSphereColorHex(color: SphereColor): string {
  return COLOR_HEX[color];
}
