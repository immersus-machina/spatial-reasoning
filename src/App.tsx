import { useMemo } from "react";
import { generateSphereArrangement } from "./puzzles/sphere/sphere-arrangement";
import { Sphere3dView } from "./components/Sphere3dView";

export function App() {
  const arrangement = useMemo(() => generateSphereArrangement(), []);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Sphere3dView arrangement={arrangement} />
    </div>
  );
}
