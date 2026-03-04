import shared from "./shared.module.css";
import styles from "./PuzzleSelection.module.css";

interface PuzzleSelectionProps {
  readonly onSelect: (puzzle: "cube" | "sphere") => void;
}

export function PuzzleSelection({ onSelect }: PuzzleSelectionProps) {
  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Spatial Reasoning</h1>

      <div className={styles.cards}>
        <button
          className={styles.card}
          onClick={() => onSelect("cube")}
          type="button"
        >
          <span className={styles.cardTitle}>Cube Puzzle</span>
          <span className={styles.cardDescription}>
            Identify the correct view of a 3x3 cube arrangement
          </span>
        </button>

        <button
          className={styles.card}
          onClick={() => onSelect("sphere")}
          type="button"
        >
          <span className={styles.cardTitle}>Sphere Puzzle</span>
          <span className={styles.cardDescription}>
            Find the wrong neighborhood in a sphere constellation
          </span>
        </button>
      </div>
    </div>
  );
}
