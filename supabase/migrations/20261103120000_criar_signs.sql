-- =====================================================================
-- Caderno de sinais (Fase 1, D3/D5): cada linha é um sinal ou uma frase que
-- ela guardou, com a mídia (foto ou vídeo) e a agenda de revisão (Leitner).
-- Dona de cada linha: user_id. Ninguém mais lê nem altera (RLS).
-- =====================================================================

create type public.sign_kind as enum ('sinal', 'frase');
create type public.sign_media_type as enum ('foto', 'video');

create table public.signs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind             public.sign_kind not null default 'sinal',
  word             text not null check (char_length(btrim(word)) between 1 and 120),
  category         text check (char_length(category) <= 40),
  lesson           text check (char_length(lesson) <= 40),
  -- 5 parâmetros da Libras e dica: opcionais, texto dela.
  hand_shape       text check (char_length(hand_shape) <= 400),
  location         text check (char_length(location) <= 400),
  movement         text check (char_length(movement) <= 400),
  palm_orientation text check (char_length(palm_orientation) <= 400),
  non_manual       text check (char_length(non_manual) <= 400),
  tip              text check (char_length(tip) <= 600),
  -- Arquivo no bucket privado sign-media, sempre dentro da pasta da dona.
  media_path       text,
  media_type       public.sign_media_type,
  -- Agenda de revisão: caixa 0–5 e data da próxima revisão.
  review_level     smallint not null default 0 check (review_level between 0 and 5),
  review_due_at    timestamptz not null default now(),
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint signs_media_completa check ((media_path is null) = (media_type is null)),
  constraint signs_media_na_pasta_da_dona check (
    media_path is null or split_part(media_path, '/', 1) = user_id::text
  )
);

comment on table public.signs is 'Sinais e frases do caderno de Libras, com mídia e agenda de revisão.';

alter table public.signs enable row level security;

create policy "Usuária lê os próprios sinais"
  on public.signs for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuária cria os próprios sinais"
  on public.signs for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuária edita os próprios sinais"
  on public.signs for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Usuária apaga os próprios sinais"
  on public.signs for delete to authenticated
  using ((select auth.uid()) = user_id);

-- O Supabase dá privilégios padrão ao anon em tabelas novas; aqui ninguém sem login entra.
revoke all on public.signs from anon;
grant select, insert, update, delete on public.signs to authenticated;

-- Lista do caderno (mais novos primeiro) e fila de revisão (vencidos primeiro).
create index signs_user_created_idx on public.signs (user_id, created_at desc);
create index signs_user_due_idx on public.signs (user_id, review_due_at);

create trigger signs_set_updated_at
  before update on public.signs
  for each row execute function public.set_updated_at();
