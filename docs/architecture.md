# White Label OS · Architecture

## Product boundary

SØD OS is a read-only reference. White Label OS is a separate product, repository, datasource and deployment.

## Classification

**CORE**: tickets, subtasks, blockers, decisions, evidence, filters, archive, inbox, audit, permissions, undo.

**CONFIG**: brand, product name, departments, roles, capabilities, terminology, locale, timezone, enabled modules, closure policy, undo duration.

**SØD-SPECIFIC**: people, SØD terminology, SØD departments, Drive IDs, URLs, roadmaps, operational data and credentials. None belong here.

## Runtime model

`OS Core + Tenant Config + Tenant Data = Client OS`

Postgres is canonical. External systems such as Google Sheets belong behind adapters and may synchronize, but they never silently become a second conflicting source of truth.

## Multi-tenant security

All tenant-owned rows carry `organization_id`. RLS verifies active membership. Capabilities are evaluated server-side and storage objects are namespaced by organization.

## Concurrency

Tickets and subtasks carry `version`. Mutations use optimistic compare-and-swap and return conflict instead of overwriting stale data.

## History

`audit_events` is append-only. Changes record actor, entity, action, before/after, correlation id, metadata and schema version.
