import { useCallback, useRef, useState } from "react";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import type { GameSession } from "../game/game-session";
import { addResult, createGameSession } from "../game/game-session";
import { GameSetup } from "./GameSetup";
import { GameResults } from "./GameResults";
import { CubePuzzleScene } from "./CubePuzzleScene";
import { CountdownTimer } from "./CountdownTimer";
import styles from "./CubeGame.module.css";

type GameState = "setup" | "playing" | "results";

export function CubeGame() {
  const [state, setState] = useState<GameState>("setup");
  const [faceMode, setFaceMode] = useState<FaceRenderMode>("color");
  const [session, setSession] = useState<GameSession>(createGameSession(0));
  const [endTime, setEndTime] = useState(0);
  const lastAnswerTimeRef = useRef(0);

  const handleStart = useCallback(
    (durationMs: number, mode: FaceRenderMode) => {
      const now = Date.now();
      setFaceMode(mode);
      setSession(createGameSession(durationMs));
      setEndTime(now + durationMs);
      lastAnswerTimeRef.current = now;
      setState("playing");
    },
    [],
  );

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
    return <GameSetup onStart={handleStart} />;
  }

  if (state === "results") {
    return <GameResults session={session} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className={styles.container}>
      <CountdownTimer endTime={endTime} onTimeUp={handleTimeUp} />
      <CubePuzzleScene mode={faceMode} onAnswer={handleAnswer} />
    </div>
  );
}
