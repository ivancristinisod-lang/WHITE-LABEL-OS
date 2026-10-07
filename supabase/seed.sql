insert into public.organizations(id, slug, name, timezone, locale) values ('11111111-1111-4111-8111-111111111111','northstar-demo','Northstar Studio','America/Argentina/Buenos_Aires','es') on conflict (id) do nothing;
insert into public.organization_branding(organization_id, product_name, accent_color) values ('11111111-1111-4111-8111-111111111111','Northstar OS','#202720') on conflict (organization_id) do nothing;
insert into public.organization_settings(organization_id, require_closure_evidence, undo_seconds) values ('11111111-1111-4111-8111-111111111111', true, 10) on conflict (organization_id) do nothing;
insert into public.departments(id, organization_id, key, name, sort_order) values
('21111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','direction','Dirección',1),
('21111111-1111-4111-8111-111111111112','11111111-1111-4111-8111-111111111111','operations','Operaciones',2),
('21111111-1111-4111-8111-111111111113','11111111-1111-4111-8111-111111111111','product-tech','Producto & Tech',3),
('21111111-1111-4111-8111-111111111114','11111111-1111-4111-8111-111111111111','growth','Growth & Marca',4)
on conflict (organization_id, key) do nothing;
insert into public.tickets(id, organization_id, ticket_number, department_id, title, priority, status, due_at, decision_needed, blocker) values
('31111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111',101,'21111111-1111-4111-8111-111111111111','Definir criterio de lanzamiento','high','open',now(),'Aprobar alcance final',null),
('31111111-1111-4111-8111-111111111112','11111111-1111-4111-8111-111111111111',102,'21111111-1111-4111-8111-111111111112','Cerrar onboarding del equipo piloto','high','open',now()+interval '1 day',null,'Falta confirmación de dos usuarios')
on conflict (organization_id, ticket_number) do nothing;
