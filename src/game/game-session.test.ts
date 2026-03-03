import { describe, it, expect } from "vitest";
import { createGameSession, addResult, getSessionStats } from "./game-session";

describe("createGameSession", () => {
  it("creates an empty session with given duration", () => {
    const session = createGameSession(120_000);
    expect(session.durationMs).toBe(120_000);
    expect(session.results).toEqual([]);
  });
});

describe("addResult", () => {
  it("appends a result to the session", () => {
    const session = createGameSession(120_000);
    const updated = addResult(session, true, 3200);
    expect(updated.results).toHaveLength(1);
    expect(updated.results[0]).toEqual({ correct: true, timeMs: 3200 });
  });

  it("does not mutate the original session", () => {
    const session = createGameSession(120_000);
    addResult(session, true, 1000);
    expect(session.results).toHaveLength(0);
  });

  it("accumulates multiple results", () => {
    let session = createGameSession(120_000);
    session = addResult(session, true, 1000);
    session = addResult(session, false, 2000);
    session = addResult(session, true, 1500);
    expect(session.results).toHaveLength(3);
  });
});

describe("getSessionStats", () => {
  it("returns zeros for an empty session", () => {
    const session = createGameSession(120_000);
    const stats = getSessionStats(session);
    expect(stats).toEqual({ total: 0, correct: 0, wrong: 0, accuracy: 0 });
  });

  it("computes correct stats", () => {
    let session = createGameSession(120_000);
    session = addResult(session, true, 1000);
    session = addResult(session, false, 2000);
    session = addResult(session, true, 1500);
    session = addResult(session, true, 800);

    const stats = getSessionStats(session);
    expect(stats.total).toBe(4);
    expect(stats.correct).toBe(3);
    expect(stats.wrong).toBe(1);
    expect(stats.accuracy).toBe(0.75);
  });

  it("returns 100% accuracy when all correct", () => {
    let session = createGameSession(60_000);
    session = addResult(session, true, 500);
    session = addResult(session, true, 600);

    const stats = getSessionStats(session);
    expect(stats.accuracy).toBe(1);
  });
});
