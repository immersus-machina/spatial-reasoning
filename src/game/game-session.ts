export interface PuzzleResult {
  readonly correct: boolean;
  readonly timeMs: number;
}

export interface GameSession {
  readonly durationMs: number;
  readonly results: readonly PuzzleResult[];
}

export interface SessionStats {
  readonly total: number;
  readonly correct: number;
  readonly wrong: number;
  readonly accuracy: number;
}

export function createGameSession(durationMs: number): GameSession {
  return { durationMs, results: [] };
}

/** Immutable update — returns a new session so React state updates correctly. */
export function addResult(
  session: GameSession,
  correct: boolean,
  timeMs: number,
): GameSession {
  return {
    ...session,
    results: [...session.results, { correct, timeMs }],
  };
}

export function getSessionStats(session: GameSession): SessionStats {
  const total = session.results.length;
  const correct = session.results.filter((r) => r.correct).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? correct / total : 0;

  return { total, correct, wrong, accuracy };
}
