import { useCallback, useMemo, useReducer } from "react";
import { generateCubePuzzle } from "../puzzles/cube/cube-puzzle";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { shuffleWithCorrect } from "../utils/shuffle";
import { Cube3dView } from "./Cube3dView";
import { CubeAnswerGrid } from "./CubeAnswerGrid";
import styles from "./CubePuzzleScene.module.css";

interface CubePuzzleSceneProps {
  readonly mode: FaceRenderMode;
  readonly onAnswer: (correct: boolean) => void;
}

function generatePuzzleState() {
  return {
    puzzle: generateCubePuzzle(),
  };
}

export function CubePuzzleScene({ mode, onAnswer }: CubePuzzleSceneProps) {
  const [{ puzzle }, regenerate] = useReducer(
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
