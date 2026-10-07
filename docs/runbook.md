# Runbook

## Demo

`npm install && npm run dev`

With no Supabase variables, the UI runs against synthetic Northstar data stored in localStorage.

## Isolated Supabase

Create a dedicated White Label project. Never reuse SØD production credentials.

Apply migrations in order:

1. `20261007000100_core.sql`
2. `20261007000200_rls.sql`
3. `20261007000300_storage.sql`

Then set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` only in server environments that genuinely need it
- `NEXT_PUBLIC_DEMO_MODE=false`

## Vercel

Link only `ivancristinisod-lang/WHITE-LABEL-OS`. Preview first, then promote after CI and tenant-isolation checks pass.

## Release gate

No release with red typecheck, build, static/security checks, missing RLS on tenant tables or cross-tenant leakage.
