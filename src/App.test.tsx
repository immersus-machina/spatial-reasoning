import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
}));

import { App } from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});
