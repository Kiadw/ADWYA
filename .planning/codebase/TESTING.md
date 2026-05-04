# Codebase Testing

**Date:** 2026-05-04

## Framework & Tooling
- **Current State**: No automated testing framework (Jest, Vitest, Cypress, Playwright) is currently configured in `package.json`.
- **Coverage**: 0% code coverage.

## Test Structure
- No `__tests__` directories or `.test.ts`/`.spec.ts` files currently exist in the repository.

## Mocking
- The application currently operates on heavily mocked data directly in `src/lib/data.ts`. This acts as an implicit stub for the backend while the UI is being iterated upon.

## Future Recommendations
- Implement unit tests for core domain logic (`src/lib/classifier.ts`).
- Set up a testing runner like Vitest.
- Use React Testing Library for component testing.
- Set up E2E tests for critical user journeys (e.g., importing compounds, viewing 3D renderings).
