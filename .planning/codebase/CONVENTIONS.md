# Codebase Conventions

**Date:** 2026-05-04

## Code Style
- **Language**: TypeScript is strictly used for all logic and components.
- **Component Style**: React Functional Components using Hooks.
- **Data Typing**: Interfaces are explicitly defined (e.g., in `src/lib/data.ts` for `Ingredient`, `Formulation`, `Activity`).
- **Styling**: Vanilla CSS. Standardized classes with CSS variables (e.g., `var(--accent-primary)`) for theming.

## Patterns
- **Data Mocking**: Currently relying on constants exported from `src/lib/data.ts`.
- **Helper Functions**: UI logic (like color-coding based on status/category) is encapsulated in helper functions (e.g., `getCategoryBadgeClass`) located near the data models to ensure consistency across views.
- **Error Handling**: Standard try-catch blocks expected, though currently the app relies heavily on static data which limits runtime errors.

## React & Next.js Specifics
- Avoid using class components; stick to functional components.
- Rely on Next.js `<Link>` for internal routing and Next.js Image component for optimized images.
- Distinguish cleanly between server and client boundaries (using `"use client"` where interactivity or browser APIs are required).
