import { describe, it, expect } from "vitest";
import { projectView, computeAllProjectedViews } from "./box-views";
import { getGridPosition } from "./box-coordinates";
import { generateBoxArrangement } from "./box-arrangement";
import type { BoxArrangement, BoxObject, FaceMapping } from "./box-types";
import { seededRandom } from "../../tests/seeded-random";

function makeTestArrangement(): BoxArrangement {
  const faceMapping: FaceMapping = {
    top: "circle",
    front: "square",
    side: "triangleUp",
  };
  const objects: BoxObject[] = [
    { shape: "sphere", color: "red", x: 0, y: 0, z: 0, faceMapping },
    { shape: "cube", color: "blue", x: 1, y: 1, z: 1, faceMapping: { top: "square", front: "square", side: "square" } },
  ];
  return { gridSize: 3, objects };
}

describe("getGridPosition", () => {
  const boxObject: BoxObject = {
    shape: "cube", color: "red", x: 1, y: 2, z: 0,
    faceMapping: { top: "square", front: "square", side: "square" },
  };

  it("top view uses row=x, column=z", () => {
    expect(getGridPosition(boxObject, "top")).toEqual({ row: 1, column: 0 });
  });

  it("front view uses row=y, column=x", () => {
    expect(getGridPosition(boxObject, "front")).toEqual({ row: 2, column: 1 });
  });

  it("side view uses row=y, column=z", () => {
    expect(getGridPosition(boxObject, "side")).toEqual({ row: 2, column: 0 });
  });

  it("works with larger coordinates", () => {
    const larger: BoxObject = {
      shape: "cube", color: "red", x: 2, y: 3, z: 1,
      faceMapping: { top: "square", front: "square", side: "square" },
    };
    expect(getGridPosition(larger, "top")).toEqual({ row: 2, column: 1 });
  });
});

describe("projectView", () => {
  it("projects top view using (x, z) coordinates", () => {
    const arrangement = makeTestArrangement();
    const view = projectView(arrangement, "top");

    // Object at (0,0,0): top → row=x=0, column=z=0
    const cell0 = view.cells.find((c) => c.row === 0 && c.column === 0);
    expect(cell0).toEqual({ row: 0, column: 0, shape: "circle", color: "red" });
    // Object at (1,1,1): top → row=x=1, column=z=1
    const cell1 = view.cells.find((c) => c.row === 1 && c.column === 1);
    expect(cell1).toEqual({ row: 1, column: 1, shape: "square", color: "blue" });
    expect(view.cells).toHaveLength(2);
  });

  it("projects front view using (y, x) coordinates", () => {
    const arrangement = makeTestArrangement();
    const view = projectView(arrangement, "front");

    // Object at (0,0,0): front → row=y=0, column=x=0
    const cell0 = view.cells.find((c) => c.row === 0 && c.column === 0);
    expect(cell0).toMatchObject({ shape: "square", color: "red" });
    // Object at (1,1,1): front → row=y=1, column=x=1
    const cell1 = view.cells.find((c) => c.row === 1 && c.column === 1);
    expect(cell1).toMatchObject({ shape: "square", color: "blue" });
  });

  it("projects side view using (y, z) coordinates", () => {
    const arrangement = makeTestArrangement();
    const view = projectView(arrangement, "side");

    // Object at (0,0,0): side → row=y=0, column=z=0
    const cell0 = view.cells.find((c) => c.row === 0 && c.column === 0);
    expect(cell0).toMatchObject({ shape: "triangleUp", color: "red" });
    // Object at (1,1,1): side → row=y=1, column=z=1
    const cell1 = view.cells.find((c) => c.row === 1 && c.column === 1);
    expect(cell1).toMatchObject({ shape: "square", color: "blue" });
  });

  it("produces correct number of cells", () => {
    const random = seededRandom(42);
    const arrangement = generateBoxArrangement("hard", random);
    const view = projectView(arrangement, "top");
    expect(view.cells).toHaveLength(arrangement.objects.length);
  });

  it("preserves direction and gridSize", () => {
    const arrangement = makeTestArrangement();
    const view = projectView(arrangement, "front");
    expect(view.direction).toBe("front");
    expect(view.gridSize).toBe(3);
  });
});

describe("computeAllProjectedViews", () => {
  it("returns views for all 3 directions", () => {
    const arrangement = makeTestArrangement();
    const views = computeAllProjectedViews(arrangement);
    expect(views.top.direction).toBe("top");
    expect(views.front.direction).toBe("front");
    expect(views.side.direction).toBe("side");
  });

  it("each view has the correct number of cells", () => {
    const random = seededRandom(99);
    const arrangement = generateBoxArrangement("easy", random);
    const views = computeAllProjectedViews(arrangement);
    for (const dir of ["top", "front", "side"] as const) {
      expect(views[dir].cells).toHaveLength(arrangement.objects.length);
    }
  });
});
