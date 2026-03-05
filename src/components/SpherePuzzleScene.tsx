import { useCallback, useMemo, useReducer } from "react";
import { generateSpherePuzzle } from "../puzzles/sphere/sphere-puzzle";
import { shuffleWithCorrect } from "../utils/shuffle";
import { Sphere3dView } from "./Sphere3dView";
import { SphereNeighborhoodAnswer } from "./SphereNeighborhoodAnswer";
import shared from "./shared.module.css";

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
    <div className={shared.puzzleContainer}>
      <div className={shared.puzzleScene}>
        <Sphere3dView arrangement={puzzle.arrangement} />
      </div>
      <div className={shared.puzzlePrompt}>Remove the wrong one</div>
      <div className={shared.puzzleAnswers}>
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
