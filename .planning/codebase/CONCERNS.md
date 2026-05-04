# Codebase Concerns

**Date:** 2026-05-04

## Technical Debt
- **Mock Data Reliance**: The application is currently heavily dependent on static, hardcoded data found in `src/lib/data.ts`. This means operations like adding, editing, or deleting items won't persist across page reloads or sessions.
- **Supabase Integration**: The Supabase client is initialized in `src/lib/supabase.ts`, but its actual usage within the data flow and UI components is limited or non-existent in the current state.
- **Lack of Tests**: Zero test coverage makes future refactoring and integration of the real backend risky.

## Security
- **Hardcoded Fallback Keys**: `src/lib/supabase.ts` contains a fallback hardcoded value for the Supabase anonymous key (`SUPABASE_ANON_KEY`). While it is an anon key, it is best practice to rely solely on environment variables (`.env`) to prevent potential misuse or quota exhaustion.

## Bugs & Fragile Areas
- **State Management**: Using static lists and potentially React local state for complex pharmaceutical operations is a fragile approach as the application scales. A proper state management solution or robust server-state management (like React Query or SWR) will be needed once the backend is connected.
- **Data Synchronization**: Moving from `src/lib/data.ts` to fetching data from Supabase will require a significant rewrite of how components ingest data.

## Performance
- Loading 3D molecular data via `3dmol` could be performance-intensive on the client side depending on the size of the compound. Lazy loading or dynamic imports for heavy visualization components should be considered.
