import { useMemo, useState } from "react";
import type { BoxDifficulty } from "../puzzles/box/box-types";
import { BoxPuzzleScene } from "./BoxPuzzleScene";
import { GameShell } from "./GameShell";
import shared from "./shared.module.css";
import setupStyles from "./GameSetup.module.css";

interface BoxGameProps {
  readonly onExit: () => void;
}

export function BoxGame({ onExit }: BoxGameProps) {
  const [difficulty, setDifficulty] = useState<BoxDifficulty>("easy");

  const sceneProps = useMemo(() => ({ difficulty }), [difficulty]);

  return (
    <GameShell
      title="Box Projection"
      rules="Colored 3D shapes are placed inside a box. You see 2 of the 3 orthographic projections (top, front, side). Identify the correct 3rd projection from the 4 options below. Rotate the specimen shapes to understand their projections."
      SceneComponent={BoxPuzzleScene}
      sceneProps={sceneProps}
      onExit={onExit}
      setupChildren={
        <div className={setupStyles.section}>
          <div className={shared.label}>Difficulty</div>
          <div className={setupStyles.options}>
            <button
              className={`${shared.button} ${difficulty === "easy" ? setupStyles.selected : ""}`}
              onClick={() => setDifficulty("easy")}
              type="button"
            >
              Easy
            </button>
            <button
              className={`${shared.button} ${difficulty === "hard" ? setupStyles.selected : ""}`}
              onClick={() => setDifficulty("hard")}
              type="button"
            >
              Hard
            </button>
          </div>
        </div>
      }
    />
  );
}
