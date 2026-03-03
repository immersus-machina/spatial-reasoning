import { CanvasTexture, SRGBColorSpace } from "three";
import type { CubeFace } from "../puzzles/cube/cube-types";
import { getFaceColor, getFaceSymbol } from "./cube-face-appearance";

const TEXTURE_SIZE = 128;
const textureCache = new Map<CubeFace, CanvasTexture>();

function createSymbolTexture(face: CubeFace): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;

  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = getFaceColor(face, "symbol");
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  ctx.fillStyle = "#222222";
  ctx.font = `bold ${TEXTURE_SIZE * 0.6}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(getFaceSymbol(face), TEXTURE_SIZE / 2, TEXTURE_SIZE / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function getSymbolTexture(face: CubeFace): CanvasTexture {
  const cached = textureCache.get(face);
  if (cached) return cached;

  const texture = createSymbolTexture(face);
  textureCache.set(face, texture);
  return texture;
}
