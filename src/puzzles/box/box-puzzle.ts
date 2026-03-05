import type {
  BoxDifficulty,
  BoxPuzzle,
  MutableCell,
  ProjectedView,
  ViewingDirection,
} from "./box-types";
import {
  ALL_DIRECTIONS,
  ALL_FLAT_SHAPES,
  EASY_FLAT_SHAPES,
} from "./box-shapes";
import {
  generateBoxArrangement,
  reorientForMutability,
} from "./box-arrangement";
import { computeAllProjectedViews } from "./box-views";
import { findMutableCells } from "./box-mutability";
import { pickDistinct } from "../../utils/random";

// ── Constants ─────────────────────────────────────────────────────────

const MIN_MUTABLE_CELLS = 3;

// ── Wrong view construction ──────────────────────────────────────────

/**
 * Generate a wrong view by picking `errorCount` mutable cells and replacing
 * each cell's shape with a geometrically impossible alternative.
 */
function generateWrongView(
  correctView: ProjectedView,
  errorCount: number,
  mutableCells: readonly MutableCell[],
  random: () => number,
): ProjectedView {
  const cellsToMutate = pickDistinct(mutableCells, errorCount, random);

  const cells = correctView.cells.map((cell) => {
    const mutation = cellsToMutate.find(
      (m) => m.row === cell.row && m.column === cell.column,
    );
    if (!mutation) return cell;

    const mutatedShape =
      mutation.mutations[Math.floor(random() * mutation.mutations.length)];
    return { ...cell, shape: mutatedShape };
  });

  return {
    direction: correctView.direction,
    gridSize: correctView.gridSize,
    cells,
  };
}

// ── Public API ────────────────────────────────────────────────────────

export function generateBoxPuzzle(
  difficulty: BoxDifficulty,
  random: () => number = Math.random,
): BoxPuzzle {
  let arrangement = generateBoxArrangement(difficulty, random);

  // Pick which view to hide (the "guess-face")
  const directions = [...ALL_DIRECTIONS];
  const shuffled = pickDistinct(directions, 3, random);
  const missingDirection = shuffled[0];
  const knownDirections = [shuffled[1], shuffled[2]] as [
    ViewingDirection,
    ViewingDirection,
  ];

  const allowedFlatShapes =
    difficulty === "easy" ? EASY_FLAT_SHAPES : ALL_FLAT_SHAPES;

  let mutableCells = findMutableCells(
    arrangement,
    missingDirection,
    allowedFlatShapes,
  );

  // If not enough cells are mutable, re-orient some cylinders/prisms so their
  // "square" face points toward the missing direction, making them mutable.
  if (mutableCells.length < MIN_MUTABLE_CELLS) {
    const deficit = MIN_MUTABLE_CELLS - mutableCells.length;
    arrangement = reorientForMutability(
      arrangement,
      missingDirection,
      deficit,
      random,
    );
    mutableCells = findMutableCells(
      arrangement,
      missingDirection,
      allowedFlatShapes,
    );
  }

  if (mutableCells.length < MIN_MUTABLE_CELLS) {
    throw new Error(
      `Only ${mutableCells.length} mutable cells found, need at least ${MIN_MUTABLE_CELLS}`,
    );
  }

  const allViews = computeAllProjectedViews(arrangement);
  const correctView = allViews[missingDirection];
  const knownViews: [ProjectedView, ProjectedView] = [
    allViews[knownDirections[0]],
    allViews[knownDirections[1]],
  ];

  return {
    arrangement,
    knownViews,
    missingDirection,
    correctView,
    wrongViews: [
      generateWrongView(correctView, 1, mutableCells, random),
      generateWrongView(correctView, 2, mutableCells, random),
      generateWrongView(correctView, 3, mutableCells, random),
    ],
  };
}
