-- Storage RLS policies for report-photos bucket
-- Allows authenticated users to upload images
-- and public read access to generated URLs.

-- Allow public read access to objects in the report-photos bucket
create policy "Public read access for report photos"
  on storage.objects for select
  using (bucket_id = 'report-photos');

-- Allow authenticated users to upload to the report-photos bucket
create policy "Authenticated users can upload report photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'report-photos'
    and auth.role() = 'authenticated'
  );

