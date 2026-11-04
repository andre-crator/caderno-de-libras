-- Testes de study_days, push_subscriptions, weekly_goal e do envio diário.
\set ON_ERROR_STOP on
\o /dev/null
\set ana '55555555-5555-5555-5555-555555555555'
\set bia '66666666-6666-6666-6666-666666666666'

insert into auth.users (id, email) values (:'ana', 'ana3@teste'), (:'bia', 'bia3@teste');
insert into public.profiles (id) values (:'ana'), (:'bia') on conflict do nothing;
insert into private.segredos values ('lembrete', sha256(convert_to('segredo-de-teste', 'UTF8')));

set role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'ana')::text, false);

-- Dia de hoje (Brasília) entra sozinho; repetir o dia não duplica.
insert into public.study_days default values;
insert into public.study_days default values on conflict do nothing;
do $$ begin
  assert (select count(*) from public.study_days) = 1, 'Ana deveria ter 1 dia';
  assert (select day from public.study_days) = (now() at time zone 'America/Sao_Paulo')::date, 'dia fora de Brasília';
end $$;

-- Meta: 1 a 7, só no próprio perfil.
update public.profiles set weekly_goal = 4 where id = :'ana';
do $$ begin
  update public.profiles set weekly_goal = 9;
  raise exception 'aceitou meta 9';
exception when check_violation then null;
end $$;

insert into public.push_subscriptions (endpoint, p256dh, auth) values ('https://fcm.googleapis.com/fcm/send/ana', 'chave', 'aut');
do $$ begin
  insert into public.push_subscriptions (endpoint, p256dh, auth) values ('https://169.254.169.254/x', 'c', 'a');
  raise exception 'aceitou endpoint fora dos serviços de push';
exception when check_violation then null;
end $$;
do $$ begin
  insert into public.study_days (day) values (((now() at time zone 'America/Sao_Paulo')::date) - 3);
  raise exception 'aceitou dia que não é hoje';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  perform * from public.lembretes_do_dia('segredo-de-teste');
  raise exception 'usuária logada chamou lembretes_do_dia';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  insert into public.study_days (user_id) values ('66666666-6666-6666-6666-666666666666');
  raise exception 'Ana registrou dia para a Bia';
exception when insufficient_privilege then null;
end $$;

-- Bia não vê, não muda e não apaga nada da Ana.
select set_config('request.jwt.claims', json_build_object('sub', :'bia')::text, false);
do $$
declare n int;
begin
  assert (select count(*) from public.study_days) = 0, 'Bia vê dias da Ana';
  assert (select count(*) from public.push_subscriptions) = 0, 'Bia vê inscrição da Ana';
  update public.profiles set weekly_goal = 1 where id = '55555555-5555-5555-5555-555555555555';
  get diagnostics n = row_count;
  assert n = 0, 'Bia mudou a meta da Ana';
  delete from public.push_subscriptions;
  get diagnostics n = row_count;
  assert n = 0, 'Bia apagou inscrição da Ana';
end $$;

-- Bia entra no mesmo celular e assume a inscrição; depois ela volta para a Ana.
insert into public.push_subscriptions (endpoint, p256dh, auth) values ('https://fcm.googleapis.com/fcm/send/bia', 'c', 'a');
select public.assumir_inscricao('https://fcm.googleapis.com/fcm/send/bia');
reset role;
do $$ begin
  assert (select count(*) from public.push_subscriptions) = 2, 'deveria haver 2 inscrições';
end $$;
set role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'ana')::text, false);
select public.assumir_inscricao('https://fcm.googleapis.com/fcm/send/bia');
reset role;
do $$ begin
  assert not exists (select 1 from public.push_subscriptions where endpoint like '%/bia'), 'inscrição antiga da Bia ficou';
end $$;

-- Ninguém logado lê as tabelas nem o esquema privado.
reset role;
set role anon;
select set_config('request.jwt.claims', '', false);
do $$ begin
  perform 1 from public.push_subscriptions;
  raise exception 'anon leu push_subscriptions';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  perform 1 from private.segredos;
  raise exception 'anon leu private.segredos';
exception when insufficient_privilege then null;
end $$;

-- Envio diário: segredo errado é recusado; certo traz a lista.
do $$ begin
  perform * from public.lembretes_do_dia('chute');
  raise exception 'aceitou segredo errado';
exception when insufficient_privilege then null;
end $$;
do $$
declare r record;
begin
  select * into r from public.lembretes_do_dia('segredo-de-teste');
  assert r.endpoint = 'https://fcm.googleapis.com/fcm/send/ana', 'lista sem a inscrição';
  assert r.estudou_hoje, 'deveria saber que estudou hoje';
  assert r.dias_na_semana = 1 and r.meta = 4 and r.vencidos = 0, 'números errados';
end $$;
do $$ begin
  perform public.apagar_inscricao_vencida('chute', 'https://fcm.googleapis.com/fcm/send/ana');
  raise exception 'apagou com segredo errado';
exception when insufficient_privilege then null;
end $$;
select public.apagar_inscricao_vencida('segredo-de-teste', 'https://fcm.googleapis.com/fcm/send/ana');

reset role;
do $$ begin
  assert (select count(*) from public.push_subscriptions) = 0, 'inscrição vencida não saiu';
end $$;
delete from auth.users where id = :'ana';
do $$ begin
  assert (select count(*) from public.study_days) = 0, 'dias não saíram com a conta';
end $$;

\o
\echo 'Meta e lembrete: todos os testes passaram'
