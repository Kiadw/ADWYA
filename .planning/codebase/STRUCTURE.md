# Codebase Structure

**Date:** 2026-05-04

## Directory Layout
```text
/
├── .planning/       # Project planning, specs, and architectural maps
├── public/          # Static assets (images, logos)
│   └── logo-adwya.png
├── src/             # Main application source code
│   ├── app/         # Next.js App Router (pages and layouts)
│   │   ├── classification/
│   │   ├── formulations/
│   │   ├── ingredients/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Dashboard entry point
│   │   └── page.module.css # Dashboard specific styles
│   ├── components/  # Reusable React components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── lib/         # Core logic and data layer
│       ├── classifier.ts   # Domain logic for classification
│       ├── data.ts         # Mock data and typescript interfaces
│       └── supabase.ts     # Supabase client instantiation
├── package.json     # Node.js dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## Key Locations
- **Entry Point**: `src/app/layout.tsx` and `src/app/page.tsx` form the main shell of the app.
- **Data Source**: `src/lib/data.ts` is the current source of truth for pharmaceutical entities.

## Naming Conventions
- React components use `PascalCase` (e.g., `Header.tsx`).
- Utility and logic files use `camelCase` or `kebab-case` (e.g., `data.ts`, `supabase.ts`).
- Route directories use lowercase (e.g., `formulations/`).
