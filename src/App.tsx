import { lazy, Suspense, useState } from "react";
import { PuzzleSelection } from "./components/PuzzleSelection";

const CubeGame = lazy(() =>
  import("./components/CubeGame").then((m) => ({ default: m.CubeGame })),
);
const SphereGame = lazy(() =>
  import("./components/SphereGame").then((m) => ({ default: m.SphereGame })),
);
const BoxGame = lazy(() =>
  import("./components/BoxGame").then((m) => ({ default: m.BoxGame })),
);

type Screen = "home" | "cube" | "sphere" | "box";

function Credit() {
  return (
    <p className="credit">
      Concept by{" "}
      <a href="https://www.immersus-machina.com" target="_blank" rel="noopener noreferrer">
        Immersus Machina
      </a>
      <br />
      <a href="https://github.com/immersus-machina/spatial-reasoning" target="_blank" rel="noopener noreferrer">
        GitHub
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
      <Suspense>{content}</Suspense>
      <Credit />
    </>
  );
}
