import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import type { GameSession } from "../game/game-session";
import { addResult, createGameSession } from "../game/game-session";
import { CountdownTimer } from "./CountdownTimer";
import { GameResults } from "./GameResults";
import { GameSetup } from "./GameSetup";
import { PuzzleErrorBoundary } from "./PuzzleErrorBoundary";
import shared from "./shared.module.css";

type GameState = "setup" | "playing" | "results";

interface SceneProps {
  readonly onAnswer: (correct: boolean) => void;
}

interface GameShellProps<P extends SceneProps> {
  readonly title: string;
  readonly rules: string;
  readonly setupChildren?: ReactNode;
  readonly SceneComponent: ComponentType<P>;
  readonly sceneProps: Omit<P, "onAnswer">;
  readonly onExit: () => void;
}

export function GameShell<P extends SceneProps>({
  title,
  rules,
  setupChildren,
  SceneComponent,
  sceneProps,
  onExit,
}: GameShellProps<P>) {
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
        title={title}
        rules={rules}
        onStart={handleStart}
        onExit={onExit}
      >
        {setupChildren}
      </GameSetup>
    );
  }

  if (state === "results") {
    return (
      <GameResults
        session={session}
        onPlayAgain={handlePlayAgain}
        onExit={onExit}
      />
    );
  }

  const allSceneProps = { ...sceneProps, onAnswer: handleAnswer } as P;

  return (
    <div className={shared.gameContainer}>
      <CountdownTimer endTime={endTime} onTimeUp={handleTimeUp} />
      <PuzzleErrorBoundary>
        <SceneComponent {...allSceneProps} />
      </PuzzleErrorBoundary>
    </div>
  );
}
