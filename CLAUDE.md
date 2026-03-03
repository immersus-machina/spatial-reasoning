# Spatial Reasoning — Project Guidelines

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 18+
- **Build tool**: Vite
- **3D rendering**: Three.js via React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Testing**: Vitest + `@testing-library/react`
- **Styling**: CSS Modules (`.module.css` files)

## Project Structure

```text
src/
  components/       # React components
  puzzles/          # Puzzle logic and 3D scenes
    cube/           # Cube rotation puzzle
    sphere/         # Sphere puzzle
    dollhouse/      # Doll house puzzle (planned)
  utils/            # Shared utilities (math, 3D helpers)
  types/            # TypeScript type definitions
  tests/            # Test utilities and setup
public/             # Static assets (textures, models)
```

## Formatting

- **Prettier** with default settings — format on save
- Double quotes, semicolons, 2-space indent, trailing commas
- Arrow function parameters always parenthesized: `(f) =>` not `f =>`

## Coding Conventions

- Use functional components with hooks (no class components)
- Use named exports (not default exports)
- Prefer `const` over `let`; never use `var`
- Use TypeScript strict mode — no `any` unless absolutely necessary
- Keep puzzle logic (pure functions) separate from rendering (React components) so logic is independently testable
- Use descriptive variable names; avoid single-letter names except in math formulas where convention is clear (e.g., `x`, `y`, `z`, `dx`, `dy`)
- No nested ternary operators — use `switch` statements for multi-way branching. A single ternary is fine; nesting them is not.
- Self-documenting code over comments — verbose naming makes most comments redundant. Only add comments that explain *why* (business logic, non-obvious constraints), not *what* the code does. If a comment restates the code beneath it, delete it.

## Naming Style

- **Verbose domain language** — types and functions should tell a story, not encode numbers. Use named string literals (e.g., `'frontA'`, `'near'`, `'topLeft'`) instead of raw numbers or index positions.
- **Function names are verbs** — `getOppositeFace`, `isValidOrientation`, not `oppositeFace` or `validOrientation`.
- **Types describe what they are** — `CubeFace`, `ViewingDirection`, `GridDepth`, `FlatView`, not `FaceValue`, `Direction`, `Depth`, `Grid`.
- **Opposite pairs use front/back prefix** — cube face pairs are `frontA/backA`, `frontB/backB`, `frontC/backC`.
- **Grid positions use named keys** — `topLeft`, `topCenter`, `centerRight`, `bottomLeft`, etc. rather than array indices.
- **Internal math uses standard axes** — internal coordinate math uses `X`, `Y`, `Z` axis names (not the face-pair letters A, B, C) so cross-product logic reads naturally.
- **Internal numbering stays internal** — the 1–6 face numbering is an implementation detail in `cube-faces.ts`. All other code uses `CubeFace` names.
- **File names use puzzle prefix** — files within a puzzle module are prefixed with the puzzle name (e.g., `cube-types.ts`, `cube-faces.ts`, `cube-views.ts`) so they are self-identifying across the project.
- **Inject randomness as a parameter** — functions that need randomness accept `random: () => number = Math.random` as a default parameter.

## Testing

- Every puzzle module must have corresponding tests
- Puzzle logic (generation, validation, constraint checking) should be tested as pure functions
- Use Vitest for all tests; files named `*.test.ts` or `*.test.tsx`
- **Mock dependencies with `vi.mock`** — unit tests should only test the code in the file under test. Mock imported functions so tests are isolated from their dependencies. This is a logic-heavy application; each module's tests should verify its own behavior, not the behavior of its imports.
- Run tests: `npm test`
- Run tests in watch mode: `npm run test:watch`

## 3D Conventions

- Use React Three Fiber's declarative JSX for scene composition
- Extract reusable 3D primitives into components under `src/components/`
- Keep Three.js math operations (quaternions, vectors) in utility functions under `src/utils/`
- Camera and lighting setup should be configurable per puzzle scene

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm test` — Run tests
- `npm run test:watch` — Run tests in watch mode
- `npm run lint` — Lint code
- `npm run preview` — Preview production build
