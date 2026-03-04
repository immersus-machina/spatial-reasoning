import { useCallback, useMemo, useReducer } from "react";
import { generateSpherePuzzle } from "../puzzles/sphere/sphere-puzzle";
import { shuffleWithCorrect } from "../utils/shuffle";
import { Sphere3dView } from "./Sphere3dView";
import { SphereNeighborhoodAnswer } from "./SphereNeighborhoodAnswer";
import styles from "./SpherePuzzleScene.module.css";

interface SpherePuzzleSceneProps {
  readonly onAnswer: (correct: boolean) => void;
}

function generatePuzzleState() {
  return {
    puzzle: generateSpherePuzzle(),
  };
}

export function SpherePuzzleScene({ onAnswer }: SpherePuzzleSceneProps) {
  const [{ puzzle }, regenerate] = useReducer(
    generatePuzzleState,
    null,
    generatePuzzleState,
  );

  const shuffled = useMemo(() => {
    const result = shuffleWithCorrect(
      puzzle.wrongAnswer,
      puzzle.correctAnswers,
    );
    return {
      wrongIndex: result.correctIndex,
      answers: result.items.map((neighborhood, i) => ({
        id: i,
        neighborhood,
      })),
    };
  }, [puzzle]);

  const handleAnswerSelected = useCallback(
    (id: number) => {
      onAnswer(id === shuffled.wrongIndex);
      regenerate();
    },
    [onAnswer, shuffled.wrongIndex],
  );

  return (
    <div className={styles.container}>
      <div className={styles.scene}>
        <Sphere3dView arrangement={puzzle.arrangement} />
      </div>
      <div className={styles.prompt}>Remove the wrong one</div>
      <div className={styles.answers}>
        {shuffled.answers.map((answer) => (
          <SphereNeighborhoodAnswer
            key={answer.id}
            id={answer.id}
            neighborhood={answer.neighborhood}
            onSelect={handleAnswerSelected}
          />
        ))}
      </div>
    </div>
  );
}
