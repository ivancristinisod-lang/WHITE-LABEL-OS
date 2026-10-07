create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'), name text not null,
  status text not null default 'active' check (status in ('active','suspended')), timezone text not null default 'UTC', locale text not null default 'en',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.organization_branding (
  organization_id uuid primary key references public.organizations(id) on delete cascade, product_name text not null default 'OS', logo_path text, favicon_path text,
  accent_color text, appearance text not null default 'system' check (appearance in ('system','light','dark')), custom_domain text, updated_at timestamptz not null default now()
);
create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade, ticket_label text not null default 'Ticket', department_label text not null default 'Department',
  decision_label text not null default 'Decision', require_closure_evidence boolean not null default true, undo_seconds integer not null default 10 check (undo_seconds between 0 and 60),
  config jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade, display_name text, avatar_path text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, key text not null, name text not null, description text,
  is_system boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, key), unique (organization_id, id)
);
create table if not exists public.capabilities (key text primary key, description text not null);
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null, status text not null default 'active' check (status in ('invited','active','suspended')), joined_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, user_id)
);
create table if not exists public.role_capabilities (
  role_id uuid not null references public.roles(id) on delete cascade, capability_key text not null references public.capabilities(key) on delete cascade,
  allowed boolean not null default true, primary key (role_id, capability_key)
);
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, key text not null, name text not null, description text,
  sort_order integer not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, key), unique (organization_id, id)
);
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, ticket_number bigint not null, department_id uuid,
  title text not null, description text, priority text not null default 'medium' check (priority in ('high','medium','low')), status text not null default 'open' check (status in ('open','done','cancelled')),
  owner_membership_id uuid references public.memberships(id) on delete set null, due_at timestamptz, next_action text, blocker text, depends_on text, decision_needed text, definition_of_done text,
  urgency text, gtd_bucket text, version bigint not null default 1 check (version > 0), created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), closed_at timestamptz, unique (organization_id, ticket_number), unique (organization_id, id),
  foreign key (organization_id, department_id) references public.departments(organization_id, id) on delete set null
);
create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, ticket_id uuid not null, title text not null,
  status text not null default 'open' check (status in ('open','done')), owner_membership_id uuid references public.memberships(id) on delete set null, sort_order integer not null default 0,
  version bigint not null default 1 check (version > 0), created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  completed_at timestamptz, foreign key (organization_id, ticket_id) references public.tickets(organization_id, id) on delete cascade
);
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, department_id uuid, ticket_id uuid, title text not null, criteria text,
  status text not null default 'open' check (status in ('open','decided','cancelled')), decision_owner_membership_id uuid references public.memberships(id) on delete set null,
  due_at timestamptz, decision text, decided_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key (organization_id, department_id) references public.departments(organization_id, id) on delete set null,
  foreign key (organization_id, ticket_id) references public.tickets(organization_id, id) on delete cascade
);
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null check (entity_type in ('ticket','subtask','decision')), entity_id uuid not null, kind text not null check (kind in ('note','url','file')),
  note text, url text, storage_path text, mime_type text, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, from_membership_id uuid references public.memberships(id) on delete set null,
  to_department_id uuid, to_membership_id uuid references public.memberships(id) on delete set null, message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'new' check (status in ('new','read','archived')), created_at timestamptz not null default now(), read_at timestamptz,
  foreign key (organization_id, to_department_id) references public.departments(organization_id, id) on delete set null
);
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, event_id uuid not null unique default gen_random_uuid(),
  actor_membership_id uuid references public.memberships(id) on delete set null, entity_type text not null, entity_id uuid not null, action text not null, field_name text, before_value jsonb, after_value jsonb,
  metadata jsonb not null default '{}'::jsonb, correlation_id uuid, schema_version integer not null default 1, created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, membership_id uuid not null references public.memberships(id) on delete cascade,
  type text not null, title text not null, body text, entity_type text, entity_id uuid, read_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.module_settings (
  organization_id uuid not null references public.organizations(id) on delete cascade, module_key text not null, enabled boolean not null default true, config jsonb not null default '{}'::jsonb,
  primary key (organization_id, module_key)
);
create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, provider text not null, status text not null default 'inactive',
  config_encrypted jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists tickets_org_status_idx on public.tickets(organization_id, status);
create index if not exists tickets_org_owner_idx on public.tickets(organization_id, owner_membership_id);
create index if not exists tickets_org_due_idx on public.tickets(organization_id, due_at);
create index if not exists tickets_org_department_idx on public.tickets(organization_id, department_id);
create index if not exists subtasks_org_ticket_idx on public.subtasks(organization_id, ticket_id);
create index if not exists audit_org_created_idx on public.audit_events(organization_id, created_at desc);
insert into public.capabilities(key, description) values
('tickets.view','View tickets'),('tickets.create','Create tickets'),('tickets.edit','Edit tickets'),('tickets.close','Close tickets'),('tickets.assign','Assign tickets'),
('subtasks.view','View subtasks'),('subtasks.create','Create subtasks'),('subtasks.edit','Edit subtasks'),('decisions.view','View decisions'),('decisions.create','Create decisions'),
('decisions.resolve','Resolve decisions'),('inbox.view','View internal inbox'),('inbox.send','Send internal messages'),('members.view','View team'),('members.manage','Manage team'),
('departments.manage','Manage departments'),('roles.manage','Manage roles and capabilities'),('branding.manage','Manage branding'),('settings.manage','Manage tenant settings'),('audit.view','View audit log')
on conflict (key) do nothing;
