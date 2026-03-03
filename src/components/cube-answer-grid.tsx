import type { FlatView } from "../puzzles/cube/cube-types";
import { FLAT_VIEW_KEYS } from "../puzzles/cube/cube-views";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { getFaceColor, getFaceSymbol } from "../utils/cube-face-appearance";
import styles from "./cube-answer-grid.module.css";

interface CubeAnswerGridProps {
  readonly view: FlatView;
  readonly mode: FaceRenderMode;
  readonly onSelect?: () => void;
}

export function CubeAnswerGrid({ view, mode, onSelect }: CubeAnswerGridProps) {
  return (
    <button className={styles.button} onClick={onSelect} type="button">
      <div className={styles.grid}>
        {FLAT_VIEW_KEYS.map((key) => (
          <div
            key={key}
            className={styles.cell}
            style={{ backgroundColor: getFaceColor(view[key], mode) }}
          >
            {mode === "symbol" ? getFaceSymbol(view[key]) : null}
          </div>
        ))}
      </div>
    </button>
  );
}
