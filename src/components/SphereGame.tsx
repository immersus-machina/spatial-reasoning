import { useCallback, useRef, useState } from "react";
import type { GameSession } from "../game/game-session";
import { addResult, createGameSession } from "../game/game-session";
import { GameSetup } from "./GameSetup";
import { GameResults } from "./GameResults";
import { SpherePuzzleScene } from "./SpherePuzzleScene";
import { CountdownTimer } from "./CountdownTimer";
import { PuzzleErrorBoundary } from "./PuzzleErrorBoundary";
import styles from "./SphereGame.module.css";

type GameState = "setup" | "playing" | "results";

export function SphereGame() {
  const [state, setState] = useState<GameState>("setup");
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
    console.log(`Answer received: correct=${correct}, timeMs=${timeMs}`);
    setSession((prev) => addResult(prev, correct, timeMs));
  }, []);

  const handleTimeUp = useCallback(() => {
    setState("results");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setState("setup");
  }, []);

  if (state === "setup") {
    return <GameSetup title="Sphere Puzzle" onStart={handleStart} />;
  }

  if (state === "results") {
    return <GameResults session={session} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className={styles.container}>
      <CountdownTimer endTime={endTime} onTimeUp={handleTimeUp} />
      <PuzzleErrorBoundary>
        <SpherePuzzleScene onAnswer={handleAnswer} />
      </PuzzleErrorBoundary>
    </div>
  );
}
