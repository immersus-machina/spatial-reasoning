# Spatial Reasoning

Status: in development.

An interactive web-based spatial reasoning test suite built with React and Three.js. The application presents 3D puzzles that measure cognitive abilities such as mental rotation, pattern recognition, and spatial awareness.

## About

Spatial reasoning — the ability to mentally visualize and manipulate objects in three dimensions — is a core cognitive skill used in fields like engineering, architecture, surgery, and software development. This project provides a set of interactive 3D puzzles designed to assess and exercise these abilities.

The puzzle designs draw on prior work in cognitive spatial assessment, now delivered as an accessible, zero-install web experience.

## Puzzles

### Cube Rotation

Nine cubes are placed in a 3x3x3 grid. The player can rotate the 3D arrangement to inspect it — each face of the overall cube shows a flat 3x3 image made up of the visible faces from that direction. Given four candidate views, the player must identify which one is valid. Tests **mental rotation** and understanding of 3D constraints (opposite face relationships).

### Sphere Arrangement

Colored spheres are arranged in a 3D structure — eight at the corners and six at the face centers. Three colors are distributed among them. When viewed from any direction, the arrangement can be simplified to a center circle surrounded by six circles. The player can rotate the structure to examine it, and must identify which of the presented color arrangements is invalid. Tests **3D spatial reasoning** and the ability to relate a 3D structure to its 2D projections.

## Tech Stack

- **TypeScript** with strict mode
- **React 18+** — UI framework
- **Vite** — Build tool and dev server
- **Three.js** via **React Three Fiber** — 3D rendering
- **Vitest** — Unit testing
- **CSS Modules** — Component-scoped styling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## Project Structure

```
src/
  components/       # Shared React components
  puzzles/          # Puzzle logic and 3D scenes
    cube/           # Cube rotation puzzle
    sphere/         # Sphere arrangement puzzle
  utils/            # Math and 3D helper functions
  types/            # TypeScript type definitions
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

If you use the spatial reasoning concepts or puzzle designs from this project, please credit [Immersus Machina](https://www.immersus-machina.com).

---

Built by [Immersus Machina](https://www.immersus-machina.com) — software consulting and spatial intelligence solutions.
