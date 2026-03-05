import { GameShell } from "./GameShell";
import { SpherePuzzleScene } from "./SpherePuzzleScene";

interface SphereGameProps {
  readonly onExit: () => void;
}

const emptyProps = {};

export function SphereGame({ onExit }: SphereGameProps) {
  return (
    <GameShell
      title="Sphere Puzzle"
      rules="You are shown a constellation of colored spheres in 3D. Four neighborhood patterns are displayed — three match actual corners of the arrangement and one does not. Find and remove the wrong one."
      SceneComponent={SpherePuzzleScene}
      sceneProps={emptyProps}
      onExit={onExit}
    />
  );
}
