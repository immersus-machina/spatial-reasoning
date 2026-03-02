# Spatial Reasoning — Project Guidelines

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 18+
- **Build tool**: Vite
- **3D rendering**: Three.js via React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Testing**: Vitest + `@testing-library/react`
- **Styling**: CSS Modules (`.module.css` files)

## Project Structure

```
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

## Coding Conventions

- Use functional components with hooks (no class components)
- Use named exports (not default exports)
- Prefer `const` over `let`; never use `var`
- Use TypeScript strict mode — no `any` unless absolutely necessary
- Keep puzzle logic (pure functions) separate from rendering (React components) so logic is independently testable
- Use descriptive variable names; avoid single-letter names except in math formulas where convention is clear (e.g., `x`, `y`, `z`, `dx`, `dy`)

## Testing

- Every puzzle module must have corresponding tests
- Puzzle logic (generation, validation, constraint checking) should be tested as pure functions
- Use Vitest for all tests; files named `*.test.ts` or `*.test.tsx`
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
