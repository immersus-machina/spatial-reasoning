import { Canvas } from "@react-three/fiber";
import type { SphereArrangement } from "../puzzles/sphere/sphere-types";
import { SphereMesh } from "./SphereMesh";
import { DragRotateGroup } from "./DragRotateGroup";

interface Sphere3dViewProps {
  readonly arrangement: SphereArrangement;
}

function SphereScene({ arrangement }: Sphere3dViewProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <DragRotateGroup>
        {arrangement.map((placement) => (
          <SphereMesh key={placement.position} placement={placement} />
        ))}
      </DragRotateGroup>
    </>
  );
}

export function Sphere3dView({ arrangement }: Sphere3dViewProps) {
  return (
    <Canvas camera={{ position: [6, 6, 10], fov: 20 }}>
      <SphereScene arrangement={arrangement} />
    </Canvas>
  );
}
