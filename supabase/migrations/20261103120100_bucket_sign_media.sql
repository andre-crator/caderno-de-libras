-- =====================================================================
-- Fotos e vídeos dos sinais (D5): bucket PRIVADO, uma pasta por usuária
-- (<user_id>/<arquivo>). Só a dona lê, envia, troca e apaga os arquivos.
-- O app mostra a mídia com URL assinada de curta duração.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sign-media',
  'sign-media',
  false,
  20971520, -- 20 MB por arquivo (vídeos de até 15 s)
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

create policy "Usuária lê a própria mídia"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'sign-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Usuária envia mídia para a própria pasta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'sign-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Usuária troca a própria mídia"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'sign-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'sign-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Usuária apaga a própria mídia"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'sign-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
