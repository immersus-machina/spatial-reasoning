import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { CubeArrangement } from "../puzzles/cube/cube-types";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { CubeMesh } from "./cube-mesh";

interface Cube3dViewProps {
  readonly arrangement: CubeArrangement;
  readonly mode: FaceRenderMode;
}

function CubeScene({ arrangement, mode }: Cube3dViewProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <group>
        {arrangement.map((placement) => (
          <CubeMesh
            key={`${placement.row}-${placement.column}-${placement.depth}-${mode}`}
            placement={placement}
            mode={mode}
          />
        ))}
      </group>
    </>
  );
}

export function Cube3dView({ arrangement, mode }: Cube3dViewProps) {
  return (
    <Canvas camera={{ position: [12, 12, 20], fov: 15 }}>
      <CubeScene arrangement={arrangement} mode={mode} />
    </Canvas>
  );
}
