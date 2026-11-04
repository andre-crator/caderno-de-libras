-- =====================================================================
-- Meta da semana e lembrete diário (Fase 2, parte C).
--   1. profiles.weekly_goal: quantos dias por semana ela quer estudar (1 a 7).
--   2. study_days: um registro por dia em que ela estudou (data de Brasília).
--   3. push_subscriptions: o "endereço" de notificação de cada celular dela.
--   4. lembretes_do_dia(segredo): lista para o envio diário (Vercel Cron), protegida
--      por um segredo cujo HASH fica em private.segredos. Assim o servidor não precisa
--      da chave secreta (service role) do Supabase.
-- =====================================================================

-- 1. Meta da semana -----------------------------------------------------
alter table public.profiles
  add column weekly_goal smallint not null default 3 check (weekly_goal between 1 and 7);

-- 2. Dias estudados -----------------------------------------------------
create table public.study_days (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day        date not null default (now() at time zone 'America/Sao_Paulo')::date,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

comment on table public.study_days is 'Dias (horário de Brasília) em que a usuária estudou.';

alter table public.study_days enable row level security;

create policy "Usuária lê os próprios dias"
  on public.study_days for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuária registra o próprio dia (só hoje)"
  on public.study_days for insert to authenticated
  with check ((select auth.uid()) = user_id and day = (now() at time zone 'America/Sao_Paulo')::date);

revoke all on public.study_days from anon;
grant select, insert on public.study_days to authenticated;

-- 3. Inscrições de notificação -----------------------------------------
create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Só serviços de push conhecidos (o envio diário faz POST para este endereço).
  endpoint   text not null check (
    length(endpoint) <= 1000 and
    endpoint ~ '^https://(fcm\.googleapis\.com|[a-z0-9.-]+\.push\.services\.mozilla\.com|[a-z0-9.-]+\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)/'
  ),
  p256dh     text not null check (length(p256dh) <= 200),
  auth       text not null check (length(auth) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

comment on table public.push_subscriptions is 'Celulares da usuária que recebem o lembrete diário.';

alter table public.push_subscriptions enable row level security;

create policy "Usuária lê as próprias inscrições"
  on public.push_subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuária cria a própria inscrição"
  on public.push_subscriptions for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuária atualiza a própria inscrição"
  on public.push_subscriptions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Usuária apaga a própria inscrição"
  on public.push_subscriptions for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.push_subscriptions from anon;
grant select, insert, update, delete on public.push_subscriptions to authenticated;

create trigger push_subscriptions_set_updated_at
  before update on public.push_subscriptions
  for each row execute function public.set_updated_at();

-- Um celular passa a ser de outra conta (saiu de uma, entrou na outra): apaga a
-- inscrição antiga com o mesmo endereço, para o lembrete de uma não ir para a outra.
create or replace function public.assumir_inscricao(alvo text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.push_subscriptions
  where endpoint = alvo and user_id <> (select auth.uid()) and (select auth.uid()) is not null;
$$;
revoke all on function public.assumir_inscricao(text) from public, anon;
grant execute on function public.assumir_inscricao(text) to authenticated;

-- 4. Envio diário -------------------------------------------------------
-- Esquema privado: a API do Supabase não o expõe.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.segredos (
  nome text primary key,
  hash bytea not null
);
revoke all on private.segredos from public, anon, authenticated;

-- Confere o segredo do envio (só o hash SHA-256 fica no banco).
create or replace function private.segredo_confere(segredo text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.segredos
    where nome = 'lembrete' and hash = pg_catalog.sha256(pg_catalog.convert_to(segredo, 'UTF8'))
  );
$$;
revoke all on function private.segredo_confere(text) from public, anon, authenticated;

-- Um item por celular inscrito: quantos sinais venceram, se já estudou hoje e a meta.
create or replace function public.lembretes_do_dia(segredo text)
returns table (
  endpoint text,
  p256dh text,
  auth text,
  vencidos bigint,
  estudou_hoje boolean,
  dias_na_semana bigint,
  meta smallint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  hoje date := (now() at time zone 'America/Sao_Paulo')::date;
  segunda date := hoje - ((extract(isodow from hoje)::int) - 1);
begin
  if not private.segredo_confere(segredo) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;
  return query
    select
      ps.endpoint, ps.p256dh, ps.auth,
      (select count(*) from public.signs s where s.user_id = ps.user_id and s.review_due_at <= now()),
      exists (select 1 from public.study_days d where d.user_id = ps.user_id and d.day = hoje),
      (select count(*) from public.study_days d where d.user_id = ps.user_id and d.day >= segunda),
      coalesce((select p.weekly_goal from public.profiles p where p.id = ps.user_id), 3::smallint)
    from public.push_subscriptions ps;
end;
$$;

-- Apaga um celular que não aceita mais notificações (o serviço de push respondeu 404/410).
create or replace function public.apagar_inscricao_vencida(segredo text, alvo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.segredo_confere(segredo) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;
  delete from public.push_subscriptions where endpoint = alvo;
end;
$$;

-- O envio diário chama estas funções com a chave pública (anon) + o segredo.
-- O segredo tem 32 bytes aleatórios (força bruta inviável); mesmo assim só anon chama.
revoke all on function public.lembretes_do_dia(text) from public, authenticated;
revoke all on function public.apagar_inscricao_vencida(text, text) from public, authenticated;
grant execute on function public.lembretes_do_dia(text) to anon;
grant execute on function public.apagar_inscricao_vencida(text, text) to anon;
