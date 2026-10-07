# WHITE LABEL OS

A task-first, configurable, multi-tenant operating system extracted from the reusable product patterns learned in SØD OS, without modifying or depending on SØD production.

## Current build

- Responsive dashboard with interactive **Abiertas / Hoy / Bloqueos / Decisiones** filters.
- Tickets with dynamic responsible dropdown sourced from active profiles.
- Subtasks, explicit ticket closure, evidence requirement, rescheduling and 10-second undo.
- Departments, internal Inbox, history, archive, team and tenant settings.
- Synthetic Northstar Demo mode for safe preview without external credentials.
- Supabase/Postgres schema for organizations, memberships, roles/capabilities, tickets, subtasks, decisions, evidence, inbox, notifications, configuration, integrations and append-only audit.
- Tenant RLS and private storage policies.
- CI quality gate and static security checks.

## Local

```bash
npm install
npm run dev
```

Then open `/dashboard`.

## Database

Apply the migrations in `supabase/migrations` to a **new isolated White Label Supabase project**. Never point this repository at SØD production.

## Product boundary

SØD OS is reference-only. This repository contains no SØD operational data, users, organization IDs, Drive IDs, production URLs or secrets.

See `docs/architecture.md` and `docs/runbook.md`.
