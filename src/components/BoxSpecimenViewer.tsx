import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { BoxObject } from "../puzzles/box/box-types";
import { getBoxColorHex } from "../utils/box-appearance";
import { BoxObjectMesh } from "./BoxObjectMesh";
import { DragRotateGroup } from "./DragRotateGroup";
import styles from "./BoxSpecimenViewer.module.css";

interface BoxSpecimenViewerProps {
  readonly objects: readonly BoxObject[];
}

/** Deduplicate objects by (shape, color) to get unique specimens. */
function getUniqueSpecimens(
  objects: readonly BoxObject[],
): { shape: BoxObject["shape"]; color: BoxObject["color"] }[] {
  const seen = new Set<string>();
  const result: { shape: BoxObject["shape"]; color: BoxObject["color"] }[] = [];
  for (const obj of objects) {
    const key = `${obj.shape}-${obj.color}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ shape: obj.shape, color: obj.color });
    }
  }
  return result;
}

const SHAPE_LABELS: Record<BoxObject["shape"], string> = {
  cube: "Cube",
  sphere: "Sphere",
  cone: "Cone",
  cylinder: "Cylinder",
  triangularPrism: "Prism",
  squarePyramid: "Pyramid",
};

export function BoxSpecimenViewer({ objects }: BoxSpecimenViewerProps) {
  const specimens = getUniqueSpecimens(objects);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const specimen = specimens[selectedIndex];

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <Canvas camera={{ position: [2, 2, 3], fov: 30 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <DragRotateGroup>
            <BoxObjectMesh
              shape={specimen.shape}
              color={getBoxColorHex(specimen.color)}
            />
          </DragRotateGroup>
        </Canvas>
      </div>
      <div className={styles.chips}>
        {specimens.map((s, i) => (
          <button
            key={`${s.shape}-${s.color}`}
            className={`${styles.chip} ${i === selectedIndex ? styles.chipSelected : ""}`}
            onClick={() => setSelectedIndex(i)}
            type="button"
          >
            <span
              className={styles.chipDot}
              style={{ backgroundColor: getBoxColorHex(s.color) }}
            />
            {SHAPE_LABELS[s.shape]}
          </button>
        ))}
      </div>
    </div>
  );
}
