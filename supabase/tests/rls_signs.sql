-- Testes da RLS de public.signs e do bucket sign-media.
-- Cada bloco falha com uma exceção se a regra estiver errada.
\set ON_ERROR_STOP on
\o /dev/null
\set ana '11111111-1111-1111-1111-111111111111'
\set bia '22222222-2222-2222-2222-222222222222'

insert into auth.users (id, email) values (:'ana', 'ana@teste'), (:'bia', 'bia@teste');

-- Perfis criados pelo gatilho de cadastro.
do $$ begin
  assert (select count(*) from public.profiles
          where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')) = 2,
         'gatilho de perfil não rodou';
end $$;

-- ---------- Ana cria os próprios sinais ----------
set role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'ana')::text, false);

insert into public.signs (word, media_path, media_type)
values ('Bom dia', :'ana' || '/bom-dia.jpg', 'foto');
insert into public.signs (word, kind) values ('Prazer em conhecer', 'frase');

do $$ begin
  assert (select count(*) from public.signs) = 2, 'Ana deveria ver os 2 sinais dela';
  assert (select user_id from public.signs limit 1) = auth.uid(), 'user_id padrão deveria ser a Ana';
end $$;

-- Ana não cria sinal em nome da Bia.
do $$ begin
  insert into public.signs (user_id, word) values ('22222222-2222-2222-2222-222222222222', 'Invasão');
  raise exception 'Ana conseguiu criar sinal para a Bia';
exception when insufficient_privilege then null;
end $$;

-- Mídia fora da própria pasta é recusada pela regra da tabela.
do $$ begin
  insert into public.signs (word, media_path, media_type)
  values ('Pasta errada', '22222222-2222-2222-2222-222222222222/x.jpg', 'foto');
  raise exception 'aceitou mídia na pasta de outra pessoa';
exception when check_violation then null;
end $$;

-- Caminho sem tipo (ou tipo sem caminho) é recusado.
do $$ begin
  insert into public.signs (word, media_path) values ('Sem tipo', '11111111-1111-1111-1111-111111111111/y.jpg');
  raise exception 'aceitou mídia sem tipo';
exception when check_violation then null;
end $$;

-- Palavra vazia e nível fora de 0–5 são recusados.
do $$ begin
  insert into public.signs (word) values ('   ');
  raise exception 'aceitou palavra vazia';
exception when check_violation then null;
end $$;
do $$ begin
  update public.signs set review_level = 6;
  raise exception 'aceitou nível 6';
exception when check_violation then null;
end $$;

-- Ana envia um arquivo para a própria pasta e não para a da Bia.
insert into storage.objects (bucket_id, name) values ('sign-media', :'ana' || '/bom-dia.jpg');
do $$ begin
  insert into storage.objects (bucket_id, name) values ('sign-media', '22222222-2222-2222-2222-222222222222/x.jpg');
  raise exception 'Ana enviou arquivo para a pasta da Bia';
exception when insufficient_privilege then null;
end $$;

-- ---------- Bia não enxerga nem altera nada da Ana ----------
select set_config('request.jwt.claims', json_build_object('sub', :'bia')::text, false);
do $$
declare n int;
begin
  assert (select count(*) from public.signs) = 0, 'Bia está vendo sinais da Ana';
  assert (select count(*) from storage.objects) = 0, 'Bia está vendo arquivos da Ana';
  update public.signs set word = 'hackeado';
  get diagnostics n = row_count;
  assert n = 0, 'Bia alterou sinais da Ana';
  delete from public.signs;
  get diagnostics n = row_count;
  assert n = 0, 'Bia apagou sinais da Ana';
  delete from storage.objects;
  get diagnostics n = row_count;
  assert n = 0, 'Bia apagou arquivos da Ana';
end $$;

-- Bia não consegue "roubar" um sinal mudando o dono para ela.
select set_config('request.jwt.claims', json_build_object('sub', :'ana')::text, false);
do $$ begin
  update public.signs set user_id = '22222222-2222-2222-2222-222222222222';
  raise exception 'Ana transferiu sinal para a Bia';
exception when insufficient_privilege or check_violation then null;
end $$;

-- ---------- Visitante sem login não vê nada ----------
reset role;
set role anon;
select set_config('request.jwt.claims', '', false);
do $$ begin
  perform 1 from public.signs;
  raise exception 'anon conseguiu ler signs';
exception when insufficient_privilege then null;
end $$;

-- ---------- updated_at e apagar conta ----------
reset role;
do $$
declare antes timestamptz;
begin
  select updated_at into antes from public.signs where word = 'Bom dia';
  perform pg_sleep(0.01);
  update public.signs set lesson = 'Aula 1' where word = 'Bom dia';
  assert (select updated_at from public.signs where word = 'Bom dia') > antes, 'updated_at não mudou';
end $$;
delete from auth.users where id = :'ana';
do $$ begin
  assert (select count(*) from public.signs) = 0, 'sinais não foram apagados com a conta';
end $$;

\echo 'RLS de signs e sign-media: todos os testes passaram'
