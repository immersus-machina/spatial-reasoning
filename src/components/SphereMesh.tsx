import type { SpherePlacement } from "../puzzles/sphere/sphere-types";
import { getSphereColorHex } from "../utils/sphere-color-map";
import { getSpherePosition } from "../utils/sphere-scene-layout";

interface SphereMeshProps {
  readonly placement: SpherePlacement;
}

export function SphereMesh({ placement }: SphereMeshProps) {
  const position = getSpherePosition(placement.position);
  const color = getSphereColorHex(placement.color);

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
