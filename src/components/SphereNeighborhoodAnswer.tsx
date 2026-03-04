import type { Neighborhood } from "../puzzles/sphere/sphere-types";
import { getSphereColorHex } from "../utils/sphere-color-map";
import styles from "./SphereNeighborhoodAnswer.module.css";

interface SphereNeighborhoodAnswerProps {
  readonly id: number;
  readonly neighborhood: Neighborhood;
  readonly onSelect: (id: number) => void;
}

const RING_POSITIONS: readonly [number, number][] = [
  [25, 70],
  [47.5, 109],
  [92.5, 109],
  [115, 70],
  [92.5, 31],
  [47.5, 31],
];

const CENTER: [number, number] = [70, 70];
const RADIUS = 18;

export function SphereNeighborhoodAnswer({
  id,
  neighborhood,
  onSelect,
}: SphereNeighborhoodAnswerProps) {
  return (
    <button
      className={styles.button}
      onClick={() => onSelect(id)}
      type="button"
    >
      <svg className={styles.svg} viewBox="0 0 140 140">
        {RING_POSITIONS.map(([cx, cy], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={RADIUS}
            fill={getSphereColorHex(neighborhood.ring[index])}
          />
        ))}
        <circle
          cx={CENTER[0]}
          cy={CENTER[1]}
          r={RADIUS}
          fill={getSphereColorHex(neighborhood.center)}
        />
      </svg>
    </button>
  );
}
