# Spatial Reasoning

An interactive web-based spatial reasoning test suite built with React and Three.js. The application presents 3D puzzles that measure cognitive abilities such as mental rotation, pattern recognition, and spatial awareness.

## About

Spatial reasoning — the ability to mentally visualize and manipulate objects in three dimensions — is a core cognitive skill used in fields like engineering, architecture, surgery, and software development. This project provides a set of interactive 3D puzzles designed to assess and exercise these abilities.

The puzzle designs draw on prior work in cognitive spatial assessment, now delivered as an accessible, zero-install web experience. The UI is intentionally minimal — the focus is on the game mechanics and the spatial reasoning they require, not on visual polish.

## Puzzles

### Cube Rotation

Nine cubes are placed at distinct positions within a 3x3x3 grid, each with distinct faces. The player rotates the 3D arrangement to inspect it — each face of the overall cube shows a flat 3x3 pattern made up of the visible faces from that direction. Given four candidate views, the player must identify which one is valid. Tests **mental rotation** and understanding of 3D constraints (opposite face relationships).

### Sphere Arrangement

Colored spheres are arranged in a 3D structure — eight at the corners and six at the face centers. Three colors are distributed among them. Each corner sphere has a neighborhood: itself as center surrounded by its six adjacent spheres in a ring. The player rotates the structure to examine it, and is shown four neighborhoods — three real, one fabricated. The player must find and remove the wrong one. Tests **3D spatial reasoning** and the ability to mentally decompose a 3D structure into local patterns.

### Box Projection

Colored 3D shapes (cubes, spheres, cones, cylinders, prisms, pyramids) are placed inside a box. The player sees two of the three orthographic projections (top, front, side) rendered on the faces of an isometric box diagram, while the third face shows "?". Given four candidate projections, the player must identify the correct one. A specimen viewer lets the player rotate each 3D shape to understand what projections it produces. Available in easy (3×3) and hard (4×4) grid sizes. Tests **perspective taking** and the ability to reason about how 3D objects project onto 2D planes from different directions.

## Tech Stack

- **TypeScript** with strict mode
- **React 18+** — UI framework
- **Vite** — Build tool and dev server
- **Three.js** via **React Three Fiber** — 3D rendering with custom quaternion-based surface drag rotation
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

```text
src/
  components/       # React components (shared + puzzle-specific)
  game/             # Game session and scoring
  puzzles/          # Puzzle logic (pure functions, tested)
    box/            # Box projection puzzle
    cube/           # Cube rotation puzzle
    sphere/         # Sphere arrangement puzzle
  utils/            # 3D layout, color mapping, helpers
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

If you use the spatial reasoning concepts or puzzle designs from this project, please credit [Immersus Machina](https://www.immersus-machina.com).

---

Built by [Immersus Machina](https://www.immersus-machina.com) — software consulting and spatial intelligence solutions.
