export interface ShuffledResult<T> {
  readonly items: T[];
  readonly correctIndex: number;
}

export function shuffleWithCorrect<T>(
  correct: T,
  wrong: readonly T[],
  random: () => number = Math.random,
): ShuffledResult<T> {
  const items = [correct, ...wrong];
  let correctIndex = 0;
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
    if (correctIndex === i) correctIndex = j;
    else if (correctIndex === j) correctIndex = i;
  }
  return { items, correctIndex };
}
