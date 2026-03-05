import { useCallback, useMemo, useReducer } from "react";
import type { BoxDifficulty } from "../puzzles/box/box-types";
import { generateBoxPuzzle } from "../puzzles/box/box-puzzle";
import { shuffleWithCorrect } from "../utils/shuffle";
import { BoxIsometricDiagram } from "./BoxIsometricDiagram";
import { BoxAnswerGrid } from "./BoxAnswerGrid";
import { BoxSpecimenViewer } from "./BoxSpecimenViewer";
import styles from "./BoxPuzzleScene.module.css";

interface BoxPuzzleSceneProps {
  readonly difficulty: BoxDifficulty;
  readonly onAnswer: (correct: boolean) => void;
}

function generatePuzzleState(difficulty: BoxDifficulty) {
  return () => ({
    puzzle: generateBoxPuzzle(difficulty),
  });
}

export function BoxPuzzleScene({ difficulty, onAnswer }: BoxPuzzleSceneProps) {
  const generator = useMemo(() => generatePuzzleState(difficulty), [difficulty]);
  const [{ puzzle }, regenerate] = useReducer(generator, null, generator);

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
        <div className={styles.sceneContent}>
          <BoxIsometricDiagram
            knownViews={puzzle.knownViews}
            missingDirection={puzzle.missingDirection}
          />
          <BoxSpecimenViewer objects={puzzle.arrangement.objects} />
        </div>
      </div>
      <div className={styles.prompt}>Pick the correct view</div>
      <div className={styles.answers}>
        {shuffled.answers.map((answer) => (
          <BoxAnswerGrid
            key={answer.id}
            id={answer.id}
            view={answer.view}
            missingDirection={puzzle.missingDirection}
            onSelect={handleAnswerSelected}
          />
        ))}
      </div>
    </div>
  );
}
