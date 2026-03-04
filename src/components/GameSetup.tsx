import type { ReactNode } from "react";
import shared from "./shared.module.css";
import styles from "./GameSetup.module.css";

const DURATIONS = [
  { label: "2 minutes", ms: 2 * 60 * 1000 },
  { label: "5 minutes", ms: 5 * 60 * 1000 },
];

interface GameSetupProps {
  readonly title: string;
  readonly onStart: (durationMs: number) => void;
  readonly onExit: () => void;
  readonly children?: ReactNode;
}

export function GameSetup({ title, onStart, onExit, children }: GameSetupProps) {
  return (
    <div className={shared.page}>
      <button className={shared.button} onClick={onExit} type="button">
        &larr; Home
      </button>
      <h1 className={shared.title}>{title}</h1>

      {children}

      <div className={styles.section}>
        <div className={shared.label}>Duration</div>
        <div className={styles.options}>
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              className={shared.button}
              onClick={() => onStart(d.ms)}
              type="button"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
