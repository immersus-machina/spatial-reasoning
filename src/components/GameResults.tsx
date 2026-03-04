import type { GameSession } from "../game/game-session";
import { getSessionStats } from "../game/game-session";
import shared from "./shared.module.css";
import styles from "./GameResults.module.css";

interface GameResultsProps {
  readonly session: GameSession;
  readonly onPlayAgain: () => void;
  readonly onExit: () => void;
}

export function GameResults({ session, onPlayAgain, onExit }: GameResultsProps) {
  const stats = getSessionStats(session);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Results</h1>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.value}>{stats.total}</span>
          <span className={shared.label}>Answered</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{stats.correct}</span>
          <span className={shared.label}>Correct</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{stats.wrong}</span>
          <span className={shared.label}>Wrong</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>
            {Math.round(stats.accuracy * 100)}%
          </span>
          <span className={shared.label}>Accuracy</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <button className={shared.button} onClick={onPlayAgain} type="button">
          Play Again
        </button>
        <button className={shared.button} onClick={onExit} type="button">
          Home
        </button>
      </div>
    </div>
  );
}
