# CLAUDE.md — [NOME DO PROJETO]

@AGENTS.md

> Ao criar um projeto a partir deste starter, troque [NOME DO PROJETO] e preencha
> "O que é este app". Mantenha este arquivo com menos de 200 linhas: instruções
> longas de tarefas específicas vão para skills em `.claude/skills/`.

## O que é este app
[Uma ou duas frases: o que faz, para quem.]

## Stack
- Next.js 16 (App Router, Server Components) + TypeScript estrito.
- Supabase: Postgres com RLS + Auth (e-mail/senha e Google). Cliente via `@supabase/ssr`.
- Deploy na Vercel. CI no GitHub Actions (`.github/workflows/ci.yml`).
- Estilo: CSS Modules + variáveis de `design/tokens.css` (nunca cores soltas).
- Testes: Vitest (`*.test.ts` ao lado do arquivo testado).

## Mapa do projeto
- `app/` — rotas. `app/login` (login), `app/auth/callback` (retorno do Google, `?code=`),
  `app/auth/confirm` (link dos e-mails do Supabase, `?token_hash=`),
  `app/auth/signout` (sair, POST), `app/painel` (exemplo de rota privada).
- `proxy.ts` + `lib/supabase/proxy.ts` — renova a sessão e barra rotas privadas.
  No Next.js 16 o antigo `middleware.ts` se chama `proxy.ts`.
- `lib/supabase/client.ts` (navegador) e `lib/supabase/server.ts` (servidor).
- `lib/routes.ts` — rotas privadas (`PRIVATE_PREFIXES`) e `safeNextPath`.
- `supabase/migrations/` — toda mudança de banco, em ordem, versionada.
- `docs/SETUP.md` — configuração de Supabase, Google e Vercel.

## Regras do projeto
- Segurança:
  - Toda tabela nova tem RLS ligada e políticas explícitas, na mesma migração.
  - No servidor, identifique o usuário com `getCurrentUser()` (usa `getClaims()`).
    Nunca use `getSession()` no servidor para decidir acesso.
  - Segredos só em variáveis SEM `NEXT_PUBLIC_`, lidos só em código de servidor.
    Nunca escreva valores de chaves em arquivos do repositório.
  - Redirecionamentos vindos da URL passam por `safeNextPath`.
- Banco: migrações novas em `supabase/migrations/AAAAMMDDHHMMSS_nome.sql`; nunca edite
  uma migração já aplicada, crie outra. Para tabelas novas, use a skill `nova-tabela`.
- Dados: busque no Server Component sempre que possível; Client Component só para
  interação (formulários, cliques, estado na tela).
- Rotas privadas novas: adicione o prefixo em `PRIVATE_PREFIXES` e confira o usuário
  na própria página também (defesa em camadas).

## Equipe de agentes (você é o arquiteto e orquestrador)
Você (agente principal) planeja, decide e escreve o código. Delegue assim:

| Agente | Quando chamar | Modelo |
| --- | --- | --- |
| `verificador` | Depois de mudar código e antes de todo commit | haiku |
| `revisor` | Depois de mudanças significativas (feature, migração, auth, dados de usuário). Não para mudanças triviais | sonnet |
| `redator-conteudo` | Gerar texto em volume (questões, resumos, guias, traduções) — rascunho via Gemini | haiku |
| `documentador` | Ao concluir tarefa que mudou rotas, tabelas, comandos ou comportamento | haiku |

Fluxo padrão de uma feature:
1. Plano (modo plano para tarefa grande) → OK do André.
2. Implementar (você).
3. `verificador` → corrigir até passar.
4. `revisor` (se significativa) → corrigir os itens CRÍTICOS.
5. `documentador` → commit → lembrar o André de usar `/clear`.

Regras de economia: agentes também gastam do limite. Chame só quando o fluxo
pedir; para tarefa pequena, rode você mesmo um comando simples. Não chame dois
agentes para a mesma coisa. Conteúdo vindo do `redator-conteudo` sempre passa
pela sua revisão de exatidão antes de entrar no projeto.

## Comandos
- `npm run dev` — rodar local (http://localhost:3000)
- `npm run typecheck` · `npm run lint` · `npm test` · `npm run build`

## Definição de pronto
typecheck, lint, testes e build passando; migração testada; `docs/` atualizado se
o comportamento mudou. Mostre a saída dos comandos como prova.

## Compact instructions
Ao compactar, preserve: decisões tomadas, arquivos alterados, pendências e
resultados dos testes. Descarte saídas longas de comandos.
