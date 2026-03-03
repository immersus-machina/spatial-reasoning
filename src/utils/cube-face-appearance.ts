import type { CubeFace } from "../puzzles/cube/cube-types";

export type FaceRenderMode = "color" | "symbol";

interface FaceAppearance {
  readonly color: string;
  readonly symbol: string;
}

const FACE_APPEARANCES: Record<CubeFace, FaceAppearance> = {
  frontA: { color: "#e74c3c", symbol: "\u25CB" }, // red, hollow circle
  backA: { color: "#e67e22", symbol: "\u25CF" }, // orange, filled circle
  frontB: { color: "#2ecc71", symbol: "\u2733" }, // green, eight-spoked asterisk
  backB: { color: "#f1c40f", symbol: "\u25A0" }, // yellow, square
  frontC: { color: "#3498db", symbol: "\u25C6" }, // blue, diamond
  backC: { color: "#9b59b6", symbol: "\u2715" }, // purple, cross
};

const SYMBOL_MODE_BACKGROUND = "#d5d5d5";

export function getFaceColor(face: CubeFace, mode: FaceRenderMode): string {
  return mode === "color"
    ? FACE_APPEARANCES[face].color
    : SYMBOL_MODE_BACKGROUND;
}

export function getFaceSymbol(face: CubeFace): string {
  return FACE_APPEARANCES[face].symbol;
}
