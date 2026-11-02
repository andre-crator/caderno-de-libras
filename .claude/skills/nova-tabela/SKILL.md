---
name: nova-tabela
description: Cria uma tabela nova no Supabase do jeito padrão do projeto (migração versionada, RLS, políticas, índices, gatilho de updated_at, tipos TypeScript e teste). Use sempre que a tarefa precisar guardar um tipo novo de dado no banco.
---

# Criar tabela nova no Supabase

## 1. Planejar (mostre ao André antes de escrever)
- Nome da tabela em `snake_case`, no plural (ex: `tarefas`).
- Colunas e tipos. Para listas fixas de valores (status, tipo), use ENUM.
- Quem é dono de cada linha? Quase sempre uma coluna `user_id uuid not null
  references auth.users (id) on delete cascade`.
- Quem pode ler, criar, editar e apagar? Escreva em português antes do SQL.

## 2. Escrever a migração
Arquivo `supabase/migrations/AAAAMMDDHHMMSS_criar_<tabela>.sql` com, nesta ordem:
1. `create type` dos ENUMs (se houver).
2. `create table` com `id uuid primary key default gen_random_uuid()`,
   `created_at` e `updated_at timestamptz not null default now()`.
3. `alter table ... enable row level security;`
4. Uma política por operação necessária, sempre `to authenticated` e usando
   `(select auth.uid())` (o `select` em volta deixa a consulta mais rápida):
   - select: `using ((select auth.uid()) = user_id)`
   - insert: `with check ((select auth.uid()) = user_id)`
   - update: `using (...)` E `with check (...)`
   - delete: `using (...)`
5. `grant` só das operações liberadas, para `authenticated`.
6. Índice em `user_id` e em colunas usadas em filtros/ordenação.
7. Gatilho de `updated_at` reaproveitando `public.set_updated_at()` (já existe).

Nunca edite uma migração já aplicada no banco real: crie uma nova.

## 3. Verificar
- Se houver Postgres local ou `supabase start`, aplicar a migração e testar:
  um usuário NÃO consegue ler a linha de outro (teste de RLS).
- Gerar os tipos: `npx supabase gen types typescript --linked > lib/database.types.ts`
  (exige `supabase link`; se não houver, avise o André).
- typecheck, lint, testes e build passando.

## 4. Não fazer
- Não aplicar no banco real sem o OK do André.
- Não liberar leitura para `anon` sem ele pedir explicitamente.
- Não usar a chave secreta (service role) para contornar a RLS no app.
