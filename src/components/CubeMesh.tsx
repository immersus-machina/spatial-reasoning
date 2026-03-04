import type { CubePlacement } from "../puzzles/cube/cube-types";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { getFaceColor } from "../utils/cube-face-appearance";
import { getSymbolTexture } from "../utils/cube-face-textures";
import { getPlacementPosition } from "../utils/cube-scene-layout";
import { getOrientedFaces } from "../utils/cube-materials";

interface CubeMeshProps {
  readonly placement: CubePlacement;
  readonly mode: FaceRenderMode;
}

// No useMemo needed: this component remounts on each new puzzle via key in the parent,
// so memoizing within a single render cycle provides no benefit.
export function CubeMesh({ placement, mode }: CubeMeshProps) {
  const position = getPlacementPosition(
    placement.row,
    placement.column,
    placement.depth,
  );
  const faces = getOrientedFaces(placement.orientation);

  const material = (slot: 0 | 1 | 2 | 3 | 4 | 5) =>
    mode === "color"
      ? { color: getFaceColor(faces[slot], "color"), map: null }
      : { color: "#ffffff", map: getSymbolTexture(faces[slot]) };

  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial attach="material-0" {...material(0)} />
      <meshStandardMaterial attach="material-1" {...material(1)} />
      <meshStandardMaterial attach="material-2" {...material(2)} />
      <meshStandardMaterial attach="material-3" {...material(3)} />
      <meshStandardMaterial attach="material-4" {...material(4)} />
      <meshStandardMaterial attach="material-5" {...material(5)} />
    </mesh>
  );
}
