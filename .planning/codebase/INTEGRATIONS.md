# Codebase Integrations

**Date:** 2026-05-04

## Backend as a Service (BaaS)
### Supabase
- **Role**: Provides the PostgreSQL database engine, authentication, and secure Row Level Security (RLS) policies.
- **Client**: Implemented via `@supabase/supabase-js`.
- **Initialization**: Configured in `src/lib/supabase.ts` using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## External APIs (Planned/Documented)
- **ChEMBL / PubChem**: The `README.md` outlines plans to integrate with deep chemical data sources for importing and analyzing structured molecular data (SMILES, ADMET properties).
- **Compliance Logs**: Architecture notes mention Audit Trail type 21 CFR Part 11 for FDA/GMP compliance, likely relying on Supabase database triggers or a specialized external service.

## Infrastructure
- **Deployment Target**: Cloud-native (Next.js), typically deployed on platforms like Vercel or custom infrastructure capable of running Node.js.
