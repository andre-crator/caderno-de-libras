# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04)

- PRs abertos, um em cima do outro: #1 `configuracao-inicial` (docs) → #2 `fase1-base`
  (identidade, home, PWA) → #3 `fase1-banco` (tabela `signs`, bucket `sign-media`, agenda) →
  #4 `fase1-soletrar` (treino de alfabeto e números, página pública) → #5 `fase1-roteiro`
  (roteiro das 12 unidades, listas de estudo e links de dicionário; D6 e D7) → #6
  `fase1-caderno` (caderno com foto/vídeo e listas de estudo) → #7 `fase1-revisar` (revisão
  com cartões). Testados com um Supabase falso local; falta o teste no Supabase real.
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

0. Testar no celular se https://www.spreadthesign.com/pt.br/search/?q=casa abre a busca
   por "casa" e qual é o endereço atual do dicionário do INES (`lib/curso/dicionarios.ts`).

1. **Supabase na conta dela (D8):** ela cria conta e o projeto `Incluir` (São Paulo),
   convida o André como Developer; o André manda ao Claude a Project URL e a Publishable key
   e liga a integração Supabase ↔ GitHub ao repositório. Depois: login Google (`docs/SETUP.md`).
   A organização vazia "Incluir" na conta do André pode ser apagada.
2. Ligar o repositório à Vercel.
3. Levar o questionário para o `starter-andre` (precisa de acesso de escrita ao starter).

## Depois (Claude)

- Com o Supabase dela pronto: configurar a Vercel (URL + publishable key), juntar os PRs,
  testar o caderno de ponta a ponta no banco real (envio de foto/vídeo, RLS).
- Parte 6 (offline básico: service worker com cache do app e das mídias já vistas) — próxima.
