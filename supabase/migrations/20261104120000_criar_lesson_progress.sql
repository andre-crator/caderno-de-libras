-- =====================================================================
-- Aulas concluídas (D9): uma linha por aula que ela marcou como concluída.
-- O conteúdo das aulas fica no código (lib/aulas); aqui só o progresso dela.
-- =====================================================================

create table public.lesson_progress (
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_slug  text not null check (lesson_slug ~ '^u[0-9]{1,2}-[a-z0-9-]{1,60}$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

comment on table public.lesson_progress is 'Aulas que a usuária marcou como concluídas.';

alter table public.lesson_progress enable row level security;

create policy "Usuária lê o próprio progresso"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuária marca aula concluída"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuária desmarca aula concluída"
  on public.lesson_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.lesson_progress from anon;
grant select, insert, delete on public.lesson_progress to authenticated;
