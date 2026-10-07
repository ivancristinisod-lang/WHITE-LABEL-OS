-- Run against an isolated Supabase test database.
-- Mandatory adversarial checks:
-- 1. user A in org A cannot SELECT/UPDATE org B tickets.
-- 2. suspended membership loses access.
-- 3. forged organization_id insert is rejected.
-- 4. audit_events cannot be updated/deleted by authenticated users.
-- 5. storage path org id must match an active membership.
select 'tenant isolation test plan loaded' as status;
