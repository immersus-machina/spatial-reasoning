import { useCallback, useMemo, useState } from "react";
import type { FlatView } from "../puzzles/cube/cube-types";
import { generateCubePuzzle } from "../puzzles/cube/cube-puzzle";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { generateSceneRotation } from "../utils/scene-rotation";
import { Cube3dView } from "./cube-3d-view";
import { CubeAnswerGrid } from "./cube-answer-grid";
import styles from "./cube-puzzle-scene.module.css";

interface LabeledAnswer {
  readonly id: string;
  readonly view: FlatView;
}

function shuffleAnswers(
  correctView: FlatView,
  wrongViews: readonly [FlatView, FlatView, FlatView],
): LabeledAnswer[] {
  const answers: LabeledAnswer[] = [
    { id: "correct", view: correctView },
    { id: "wrong-1", view: wrongViews[0] },
    { id: "wrong-2", view: wrongViews[1] },
    { id: "wrong-3", view: wrongViews[2] },
  ];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}

export function CubePuzzleScene() {
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [faceMode, setFaceMode] = useState<FaceRenderMode>("color");

  const puzzle = useMemo(() => generateCubePuzzle(), [puzzleKey]);
  const rotation = useMemo(() => generateSceneRotation(), [puzzleKey]);
  const answers = useMemo(
    () => shuffleAnswers(puzzle.correctView, puzzle.wrongViews),
    [puzzle],
  );

  const handleAnswerSelected = useCallback(() => {
    setPuzzleKey((key) => key + 1);
  }, []);

  const handleToggleMode = useCallback(() => {
    setFaceMode((current) => (current === "color" ? "symbol" : "color"));
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={styles.modeToggle}
        onClick={handleToggleMode}
        type="button"
      >
        {faceMode === "color" ? "Symbol Mode" : "Color Mode"}
      </button>
      <div className={styles.scene}>
        <Cube3dView
          arrangement={puzzle.arrangement}
          rotation={rotation}
          mode={faceMode}
        />
      </div>
      <div className={styles.answers}>
        {answers.map((answer) => (
          <CubeAnswerGrid
            key={answer.id}
            view={answer.view}
            mode={faceMode}
            onSelect={handleAnswerSelected}
          />
        ))}
      </div>
    </div>
  );
}
