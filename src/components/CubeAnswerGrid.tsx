import type { FlatView } from "../puzzles/cube/cube-types";
import { FLAT_VIEW_KEYS } from "../puzzles/cube/cube-views";
import type { FaceRenderMode } from "../utils/cube-face-appearance";
import { getFaceColor, getFaceSymbol } from "../utils/cube-face-appearance";
import styles from "./CubeAnswerGrid.module.css";

interface CubeAnswerGridProps {
  readonly id: number;
  readonly view: FlatView;
  readonly mode: FaceRenderMode;
  readonly onSelect: (id: number) => void;
}

export function CubeAnswerGrid({
  id,
  view,
  mode,
  onSelect,
}: CubeAnswerGridProps) {
  return (
    <button
      className={styles.button}
      onClick={() => onSelect(id)}
      type="button"
    >
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
