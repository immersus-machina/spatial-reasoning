import { describe, it, expect } from "vitest";
import {
  projectFlatView,
  computeAllFlatViews,
  rotateFlatViewClockwise,
  areFlatViewsEqual,
  FLAT_VIEW_KEYS,
} from "./cube-views";
import type { CubeArrangement, CubePlacement, FlatView } from "./cube-types";

// ── Test helpers ───────────────────────────────────────────────────────

/** Build a CubePlacement with the given position and orientation. */
function placement(
  row: CubePlacement["row"],
  column: CubePlacement["column"],
  depth: CubePlacement["depth"],
  facingViewer: CubePlacement["orientation"]["facingViewer"] = "frontA",
  facingUp: CubePlacement["orientation"]["facingUp"] = "frontB",
): CubePlacement {
  return { row, column, depth, orientation: { facingViewer, facingUp } };
}

/**
 * Build a default arrangement where all cubes face frontA toward the viewer
 * and frontB up, with depths arranged as a Latin square.
 */
function defaultArrangement(): CubeArrangement {
  return [
    placement("top", "left", "near"),
    placement("top", "center", "center"),
    placement("top", "right", "far"),
    placement("center", "left", "far"),
    placement("center", "center", "near"),
    placement("center", "right", "center"),
    placement("bottom", "left", "center"),
    placement("bottom", "center", "far"),
    placement("bottom", "right", "near"),
  ] as CubeArrangement;
}

/** A FlatView where every cell has the same face value. */
function uniformView(
  face: CubePlacement["orientation"]["facingViewer"],
): FlatView {
  return Object.fromEntries(
    FLAT_VIEW_KEYS.map((k) => [k, face]),
  ) as unknown as FlatView;
}

// ── Tests ──────────────────────────────────────────────────────────────

describe("projectFlatView", () => {
  it("front view shows all cubes at their natural (column, row) positions", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "front");

    // All cubes face frontA toward viewer, so all positions show frontA
    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("frontA");
    }
  });

  it("back view shows the opposite face (backA) for a uniform-orientation arrangement", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "back");

    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("backA");
    }
  });

  it("top view shows the up face (frontB) for a uniform-orientation arrangement", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "top");

    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("frontB");
    }
  });

  it("bottom view shows the opposite of up (backB)", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "bottom");

    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("backB");
    }
  });

  it("right view shows the right face (frontC for default orientation)", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "right");

    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("frontC");
    }
  });

  it("left view shows the opposite of right (backC)", () => {
    const arrangement = defaultArrangement();
    const view = projectFlatView(arrangement, "left");

    for (const key of FLAT_VIEW_KEYS) {
      expect(view[key]).toBe("backC");
    }
  });

  it("all 9 positions in the FlatView are populated for every direction", () => {
    const arrangement = defaultArrangement();
    const allViews = computeAllFlatViews(arrangement);

    for (const view of allViews) {
      for (const key of FLAT_VIEW_KEYS) {
        expect(view[key]).toBeDefined();
      }
    }
  });

  it("front view preserves cube grid position", () => {
    // Give each cube a unique front face to track positions
    const arrangement = [
      placement("top", "left", "near", "frontA", "frontB"),
      placement("top", "center", "center", "backA", "frontB"),
      placement("top", "right", "far", "frontB", "frontC"),
      placement("center", "left", "far", "backB", "frontA"),
      placement("center", "center", "near", "frontC", "frontA"),
      placement("center", "right", "center", "backC", "frontA"),
      placement("bottom", "left", "center", "frontA", "frontC"),
      placement("bottom", "center", "far", "backA", "frontC"),
      placement("bottom", "right", "near", "frontB", "frontA"),
    ] as CubeArrangement;

    const view = projectFlatView(arrangement, "front");

    expect(view.topLeft).toBe("frontA");
    expect(view.topCenter).toBe("backA");
    expect(view.topRight).toBe("frontB");
    expect(view.centerLeft).toBe("backB");
    expect(view.center).toBe("frontC");
    expect(view.centerRight).toBe("backC");
    expect(view.bottomLeft).toBe("frontA");
    expect(view.bottomCenter).toBe("backA");
    expect(view.bottomRight).toBe("frontB");
  });

  it("back view flips columns but keeps rows", () => {
    // Viewing from behind = 180° rotation around vertical axis: left↔right, top stays top
    const arrangement = [
      placement("top", "left", "near", "frontA", "frontB"),
      placement("top", "center", "center", "frontB", "frontC"),
      placement("top", "right", "far", "frontC", "frontA"),
      placement("center", "left", "far", "backA", "frontB"),
      placement("center", "center", "near", "backB", "frontC"),
      placement("center", "right", "center", "backC", "frontA"),
      placement("bottom", "left", "center", "frontA", "frontC"),
      placement("bottom", "center", "far", "frontB", "frontA"),
      placement("bottom", "right", "near", "frontC", "frontB"),
    ] as CubeArrangement;

    const backView = projectFlatView(arrangement, "back");

    // Back view: columns flip, rows stay.
    // top/left from front → top/right from back (showing backA)
    expect(backView.topRight).toBe("backA"); // was topLeft frontA
    expect(backView.topCenter).toBe("backB"); // was topCenter frontB
    expect(backView.topLeft).toBe("backC"); // was topRight frontC
    expect(backView.bottomRight).toBe("backA"); // was bottomLeft frontA
  });
});

describe("computeAllFlatViews", () => {
  it("returns exactly 6 views", () => {
    const arrangement = defaultArrangement();
    const views = computeAllFlatViews(arrangement);

    expect(views).toHaveLength(6);
  });

  it("each view has all 9 positions filled", () => {
    const arrangement = defaultArrangement();
    const views = computeAllFlatViews(arrangement);

    for (const view of views) {
      for (const key of FLAT_VIEW_KEYS) {
        expect(view[key]).toBeDefined();
      }
    }
  });
});

describe("rotateFlatViewClockwise", () => {
  it("moves topLeft to topRight", () => {
    const view: FlatView = {
      topLeft: "frontA",
      topCenter: "frontB",
      topRight: "frontC",
      centerLeft: "backA",
      center: "backB",
      centerRight: "backC",
      bottomLeft: "frontA",
      bottomCenter: "frontB",
      bottomRight: "frontC",
    };
    const rotated = rotateFlatViewClockwise(view);
    expect(rotated.topRight).toBe("frontA");
  });

  it("keeps center in place", () => {
    const view: FlatView = {
      topLeft: "frontA",
      topCenter: "frontA",
      topRight: "frontA",
      centerLeft: "frontA",
      center: "backC",
      centerRight: "frontA",
      bottomLeft: "frontA",
      bottomCenter: "frontA",
      bottomRight: "frontA",
    };
    const rotated = rotateFlatViewClockwise(view);
    expect(rotated.center).toBe("backC");
  });

  it("four rotations return the original view", () => {
    const view: FlatView = {
      topLeft: "frontA",
      topCenter: "backA",
      topRight: "frontB",
      centerLeft: "backB",
      center: "frontC",
      centerRight: "backC",
      bottomLeft: "frontA",
      bottomCenter: "backA",
      bottomRight: "frontB",
    };
    let rotated = view;
    for (let i = 0; i < 4; i++) {
      rotated = rotateFlatViewClockwise(rotated);
    }
    expect(areFlatViewsEqual(rotated, view)).toBe(true);
  });

  it("correctly cycles all positions in one rotation", () => {
    // Use unique faces at each position to track movement
    const view: FlatView = {
      topLeft: "frontA",
      topCenter: "frontB",
      topRight: "frontC",
      centerLeft: "backA",
      center: "backB",
      centerRight: "backC",
      bottomLeft: "frontA", // Note: can't have 9 unique faces, only 6 exist
      bottomCenter: "frontB",
      bottomRight: "frontC",
    };
    const rotated = rotateFlatViewClockwise(view);

    // Clockwise rotation: bottomLeft → topLeft, topLeft → topRight, etc.
    expect(rotated.topLeft).toBe(view.bottomLeft);
    expect(rotated.topCenter).toBe(view.centerLeft);
    expect(rotated.topRight).toBe(view.topLeft);
    expect(rotated.centerLeft).toBe(view.bottomCenter);
    expect(rotated.center).toBe(view.center);
    expect(rotated.centerRight).toBe(view.topCenter);
    expect(rotated.bottomLeft).toBe(view.bottomRight);
    expect(rotated.bottomCenter).toBe(view.centerRight);
    expect(rotated.bottomRight).toBe(view.topRight);
  });
});

describe("areFlatViewsEqual", () => {
  it("returns true for identical views", () => {
    const view = uniformView("frontA");
    expect(areFlatViewsEqual(view, { ...view })).toBe(true);
  });

  it("returns false when one position differs", () => {
    const a = uniformView("frontA");
    const b = { ...a, center: "backC" as const };
    expect(areFlatViewsEqual(a, b)).toBe(false);
  });

  it("is symmetric", () => {
    const a = uniformView("frontA");
    const b = uniformView("frontB");
    expect(areFlatViewsEqual(a, b)).toBe(areFlatViewsEqual(b, a));
  });
});

describe("FLAT_VIEW_KEYS", () => {
  it("has exactly 9 entries", () => {
    expect(FLAT_VIEW_KEYS).toHaveLength(9);
  });

  it("contains all FlatView property names", () => {
    const expected = [
      "topLeft",
      "topCenter",
      "topRight",
      "centerLeft",
      "center",
      "centerRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
    ];
    expect([...FLAT_VIEW_KEYS]).toEqual(expected);
  });
});
