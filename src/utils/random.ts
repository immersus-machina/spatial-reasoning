/** Pick a single random item from an array. */
export function pickRandom<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

/** Pick n distinct items from an array (without replacement). */
export function pickDistinct<T>(
  items: readonly T[],
  n: number,
  random: () => number,
): T[] {
  const result: T[] = [];
  const remaining = [...items];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(random() * remaining.length);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return result;
}

/** Pick n distinct indices from the range [0, max). Uses rejection sampling,
 * so degrades when count approaches max. (No problem for current use cases.) */
export function pickDistinctIndices(
  count: number,
  max: number,
  random: () => number,
): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const idx = Math.floor(random() * max);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  return indices;
}

/** Pick a random integer in [min, max] (inclusive). */
export function pickIntInRange(
  min: number,
  max: number,
  random: () => number,
): number {
  return min + Math.floor(random() * (max - min + 1));
}

/** Fisher-Yates shuffle (returns a new array). */
export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
