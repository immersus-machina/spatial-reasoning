import { useCallback, useMemo, useReducer } from "react";
import { generateCubePuzzle } from "../puzzles/cube/cube-puzzle";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { generateSceneRotation } from "../utils/scene-rotation";
import { shuffleWithCorrect } from "../utils/shuffle";
import { Cube3dView } from "./cube-3d-view";
import { CubeAnswerGrid } from "./cube-answer-grid";
import styles from "./cube-puzzle-scene.module.css";

interface CubePuzzleSceneProps {
  readonly mode: FaceRenderMode;
  readonly onAnswer: (correct: boolean) => void;
}

function generatePuzzleState() {
  return {
    puzzle: generateCubePuzzle(),
    rotation: generateSceneRotation(),
  };
}

export function CubePuzzleScene({ mode, onAnswer }: CubePuzzleSceneProps) {
  const [{ puzzle, rotation }, regenerate] = useReducer(
    generatePuzzleState,
    null,
    generatePuzzleState,
  );

  const shuffled = useMemo(() => {
    const result = shuffleWithCorrect(puzzle.correctView, puzzle.wrongViews);
    return {
      correctIndex: result.correctIndex,
      answers: result.items.map((view, i) => ({ id: i, view })),
    };
  }, [puzzle]);

  const handleAnswerSelected = useCallback(
    (id: number) => {
      onAnswer(id === shuffled.correctIndex);
      regenerate();
    },
    [onAnswer, shuffled.correctIndex],
  );

  return (
    <div className={styles.container}>
      <div className={styles.scene}>
        <Cube3dView
          arrangement={puzzle.arrangement}
          rotation={rotation}
          mode={mode}
        />
      </div>
      <div className={styles.answers}>
        {shuffled.answers.map((answer) => (
          <CubeAnswerGrid
            key={answer.id}
            id={answer.id}
            view={answer.view}
            mode={mode}
            onSelect={handleAnswerSelected}
          />
        ))}
      </div>
    </div>
  );
}
