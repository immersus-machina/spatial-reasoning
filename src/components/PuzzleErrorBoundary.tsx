import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface PuzzleErrorBoundaryProps {
  readonly children: ReactNode;
}

interface PuzzleErrorBoundaryState {
  readonly error: string | null;
}

// Safety net for theoretically possible but practically unreachable errors
// in puzzle generation (e.g. retry loops exhausted with adversarial RNG).
export class PuzzleErrorBoundary extends Component<
  PuzzleErrorBoundaryProps,
  PuzzleErrorBoundaryState
> {
  state: PuzzleErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): PuzzleErrorBoundaryState {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Puzzle error:", error, info.componentStack);
  }

  render() {
    if (this.state.error !== null) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Something went wrong generating the puzzle.</p>
          <button onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
