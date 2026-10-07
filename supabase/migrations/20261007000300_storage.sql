insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('organization-assets','organization-assets',false,5242880,array['image/png','image/jpeg','image/webp','image/svg+xml','image/x-icon']),
  ('evidence','evidence',false,8388608,array['text/plain','text/markdown','image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "tenant assets read" on storage.objects for select to authenticated using (bucket_id = 'organization-assets' and public.is_active_member((storage.foldername(name))[1]::uuid));
create policy "tenant assets write" on storage.objects for insert to authenticated with check (bucket_id = 'organization-assets' and public.is_active_member((storage.foldername(name))[1]::uuid) and public.current_user_has_capability('branding.manage', (storage.foldername(name))[1]::uuid));
create policy "tenant evidence read" on storage.objects for select to authenticated using (bucket_id = 'evidence' and public.is_active_member((storage.foldername(name))[1]::uuid));
create policy "tenant evidence write" on storage.objects for insert to authenticated with check (bucket_id = 'evidence' and public.is_active_member((storage.foldername(name))[1]::uuid));
