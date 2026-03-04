import { useState } from "react";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import shared from "./shared.module.css";
import styles from "./GameSetup.module.css";

const DURATIONS = [
  { label: "2 minutes", ms: 2 * 60 * 1000 },
  { label: "5 minutes", ms: 5 * 60 * 1000 },
];

interface GameSetupProps {
  readonly onStart: (durationMs: number, faceMode: FaceRenderMode) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [faceMode, setFaceMode] = useState<FaceRenderMode>("color");

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Cube Puzzle</h1>

      <div className={styles.section}>
        <div className={shared.label}>Display</div>
        <div className={styles.options}>
          <button
            className={`${shared.button} ${faceMode === "color" ? styles.selected : ""}`}
            onClick={() => setFaceMode("color")}
            type="button"
          >
            Colors
          </button>
          <button
            className={`${shared.button} ${faceMode === "symbol" ? styles.selected : ""}`}
            onClick={() => setFaceMode("symbol")}
            type="button"
          >
            Symbols
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={shared.label}>Duration</div>
        <div className={styles.options}>
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              className={shared.button}
              onClick={() => onStart(d.ms, faceMode)}
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
