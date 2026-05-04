# Codebase Architecture

**Date:** 2026-05-04

## System Design
ADWYA PharmaTech Hub uses a modern Next.js 16 App Router architecture. It embraces Server and Client components to separate data fetching from interactive UI.

## Layers
1. **Routing & Pages (`src/app/`)**: Defines the navigational structure and page-level entry points.
2. **UI Components (`src/components/`)**: Reusable interactive and layout components (e.g., `Header.tsx`, `Sidebar.tsx`).
3. **Libraries & Utilities (`src/lib/`)**: Data models, client initializations, and domain logic.

## Data Flow
- **State & Data**: Currently relies on a local mocked data store (`src/lib/data.ts`) containing hardcoded constants for `INGREDIENTS`, `FORMULATIONS`, and `ACTIVITIES`.
- **Classification Engine**: Logic handled in `src/lib/classifier.ts`.
- **Backend Communication**: Supabase client is initialized in `src/lib/supabase.ts`, meant to eventually replace the local mocked data for real-time interactions, authentication, and structured DB queries.

## Abstractions
- **UI Design System**: The app uses a custom CSS-based design system, tailored to be "sober, white, and professional" for pharmaceutical data reading.
- **Molecular Data**: 3D rendering of molecules operates on the client-side via `3dmol`.
