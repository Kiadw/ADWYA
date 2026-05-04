# Codebase Tech Stack

**Date:** 2026-05-04

## Overview
ADWYA PharmaTech Hub is a modern web application built on the React ecosystem.

## Languages & Runtime
- **Language**: TypeScript (with strict types via `tsconfig.json`)
- **Runtime**: Node.js (v20+ based on types)
- **UI Framework**: React 19

## Frameworks
- **Application Framework**: Next.js 16.2.4 (using App Router)

## Core Dependencies
- **Data Visualization**: `chart.js` (v4.5.1), `react-chartjs-2` (v5.3.1)
- **Molecular Rendering**: `3dmol` (v2.5.4) - Used for 3D molecular visualization
- **Icons**: `lucide-react` (v1.11.0)
- **Backend/Database Client**: `@supabase/supabase-js` (v2.104.1)

## Configuration
- **Next.js**: `next.config.ts`
- **TypeScript**: `tsconfig.json`
- **Linting**: `eslint.config.mjs`

## State Management & Styling
- **Styling**: Standard CSS (`globals.css`) and CSS Modules (`page.module.css`).
- **State**: React state (no Redux/Zustand detected, mostly local state or Next.js server/client state).
