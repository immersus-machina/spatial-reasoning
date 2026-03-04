import { useState } from "react";
import { CubeGame } from "./components/CubeGame";
import { SphereGame } from "./components/SphereGame";
import { PuzzleSelection } from "./components/PuzzleSelection";

type Screen = "home" | "cube" | "sphere";

export function App() {
  const [screen, setScreen] = useState<Screen>("home");

  switch (screen) {
    case "cube":
      return <CubeGame onExit={() => setScreen("home")} />;
    case "sphere":
      return <SphereGame onExit={() => setScreen("home")} />;
    default:
      return <PuzzleSelection onSelect={setScreen} />;
  }
}
