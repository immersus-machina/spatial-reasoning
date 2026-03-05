import { useState } from "react";
import { BoxGame } from "./components/BoxGame";
import { CubeGame } from "./components/CubeGame";
import { SphereGame } from "./components/SphereGame";
import { PuzzleSelection } from "./components/PuzzleSelection";

type Screen = "home" | "cube" | "sphere" | "box";

function Credit() {
  return (
    <p className="credit">
      Concept by{" "}
      <a href="https://www.immersus-machina.com" target="_blank" rel="noopener noreferrer">
        Immersus Machina
      </a>
    </p>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>("home");

  let content;
  switch (screen) {
    case "cube":
      content = <CubeGame onExit={() => setScreen("home")} />;
      break;
    case "sphere":
      content = <SphereGame onExit={() => setScreen("home")} />;
      break;
    case "box":
      content = <BoxGame onExit={() => setScreen("home")} />;
      break;
    default:
      content = <PuzzleSelection onSelect={setScreen} />;
  }

  return (
    <>
      {content}
      <Credit />
    </>
  );
}
