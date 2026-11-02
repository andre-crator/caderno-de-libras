-- =====================================================================
-- Perfis de usuário: uma linha por conta, criada AUTOMATICAMENTE no cadastro
-- (e-mail ou Google). Base de todo app; adicione colunas conforme o projeto.
-- =====================================================================

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: sem isso, qualquer pessoa com a chave pública leria todos os perfis.
alter table public.profiles enable row level security;

create policy "Usuário lê o próprio perfil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Usuário edita o próprio perfil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select, update on public.profiles to authenticated;

-- Cria o perfil quando uma conta nova nasce em auth.users.
-- O login com Google já manda nome e foto em raw_user_meta_data.
-- security definer: roda com permissão do dono da função (precisa, porque quem
-- dispara é o sistema de auth). search_path vazio evita sequestro de esquema.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém updated_at sempre certo, sem depender do código do app.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
