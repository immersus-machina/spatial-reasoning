import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { Group } from "three";
import type { CubeArrangement } from "../puzzles/cube/cube-types";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import type { SceneRotation } from "../utils/scene-rotation";
import { CubeMesh } from "./cube-mesh";

interface Cube3dViewProps {
  readonly arrangement: CubeArrangement;
  readonly rotation: SceneRotation;
  readonly mode: FaceRenderMode;
}

function CubeScene({ arrangement, rotation, mode }: Cube3dViewProps) {
  const groupRef = useRef<Group>(null);
  const axis = useMemo(
    () => new Vector3(rotation.axisX, rotation.axisY, rotation.axisZ),
    [rotation.axisX, rotation.axisY, rotation.axisZ],
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotateOnAxis(axis, rotation.speed * delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <group ref={groupRef}>
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

export function Cube3dView({ arrangement, rotation, mode }: Cube3dViewProps) {
  return (
    <Canvas camera={{ position: [12, 12, 20], fov: 15 }}>
      <CubeScene
        key={`${rotation.axisX}-${rotation.speed}`}
        arrangement={arrangement}
        rotation={rotation}
        mode={mode}
      />
    </Canvas>
  );
}
