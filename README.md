# White Label OS

A task-first, configurable multi-tenant operating system. This repository is isolated from SØD OS and contains only synthetic Northstar Demo data.

Canonical product/repository name: **WHITE LABEL OS** / `WHITE-LABEL-OS`.

## What is implemented

- Responsive Next.js App Router interface for dashboard, tickets, subtasks, departments, decisions, inbox, audit history, archive, team and tenant settings.
- Tenant-neutral domain rules for optimistic concurrency, explicit closure, evidence requirements and bounded undo.
- Supabase migrations for organizations, memberships, configurable roles/capabilities, work objects, audit, notifications, branding and integrations.
- Defense-in-depth authorization: active-membership RLS plus server-side capability checks.
- Private tenant-namespaced Storage policies for organization assets and evidence.
- Synthetic demo seed and adversarial SQL tests.
- GitHub CI for lint, typecheck, unit tests, build and migration safety checks.

## Start locally

```bash
pnpm install
pnpm dev
```

The UI runs in demo mode when isolated Supabase variables are absent. Copy `.env.example` to `.env.local` only when connecting a new White Label project. Never paste SØD production credentials.

## Verify

```bash
pnpm check
pnpm build
```

Database tests require an isolated local/preview Supabase database. See `docs/runbook.md`.

## Safety

SØD production, its repository, Drive/Sheets, users, identifiers, secrets and operational data are intentionally out of scope. The reference audit is stored outside this repository in the task workspace.
