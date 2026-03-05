import type { FlatShape, ProjectedView } from "../puzzles/box/box-types";
import { getBoxColorHex } from "../utils/box-appearance";

interface BoxProjectedGridProps {
  readonly view: ProjectedView;
  /** Whether to show "?" overlay instead of shapes. */
  readonly hidden?: boolean;
}

const CELL_SIZE = 40;
const SHAPE_PADDING = 4;
const GRID_GAP = 2;

function cellOffset(index: number): number {
  return index * (CELL_SIZE + GRID_GAP);
}

function renderFlatShape(
  shape: FlatShape,
  color: string,
  x: number,
  y: number,
  key: string,
): React.ReactElement {
  const inner = CELL_SIZE - 2 * SHAPE_PADDING;
  const cx = x + CELL_SIZE / 2;
  const cy = y + CELL_SIZE / 2;
  const px = x + SHAPE_PADDING;
  const py = y + SHAPE_PADDING;

  switch (shape) {
    case "square":
      return (
        <rect
          key={key}
          x={px}
          y={py}
          width={inner}
          height={inner}
          fill={color}
          rx={2}
        />
      );

    case "circle":
      return (
        <circle
          key={key}
          cx={cx}
          cy={cy}
          r={inner / 2}
          fill={color}
        />
      );

    case "triangleUp":
      return (
        <polygon
          key={key}
          points={`${cx},${py} ${px},${py + inner} ${px + inner},${py + inner}`}
          fill={color}
        />
      );

    case "triangleDown":
      return (
        <polygon
          key={key}
          points={`${px},${py} ${px + inner},${py} ${cx},${py + inner}`}
          fill={color}
        />
      );

    case "triangleLeft":
      return (
        <polygon
          key={key}
          points={`${px + inner},${py} ${px + inner},${py + inner} ${px},${cy}`}
          fill={color}
        />
      );

    case "triangleRight":
      return (
        <polygon
          key={key}
          points={`${px},${py} ${px + inner},${cy} ${px},${py + inner}`}
          fill={color}
        />
      );
  }
}

export function BoxProjectedGrid({ view, hidden }: BoxProjectedGridProps) {
  const totalSize = view.gridSize * CELL_SIZE + (view.gridSize - 1) * GRID_GAP;

  return (
    <svg
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      {/* Grid background cells */}
      {Array.from({ length: view.gridSize }, (_, row) =>
        Array.from({ length: view.gridSize }, (_, col) => (
          <rect
            key={`bg-${row}-${col}`}
            x={cellOffset(col)}
            y={cellOffset(row)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#1a1a2e"
            rx={2}
          />
        )),
      )}

      {/* Shapes in occupied cells */}
      {!hidden &&
        view.cells.map((cell) =>
          renderFlatShape(
            cell.shape,
            getBoxColorHex(cell.color),
            cellOffset(cell.column),
            cellOffset(cell.row),
            `shape-${cell.row}-${cell.column}`,
          ),
        )}

      {/* "?" overlay for hidden view */}
      {hidden && (
        <text
          x={totalSize / 2}
          y={totalSize / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#666"
          fontSize={totalSize * 0.4}
          fontWeight="bold"
        >
          ?
        </text>
      )}
    </svg>
  );
}
