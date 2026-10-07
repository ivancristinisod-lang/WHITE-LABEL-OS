create or replace function public.is_active_member(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.memberships m where m.organization_id = target_org and m.user_id = auth.uid() and m.status = 'active');
$$;
create or replace function public.current_user_has_capability(capability_key text, target_org uuid default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships m join public.role_capabilities rc on rc.role_id = m.role_id and rc.allowed = true
    where m.user_id = auth.uid() and m.status = 'active' and (target_org is null or m.organization_id = target_org) and rc.capability_key = current_user_has_capability.capability_key
  );
$$;
revoke all on function public.is_active_member(uuid) from public;
revoke all on function public.current_user_has_capability(text, uuid) from public;
grant execute on function public.is_active_member(uuid) to authenticated;
grant execute on function public.current_user_has_capability(text, uuid) to authenticated;

do $$ declare t text; begin
  foreach t in array array['organizations','organization_branding','organization_settings','roles','memberships','role_capabilities','departments','tickets','subtasks','decisions','evidence','inbox_messages','audit_events','notifications','module_settings','integration_connections'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
alter table public.profiles enable row level security;
alter table public.capabilities enable row level security;

create policy profiles_self_select on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_self_update on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy capabilities_authenticated_read on public.capabilities for select to authenticated using (true);
create policy org_member_select on public.organizations for select to authenticated using (public.is_active_member(id));
create policy branding_member_select on public.organization_branding for select to authenticated using (public.is_active_member(organization_id));
create policy settings_member_select on public.organization_settings for select to authenticated using (public.is_active_member(organization_id));
create policy roles_member_select on public.roles for select to authenticated using (public.is_active_member(organization_id));
create policy memberships_member_select on public.memberships for select to authenticated using (public.is_active_member(organization_id));
create policy role_caps_member_select on public.role_capabilities for select to authenticated using (exists (select 1 from public.roles r where r.id = role_id and public.is_active_member(r.organization_id)));
create policy departments_member_select on public.departments for select to authenticated using (public.is_active_member(organization_id));
create policy tickets_member_select on public.tickets for select to authenticated using (public.is_active_member(organization_id));
create policy subtasks_member_select on public.subtasks for select to authenticated using (public.is_active_member(organization_id));
create policy decisions_member_select on public.decisions for select to authenticated using (public.is_active_member(organization_id));
create policy evidence_member_select on public.evidence for select to authenticated using (public.is_active_member(organization_id));
create policy inbox_member_select on public.inbox_messages for select to authenticated using (public.is_active_member(organization_id));
create policy audit_member_select on public.audit_events for select to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('audit.view', organization_id));
create policy notifications_self_select on public.notifications for select to authenticated using (exists (select 1 from public.memberships m where m.id = membership_id and m.user_id = auth.uid() and m.status = 'active'));
create policy modules_member_select on public.module_settings for select to authenticated using (public.is_active_member(organization_id));
create policy integrations_member_select on public.integration_connections for select to authenticated using (public.is_active_member(organization_id));
create policy tickets_create on public.tickets for insert to authenticated with check (public.is_active_member(organization_id) and public.current_user_has_capability('tickets.create', organization_id));
create policy tickets_edit on public.tickets for update to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('tickets.edit', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('tickets.edit', organization_id));
create policy subtasks_create on public.subtasks for insert to authenticated with check (public.is_active_member(organization_id) and public.current_user_has_capability('subtasks.create', organization_id));
create policy subtasks_edit on public.subtasks for update to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('subtasks.edit', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('subtasks.edit', organization_id));
create policy decisions_create on public.decisions for insert to authenticated with check (public.is_active_member(organization_id) and public.current_user_has_capability('decisions.create', organization_id));
create policy decisions_edit on public.decisions for update to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('decisions.resolve', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('decisions.resolve', organization_id));
create policy evidence_insert on public.evidence for insert to authenticated with check (public.is_active_member(organization_id));
create policy inbox_insert on public.inbox_messages for insert to authenticated with check (public.is_active_member(organization_id) and public.current_user_has_capability('inbox.send', organization_id));
create policy departments_manage_all on public.departments for all to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('departments.manage', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('departments.manage', organization_id));
create policy branding_manage on public.organization_branding for all to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('branding.manage', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('branding.manage', organization_id));
create policy settings_manage on public.organization_settings for all to authenticated using (public.is_active_member(organization_id) and public.current_user_has_capability('settings.manage', organization_id)) with check (public.is_active_member(organization_id) and public.current_user_has_capability('settings.manage', organization_id));
create policy audit_insert on public.audit_events for insert to authenticated with check (public.is_active_member(organization_id));
revoke update, delete on public.audit_events from authenticated;
