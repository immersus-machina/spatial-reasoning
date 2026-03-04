import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { SphereArrangement } from "../puzzles/sphere/sphere-types";
import { SphereMesh } from "./SphereMesh";

interface Sphere3dViewProps {
  readonly arrangement: SphereArrangement;
}

function SphereScene({ arrangement }: Sphere3dViewProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
      <group>
        {arrangement.map((placement) => (
          <SphereMesh key={placement.position} placement={placement} />
        ))}
      </group>
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
