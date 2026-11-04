# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04)

- **App no ar:** https://caderno-de-libras.vercel.app (Vercel `caderno-de-libras`, deploy
  automático do `main`). Supabase **na conta dela** (D8), projeto `zgiqidfjddnxgicueqnv`; a
  integração Supabase ↔ GitHub NÃO está ligada a ele: migração nova = colar o SQL no SQL Editor.
- No `main`: fase 1 completa, aulas das unidades 1–3 (D9), tela inicial nova com barra de
  navegação, correção do vídeo que seguia tocando (Next 16 esconde a página: ver CLAUDE.md).
- **Fase 2 — PRs prontos, aguardando o OK do André para juntar:**
  - #13 frases para conversar + data/hora/dinheiro no Soletrar;
  - #14 quiz "que sinal é este?" + vídeo em câmera lenta (este PR traz este PROXIMOS).
  Os dois mexem no CLAUDE.md em pontos diferentes; se o segundo der conflito, rebase simples.

## O André precisa

1. Dizer "pode juntar" para #13 e #14 (o Claude não junta sem OK explícito).
2. Assistir aos vídeos das aulas (unidades 1–3) com ela e dizer quais trocar.
3. Desligar a integração Supabase ↔ GitHub do projeto antigo `dpeluwtwvifkhnxwwves`.
4. Login com Google (passo 3 do `docs/SETUP.md`) — combinado para depois.
5. Testar se https://www.spreadthesign.com/pt.br/search/?q=casa abre a busca.

## Depois (Claude) — Fase 2, na ordem combinada em 2026-11-04

- **C. Meta da semana + lembrete diário:** tabela de dias estudados (sequência e meta, ex.:
  3 dias/semana, no painel) e notificação diária no Android (Web Push: chaves VAPID nas
  variáveis da Vercel, tabela de inscrições, Vercel Cron 1x/dia ~19h Brasília, que manda
  "X sinais para revisar"). Migração nova → SQL para o André colar.
- **D. Aulas da unidade 4** (família, ser/estar, ir, sentimentos): mesmo formato do lote 1,
  vídeos achados pela busca com domínio youtube.com e conferidos pelo CI.
- **E. Mini questionário de opinião** (5 perguntas, como o primeiro, envio pelo WhatsApp).
- **F. Guardar sinal sem internet** (fila no IndexedDB, sincroniza ao voltar a conexão) e
  vídeos offline — **perguntar ao André antes** (tamanho/espaço no celular).
- **G. Compartilhar com o André e com a turma** — **decidir antes**: o caderno todo ou só
  alguns sinais? só leitura? colegas precisam de conta no app (Supabase dela).
- Vídeos ainda não ficam guardados offline (respostas com Range).
