import type { ProjectedView, ViewingDirection } from "../puzzles/box/box-types";
import { BoxProjectedGrid } from "./BoxProjectedGrid";
import { AXIS_COLORS } from "../utils/box-appearance";
import styles from "./BoxIsometricDiagram.module.css";

interface BoxIsometricDiagramProps {
  readonly knownViews: readonly [ProjectedView, ProjectedView];
  readonly missingDirection: ViewingDirection;
}

// ── Edge styling per direction ───────────────────────────────────────

/**
 * Each view square gets an L-shaped colored border on 2 edges,
 * matching the axis colors. The L orientation corresponds to how
 * this face relates to the 3D box corner.
 *
 * - top:   L at bottom-right (x-red bottom, z-blue right)
 * - front: L at top-right   (x-red top, y-green right)
 * - side:  L at top-left    (z-blue top, y-green left)
 */
function getEdgeBorderStyle(direction: ViewingDirection): React.CSSProperties {
  const thin = "1px solid #333";
  switch (direction) {
    case "top":
      return {
        borderTop: thin,
        borderLeft: thin,
        borderBottom: `3px solid ${AXIS_COLORS.x}`,
        borderRight: `3px solid ${AXIS_COLORS.z}`,
      };
    case "front":
      return {
        borderBottom: thin,
        borderLeft: thin,
        borderTop: `3px solid ${AXIS_COLORS.x}`,
        borderRight: `3px solid ${AXIS_COLORS.y}`,
      };
    case "side":
      return {
        borderBottom: thin,
        borderRight: thin,
        borderTop: `3px solid ${AXIS_COLORS.z}`,
        borderLeft: `3px solid ${AXIS_COLORS.y}`,
      };
  }
}

// ── Direction labels ─────────────────────────────────────────────────

const DIRECTION_LABELS: Record<ViewingDirection, string> = {
  top: "Top",
  front: "Front",
  side: "Side",
};

// ── Isometric wireframe box (SVG) ────────────────────────────────────

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

/**
 * Small isometric wireframe cube centered at origin.
 * The front corner is at (0, S) where S is the half-size.
 * Edges from the corner are colored by axis.
 */
function IsometricWireframe() {
  const S = 40; // half-size in SVG units
  const cx = 50;
  const cy = 50;

  // Front corner (closest to viewer)
  const fx = cx;
  const fy = cy + S * 0.2;

  // Three edges from front corner
  const topLeft = [fx - COS30 * S, fy - SIN30 * S]; // up-left (x axis)
  const topRight = [fx + COS30 * S, fy - SIN30 * S]; // up-right (z axis)
  const bottom = [fx, fy + S]; // straight down (y axis)

  // Back corners (far from viewer)
  const backTop = [cx, fy - S]; // top-back
  const backLeft = [fx - COS30 * S, fy - SIN30 * S + S]; // back-left
  const backRight = [fx + COS30 * S, fy - SIN30 * S + S]; // back-right

  return (
    <svg viewBox="0 0 100 100" className={styles.wireframe}>
      {/* Back edges (dimmer) */}
      <line x1={topLeft[0]} y1={topLeft[1]} x2={backTop[0]} y2={backTop[1]} stroke="#444" strokeWidth={1} />
      <line x1={topRight[0]} y1={topRight[1]} x2={backTop[0]} y2={backTop[1]} stroke="#444" strokeWidth={1} />
      <line x1={topLeft[0]} y1={topLeft[1]} x2={backLeft[0]} y2={backLeft[1]} stroke="#444" strokeWidth={1} />
      <line x1={topRight[0]} y1={topRight[1]} x2={backRight[0]} y2={backRight[1]} stroke="#444" strokeWidth={1} />
      <line x1={bottom[0]} y1={bottom[1]} x2={backLeft[0]} y2={backLeft[1]} stroke="#444" strokeWidth={1} />
      <line x1={bottom[0]} y1={bottom[1]} x2={backRight[0]} y2={backRight[1]} stroke="#444" strokeWidth={1} />

      {/* Back-back edges */}
      <line x1={backTop[0]} y1={backTop[1]} x2={backLeft[0] + COS30 * S} y2={backLeft[1] - SIN30 * S} stroke="#333" strokeWidth={1} strokeDasharray="3,3" />
      <line x1={backLeft[0]} y1={backLeft[1]} x2={backLeft[0] + COS30 * S} y2={backLeft[1] - SIN30 * S} stroke="#333" strokeWidth={1} strokeDasharray="3,3" />
      <line x1={backRight[0]} y1={backRight[1]} x2={backLeft[0] + COS30 * S} y2={backLeft[1] - SIN30 * S} stroke="#333" strokeWidth={1} strokeDasharray="3,3" />

      {/* Front edges (colored by axis) */}
      <line x1={fx} y1={fy} x2={topLeft[0]} y2={topLeft[1]} stroke={AXIS_COLORS.x} strokeWidth={2} />
      <line x1={fx} y1={fy} x2={topRight[0]} y2={topRight[1]} stroke={AXIS_COLORS.z} strokeWidth={2} />
      <line x1={fx} y1={fy} x2={bottom[0]} y2={bottom[1]} stroke={AXIS_COLORS.y} strokeWidth={2} />
    </svg>
  );
}

// ── View panel ───────────────────────────────────────────────────────

function ViewPanel({
  direction,
  view,
  isHidden,
}: {
  readonly direction: ViewingDirection;
  readonly view: ProjectedView | undefined;
  readonly isHidden: boolean;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>{DIRECTION_LABELS[direction]}</div>
      <div
        className={`${styles.viewSquare} ${isHidden ? styles.hidden : ""}`}
        style={getEdgeBorderStyle(direction)}
      >
        {view && !isHidden ? (
          <BoxProjectedGrid view={view} />
        ) : (
          <div className={styles.questionMark}>?</div>
        )}
      </div>
    </div>
  );
}

// ── Public component ─────────────────────────────────────────────────

/**
 * Layout: small isometric wireframe box in the center, with the 3 flat
 * view squares positioned around it matching their spatial orientation.
 *
 *          [ Top  ]
 *       [ wireframe ]
 *    [Front]   [Side]
 */
export function BoxIsometricDiagram({
  knownViews,
  missingDirection,
}: BoxIsometricDiagramProps) {
  const viewMap = new Map<ViewingDirection, ProjectedView>();
  for (const v of knownViews) {
    viewMap.set(v.direction, v);
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <ViewPanel
          direction="top"
          view={viewMap.get("top")}
          isHidden={missingDirection === "top"}
        />
      </div>
      <div className={styles.middleRow}>
        <IsometricWireframe />
      </div>
      <div className={styles.bottomRow}>
        <ViewPanel
          direction="front"
          view={viewMap.get("front")}
          isHidden={missingDirection === "front"}
        />
        <ViewPanel
          direction="side"
          view={viewMap.get("side")}
          isHidden={missingDirection === "side"}
        />
      </div>
    </div>
  );
}
