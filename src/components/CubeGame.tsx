import { useMemo, useState } from "react";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { CubePuzzleScene } from "./CubePuzzleScene";
import { GameShell } from "./GameShell";
import shared from "./shared.module.css";
import setupStyles from "./GameSetup.module.css";

interface CubeGameProps {
  readonly onExit: () => void;
}

export function CubeGame({ onExit }: CubeGameProps) {
  const [faceMode, setFaceMode] = useState<FaceRenderMode>("color");

  const sceneProps = useMemo(() => ({ mode: faceMode }), [faceMode]);

  return (
    <GameShell
      title="Cube Puzzle"
      rules="You are shown a 3x3 arrangement of cubes in 3D, each with distinct faces. Rotate the scene to study it, then pick the 2D grid that correctly shows one of its faces."
      SceneComponent={CubePuzzleScene}
      sceneProps={sceneProps}
      onExit={onExit}
      setupChildren={
        <div className={setupStyles.section}>
          <div className={shared.label}>Display</div>
          <div className={setupStyles.options}>
            <button
              className={`${shared.button} ${faceMode === "color" ? setupStyles.selected : ""}`}
              onClick={() => setFaceMode("color")}
              type="button"
            >
              Colors
            </button>
            <button
              className={`${shared.button} ${faceMode === "symbol" ? setupStyles.selected : ""}`}
              onClick={() => setFaceMode("symbol")}
              type="button"
            >
              Symbols
            </button>
          </div>
        </div>
      }
    />
  );
}
