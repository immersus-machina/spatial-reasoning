import type { BoxColor } from "../puzzles/box/box-types";

// ── Color mapping ────────────────────────────────────────────────────

const BOX_COLOR_HEX: Record<BoxColor, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  yellow: "#f1c40f",
};

export function getBoxColorHex(color: BoxColor): string {
  return BOX_COLOR_HEX[color];
}

// ── Axis colors ──────────────────────────────────────────────────────

/**
 * Colors for the 3 axes of the isometric box diagram.
 * Used to color edges and correlate views with directions.
 */
export const AXIS_COLORS = {
  x: "#e74c3c", // red
  y: "#2ecc71", // green
  z: "#3498db", // blue
} as const;
