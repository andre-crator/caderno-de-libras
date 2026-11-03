# CLAUDE.md — Caderno de Libras

@AGENTS.md

> Mantenha este arquivo com menos de 200 linhas: instruções longas de tarefas
> específicas vão para skills em `.claude/skills/`.

## O que é este app
**Incluir** (nome escolhido por ela, D4) — caderno de estudo de Libras (Língua Brasileira de
Sinais) para a esposa do André, que está começando um curso (básico, professora surda).
Ela guarda os sinais de cada aula com foto/vídeo, revisa com cartões (repetição espaçada)
e treina datilologia e números. Interface em português, pensada para o celular.

**MVP:** fases aprovadas em `docs/REQUISITOS.md` (D3); plano em `docs/PLANO_FASE1.md`. Ela usa Android,
entra com Google, prefere tela clara com letras maiores, azul e branco.
Não definir telas nem tabelas novas sem o OK do André.

**Protótipo de referência:** `docs/prototipo/caderno-de-libras.html` (página única,
publicada como Artifact). Mostra o fluxo validado: sinais → revisar → soletrar.

## Regras de conteúdo
- **Sinais não são inventados.** O app nunca descreve, desenha nem gera sinais por conta
  própria: o conteúdo vem do que ela anota ou grava. Sinais variam por região; vale o que a
  professora ensinou.
- Vídeos e imagens de dicionários (INES, Spread The Sign, VLibras etc.) só como **link**.
  Nada copiado sem licença conferida; na dúvida, perguntar ao André.
- Descrição de sinal segue os 5 parâmetros da Libras: configuração de mão (CM), ponto de
  articulação (PA), movimento (M), orientação da palma (Or) e expressão não manual (ENM).
- Fotos e vídeos dela são dados pessoais: privados por padrão (RLS + Storage privado).
- **Apostila do curso (D6):** direitos reservados. Nada dela entra no app ou no repositório
  (texto, imagem, PDF). Só a sequência de unidades e temas, em `lib/curso/unidades.ts`.

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
- `supabase/migrations/` — toda mudança de banco, em ordem, versionada. Tabela `signs`
  (sinal/frase, mídia, agenda de revisão) e bucket privado `sign-media` (`<user_id>/<arquivo>`).
- `supabase/tests/` + `scripts/testar-banco.sh` (`npm run test:banco`) — aplica as migrações
  num Postgres temporário com imitação mínima do Supabase e testa a RLS. Toda tabela nova
  ganha um teste aqui (outra usuária e anon não leem nem alteram).
- `lib/revisao/agenda.ts` — agenda de Leitner (0, 1, 2, 4, 8, 16 dias; vence à meia-noite
  de Brasília).
- `docs/SETUP.md` — configuração de Supabase, Google e Vercel.
- `docs/REQUISITOS.md` — levantamento de requisitos (questionário dela + o que já se sabe).
- `docs/ROADMAP.md` — o que vem depois do MVP; `docs/decisoes/` — uma nota por decisão.
- `docs/prototipo/` — protótipo em HTML (só referência, não é código do app).
- `docs/PLANO_FASE1.md` — partes da Fase 1 (um PR cada) e desenho do banco.
- Identidade: `design/tokens.css` (só tema claro, base 18px, alvo de toque 48px), fontes
  Atkinson Hyperlegible + Bricolage Grotesque via `next/font` em `app/layout.tsx`.
- App instalável: `app/manifest.ts` (abre em `/painel`), ícones em `public/icons/`,
  `app/icon.svg` e `app/apple-icon.png`. `app/painel` é o menu principal (áreas "em breve").
- Caderno (parte 3): `app/caderno` (lista com busca e filtro por tema, `novo`, `[id]`,
  `[id]/editar`, `temas` = listas de estudo com progresso), `components/caderno/`
  (`FormSinal` envia a mídia do celular direto para a pasta dela no bucket; `MidiaSinal`
  mostra por URL assinada de 1 h) e `lib/sinais/` (`formato.ts` regras puras, `dados.ts`
  leituras, `acoes.ts` Server Actions; arquivo só é apagado se nenhum sinal o usa).
- `lib/curso/` — roteiro do curso (`unidades.ts`, D6), listas de estudo por tema
  (`vocabulario.ts`, D7; acentos contam) e links para dicionários (`dicionarios.ts`).
- `app/soletrar` (pública, sem dados dela) + `lib/soletrar/sequencia.ts` — treino de
  datilologia e números, item a item, com modo "esconder a palavra".

## Começo e fim de sessão
`PROXIMOS.md` diz onde paramos e o que vem a seguir. Leia no começo e atualize no fim
(meia página, sem histórico — o histórico está no git).

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
- `npm run typecheck` · `npm run lint` · `npm test` · `npm run test:banco` · `npm run build`

## Definição de pronto
typecheck, lint, testes e build passando; migração testada; `docs/` atualizado se
o comportamento mudou. Mostre a saída dos comandos como prova.

## Compact instructions
Ao compactar, preserve: decisões tomadas, arquivos alterados, pendências e
resultados dos testes. Descarte saídas longas de comandos.
