# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-03)

- PRs abertos, um em cima do outro: #1 `configuracao-inicial` (docs) → #2 `fase1-base`
  (identidade, home, PWA) → #3 `fase1-banco` (tabela `signs`, bucket `sign-media`, agenda) →
  #4 `fase1-soletrar` (treino de alfabeto e números, página pública).
  Migrações testadas só no Postgres local (`npm run test:banco`); **não aplicadas** no Supabase.
  Ainda **sem** Supabase nem Vercel do app.
- **Respostas do questionário recebidas** e organizadas em `docs/REQUISITOS.md`: básico, 1 aula
  por semana, professora surda, Android, login Google, tela clara com letras maiores, azul e
  branco, nome **Incluir**. Marcou "Preciso" em todas as funções.
- Fases aprovadas (D3, D4 nome Incluir, D5 mídia no Storage). Plano técnico da Fase 1 em
  `docs/PLANO_FASE1.md` (6 partes, um PR cada).
- Protótipo: https://claude.ai/artifact/7ucKgTrhaQEsJzKT6newSm (cópia em `docs/prototipo/`).
  Questionário: https://questionario-libras-blue.vercel.app.

## O André precisa

1. Criar o projeto no Supabase (região São Paulo) e o OAuth do Google (`docs/SETUP.md`).
   Decidido (2026-11-03): projeto `Incluir` na organização **Zeus-AI** (grátis, tem vaga).
   O conector do Supabase do Claude vale para UMA organização (hoje a andre-crator's Org,
   onde estão Bíblia da Noiva e minhas-financas) — por isso o Claude não vê a Zeus-AI.
   Caminho escolhido, sem trocar o conector: o André cria o projeto pelo painel e manda a
   Project URL + Publishable key; o Claude configura a Vercel e junta os PRs #1–#4 no `main`
   (com OK), e a integração Supabase↔GitHub aplica as migrações. CI dos 4 PRs: verde.
2. Ligar o repositório à Vercel.
3. Levar o questionário para o `starter-andre` (precisa de acesso de escrita ao starter).

## Depois (Claude)

- Com o OK: plano técnico da Fase 1 (tabelas `signs` e `reviews`, bucket de mídia, telas),
  depois implementar em partes pequenas, cada uma com PR.
