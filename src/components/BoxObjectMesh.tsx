import { useMemo } from "react";
import { Shape, ExtrudeGeometry, BufferGeometry, Float32BufferAttribute } from "three";
import type { BoxShapeHard } from "../puzzles/box/box-types";

interface BoxObjectMeshProps {
  readonly shape: BoxShapeHard;
  readonly color: string;
}

function createTriangularPrismGeometry(): ExtrudeGeometry {
  const s = new Shape();
  s.moveTo(-0.5, -0.5);
  s.lineTo(0.5, -0.5);
  s.lineTo(0, 0.5);
  s.closePath();
  return new ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
}

function createSquarePyramidGeometry(): BufferGeometry {
  const h = 0.7;
  // base corners
  const bl = [-0.5, 0, -0.5];
  const br = [0.5, 0, -0.5];
  const fr = [0.5, 0, 0.5];
  const fl = [-0.5, 0, 0.5];
  const apex = [0, h, 0];

  // prettier-ignore
  const vertices = new Float32Array([
    // base (2 triangles)
    ...bl, ...br, ...fr,
    ...bl, ...fr, ...fl,
    // front face
    ...fl, ...fr, ...apex,
    // right face
    ...fr, ...br, ...apex,
    // back face
    ...br, ...bl, ...apex,
    // left face
    ...bl, ...fl, ...apex,
  ]);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function BoxObjectMesh({ shape, color }: BoxObjectMeshProps) {
  const prismGeometry = useMemo(
    () => (shape === "triangularPrism" ? createTriangularPrismGeometry() : null),
    [shape],
  );

  const pyramidGeometry = useMemo(
    () => (shape === "squarePyramid" ? createSquarePyramidGeometry() : null),
    [shape],
  );

  switch (shape) {
    case "cube":
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );

    case "sphere":
      return (
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );

    case "cone":
      return (
        <mesh>
          <coneGeometry args={[0.5, 1, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );

    case "cylinder":
      return (
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );

    case "triangularPrism":
      return (
        <mesh geometry={prismGeometry!} position={[0, 0, -0.5]}>
          <meshStandardMaterial color={color} />
        </mesh>
      );

    case "squarePyramid":
      return (
        <mesh geometry={pyramidGeometry!}>
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}
