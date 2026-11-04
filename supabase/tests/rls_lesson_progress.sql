-- Testes da RLS de public.lesson_progress.
\set ON_ERROR_STOP on
\o /dev/null
\set ana '33333333-3333-3333-3333-333333333333'
\set bia '44444444-4444-4444-4444-444444444444'

insert into auth.users (id, email) values (:'ana', 'ana2@teste'), (:'bia', 'bia2@teste');

set role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'ana')::text, false);
insert into public.lesson_progress (lesson_slug) values ('u2-parametros'), ('u1-historia-dos-surdos');
do $$ begin
  assert (select count(*) from public.lesson_progress) = 2, 'Ana deveria ver as 2 aulas dela';
end $$;

-- Slug fora do formato é recusado.
do $$ begin
  insert into public.lesson_progress (lesson_slug) values ('../../etc');
  raise exception 'aceitou slug inválido';
exception when check_violation then null;
end $$;

-- Ana não marca aula em nome da Bia.
do $$ begin
  insert into public.lesson_progress (user_id, lesson_slug) values ('44444444-4444-4444-4444-444444444444', 'u2-numeros');
  raise exception 'Ana marcou aula para a Bia';
exception when insufficient_privilege then null;
end $$;

-- Bia não vê nem apaga o progresso da Ana.
select set_config('request.jwt.claims', json_build_object('sub', :'bia')::text, false);
do $$
declare n int;
begin
  assert (select count(*) from public.lesson_progress) = 0, 'Bia está vendo o progresso da Ana';
  delete from public.lesson_progress;
  get diagnostics n = row_count;
  assert n = 0, 'Bia apagou o progresso da Ana';
end $$;

-- Sem login não lê nada.
reset role;
set role anon;
select set_config('request.jwt.claims', '', false);
do $$ begin
  perform 1 from public.lesson_progress;
  raise exception 'anon conseguiu ler lesson_progress';
exception when insufficient_privilege then null;
end $$;

-- Apagar a conta apaga o progresso.
reset role;
delete from auth.users where id = :'ana';
do $$ begin
  assert (select count(*) from public.lesson_progress) = 0, 'progresso não saiu com a conta';
end $$;

\o
\echo 'RLS de lesson_progress: todos os testes passaram'
