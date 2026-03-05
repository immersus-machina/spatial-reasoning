import type { ProjectedView, ViewingDirection } from "../puzzles/box/box-types";
import { BoxProjectedGrid } from "./BoxProjectedGrid";
import { AXIS_COLORS } from "../utils/box-appearance";
import styles from "./BoxAnswerGrid.module.css";

interface BoxAnswerGridProps {
  readonly id: number;
  readonly view: ProjectedView;
  readonly missingDirection: ViewingDirection;
  readonly onSelect: (id: number) => void;
}

/**
 * Edge styling per missing direction. The L-shape corner on the answer grid
 * must match the orientation of the corresponding face on the isometric box:
 *
 * - top missing → L at bottom-right (bottom + right edges colored)
 * - front missing (left face on iso) → L at top-right (top + right edges colored)
 * - side missing (right face on iso) → L at top-left (top + left edges colored)
 */
interface EdgeStyle {
  readonly borderTopWidth: string;
  readonly borderRightWidth: string;
  readonly borderBottomWidth: string;
  readonly borderLeftWidth: string;
  readonly borderTopColor: string;
  readonly borderRightColor: string;
  readonly borderBottomColor: string;
  readonly borderLeftColor: string;
}

const THIN = "1px";
const THICK = "3px";
const MUTED = "#333";

function getEdgeStyle(direction: ViewingDirection): EdgeStyle {
  switch (direction) {
    case "top":
      // L at bottom-right
      return {
        borderTopWidth: THIN, borderTopColor: MUTED,
        borderLeftWidth: THIN, borderLeftColor: MUTED,
        borderBottomWidth: THICK, borderBottomColor: AXIS_COLORS.x,
        borderRightWidth: THICK, borderRightColor: AXIS_COLORS.z,
      };
    case "front":
      // L at top-right
      return {
        borderBottomWidth: THIN, borderBottomColor: MUTED,
        borderLeftWidth: THIN, borderLeftColor: MUTED,
        borderTopWidth: THICK, borderTopColor: AXIS_COLORS.x,
        borderRightWidth: THICK, borderRightColor: AXIS_COLORS.y,
      };
    case "side":
      // L at top-left
      return {
        borderBottomWidth: THIN, borderBottomColor: MUTED,
        borderRightWidth: THIN, borderRightColor: MUTED,
        borderTopWidth: THICK, borderTopColor: AXIS_COLORS.z,
        borderLeftWidth: THICK, borderLeftColor: AXIS_COLORS.y,
      };
  }
}

export function BoxAnswerGrid({
  id,
  view,
  missingDirection,
  onSelect,
}: BoxAnswerGridProps) {
  return (
    <button
      className={styles.button}
      onClick={() => onSelect(id)}
      type="button"
      aria-label={`Answer option ${id + 1}`}
    >
      <div
        className={styles.gridWrapper}
        style={getEdgeStyle(missingDirection)}
      >
        <BoxProjectedGrid view={view} />
      </div>
    </button>
  );
}
