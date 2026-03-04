import { useCallback, useRef, useState } from "react";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import type { GameSession } from "../game/game-session";
import { addResult, createGameSession } from "../game/game-session";
import { GameSetup } from "./GameSetup";
import { GameResults } from "./GameResults";
import { CubePuzzleScene } from "./CubePuzzleScene";
import { CountdownTimer } from "./CountdownTimer";
import { PuzzleErrorBoundary } from "./PuzzleErrorBoundary";
import shared from "./shared.module.css";
import setupStyles from "./GameSetup.module.css";
import styles from "./CubeGame.module.css";

type GameState = "setup" | "playing" | "results";

interface CubeGameProps {
  readonly onExit: () => void;
}

export function CubeGame({ onExit }: CubeGameProps) {
  const [state, setState] = useState<GameState>("setup");
  const [faceMode, setFaceMode] = useState<FaceRenderMode>("color");
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
      <GameSetup title="Cube Puzzle" onStart={handleStart} onExit={onExit}>
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
        <CubePuzzleScene mode={faceMode} onAnswer={handleAnswer} />
      </PuzzleErrorBoundary>
    </div>
  );
}
