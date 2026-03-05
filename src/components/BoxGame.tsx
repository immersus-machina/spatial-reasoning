import { useCallback, useRef, useState } from "react";
import type { BoxDifficulty } from "../puzzles/box/box-types";
import type { GameSession } from "../game/game-session";
import { addResult, createGameSession } from "../game/game-session";
import { GameSetup } from "./GameSetup";
import { GameResults } from "./GameResults";
import { BoxPuzzleScene } from "./BoxPuzzleScene";
import { CountdownTimer } from "./CountdownTimer";
import { PuzzleErrorBoundary } from "./PuzzleErrorBoundary";
import shared from "./shared.module.css";
import setupStyles from "./GameSetup.module.css";
import styles from "./BoxGame.module.css";

type GameState = "setup" | "playing" | "results";

interface BoxGameProps {
  readonly onExit: () => void;
}

export function BoxGame({ onExit }: BoxGameProps) {
  const [state, setState] = useState<GameState>("setup");
  const [difficulty, setDifficulty] = useState<BoxDifficulty>("easy");
  const [session, setSession] = useState<GameSession>(createGameSession(0));
  const [endTime, setEndTime] = useState(0);
  const lastAnswerTimeRef = useRef(0);

  const handleStart = useCallback((durationMs: number) => {
    const now = Date.now();
    setSession(createGameSession(durationMs));
    setEndTime(now + durationMs);
    lastAnswerTimeRef.current = now;
    setState("playing");
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    const now = Date.now();
    const timeMs = now - lastAnswerTimeRef.current;
    lastAnswerTimeRef.current = now;
    setSession((prev) => addResult(prev, correct, timeMs));
  }, []);

  const handleTimeUp = useCallback(() => {
    setState("results");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setState("setup");
  }, []);

  if (state === "setup") {
    return (
      <GameSetup
        title="Box Projection"
        rules="Colored 3D shapes are placed inside a box. You see 2 of the 3 orthographic projections (top, front, side). Identify the correct 3rd projection from the 4 options below. Rotate the specimen shapes to understand their projections."
        onStart={handleStart}
        onExit={onExit}
      >
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
      </GameSetup>
    );
  }

  if (state === "results") {
    return <GameResults session={session} onPlayAgain={handlePlayAgain} onExit={onExit} />;
  }

  return (
    <div className={styles.container}>
      <CountdownTimer endTime={endTime} onTimeUp={handleTimeUp} />
      <PuzzleErrorBoundary>
        <BoxPuzzleScene difficulty={difficulty} onAnswer={handleAnswer} />
      </PuzzleErrorBoundary>
    </div>
  );
}
