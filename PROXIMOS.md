# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04)

- **Fase 1 completa e no `main`** (PRs #1–#8 juntados em 2026-11-04, CI verde): identidade e
  app instalável, banco (`signs` + `sign-media`), soletrar, roteiro e listas de estudo (D6/D7),
  caderno com foto/vídeo, revisão com cartões e offline básico. Testado com um Supabase falso
  local; **falta o teste no Supabase real e no celular dela**. Ainda sem Supabase nem Vercel do app.
- **Atenção:** o repositório está ligado à integração Supabase ↔ GitHub de um projeto
  `dpeluwtwvifkhnxwwves` (provavelmente o "Zeus-AI", pausado). No merge, o "Supabase Preview"
  falhou pelo limite de projetos grátis e **nada foi aplicado**. Desligar essa ligação e ligar
  no projeto dela quando existir (D8).
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
   convida o André como Developer; o André manda ao Claude a Project URL e a Publishable key,
   desliga a integração do projeto antigo e liga a do projeto dela ao repositório. Depois: login Google (`docs/SETUP.md`).
   A organização vazia "Incluir" na conta do André pode ser apagada.
2. Ligar o repositório à Vercel.
3. Levar o questionário para o `starter-andre` (precisa de acesso de escrita ao starter).

## Depois (Claude)

- Com o Supabase dela pronto: configurar a Vercel (URL + publishable key), juntar os PRs,
  testar o caderno de ponta a ponta no banco real (envio de foto/vídeo, RLS).
- Depois do teste real: Fase 2 (quiz, câmera lenta, datas e horas, lembrete, offline completo).
- Vídeos ainda não ficam guardados offline (respostas com Range); avaliar na Fase 2.
