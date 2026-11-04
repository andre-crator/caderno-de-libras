# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04)

- **App no ar:** https://caderno-de-libras.vercel.app (Vercel `caderno-de-libras`, deploy
  automático do `main`). Supabase **na conta dela** (D8), projeto `zgiqidfjddnxgicueqnv`; a
  integração Supabase ↔ GitHub NÃO está ligada a ele: migração nova = colar o SQL no SQL Editor.
- No `main`: fase 1 completa, aulas das unidades 1–3 (D9), tela inicial nova com barra de
  navegação, correção do vídeo que seguia tocando (Next 16 esconde a página: ver CLAUDE.md).
- Fase 2 A e B no `main`: frases para conversar, data/hora/dinheiro no Soletrar, quiz
  "que sinal é este?" e vídeo em câmera lenta.
- **Jogos aprovados pelo André (2026-11-04)**, protótipos visuais em
  https://claude.ai/artifact/FAWdhWNQxGETDTLu7ahUaZ. O André **não** sabe Libras: nenhum jogo
  pode depender de ele sinalizar (no máximo ele confere, vendo o sinal certo na tela).

## O André precisa

1. Dizer "pode juntar" nos PRs novos (o Claude não junta sem OK explícito).
2. Assistir aos vídeos das aulas (unidades 1–3) com ela e dizer quais trocar.
3. Desligar a integração Supabase ↔ GitHub do projeto antigo `dpeluwtwvifkhnxwwves`.
4. Login com Google (passo 3 do `docs/SETUP.md`) — combinado para depois.
5. Testar se https://www.spreadthesign.com/pt.br/search/?q=casa abre a busca.

## Depois (Claude) — Fase 2, na ordem combinada em 2026-11-04

- **Jogos (todos aprovados), nesta ordem:**
  1. **Trilha de estrelas** (a preferida do André): cada aula vira parada; 3 estrelas =
     assistiu, guardou 3 sinais do tema, ≥ 80% no quiz do tema; próxima abre com 1 estrela;
     sequência de dias no topo. Fazer junto com a parte C (meta da semana).
  2. **Jogo da memória**: 6 pares mídia do caderno ↔ palavra; tempo e tentativas; pares
     difíceis vão para a revisão.
  3. **Sinal relâmpago**: vídeo do caderno começa em 0,5× e acelera a cada 5 acertos;
     3 opções, 3 vidas, combo, recorde (reaproveitar `lib/revisao/quiz.ts` e `VideoLento`).
  4. **Desafio do espelho**: sorteia palavra guardada, ela se grava (câmera frontal, input
     `capture="user"`), vê lado a lado com o vídeo do caderno e marca igual/quase/errei
     (→ `responderCartao`). Modo dupla: o André só confere vendo o sinal certo. O vídeo dela
     não é salvo, a não ser que ela queira.
  5. **Caça ao sinal**: 3 missões por semana ligadas à aula da vez (texto nosso); cumprir =
     guardar o sinal no caderno.
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
